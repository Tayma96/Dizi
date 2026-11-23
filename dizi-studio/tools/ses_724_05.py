#!/usr/bin/env python3
"""7/24 Bölüm 5 ses sonrası işlemleri (ücretsiz; kredi harcamaz). dizi-studio/ içinden çalıştırılır.

  python3 tools/ses_724_05.py bol      # 724-05-ses/i_01 (tek nefes: "hıığğ" + "abi vallahi büyük hayranınım.") -> 724-05 i_01 + i_02
  python3 tools/ses_724_05.py sahte    # sahte Sabri replikleri (b_01, d_01): fark edilmeyecek kadar hafif çift ses / perde kayması
  python3 tools/ses_724_05.py kirp ID BAS SON   # repliği [BAS, SON] saniye aralığına kırpar; words/mouth kaydırılır
  python3 tools/ses_724_05.py olc      # bütün repliklerin LUFS / tepe ölçümü

Manifest anahtarları, elevenlabs.py'nin 724-05.json alanlarından hesapladığı anahtarla aynı tutulur;
böylece `seslendir` bu satırları önbellekte sayar ve yeniden üretmez (B4 yöntemi, raporlar/b4-ses.md §1.3).
Kuru (işlenmemiş) kopyalar public/voice/724-05/kuru/ altında saklanır."""
import hashlib, json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools"))
import elevenlabs as E  # noqa: E402

EP = "724-05"
VDIR = os.path.join(ROOT, "public", "voice", EP)
MAN = os.path.join(VDIR, "manifest.json")
KURU = os.path.join(VDIR, "kuru")
MODEL = "eleven_v4"


def man_load():
    return json.load(open(MAN, encoding="utf-8")) if os.path.exists(MAN) else {}


def man_save(m):
    json.dump(m, open(MAN, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def keys():
    ep = json.load(open(os.path.join(ROOT, "public", "episodes", EP + ".json"), encoding="utf-8"))
    vm = json.load(open(E.VOICES, encoding="utf-8"))
    out = {}
    for l in E.lines_from_episode(ep):
        v = vm[l["who"]]
        t = E.build_text(l, MODEL)
        extra = "".join(f"|{k}={l[k]}" for k in ("hiz", "fx") if l.get(k))
        if l.get("stab") is not None:
            extra += f"|stab={l['stab']}"
        out[l["id"]] = (hashlib.sha1(f"el|{MODEL}|{v['voice_id']}|{json.dumps(v.get('ayar', {}), sort_keys=True)}|{l['emotion']}|{t}{extra}".encode()).hexdigest()[:12], l)
    return out


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).strip())


def cut(src, dst, a, b, fin=0.008, fout=0.012, af_extra=""):
    d = b - a
    af = f"atrim={a:.3f}:{b:.3f},asetpts=N/SR/TB,afade=t=in:d={fin},afade=t=out:st={max(0, d - fout):.3f}:d={fout}"
    if af_extra:
        af += "," + af_extra
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", af, "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "2", dst], check=True)


def shift(words, mouth, a, b):
    w = [{"w": x["w"], "start": round(max(0.0, x["start"] - a), 3), "end": round(min(b, x["end"]) - a, 3)} for x in words if x["end"] > a and x["start"] < b]
    m = [{"t": round(x["t"] - a, 3), "v": x["v"]} for x in mouth if a <= x["t"] < b]
    if m and m[-1]["v"] != "X":
        m.append({"t": round(b - a - 0.02, 3), "v": "X"})
    return w, m


