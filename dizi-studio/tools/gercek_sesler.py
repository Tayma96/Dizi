#!/usr/bin/env python3
"""Gerçek ses kayıtlarını (BigSoundBank, CC0 — https://bigsoundbank.com/licenses.html) indirip
kütüphaneye uygun hale getirir: ortam sesleri 60 sn kesintisiz döngü, efektler kırpılmış ve seviyelenmiş.
Sentetik sesleri aynı isimle değiştirir (motor ve bölüm JSON'ları değişmeden çalışır).
Kullanım: python3 tools/gercek_sesler.py
"""
import json
import os
import subprocess
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SES = os.path.join(ROOT, "public", "ses")
SRC = os.path.join(tempfile.gettempdir(), "bsb-kaynak")
URL = "https://bigsoundbank.com/UPLOAD/mp3/{}.mp3"

# isim: (kaynak no, başlangıç sn, açıklama, [ek katman (no, seviye dB, filtre)])
AMB = {
    "yagmur": ("2387", 20, "Yağmur, kapalı pencere arkası (BigSoundBank #2387 + #1289 alçak geçiren katman)", [("1289", -9, "lowpass=f=2500")]),
    "yagmur_saganak": ("0740", 10, "Sağanak + uzak gök gürültüsü (BigSoundBank #0740)", []),
    "ruzgar": ("1714", 5, "Rüzgâr, içeriden (BigSoundBank #1714)", []),
    "sehir": ("0080", 30, "Trafik uğultusu, kapalı pencereli daire (BigSoundBank #0080)", []),
    "sehir_gece": ("0680", 5, "Gece şehir (BigSoundBank #0680)", []),
    "sehir_kavsak": ("0608", 10, "Kavşak trafiği, dış mekân (BigSoundBank #0608)", []),
    "kafe_kalabalik": ("2561", 30, "Kafe kalabalığı (BigSoundBank #2561)", []),
    "kus_sesleri": ("0222", 10, "Kuş sesleri (BigSoundBank #0222)", []),
    "gece_cekirge": ("1470", 10, "Gece cırcır böceği (BigSoundBank #1470)", []),
    "oda_tonu": ("2458", 10, "Ev içi oda tonu (BigSoundBank #2458)", []),
    "saat_tiklama": ("1372", 2, "Duvar saati tik-tak (BigSoundBank #1372)", []),
}
# isim: (kaynak no, başlangıç, süre, açıklama)
SFX = {
    "gok_gurultusu": ("2718", 0, 12, "Gök gürültüsü (BigSoundBank #2718)"),
    "gok_gurultusu_yakin": ("3113", 0, 5, "Yakın gök gürültüsü (BigSoundBank #3113)"),
    "kapi_vurma": ("0095", 0, 4, "Kapı vurma (BigSoundBank #0095)"),
    "kapi_zili": ("0159", 0, 4, "Kapı zili (BigSoundBank #0159)"),
    "kapi_gicirti": ("0302", 0, 2, "Kapı gıcırtısı (BigSoundBank #0302)"),
    "kapi_acilma": ("1702", 0, 5, "Kapı açılma (BigSoundBank #1702)"),
    "kapi_kapanma": ("1704", 0, 4, "Kapı kapanma (BigSoundBank #1704)"),
    "kapi_carpma": ("0103", 0, 4, "Kapı çarpma (BigSoundBank #0103)"),
    "ayak_sesleri": ("0376", 0, 8, "Ayak sesleri, iç mekân (BigSoundBank #0376)"),
    "ayak_sesleri2": ("0165", 0, 8, "Ayak sesleri 2 (BigSoundBank #0165)"),
    "telefon_titresim": ("0022", 0, 5, "Telefon titreşimi (BigSoundBank #0022)"),
    "cam_kirilma": ("0771", 0, 5, "Cam kırılma (BigSoundBank #0771)"),
    "hastane_monitor": ("0457", 0, 9, "Hastane monitörü bip (BigSoundBank #0457)"),
}


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def fetch(n):
    os.makedirs(SRC, exist_ok=True)
    p = os.path.join(SRC, f"{n}.mp3")
    if not os.path.exists(p):
        urllib.request.urlretrieve(URL.format(n), p)
    return p


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).strip())


