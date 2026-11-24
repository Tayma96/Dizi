#!/usr/bin/env python3
"""7/24 Bölüm 8 Parça 1: ses yönetmeninin ücretsiz türevleri (kredi harcamaz, yalnız ffmpeg).
- Replik seçimi           -> public/voice/724-08/secim.json
- Kalem / kâğıt efektleri -> public/ses/efekt/b8_*.mp3 (ElevenLabs SFX kayıtlarından kesim)
- Ortam                   -> public/ses/ortam/b8_*.mp3 (-20 LUFS): market gecesi, floresan vızıltısı, camın arkasında trafik
- Müzik                   -> public/ses/muzik/b8_*.mp3 (varsa ElevenLabs müziğinden kesim + sentez alt ton)
Kullanım (dizi-studio/ içinden): python3 tools/b8p1_ses.py
"""
import json, os, re, subprocess

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(K, "public")
S = os.path.join(P, "ses")
V = os.path.join(P, "voice", "724-08")
CAT_P = os.path.join(S, "katalog.json")
cat = json.load(open(CAT_P, encoding="utf-8"))


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def lufs(path):
    e = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", e)
    return float(m[-1]) if m else -70.0


def peak(path):
    e = subprocess.run(["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.search(r"max_volume: (-?[\d.]+) dB", e).group(1))


def dur(path):
    return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).strip()), 3)


def seviye(tmp, dst, hedef, mono=True, limit=0.84):
    cur = lufs(tmp)
    if cur <= -69.0:  # çok kısa: tepeyi hedef+8 dBFS'e getir
        cur = peak(tmp) - (hedef + 8.0) + hedef
    g = max(-30.0, min(24.0, hedef - cur))
    run("-i", tmp, "-af", f"volume={g:.2f}dB,alimiter=limit={limit}:level=false", "-ar", "44100", "-ac", "1" if mono else "2", "-c:a", "libmp3lame", "-q:a", "2", dst)
    os.remove(tmp)
    return dur(dst)


def kes(src, ad, ss, to, desc, hedef=-20.0, fi=0.02, fo=0.08, af=""):
    """efekt/<ad>: kaynaktan kesim + yumuşak giriş/çıkış + seviye."""
    dst = os.path.join(S, "efekt", f"{ad}.mp3")
    tmp = dst + ".tmp.wav"
    d = to - ss
    f = f"afade=t=in:d={fi},afade=t=out:st={max(0, d - fo):.3f}:d={fo}" + ("," + af if af else "")
    run("-ss", f"{ss:.3f}", "-to", f"{to:.3f}", "-i", src, "-af", f, "-ar", "44100", tmp)
    d = seviye(tmp, dst, hedef)
    cat[f"efekt/{ad}"] = {"file": f"ses/efekt/{ad}.mp3", "category": "efekt", "duration": d, "loop": False, "desc": desc}
    return d


E = lambda n: os.path.join(S, "efekt", f"{n}.mp3")

# ---------------------------------------------------------------- 1. kalem ve kâğıt
DAIRE, UZUN, KISA, KAGIT = E("el_kalem_daire"), E("el_kalem_uzun_cizgi"), E("el_kalem_kisa_cizgi"), E("el_kagit_tezgah")
KALEM = "B8: kalem kâğıtta ({}); ElevenLabs SFX {} kesimi {}-{} sn"
# Süreler görüntü yönetmeninin çizim zamanlamasına göre (tools/b8p1.py): daire 0,6 sn, birleşme yayı 0,36, yaşam çizgisi ~2,0,
# paralel çizgi 0,55, yakınsayan çizgi 0,5, son daire 0,62; dokunma = kısa tık.
for i, (a, b) in enumerate(((0.15, 0.77), (1.35, 1.97), (2.55, 3.17)), 1):
    kes(DAIRE, f"b8_kalem_daire_{i}", a, b, KALEM.format(f"{i}. yuvarlak (0,6 sn)", "el_kalem_daire", a, b), fo=0.06)