def cmd_bol():
    """Tek nefes çekimi ikiye böler. Bölme noktası: ikinci (titrek) 'hıh'tan sonra, 'Abi' öncesi nefesin başı."""
    src = os.path.join(ROOT, "public", "voice", EP + "-ses", "i_01.mp3")
    sm = json.load(open(os.path.join(ROOT, "public", "voice", EP + "-ses", "manifest.json"), encoding="utf-8"))["i_01"]
    A0, SPLIT, END = 0.04, 1.47, sm["duration"]
    K = keys()
    m = man_load()
    os.makedirs(VDIR, exist_ok=True)
    # i_01: nefes çekme (0.06-0.34) + "Hığ!" (0.56-0.90) + titrek "hıh" (1.22-1.44)
    cut(src, os.path.join(VDIR, "i_01.mp3"), A0, SPLIT)
    d1 = dur(os.path.join(VDIR, "i_01.mp3"))
    m["i_01"] = {"key": K["i_01"][0], "file": f"voice/{EP}/i_01.mp3", "voice": "elevenlabs:Nazlı Yeni", "emotion": "notr", "text": "hıığğ",
                 "duration": round(d1, 3), "asrScore": None, "heard": None,
                 "words": [{"w": "hıığğ", "start": 0.02, "end": round(1.42 - A0, 3)}],
                 "mouth": [{"t": 0.02, "v": "U"}, {"t": 0.3, "v": "X"}, {"t": 0.5, "v": "A"}, {"t": 0.86, "v": "X"}, {"t": 1.18, "v": "I"}, {"t": 1.4, "v": "X"}],
                 "kaynak": "elevenlabs", "model": MODEL, "turetim": f"{EP}-ses/i_01 [{A0}-{SPLIT}] (tek nefes çekimi, bölündü)", "kredi": 0}
    cut(src, os.path.join(VDIR, "i_02.mp3"), SPLIT, END, fin=0.004)
    d2 = dur(os.path.join(VDIR, "i_02.mp3"))
    w, mo = shift(sm["words"][1:], sm["mouth"], SPLIT, END)
    m["i_02"] = {"key": K["i_02"][0], "file": f"voice/{EP}/i_02.mp3", "voice": "elevenlabs:Nazlı Yeni", "emotion": "notr", "text": "abi vallahi büyük hayranınım.",
                 "duration": round(d2, 3), "asrScore": None, "heard": None, "words": w, "mouth": mo,
                 "kaynak": "elevenlabs", "model": MODEL, "turetim": f"{EP}-ses/i_01 [{SPLIT}-{END}] (tek nefes çekimi, bölündü)", "kredi": 0}
    man_save(m)
    print(f"i_01 {d1:.3f} sn, i_02 {d2:.3f} sn; anahtarlar {K['i_01'][0]} / {K['i_02'][0]}")


# Sahte Sabri dokusu: aynı ses, 14 ms gecikmeli ve -0.18 yarım ton kaymış ikinci bir kopya -17 dB altta
# (çok hafif "çift ağız"), artı bir oktav aşağıda -30 dB gölge. Süre değişmez, kuyruk eklenmez.
SAHTE = ("[0:a]asplit=3[k][c][o];"
         "[c]rubberband=pitch=0.9897:formant=preserved,adelay=14,volume=0.14[c2];"
         "[o]rubberband=pitch=0.5:formant=shifted,lowpass=f=900,volume=0.03[o2];"
         "[k][c2][o2]amix=inputs=3:normalize=0:duration=first,volume=0.88")


def cmd_sahte(ids=("b_01", "d_01")):
    m = man_load()
    os.makedirs(KURU, exist_ok=True)
    for lid in ids:
        f = os.path.join(VDIR, f"{lid}.mp3")
        k = os.path.join(KURU, f"{lid}.mp3")
        if not os.path.exists(k):
            shutil.copyfile(f, k)
        tmp = f + ".tmp.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", k, "-filter_complex", SAHTE, tmp], check=True)
        E.loudnorm_2pass(tmp, f, target=-16.0)
        os.remove(tmp)
        m[lid]["sahte_doku"] = "rubberband -0.18 yt çift ses 14 ms -17 dB + oktav altı -30 dB (tools/ses_724_05.py sahte); kuru: voice/724-05/kuru/" + lid + ".mp3"
        m[lid]["duration"] = round(dur(f), 3)
        print(f"{lid}: doku uygulandı, {m[lid]['duration']} sn")
    man_save(m)


def cmd_kirp(lid, a, b):
    a, b = float(a), float(b)
    m = man_load()
    f = os.path.join(VDIR, f"{lid}.mp3")
    os.makedirs(KURU, exist_ok=True)
    yedek = os.path.join(KURU, f"{lid}_kirpilmamis.mp3")
    if not os.path.exists(yedek):
        shutil.copyfile(f, yedek)
    tmp = f + ".tmp.mp3"
    cut(f, tmp, a, b)
    os.replace(tmp, f)
    w, mo = shift(m[lid]["words"], m[lid]["mouth"], a, b)
    m[lid].update(words=w, mouth=mo, duration=round(dur(f), 3))
    m[lid]["kirpma"] = (m[lid].get("kirpma", "") + f" [{a}-{b}]").strip()
    man_save(m)
    print(f"{lid}: {m[lid]['duration']} sn", w)


