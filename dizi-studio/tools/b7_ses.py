#!/usr/bin/env python3
"""7/24 Bölüm 7: ses yönetmeninin ücretsiz türev sesleri (kredi harcamaz, yalnız ffmpeg).
- Yeni replik seçimleri ve kesimleri  -> public/voice/724-07-yeni/sec/*.mp3 + manifest.json'a *_sec kayıtları
- Akşam ortamları (kuşsuz, 18:00 kasım) -> public/ses/ortam/b7_*.mp3 (-20 LUFS)
- Kesilmiş/filtrelenmiş efektler        -> public/ses/efekt/b7_*.mp3
Kullanım (dizi-studio/ içinden): python3 tools/b7_ses.py
"""
import json, os, re, subprocess

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(K, "public")
V = os.path.join(P, "voice", "724-07-yeni")
S = os.path.join(P, "ses")
os.makedirs(os.path.join(V, "sec"), exist_ok=True)

# elevenlabs.py ile aynı filtreler (kapı arkası)
FX = {
    "kapi_arkasi": "highpass=f=180,lowpass=f=2000,equalizer=f=350:t=q:w=1.0:g=2,aecho=0.8:0.5:14|31:0.18|0.1,apad=pad_dur=0.3",
    "kapi_arkasi_hafif": "highpass=f=150,lowpass=f=3200,aecho=0.8:0.4:12|25:0.15|0.08,apad=pad_dur=0.3",
    "yanki": "aecho=0.8:0.7:70|140:0.35|0.2,apad=pad_dur=0.5",
}


def lufs(path, af=""):
    pre = (af + ",") if af else ""
    e = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", f"{pre}ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", e)
    return float(m[-1]) if m else -70.0


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).strip())


def kes(src, dst, ss=0.0, to=None, af="", hedef=-16.0, fi=0.01, fo=0.05, mono=True):
    """Kes, filtrele, hedef LUFS'a getir (kısa kliplerde doğrusal kazanç + sınırlayıcı)."""
    tmp = dst + ".tmp.wav"
    cut = ["-ss", f"{ss:.3f}"] + (["-to", f"{to:.3f}"] if to else [])
    d = (to or dur(src)) - ss
    f = [f"afade=t=in:d={fi}", f"afade=t=out:st={max(0, d - fo):.3f}:d={fo}"]
    if af:
        f.append(af)
    subprocess.run(["ffmpeg", "-v", "error", "-y", *cut, "-i", src, "-af", ",".join(f), "-ar", "44100", "-ac", "1" if mono else "2", tmp], check=True)
    cur = lufs(tmp)
    if cur <= -69.0:  # 0,4 sn altı: LUFS ölçülemez -> tepeyi -8 dBFS'e getir
        e = subprocess.run(["ffmpeg", "-i", tmp, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
        cur = float(re.search(r"max_volume: (-?[\d.]+) dB", e).group(1)) + (hedef + 8.0)
    g = max(-30.0, min(20.0, hedef - cur))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={g:.2f}dB,alimiter=limit=0.84:level=false", "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "2", dst], check=True)
    os.remove(tmp)
    return round(dur(dst), 3)


# ---------------------------------------------------------------- 1. replik seçimleri
man_p = os.path.join(V, "manifest.json")
man = json.load(open(man_p, encoding="utf-8"))
E05b = os.path.join(P, "voice", "724-07", "cekim", "E05b_01.mp3")


def kayit(lid, rel, text, d, words, mouth, kaynak, emotion="notr"):
    man[lid] = {"key": "turev", "file": f"voice/724-07-yeni/{rel}", "voice": "elevenlabs:Nazlı Yeni", "emotion": emotion, "text": text,
                "duration": d, "asrScore": None, "heard": None, "words": words, "mouth": mouth, "kaynak": kaynak, "model": "eleven_v4", "kredi": 0}


def kopya_kayit(lid, src_id, rel, kirp=0.0, son=None):
    s = man[src_id]
    w = [dict(x, start=round(max(0, x["start"] - kirp), 3), end=round(max(0, x["end"] - kirp), 3)) for x in s["words"] if son is None or x["start"] < son]
    c = [dict(x, t=round(max(0, x["t"] - kirp), 3)) for x in s["mouth"] if x["t"] >= kirp and (son is None or x["t"] < son)]
    return w, c