kes(DAIRE, "b8_kalem_son_daire", 2.95, 3.62, KALEM.format("son daire: kesişim noktasında, bastırarak (0,62 sn)", "el_kalem_daire", 2.95, 3.62), hedef=-18.0, fo=0.06)
for i, (a, b) in enumerate(((0.10, 0.48), (1.05, 1.43), (2.20, 2.58)), 1):
    kes(KISA, f"b8_kalem_birles_{i}", a, b, KALEM.format(f"{i}. birleşme yayı (0,36 sn)", "el_kalem_kisa_cizgi", a, b), fo=0.05)
kes(UZUN, "b8_kalem_yasam_cizgisi", 0.45, 2.50, KALEM.format("ortak yaşam çizgisi: tek uzun çizgi (~2 sn), sonu bastırarak", "el_kalem_uzun_cizgi", 0.45, 2.50), hedef=-19.0)
kes(UZUN, "b8_kalem_uzun_tam", 0.08, 2.55, KALEM.format("tek uzun çizgi, tam (2,5 sn)", "el_kalem_uzun_cizgi", 0.08, 2.55))
for i, (a, b) in enumerate(((0.05, 0.62), (0.95, 1.52), (2.35, 2.92)), 1):
    kes(KISA, f"b8_kalem_paralel_{i}", a, b, KALEM.format(f"{i}. paralel çizgi (0,55 sn)", "el_kalem_kisa_cizgi", a, b), fo=0.06)
for i, (a, b) in enumerate(((0.10, 0.62), (1.45, 1.97), (2.00, 2.52)), 1):
    kes(UZUN, f"b8_kalem_yakinsa_{i}", a, b, KALEM.format(f"{i}. yakınsayan çizgi, gecenin noktasına (0,5 sn)", "el_kalem_uzun_cizgi", a, b), fo=0.06)

# dokunma: tükenmez kalem ucunun kâğıda (altında tahta tezgâh) vuruşu; kendi sentezimiz
dst = E("b8_kalem_dokun"); tmp = dst + ".tmp.wav"
run("-f", "lavfi", "-i", "anoisesrc=d=0.12:c=white:a=0.9", "-f", "lavfi", "-i", "sine=f=190:d=0.12", "-filter_complex",
    "[0:a]bandpass=f=3800:w=3000,afade=t=out:st=0.004:d=0.02[n];[1:a]volume=0.5,afade=t=out:st=0.01:d=0.05[l];"
    "[n][l]amix=inputs=2:normalize=0,afade=t=in:d=0.001,apad=pad_dur=0.1[o]", "-map", "[o]", "-ar", "44100", "-ac", "1", tmp)
cat["efekt/b8_kalem_dokun"] = {"file": "ses/efekt/b8_kalem_dokun.mp3", "category": "efekt", "duration": seviye(tmp, dst, -22.0), "loop": False,
                               "desc": "B8: kalem ucuyla kâğıda dokunma (kısa tık; kendi sentezimiz)"}
for eski in ("b8_kalem_birlestir", "b8_kalem_yan_cizgi"):
    cat.pop(f"efekt/{eski}", None)
    if os.path.exists(E(eski)):
        os.remove(E(eski))
kes(KAGIT, "b8_kagit_tezgah", 0.30, 1.40, "B8: kâğıt tezgâha konur, avuçla bir kez düzlenir (el_kagit_tezgah 0,30-1,40; tepe ~0,17 sn)", hedef=-20.0, fi=0.005)

# ---------------------------------------------------------------- 2. ortam (-20 LUFS)
def ortam(ad, inputs, filt, desc, sure, loop=True):
    dst = os.path.join(S, "ortam", f"{ad}.mp3")
    tmp = dst + ".tmp.wav"
    cmd = []
    for i in inputs:
        cmd += i
    run(*cmd, "-filter_complex", filt, "-map", "[o]", "-t", str(sure), "-ar", "44100", "-ac", "2", tmp)
    d = seviye(tmp, dst, -20.0, mono=False, limit=0.7)
    cat[f"ortam/{ad}"] = {"file": f"ses/ortam/{ad}.mp3", "category": "ortam", "duration": d, "loop": loop, "desc": desc}
    return d