# B5 efekt türevleri: ElevenLabs SFX ham dosyası (efekt/el_*) -> efekt/b5_* (başı olayın başlangıcına kırpılır,
# kuyruk sönümlenir, tek vuruşlar tepe -3 dBFS'e, ortam katmanları -20 LUFS'e normalize). Kaynak dosyalar silinmez.
B5_EFEKT = {
    # ad: (kaynak, tür, açıklama)
    "b5_omuz_kavrama": ("el_omuz_kavrama", "vurus", "Omuza el konması, kazakta kumaş kavrama"),
    "b5_irkilme": ("el_irkilme", "vurus", "İrkilme: gövde sıçraması, kıyafet hışırtısı, ayakkabı sürtünmesi"),
    "b5_yuz_erime": ("el_yuz_erime", "vurus", "Yüzün erimesi: cızırtı, kabarcık, ıslak akış ve damlama (4,4 sn)"),
    "b5_deri_yirtilma": ("el_deri_yirtilma", "vurus", "Derinin ıslak yırtılıp soyulması, simbiyot lifleri gerilip kopar"),
    "b5_kitin_catirti": ("el_kitin_catirti", "vurus", "Kitin kabuk çatırtısı"),
    "b5_bocek_bacak": ("el_bocek_bacak", "vurus", "Böcek bacaklarının açılması ve fayansta tıkırtı"),
    "b5_anten_hisirti": ("el_anten_hisirti", "vurus", "Antenlerin havada hışırtısı"),
    "b5_kanat_vizilti": ("el_kanat_vizilti", "vurus", "Kanatların kabarması: kuru tırtıl, kısa vızıltı"),
    "b5_govde_buyume": ("el_govde_buyume", "vurus", "Gövdenin devleşmesi: gerilme gıcırtısı, kabuk çatırtısı, alçak homurtu"),
    "b5_deri_dusme": ("el_deri_dusme", "vurus", "Deri ve hırka yığınının yere ıslak düşüşü"),
    "b5_floresan_kivilcim": ("el_floresan_kivilcim", "vurus", "Anten floresana çarpar: kıvılcım, cam tıngırtısı, titreme"),
    "b5_bocek_tislama": ("el_bocek_tislama", "vurus", "Dev hamamböceği tıslaması"),
    "b5_mandibula": ("el_mandibula", "vurus", "Mandibula tık tık (meraklı), altında alçak tıslama"),
    "b5_bocek_kukreme": ("el_bocek_kukreme", "vurus", "Dev hamamböceği KÜKREMESİ: hırıltı + böceksi tıkırtı"),
    "b5_vurus": ("el_b5_vurus", "vurus", "Final korku-komedi vuruşu"),
    "b5_buzdolabi": ("el_buzdolabi", "ortam", "Mahçup sessizlik: buzdolabı uğultusu (6 sn, -20 LUFS)"),
}


def _env(src):
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "8000", "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.float32)
    w = 80  # 10 ms
    return np.array([20 * np.log10(np.sqrt((a[i:i + w] ** 2).mean()) + 1e-9) for i in range(0, len(a) - w, w)])