# Y1: "anne vallahi büyük hayranınım." -> Y1c tam (Whisper 1.00), fısıltı
d = kes(os.path.join(V, "Y1c_01.mp3"), os.path.join(V, "sec", "Y1_sec.mp3"), 0.0, None, hedef=-17.0)
w, c = kopya_kayit("Y1_sec", "Y1c_01", "sec/Y1_sec.mp3")
kayit("Y1_sec", "sec/Y1_sec.mp3", "anne vallahi büyük hayranınım.", d, w, c, "turev: Y1c_01 tam (fısıltı -17 LUFS)")
# Y1 yedek: Y1a, gergin kıkırdama + replik (4,4 sn; kıkırdama "korkuyla sırıtır" vuruşuna)
d = kes(os.path.join(V, "Y1a_01.mp3"), os.path.join(V, "sec", "Y1_yedek_kikir.mp3"), 0.0, None, hedef=-17.0)
w, c = kopya_kayit("Y1_yedek", "Y1a_01", "")
kayit("Y1_yedek_kikir", "sec/Y1_yedek_kikir.mp3", "anne vallahi büyük hayranınım.", d, w, c, "turev: Y1a_01 tam (kıkırdama 0-1,95 + replik 2,0-4,2)")

# Y2: "Iıh!" -> E05b_01 (P1'de kullanılmayan çekim) içinden tek hece
for ad, a, b in (("Y2_sec", 1.78, 2.28), ("Y2_yedek", 0.22, 0.64)):
    d = kes(E05b, os.path.join(V, "sec", f"{ad}.mp3"), a, b, hedef=-16.0, fi=0.008, fo=0.08)
    kayit(ad, f"sec/{ad}.mp3", "Iıh!", d, [{"w": "Iıh!", "start": 0.0, "end": round(d - 0.05, 3)}],
          [{"t": 0.0, "v": "I"}, {"t": round(d * 0.45, 3), "v": "A"}, {"t": round(d - 0.05, 3), "v": "X"}], f"turev: 724-07/cekim/E05b_01 {a}-{b} sn")

# Y3: "İyiyim!" -> Y3b: nefes nefese soluk (0-1,0) + daha net ikinci "İyiyim!" (2,22-3,24; Whisper small+medium doğru duyuyor).
# İlk tekrar (1,06-2,15) small modelde "İm!" duyuluyor; yedek olarak kalır. Replik bir kez söylenir (metin aynen).
Y3 = os.path.join(V, "Y3b_01.mp3")
Y3S = os.path.join(V, "sec", "_y3_ek.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", Y3, "-filter_complex",
                "[0:a]atrim=0:1.0,asetpts=N/SR/TB,afade=t=out:st=0.9:d=0.1[a];[0:a]atrim=2.22:3.239,asetpts=N/SR/TB,afade=t=in:d=0.01[b];[a][b]concat=n=2:v=0:a=1[o]",
                "-map", "[o]", Y3S], check=True)
W3 = [{"w": "İyiyim!", "start": 1.02, "end": 1.66}]
M3 = [{"t": 1.02, "v": "I"}, {"t": 1.25, "v": "I"}, {"t": 1.66, "v": "X"}]
d = kes(Y3S, os.path.join(V, "sec", "Y3_kuru.mp3"), 0.0, None, hedef=-16.0)
kayit("Y3_kuru", "sec/Y3_kuru.mp3", "İyiyim!", d, W3, M3, "turev: Y3b_01 0-1,0 (soluk) + 2,22-3,24 (İyiyim!), kuru")
d = kes(Y3S, os.path.join(V, "sec", "Y3_kapi.mp3"), 0.0, None, af=FX["kapi_arkasi_hafif"], hedef=-19.0)
kayit("Y3_sec", "sec/Y3_kapi.mp3", "İyiyim!", d, W3, [], "turev: Y3b_01 soluk + ikinci İyiyim! + kapi_arkasi_hafif (-19 LUFS), oda kapısı arkası")
d = kes(Y3, os.path.join(V, "sec", "Y3_kapi_kisa.mp3"), 2.22, 3.239, af=FX["kapi_arkasi_hafif"], hedef=-19.0)
kayit("Y3_kisa", "sec/Y3_kapi_kisa.mp3", "İyiyim!", d, [{"w": "İyiyim!", "start": 0.0, "end": 0.66}], [], "turev: Y3b_01 2,22-3,24 (soluksuz) + kapi_arkasi_hafif")
d = kes(Y3, os.path.join(V, "sec", "Y3_yedek_ilk.mp3"), 1.06, 2.15, af=FX["kapi_arkasi_hafif"], hedef=-19.0)
kayit("Y3_yedek_ilk", "sec/Y3_yedek_ilk.mp3", "İyiyim!", d, [{"w": "İyiyim!", "start": 0.06, "end": 1.02}], [], "turev: Y3b_01 1,06-2,15 (ilk tekrar) + kapi_arkasi_hafif")
os.remove(Y3S)

