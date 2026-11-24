"""7/24 B8 P2 ses türevleri ve seçimleri (ses yönetmeni). Yalnız ffmpeg; kredi harcamaz.

- efekt/b8_nah_sak        : nah hareketindeki 'ŞAK' (el_nah_sak ilk 0,5 sn + kendi sentezimiz alçak 'tok' katmanı), tepe baştadır
- muzik/b8_komik_dusus_kesik : b8_komik_dusus 0-14,15 sn, 14,15'te sert kesim (plak çiziği anı) + 10 sn sessizlik
- muzik/b8_komik_buton    : b8_komik_dusus son pizzicato vuruşu (13,97-son); E6'dan sonra kapanış 'butonu'
- public/voice/724-08-p2/secim.json
Çalıştır: python3 tools/b8p2_ses.py  (dizi-studio/ içinden)
"""
import json, os, subprocess

D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(D, "public", "ses")
V = os.path.join(D, "public", "voice", "724-08-p2")
CAT_P = os.path.join(S, "katalog.json")
cat = json.load(open(CAT_P, encoding="utf-8"))
KESIM = 14.38   # müzik 8,33'te girer -> 22,71'de (heh'ten hemen önce) kesilir


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def dur(p):
    return round(float(subprocess.run(["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                      capture_output=True, text=True).stdout), 3)


def kaydet(ad, kat, desc, **ek):
    p = os.path.join(S, kat, ad + ".mp3")
    cat[f"{kat}/{ad}"] = {"file": f"ses/{kat}/{ad}.mp3", "category": kat, "duration": dur(p), "loop": False, "desc": desc, **ek}


# ŞAK (kullanıcı düzeltmesi): sağ bilek sol avuç içine çarpar -> tok, etli TEK şaplak (kuru alkış değil).
# el_nah_sak tek vuruşu: tizler kısılır (3 kHz üstü -4 dB, 7 kHz alçak geçiren), gövde 250 Hz +6 dB;
# + kendi sentezimiz: 120->70 Hz et 'tok'u ve 300-1200 Hz kısa et patlaması. Tepe baştadır.
run("-i", os.path.join(S, "efekt", "el_nah_sak.mp3"),
    "-f", "lavfi", "-i", "aevalsrc='0.9*sin(2*PI*(120-50*t/0.07)*t)*exp(-t/0.035)':s=44100:d=0.14",
    "-f", "lavfi", "-i", "anoisesrc=d=0.05:c=pink:r=44100:a=0.6",
    "-filter_complex",
    "[0:a]aformat=sample_rates=44100:channel_layouts=mono,atrim=0:0.4,asetpts=N/SR/TB,"
    "highshelf=f=3000:g=-4,lowpass=f=7000,equalizer=f=250:t=q:w=1.2:g=6,afade=t=out:st=0.18:d=0.2[a];"
    "[1:a]aformat=channel_layouts=mono,volume=0.45[b];"
    "[2:a]aformat=channel_layouts=mono,bandpass=f=600:w=900,afade=t=out:st=0:d=0.035,volume=0.5[c];"
    "[a][b][c]amix=inputs=3:normalize=0,alimiter=limit=0.7:attack=1:release=30,volume=0.7",
    "-ar", "44100", "-b:a", "192k", os.path.join(S, "efekt", "b8_nah_sak.mp3"))
kaydet("b8_nah_sak", "efekt", "B8 P2: nah işaretinde sağ bilek sol avuç içine çarpar: tok, etli tek şaplak (el_nah_sak tek vuruşu, "
       "tizleri biraz kısılıp gövdesi artırıldı + kendi sentezimiz et 'tok'u). Tepe baştadır, at = SAK karesi (24,287).")

src = os.path.join(S, "muzik", "b8_komik_dusus.mp3")
run("-i", src, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo:d=10", "-filter_complex",
    f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo,atrim=0:{KESIM},asetpts=N/SR/TB,afade=t=out:st={KESIM - 0.02}:d=0.02[m];[m][1:a]concat=n=2:v=0:a=1",
    "-b:a", "192k", os.path.join(S, "muzik", "b8_komik_dusus_kesik.mp3"))
kaydet("b8_komik_dusus_kesik", "muzik", f"B8 P2: b8_komik_dusus 0-{KESIM} sn, {KESIM}'te sert kesim (son pizzicato çınlarken; "
       "plak çiziğiyle aynı an) + 10 sn sessizlik", kesim=KESIM)

run("-ss", "13.97", "-i", src, "-af", "afade=t=in:d=0.005", "-b:a", "192k", os.path.join(S, "muzik", "b8_komik_buton.mp3"))
kaydet("b8_komik_buton", "muzik", "B8 P2: b8_komik_dusus son pizzicato vuruşu ve sönümü (13,97-son); E6 sonrası kapanış butonu")

# Plak çiziği, kısa: 4. duvar dönüşünden hemen önce müziği 'durdurur'; heh'in önündeki 0,32 sn boşluğa sığar
run("-i", os.path.join(S, "efekt", "el_plak_cizik.mp3"), "-af", "atrim=0:0.38,afade=t=out:st=0.26:d=0.12",
    "-b:a", "192k", os.path.join(S, "efekt", "b8_plak_kisa.mp3"))
kaydet("b8_plak_kisa", "efekt", "B8 P2: plak çiziği ilk 0,38 sn (el_plak_cizik türevi); müzik durur, 4. duvar")

# Kalem tezgâha düşer: plastik tükenmez tahta tezgâhta sekiyor (b8_kalem_dokun x4, azalan; kendi sentezimiz)
k = os.path.join(S, "efekt", "b8_kalem_dokun.mp3")
run("-i", k, "-i", k, "-i", k, "-i", k, "-filter_complex",
    "[0:a]volume=1.0[a];[1:a]adelay=120:all=1,volume=0.55[b];[2:a]adelay=205:all=1,volume=0.32[c];[3:a]adelay=262:all=1,volume=0.18[d];"
    "[a][b][c][d]amix=inputs=4:normalize=0,highpass=f=180,alimiter=limit=0.7,volume=0.8",
    "-b:a", "192k", os.path.join(S, "efekt", "b8_kalem_dus.mp3"))
kaydet("b8_kalem_dus", "efekt", "B8 P2: tükenmez kalem tahta tezgâha düşer, 3 kez seker (b8_kalem_dokun türevi, kendi sentezimiz). Tepe baştadır.")

json.dump(cat, open(CAT_P, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

SECIM = {
    "_not": "B8 P2 replik seçimleri (ses yönetmeni). Anahtar = manifest anahtarı. Metin aynen; okunuş yalnız ritim/telaffuz için "
            "(virgül, üç nokta, büyük harf vurgusu, 'jıb' Türkçe j). Çekim kaynağı public/episodes/724-08-p2-ses.json.",
    "E1_ece_paralel_evrenler": {"sec": "E1a_01", "yedek": ["E1b_01"]},
    "S1_sabri_he_valla": {"sec": "S1a_01", "yedek": ["S1f_01", "S1c_01"]},
    "E2_ece_obur_taraf": {"sec": "E2a_01", "yedek": ["E2b_01"]},
    "S2_sabri_derken": {"sec": "S2a_01", "yedek": ["S2b_01"]},
    "E3_ece_ruhlar_alemi": {"sec": "E3a_01", "yedek": ["E3b_01"]},
    "S3_sabri_ne_alaka": {"sec": "S3a_01", "yedek": ["S3b_01"]},
    "E4_ece_heh": {"sec": "E4h_01", "yedek": ["E4a_01", "E4g_01"]},
    "E5_ece_dordunu_duvar": {"sec": "E5a_01", "yedek": ["E5d_01", "E5b_01"]},
    "E6_ece_bocek_sican": {"sec": "E6a_01", "yedek": ["E6b_01"]},
}
json.dump(SECIM, open(os.path.join(V, "secim.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("b8p2 ses tamam")