def cmd_efekt():
    cat_path = os.path.join(ROOT, "public", "ses", "katalog.json")
    cat = json.load(open(cat_path, encoding="utf-8"))
    E_DIR = os.path.join(ROOT, "public", "ses", "efekt")
    for ad, (kay, tur, aciklama) in B5_EFEKT.items():
        src = os.path.join(E_DIR, kay + ".mp3")
        dst = os.path.join(E_DIR, ad + ".mp3")
        if tur == "ortam":
            E.loudnorm_2pass(src, dst, target=-20.0)
            bas = 0.0
        else:
            db = _env(src)
            pk = db.max()
            act = [i for i, x in enumerate(db) if x > pk - 30]
            bas = max(0.0, act[0] * 0.01 - 0.01)
            son_i = max(i for i, x in enumerate(db) if x > pk - 45)
            son = min(len(db) * 0.01, son_i * 0.01 + 0.12)
            tmp = dst + ".tmp.mp3"
            cut(src, tmp, bas, son, fin=0.004, fout=0.08)
            # tepe -3 dBFS
            st = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
            mx = float(re.search(r"max_volume: (-?[\d.]+) dB", st).group(1))
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={-3.0 - mx:.2f}dB", "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-q:a", "2", dst], check=True)
            os.remove(tmp)
        d = round(dur(dst), 2)
        cat[f"efekt/{ad}"] = {"file": f"ses/efekt/{ad}.mp3", "category": "efekt", "duration": d, "loop": tur == "ortam",
                              "desc": f"B5: {aciklama} ({kay}; {'-20 LUFS' if tur == 'ortam' else f'baştan {bas:.2f} sn kırpıldı, tepe -3 dBFS'}). ElevenLabs SFX (kullanıcı hesabı)."}
        print(f"efekt/{ad:22s} {d:5.2f} sn  (kaynak {kay}, baş kırpma {bas:.2f})")
    json.dump(dict(sorted(cat.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


# Müzik: h sahnesinin başından (dönüşüm) kükremenin başına kadar. Sahne h 12,5 sn (eklemeler sabit),
# i_01 + i_02 = 44 + 79 kare; kükreme vuruşu h başından 16,60 sn sonra, kükreme sesi +0,18 -> 16,78 sn'de müzik keskin kesilir
# (kükreme tek başına kalır, ardından "lülü?" sessizliği). Dosya 30 sn'ye sessizlikle doldurulur (motor müziği döngüye alır).
MUZIK_KESME = 16.78


def cmd_muzik(kesme=MUZIK_KESME):
    M = os.path.join(ROOT, "public", "ses", "muzik")
    fc = (f"[0:a]atrim=0:13.0,asetpts=N/SR/TB,afade=t=out:st=12.3:d=0.7[a];"
          f"[1:a]atrim=4.0:9.2,asetpts=N/SR/TB,afade=t=in:d=0.8,volume=0.45,adelay=12000|12000[b];"
          f"[a][b]amix=inputs=2:normalize=0:duration=longest,atrim=0:{kesme:.3f},afade=t=out:st={kesme - 0.03:.3f}:d=0.03,apad=whole_dur=30[o]")
    tmp = os.path.join(M, "b5_donusum_tam.tmp.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(M, "b5_donusum.mp3"), "-i", os.path.join(ROOT, "public", "ses", "efekt", "korku_drone.mp3"),
                    "-filter_complex", fc, "-map", "[o]", "-ac", "2", "-ar", "44100", tmp], check=True)
    # ölçüm yalnız müzikli bölümde: -18 LUFS
    st = subprocess.run(["ffmpeg", "-hide_banner", "-t", f"{kesme:.2f}", "-i", tmp, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    cur = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", st)[-1])
    out = os.path.join(M, "b5_donusum_tam.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={-18.0 - cur:.2f}dB,alimiter=limit=0.84:level=false", "-c:a", "libmp3lame", "-q:a", "2", out], check=True)
    os.remove(tmp)
    cat_path = os.path.join(ROOT, "public", "ses", "katalog.json")
    cat = json.load(open(cat_path, encoding="utf-8"))
    cat["muzik/b5_donusum_tam"] = {"file": "ses/muzik/b5_donusum_tam.mp3", "category": "muzik", "duration": 30.0, "loop": False,
                                   "desc": f"B5 dönüşüm altyapısı: muzik/b5_donusum (ElevenLabs Music) 0-13 sn + efekt/korku_drone (kendi sentezimiz) yükselen bölüm; {kesme} sn'de kükremeyle keskin kesilir, sonrası sessiz. -18 LUFS."}
    json.dump(dict(sorted(cat.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"muzik/b5_donusum_tam: kesme {kesme} sn, kazanç {-18.0 - cur:.2f} dB")


def cmd_kukreme(son=2.1, sonum=0.4):
    """Kükremeyi 'lülü?'den önce bitir: 2,1 sn'de sönümle kes (kaynak el_bocek_kukreme'den yeniden türetir)."""
    src = os.path.join(ROOT, "public", "ses", "efekt", "b5_bocek_kukreme.mp3")
    tmp = src + ".tmp.mp3"
    cut(src, tmp, 0.0, son, fin=0.003, fout=sonum)
    os.replace(tmp, src)
    cat_path = os.path.join(ROOT, "public", "ses", "katalog.json")
    cat = json.load(open(cat_path, encoding="utf-8"))
    cat["efekt/b5_bocek_kukreme"]["duration"] = round(dur(src), 2)
    cat["efekt/b5_bocek_kukreme"]["desc"] += f" {son} sn'de {sonum} sn sönümle kısaltıldı."
    json.dump(dict(sorted(cat.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("kükreme", round(dur(src), 2), "sn")


def cmd_olc():
    for lid, v in sorted(man_load().items()):
        out = subprocess.run(["ffmpeg", "-hide_banner", "-i", os.path.join(ROOT, "public", v["file"]), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
        i = re.findall(r"I:\s+(-?[\d.]+) LUFS", out)
        p = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", out)
        print(f"{lid:>6} {v['duration']:6.3f} sn  {i[-1] if i else '?':>6} LUFS  tepe {p[-1] if p else '?'} dBTP")


if __name__ == "__main__":
    c = sys.argv[1] if len(sys.argv) > 1 else ""
    if c == "bol":
        cmd_bol()
    elif c == "sahte":
        cmd_sahte(tuple(sys.argv[2:]) or ("b_01", "d_01"))
    elif c == "kirp":
        cmd_kirp(*sys.argv[2:5])
    elif c == "olc":
        cmd_olc()
    elif c == "efekt":
        cmd_efekt()
        cmd_kukreme()
    elif c == "muzik":
        cmd_muzik(float(sys.argv[2]) if len(sys.argv) > 2 else MUZIK_KESME)
    else:
        print(__doc__)
