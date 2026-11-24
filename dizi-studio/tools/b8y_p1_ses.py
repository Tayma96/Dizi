"""7/24 B8 (yeni) P1 ses türevleri (ses yönetmeni). Yalnız ffmpeg + kütüphanedeki CC0/kendi kayıtlarımız; kredi harcamaz.
- efekt/b8y_bam          : Ece iki avucunu tezgâha vurur (tokat + el_tezgah_carpma gövdesi, 15 ms arayla iki el)
- efekt/b8y_kol_gicirti  : depo kapısının kolu yavaşça iner (kapi_gicirti yavaşlatılmış, boğuk)
- efekt/b8y_kol_mandal   : mandal dili çekilir (kilit_yarim ilk 0,45 sn)
- efekt/b8y_kapi_hiz     : depo kapısı hızla açılır, duvara çarpar (el_banyo_kapi)
- efekt/b8y_parilti      : anime parıltısı: yükselen çan arpeji + ışıltı (kendi sentezimiz)
- muzik/b8y_rom_1..3     : romantik (kendi sentezimiz) kesitleri, yumuşak giriş/çıkış (süreler b8y_p1.py zamanlarından)
Çalıştır: python3 tools/b8y_p1_ses.py  (dizi-studio/ içinden), sonra python3 tools/b8y_p1.py
"""
import json, os, subprocess, sys

D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(D, "public", "ses")
CAT_P = os.path.join(S, "katalog.json")
cat = json.load(open(CAT_P, encoding="utf-8"))
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as P  # noqa: E402


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def dur(p):
    return round(float(subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                      capture_output=True, text=True).stdout), 3)


def kaydet(ad, kat, desc):
    p = os.path.join(S, kat, ad + ".mp3")
    cat[f"{kat}/{ad}"] = {"file": f"ses/{kat}/{ad}.mp3", "category": kat, "duration": dur(p), "loop": kat != "efekt" and False, "desc": desc}


e = lambda n: os.path.join(S, "efekt", n + ".mp3")
out = lambda n, k="efekt": os.path.join(S, k, n + ".mp3")

# BAM: iki avuç; tokat (şaplak) + tezgâh gövdesi (tok), ikinci el 15 ms sonra
run("-i", e("tokat"), "-i", e("el_tezgah_carpma"), "-i", e("tokat"), "-filter_complex",
    "[0:a]aformat=sample_rates=44100:channel_layouts=mono,volume=0.9[a];"
    "[1:a]aformat=sample_rates=44100:channel_layouts=mono,atrim=0:0.6,lowpass=f=2500,equalizer=f=140:t=q:w=1:g=6,volume=0.9[b];"
    "[2:a]aformat=sample_rates=44100:channel_layouts=mono,adelay=15,volume=0.8[c];"
    "[a][b][c]amix=inputs=3:normalize=0,alimiter=limit=0.8,afade=t=out:st=0.45:d=0.15", "-t", "0.6", "-b:a", "192k", out("b8y_bam"))
kaydet("b8y_bam", "efekt", "B8y P1: Ece iki avucunu tezgâha vurur (tokat + el_tezgah_carpma gövdesi; ikinci el 15 ms sonra). Tepe baştadır.")

run("-i", e("kapi_gicirti"), "-af", "aformat=channel_layouts=mono,atempo=0.65,asetrate=44100*0.9,aresample=44100,lowpass=f=3500,afade=t=in:d=0.3,afade=t=out:st=1.6:d=0.4",
    "-t", "2.0", "-b:a", "192k", out("b8y_kol_gicirti"))
kaydet("b8y_kol_gicirti", "efekt", "B8y P1: depo kapısının kolu yavaşça iner (kapi_gicirti %65 hız, perde düşük, boğuk).")

run("-i", e("kilit_yarim"), "-af", "atrim=0:0.45,afade=t=out:st=0.33:d=0.12", "-b:a", "192k", out("b8y_kol_mandal"))
kaydet("b8y_kol_mandal", "efekt", "B8y P1: kol dibe varır, mandal dili çekilir (kilit_yarim ilk 0,45 sn).")

run("-i", e("el_banyo_kapi"), "-af", "afade=t=out:st=1.4:d=0.5", "-b:a", "192k", out("b8y_kapi_hiz"))
kaydet("b8y_kapi_hiz", "efekt", "B8y P1: depo kapısı hızla açılır ve duvara çarpar (el_banyo_kapi). Tepe ~0,05 sn.")

# PARILTI: C6-E6-G6-C7-E7 çan arpeji (sinüs + 2,76× kısmi, üstel sönüm) + yüksek ışıltı gürültüsü
notes = [1046.5, 1318.5, 1568.0, 2093.0, 2637.0]
parts = "+".join(f"if(gte(t,{i * 0.07:.2f}),(0.5*sin(2*PI*{f}*(t-{i * 0.07:.2f}))+0.18*sin(2*PI*{f * 2.76:.1f}*(t-{i * 0.07:.2f})))*exp(-(t-{i * 0.07:.2f})*3.2),0)"
                 for i, f in enumerate(notes))
run("-f", "lavfi", "-i", f"aevalsrc='0.32*({parts})':s=44100:d=1.6",
    "-f", "lavfi", "-i", "anoisesrc=d=1.6:c=white:r=44100:a=0.25",
    "-filter_complex", "[1:a]highpass=f=7000,afade=t=in:d=0.2,afade=t=out:st=0.5:d=1.0,volume=0.35[n];[0:a][n]amix=inputs=2:normalize=0,aecho=0.8:0.6:90:0.3,alimiter=limit=0.7",
    "-ac", "1", "-b:a", "192k", out("b8y_parilti"))
kaydet("b8y_parilti", "efekt", "B8y P1: anime parıltısı: C6-E6-G6-C7-E7 çan arpeji + ışıltı (kendi sentezimiz).")

# romantik kesitleri (yumuşak giriş/çıkış). 1: DON→BOL (plak çiziğiyle kesilir), 2: E4→S3, 3: E5→son
rom = os.path.join(S, "muzik", "romantik.mp3")
for ad, bas, uz, cikis in [("b8y_rom_1", 0.0, P.b0 - P.d0 - 0.45, 0.05), ("b8y_rom_2", 14.0, P.s3a - P.e4a + 0.9, 0.8),
                           ("b8y_rom_3", 28.0, P.SON_T - P.e5a - 0.1, 0.9)]:
    run("-ss", f"{bas}", "-i", rom, "-af", f"afade=t=in:d=0.5,afade=t=out:st={max(0, uz - cikis):.3f}:d={cikis}", "-t", f"{uz:.3f}", "-b:a", "192k", out(ad, "muzik"))
    kaydet(ad, "muzik", f"B8y P1: romantik ({bas:.0f}. sn'den {uz:.2f} sn), yumuşak giriş/çıkış.")

json.dump(cat, open(CAT_P, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("tamam")