# floresan: 100 Hz şebeke vızıltısı + harmonikler, hafif titreşim, çok hafif cızırtı (kendi sentezimiz)
FLOR = ("sine=f=100:d=40[s1];sine=f=200:d=40[s2];sine=f=300:d=40[s3];sine=f=500:d=40[s5];anoisesrc=d=40:c=pink:a=0.02[n];"
        "[s1]volume=0.5[a];[s2]volume=0.32[b];[s3]volume=0.16[c];[s5]volume=0.05[d];[n]highpass=f=2500,volume=0.5[e];"
        "[a][b][c][d][e]amix=inputs=5:normalize=0,tremolo=f=7:d=0.08,highpass=f=70,aformat=channel_layouts=stereo[x];"
        "[x]afade=t=in:d=0.5[o]")
ortam("b8_floresan", [], FLOR.replace("[x]afade=t=in:d=0.5[o]", "[x]anull[o]"), "B8: floresan tüp vızıltısı (100 Hz + harmonikler, kendi sentezimiz), kısık katman", 40)

# camın arkasında gece trafiği: sehir_gece (BigSoundBank #0680, CC0) alçak geçiren (vitrin camı)
ortam("b8_trafik_cam", [["-i", os.path.join(S, "ortam", "sehir_gece.mp3")]],
      "[0:a]lowpass=f=900,highpass=f=60,equalizer=f=250:t=q:w=1:g=2,aformat=channel_layouts=stereo[o]",
      "B8: market camının arkasından gece trafiği (sehir_gece #0680 CC0, cam filtresi)", 58)

# birleşik market gecesi: el_market_ortam (buzdolabı, floresan, uzak yağmur) 4 kez çapraz geçişle + floresan + trafik
MO = E("el_market_ortam")
ortam("b8_market_gece",
      [["-i", MO], ["-i", MO], ["-i", MO], ["-i", MO], ["-i", os.path.join(S, "ortam", "b8_floresan.mp3")], ["-i", os.path.join(S, "ortam", "b8_trafik_cam.mp3")]],
      "[0:a][1:a]acrossfade=d=2[a01];[a01][2:a]acrossfade=d=2[a02];[a02][3:a]acrossfade=d=2,aformat=channel_layouts=stereo[m];"
      "[4:a]volume=-9dB[f];[5:a]volume=-5dB[t];[m][f][t]amix=inputs=3:normalize=0:duration=first,afade=t=in:d=0.4[o]",
      "B8: gece marketi (buzdolabı, floresan vızıltısı, uzakta yağmur, camın arkasında seyrek trafik); P1 ana ortam katmanı", 52)