def main():
    cat_path = os.path.join(SES, "katalog.json")
    cat = json.load(open(cat_path, encoding="utf-8"))
    lic = ["kaynak,dosya,lisans,atif"]
    for name, (n, start, desc, layers) in AMB.items():
        src = fetch(n)
        length = 62
        tmp = os.path.join(SRC, f"{name}-raw.wav")
        if dur(src) < start + length:
            run("-stream_loop", "3", "-i", src, "-ss", str(start), "-t", str(length), "-ac", "2", "-ar", "44100", tmp)
        else:
            run("-ss", str(start), "-i", src, "-t", str(length), "-ac", "2", "-ar", "44100", tmp)
        if layers:
            ins = ["-i", tmp]
            fl = []
            for i, (ln, db, filt) in enumerate(layers):
                ins += ["-stream_loop", "3", "-i", fetch(ln)]
                fl.append(f"[{i + 1}]atrim=0:{length},{filt},volume={db}dB,aformat=channel_layouts=stereo:sample_rates=44100[l{i}]")
            mix = "[0]" + "".join(f"[l{i}]" for i in range(len(layers)))
            tmp2 = os.path.join(SRC, f"{name}-mix.wav")
            run(*ins, "-filter_complex", ";".join(fl) + f";{mix}amix=inputs={len(layers) + 1}:normalize=0", "-t", str(length), tmp2)
            tmp = tmp2
        # kesintisiz döngü: son 2 sn'yi başa çapraz geçişle karıştır
        out = os.path.join(SES, "ortam", f"{name}.mp3")
        run("-i", tmp, "-filter_complex",
            "[0]asplit=3[a][b][c];[a]atrim=2:4,asetpts=PTS-STARTPTS,afade=t=in:d=2[h];[b]atrim=60:62,asetpts=PTS-STARTPTS,afade=t=out:d=2[t];"
            "[c]atrim=4:60,asetpts=PTS-STARTPTS[rest];[h][t]amix=inputs=2:normalize=0[x];[x][rest]concat=n=2:v=0:a=1,loudnorm=I=-20:TP=-2",
            "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "3", out)
        cat[f"ortam/{name}"] = {"file": f"ses/ortam/{name}.mp3", "category": "ortam", "duration": 58.0, "loop": True, "desc": desc + " — gerçek kayıt, CC0"}
        lic.append(f"BigSoundBank #{n},ses/ortam/{name}.mp3,CC0 1.0,gerekmez")
        print("+ ortam", name)
    for name, (n, start, length, desc) in SFX.items():
        src = fetch(n)
        out = os.path.join(SES, "efekt", f"{name}.mp3")
        run("-ss", str(start), "-i", src, "-t", str(length), "-af",
            "silenceremove=start_periods=1:start_threshold=-50dB,afade=t=out:st=%s:d=0.3,loudnorm=I=-16:TP=-1.5" % max(0.1, length - 0.3),
            "-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "3", out)
        cat[f"efekt/{name}"] = {"file": f"ses/efekt/{name}.mp3", "category": "efekt", "duration": round(min(length, dur(out)), 2), "loop": False, "desc": desc + " — gerçek kayıt, CC0"}
        lic.append(f"BigSoundBank #{n},ses/efekt/{name}.mp3,CC0 1.0,gerekmez")
        print("+ efekt", name)
    json.dump(dict(sorted(cat.items())), open(cat_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    lic.append("kod-sentezi (tools/ses_kutuphanesi.py),diğer ses/* dosyaları,telifsiz (kendi üretimimiz),gerekmez")
    open(os.path.join(SES, "LISANSLAR.csv"), "w", encoding="utf-8").write("\n".join(lic) + "\n")


if __name__ == "__main__":
    main()
