"""7/24 B8 (yeni): pembe (anime) arka planın göründüğü her yerde âşık fonu (kullanıcı, 24 Kasım). Kaynak: muzik/b8y_ask_el (ElevenLabs Music, 15 sn).
Kesitler zamanlarını b8y_p1.py / b8y_p2.py'den alır. Çalıştır: python3 tools/b8y_muzik.py, sonra iki üreticiyi yeniden çalıştır.
"""
import json, os, subprocess, sys
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(D, "public", "ses")
sys.argv = [sys.argv[0]]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as A  # noqa: E402
import b8y_p2 as B  # noqa: E402
src = os.path.join(S, "muzik", "b8y_ask_el.mp3")
# (ad, kaynaktaki başlangıç, süre, giriş, çıkış)
KES = [("b8y_ask_a", 0.0, A.s3a - A.d0 - 0.35 + 0.3, 1.0, 1.0),
       ("b8y_ask_b", 12.0, A.SON_T - A.e5a, 0.5, 0.8),
       ("b8y_ask_c", 2.0, B.s2a - B.e1a + 0.2, 0.4, 0.5),
       ("b8y_ask_d", 5.0, B.c0 - B.e3a + 0.3, 0.4, 0.5),
       ("b8y_ask_e", 8.0, B.t_alarm - B.ka0, 0.6, 0.04)]
cat = json.load(open(os.path.join(S, "katalog.json"), encoding="utf-8"))
for ad, bas, uz, gir, cik in KES:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{bas}", "-i", src, "-af",
                    f"afade=t=in:d={gir},afade=t=out:st={max(0, uz - cik):.3f}:d={cik}", "-t", f"{uz:.3f}", "-b:a", "192k",
                    os.path.join(S, "muzik", ad + ".mp3")], check=True)
    cat[f"muzik/{ad}"] = {"file": f"ses/muzik/{ad}.mp3", "category": "muzik", "duration": round(uz, 3), "loop": False,
                          "desc": f"B8y: âşık fonu kesiti (b8y_ask_el {bas:.0f}. sn'den {uz:.2f} sn), pembe arka plan boyunca"}
    print(ad, round(uz, 2))
json.dump(cat, open(os.path.join(S, "katalog.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