# Y4: "Hassiktir…" -> Y4b (Whisper 0.94; irkilme nefesi + kelime) dış kapı arkası, merdiven boşluğu
Y4 = os.path.join(V, "Y4b_01.mp3")
d = kes(Y4, os.path.join(V, "sec", "Y4_kapi.mp3"), 0.0, None, af=FX["kapi_arkasi"], hedef=-24.0)
kayit("Y4_sec", "sec/Y4_kapi.mp3", "Hassiktir…", d, [{"w": "Hassiktir…", "start": 0.69, "end": 1.9}], [], "turev: Y4b_01 + kapi_arkasi (-24 LUFS), antre kapısı arkası")
d = kes(Y4, os.path.join(V, "sec", "Y4_kuru.mp3"), 0.0, None, hedef=-17.0)
kayit("Y4_kuru", "sec/Y4_kuru.mp3", "Hassiktir…", d, [{"w": "Hassiktir…", "start": 0.69, "end": 1.9}], [], "turev: Y4b_01 kuru")

json.dump(man, open(man_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- 2. akşam ortamları (-20 LUFS, kuşsuz)
def ortam(dst, inputs, filt, desc, cat):
    tmp = dst + ".tmp.wav"
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for i in inputs:
        cmd += i
    subprocess.run(cmd + ["-filter_complex", filt, "-map", "[o]", "-t", "58", "-ar", "44100", "-ac", "2", tmp], check=True)
    g = -20.0 - lufs(tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={g:.2f}dB,alimiter=limit=0.7:level=false", "-c:a", "libmp3lame", "-q:a", "3", dst], check=True)
    os.remove(tmp)
    rel = os.path.relpath(dst, P)
    cat[rel[4:-4]] = {"file": rel, "category": "ortam", "duration": round(dur(dst), 2), "loop": True, "desc": desc}


cat_p = os.path.join(S, "katalog.json")
cat = json.load(open(cat_p, encoding="utf-8"))
oda, gece, saat = (["-i", os.path.join(S, "ortam", f"{x}.mp3")] for x in ("oda_tonu", "sehir_gece", "saat_tiklama"))
fan = ["-f", "lavfi", "-t", "58", "-i", "anoisesrc=c=brown:a=0.5:r=44100,lowpass=f=260,highpass=f=60"]
ortam(os.path.join(S, "ortam", "b7_banyo_aksam.mp3"), [oda, gece, fan],
      "[0:a]volume=0dB[a];[1:a]lowpass=f=700,volume=-9dB[b];[2:a]volume=-8dB[c];[a][b][c]amix=inputs=3:normalize=0,afade=t=in:d=0.3[o]",
      "B7 banyo, kasım 18:00 (kuşsuz): oda tonu + aspiratör uğultusu + kapalı pencere arkası gece şehri. oda_tonu/sehir_gece (BigSoundBank CC0) + kendi sentezimiz. -20 LUFS.", cat)
ortam(os.path.join(S, "ortam", "b7_salon_aksam.mp3"), [oda, gece, saat],
      "[0:a]volume=0dB[a];[1:a]lowpass=f=1200,volume=-5dB[b];[2:a]volume=-10dB[c];[a][b][c]amix=inputs=3:normalize=0,afade=t=in:d=0.3[o]",
      "B7 salon akşamı (kasım 18:00): oda tonu + pencere arkası gece şehri + hafif duvar saati. BigSoundBank CC0 türevi. -20 LUFS.", cat)

# ---------------------------------------------------------------- 3. efekt türevleri
def efekt(ad, src, a, b, af, hedef, desc, fo=0.08):
    dst = os.path.join(S, "efekt", f"{ad}.mp3")
    d = kes(os.path.join(S, "efekt", f"{src}.mp3"), dst, a, b, af=af, hedef=hedef, fo=fo, mono=False)
    cat[f"efekt/{ad}"] = {"file": f"ses/efekt/{ad}.mp3", "category": "efekt", "duration": d, "loop": False, "desc": desc}


efekt("b7_oda_kapi_kut", "kapi_carpma", 1.92, 2.75, "", -16.0, "B7: oda kapısı tek 'KÜT' (kapi_carpma 1,92-2,75 türevi, BigSoundBank #0103 CC0).", fo=0.15)
efekt("b7_kapi_arkasi_dolap", "el_dolap_karistir", 0.0, 2.6, FX["kapi_arkasi_hafif"], -22.0, "B7: oda kapısı arkasından çekmece/askı telaşı (el_dolap_karistir + kapı arkası filtresi).", fo=0.2)
efekt("b7_hayal_zincir", "kilit", 0.0, 1.1, FX["yanki"], -18.0, "B7: hayal ekinde kapı zinciri/kilit, rüya yankılı (kilit, kendi sentezimiz, türev).", fo=0.4)
efekt("b7_musluk_kapat", "el_yuz_yikama", 2.5, 4.0, "", -24.0, "B7: musluk kapanır, son damlalar (el_yuz_yikama 2,5-4,0 türevi).", fo=0.3)
efekt("b7_otomatik_sonme", "el_otomatik_isik", 0.0, 0.35, "lowpass=f=2500", -22.0, "B7: merdiven otomatiği röle tıkı (el_otomatik_isik ilk 0,35 sn, kapı arkası tınısı).", fo=0.1)

efekt("b7_tabak_uzak", "el_tabak_tak", 0.0, 0.9, "lowpass=f=1800,aecho=0.8:0.5:22|45:0.22|0.12", -27.0, "B7 P2 sonu: salondan uzak tabak 'tak' (J-cut köprüsü; el_tabak_tak türevi, koridor yankısı).", fo=0.3)
efekt("b7_otomatik_isik_kapi", "el_otomatik_isik", 0.0, 1.5, FX["kapi_arkasi"], -26.0, "B7 P3: dış kapı arkasında merdiven otomatiğine basılır, ışık vızıltısı (el_otomatik_isik + kapı arkası).", fo=0.3)

efekt("b7_merdiven_kosu", "kosma", 0.0, 2.2, FX["kapi_arkasi"] + ",aecho=0.6:0.4:60:0.25", -27.0, "B7 P3: dış kapı arkasında merdivenden hızla inen adımlar, uzaklaşır (kosma türevi + kapı arkası + merdiven yankısı).", fo=1.2)

# musluk döngüsü: el_musluk'un 0,4-5,6'sı, 12 sn, çapraz geçişli
src = os.path.join(S, "efekt", "el_musluk.mp3")
dst = os.path.join(S, "ortam", "b7_musluk_dongu.mp3")
tmp = dst + ".tmp.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.4", "-to", "5.6", "-i", src, "-ss", "0.4", "-to", "5.6", "-i", src, "-ss", "0.4", "-to", "5.6", "-i", src,
                "-filter_complex", "[0:a][1:a]acrossfade=d=0.8[x];[x][2:a]acrossfade=d=0.8,afade=t=in:d=0.15[o]", "-map", "[o]", "-ac", "2", tmp], check=True)
g = -24.0 - lufs(tmp)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={g:.2f}dB", "-c:a", "libmp3lame", "-q:a", "3", dst], check=True)
os.remove(tmp)
cat["ortam/b7_musluk_dongu"] = {"file": "ses/ortam/b7_musluk_dongu.mp3", "category": "ortam", "duration": round(dur(dst), 2), "loop": True,
                                "desc": "B7 P2: açık kalan lavabo musluğu, ~14 sn döngü (el_musluk türevi, ElevenLabs SFX kullanıcı hesabı). -24 LUFS."}

cat["muzik/b7_sofra_komik"]["desc"] = cat["muzik/b7_sofra_komik"]["desc"].split(" | ")[0] + " | Ölçüm: 0-24 sn oynak pizzicato/klarnet, 24-25 sn söner; istenen 'asılı nota' ÇIKMADI (kanca için efekt/el_asili_nota). -17,5 LUFS."
json.dump(dict(sorted(cat.items())), open(cat_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("tamam")
for k in sorted(man):
    if "_sec" in k or k.endswith(("kuru", "kisa", "yedek", "kikir")):
        print(" ", k, man[k]["file"], man[k]["duration"])
