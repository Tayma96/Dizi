"""7/24 B8 (yeni) P2 ses türevleri (kendi sentezimiz, ffmpeg; kredi harcamaz).
- efekt/b8y_ruzgar_circir : "kurallar önceden hazırlanmıyor" sonrası tuhaf sessizlik: boş rüzgâr uğultusu + cırcır böceği (3 sn)
- efekt/b8y_saat_hizli    : saat hızla akar: hızlanan tik-tak + hava süpürmesi (2,2 sn)
- efekt/b8y_saat_bip      : dijital saat 00:00'da tek bip
- efekt/b8y_alarm         : telefon alarmı: dörtlü dijital bip, iki tur (2,4 sn)
"""
import json, os, subprocess

D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(D, "public", "ses")
CAT_P = os.path.join(S, "katalog.json")
cat = json.load(open(CAT_P, encoding="utf-8"))
out = lambda n: os.path.join(S, "efekt", n + ".mp3")


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def dur(p):
    return round(float(subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout), 3)


def kaydet(ad, desc):
    cat[f"efekt/{ad}"] = {"file": f"ses/efekt/{ad}.mp3", "category": "efekt", "duration": dur(out(ad)), "loop": False, "desc": desc}


# rüzgâr: kahverengi gürültü, bant geçiren, yavaş genlik dalgası; cırcır: 4,6 kHz taşıyıcı, 30 Hz titreşimli üçlü cırlamalar
cir = "0.35*sin(2*PI*4600*t)*(0.5+0.5*sin(2*PI*30*t))*gt(mod(t,0.62),0)*lt(mod(t,0.62),0.16)*(0.6+0.4*sin(2*PI*0.7*t))"
run("-f", "lavfi", "-i", "anoisesrc=d=3:c=brown:r=44100:a=0.8",
    "-f", "lavfi", "-i", f"aevalsrc='{cir}':s=44100:d=3",
    "-filter_complex",
    "[0:a]bandpass=f=420:w=500,volume='0.6+0.35*sin(2*PI*0.4*t)':eval=frame,afade=t=in:d=0.5,afade=t=out:st=2.3:d=0.7[r];"
    "[1:a]afade=t=in:st=0.4:d=0.4,afade=t=out:st=2.4:d=0.6,aecho=0.8:0.5:40:0.25[c];[r][c]amix=inputs=2:normalize=0,alimiter=limit=0.7",
    "-ac", "1", "-b:a", "192k", out("b8y_ruzgar_circir"))
kaydet("b8y_ruzgar_circir", "B8y P2: tuhaf sessizlik: boş rüzgâr uğultusu + cırcır böceği (kendi sentezimiz), 3 sn.")

# saat hızlı: tik aralığı 0,25 → 0,05 sn'ye daralır (üstel), üstte yükselen hava süpürmesi
tik = "0.6*sin(2*PI*2400*t)*exp(-mod(t*(4+16*t*t/4.84),1)*60)"
run("-f", "lavfi", "-i", f"aevalsrc='{tik}':s=44100:d=2.2",
    "-f", "lavfi", "-i", "anoisesrc=d=2.2:c=pink:r=44100:a=0.4",
    "-filter_complex", "[1:a]highpass=f=800,lowpass=f=6000,afade=t=in:d=1.6,afade=t=out:st=1.9:d=0.3,volume=0.5[w];[0:a][w]amix=inputs=2:normalize=0,alimiter=limit=0.7",
    "-ac", "1", "-b:a", "192k", out("b8y_saat_hizli"))
kaydet("b8y_saat_hizli", "B8y P2: saat hızla akar: hızlanan tik-tak + hava süpürmesi (kendi sentezimiz), 2,2 sn.")

run("-f", "lavfi", "-i", "aevalsrc='0.5*sin(2*PI*1900*t)*lt(t,0.14)*exp(-t*6)':s=44100:d=0.5", "-ac", "1", "-b:a", "192k", out("b8y_saat_bip"))
kaydet("b8y_saat_bip", "B8y P2: dijital saat 00:00'da tek bip (kendi sentezimiz).")

# alarm: 4 hızlı bip (2,1 kHz) + 0,4 sn ara, iki tur
bip = "0.45*sin(2*PI*2100*t)*lt(mod(t,0.12),0.07)*lt(mod(t,1.2),0.48)"
run("-f", "lavfi", "-i", f"aevalsrc='{bip}':s=44100:d=2.4", "-af", "highpass=f=600,alimiter=limit=0.7", "-ac", "1", "-b:a", "192k", out("b8y_alarm"))
kaydet("b8y_alarm", "B8y P2: telefon alarmı: dörtlü dijital bip, iki tur (kendi sentezimiz), 2,4 sn.")

json.dump(cat, open(CAT_P, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("tamam")