# ---------------------------------------------------------------- 3. müzik
# b8_anlatim (ElevenLabs Music, 30 sn): 0-2 giriş, 2-21 alçak drone + pad (tını giderek parlaklaşır), 22-25,5 doruk, 26-28,5 sönüm.
# Kesik sürüm: 0-25,55 sn, büyüme vurgusu için -5 dB -> +1 dB doğrusal kazanç rampası ve sert kesim (30 ms).
# Motorun müzik izi döngülü çalar ve segment sonunda 1 sn söndürür; sert kesimin duyulması için kesimden sonra
# dosyaya 10 sn sessizlik eklenir (segment kesimden sonra da sürebilir, döngüye girmez).
# Uzun sürüm: baş tarafa 2-15 sn'lik alçak drone bölümü eklenir (2,5 sn çapraz geçiş), çizim başından son kelimeye kadar yeter.
AN = os.path.join(S, "muzik", "b8_anlatim.mp3")
PAD = 10.0
if os.path.exists(AN):
    T = 25.55
    for ad, filt, L, desc in (
        ("b8_anlatim_kesik", f"[0:a]atrim=0:{T},asetpts=N/SR/TB[m]", T,
         "B8 P1: b8_anlatim 0-25,55 sn, büyüyen kazanç rampası (-5 -> +1 dB), 25,55'te sert kesim + 10 sn sessizlik"),
        ("b8_anlatim_uzun", f"[0:a]atrim=2:15,asetpts=N/SR/TB,afade=t=in:d=2.5[h];[0:a]atrim=2.5:{T},asetpts=N/SR/TB[b];[h][b]acrossfade=d=2.5:c1=tri:c2=tri[m]", 13 + (T - 2.5) - 2.5,
         "B8 P1: b8_anlatim uzatılmış (baş: alçak drone 2-15 sn tekrar), büyüyen rampa, 33,55'te sert kesim + 10 sn sessizlik"),
    ):
        dst = os.path.join(S, "muzik", f"{ad}.mp3")
        tmp = dst + ".tmp.wav"
        run("-i", AN, "-filter_complex",
            f"{filt};[m]volume='pow(10,(-5+6*t/{L:.2f})/20)':eval=frame,afade=t=out:st={L - 0.03:.3f}:d=0.03,apad=pad_dur={PAD}[o]",
            "-map", "[o]", "-ar", "44100", "-ac", "2", tmp)
        # seviye ölçümü sessiz kuyruğu saymasın diye müzik kısmından ölçülür
        e = subprocess.run(["ffmpeg", "-hide_banner", "-t", f"{L:.2f}", "-i", tmp, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
        cur = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1])
        run("-i", tmp, "-af", f"volume={-18.0 - cur:.2f}dB,alimiter=limit=0.8:level=false", "-ar", "44100", "-ac", "2", "-c:a", "libmp3lame", "-q:a", "2", dst)
        os.remove(tmp)
        cat[f"muzik/{ad}"] = {"file": f"ses/muzik/{ad}.mp3", "category": "muzik", "duration": dur(dst), "kesim": round(L, 2), "loop": False, "desc": desc}

json.dump(dict(sorted(cat.items())), open(CAT_P, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("tamam")

# ---------------------------------------------------------------- 4. replik seçimi + R1c zaman düzeltmesi
man_p = os.path.join(V, "manifest.json")
man = json.load(open(man_p, encoding="utf-8"))
r1 = man["R1c_01"]
if not r1.get("duzeltme"):
    # ElevenLabs hizalaması ilk kelimeyi 0,35'te başlatıyor; dalga biçimi ve Whisper sesi 0,10'da başlatıyor.
    a0, a1, b0 = 0.349, 0.59, 0.10
    sk = lambda t: round(b0 + (t - a0) * (a1 - b0) / (a1 - a0), 3) if a0 <= t < a1 else t
    r1["words"][0]["start"] = 0.10
    r1["words"][0]["end"] = 0.55
    r1["mouth"] = [dict(c, t=sk(c["t"])) for c in r1["mouth"]]
    r1["duzeltme"] = "ilk kelime 0,35 -> 0,10 (dalga biçimi + Whisper medium); ilk kelimenin ağız işaretleri yeniden ölçeklendi"
json.dump(man, open(man_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

SECIM = {
    "_not": "B8 P1 replik seçimleri (ses yönetmeni). Anahtar = manifest anahtarı. Metin aynen; okunuş yalnız ritim için (virgül, üç nokta, BULUŞUYOR büyük harf vurgusu).",
    "1_sabri_geldin": {"sec": "R1c_01", "yedek": ["R1a_01", "R1b_01"]},
    "2_ece_cevaplar": {"sec": "R2b_01", "yedek": ["R2c_01", "R2a_01"]},
    "3_sabri_anlatayim": {"sec": "R3b_01", "yedek": ["R3a_01"]},
    "4_sabri_topluluklar": {"sec": "R4a_01", "yedek": ["R4b_01"]},
    "5_sabri_yasam_cizgisi": {"sec": "R5a_01", "yedek": ["R5b_01"]},
    "6_sabri_paralel": {"sec": "R6a_01", "yedek": ["R6b_01"]},
    "7_sabri_ortak_nokta": {"sec": "R7d_01", "yedek": ["R7b_01", "R7e_01", "R7a_01", "R7c_01"]},
}
json.dump(SECIM, open(os.path.join(V, "secim.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("secim tamam")
