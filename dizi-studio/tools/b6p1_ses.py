"""7/24 B6 Parça 1 tam ses miksi -> public/ses/efekt/b6p1_tam.mp3 (bölüm JSON'unda sahne a'nın müziği).
Zamanlar bölüm saniyesi. Sahne b'nin sahne zamanı τ: bölüm = 26,4 + τ (tools/b6p1.py ile aynı).
Kullanım: python3 tools/b6p1_ses.py
"""
import os, subprocess

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S = os.path.join(K, "public/ses")
V = os.path.join(K, "public/voice/724-06/cekim")
B = 26.4  # sahne b'nin τ=0 anı
SURE = 42.9

# (dosya, bölüm-zamanı, kazanç dB, [kırp_bas, kırp_son], fade_in, fade_out, hız)
P = [
    (f"{S}/efekt/b5p2_tam.mp3", 0.0, 0, (52.8, 54.0), 0.05, 0.4, 1),   # B5 fısıltı kuyruğu
    (f"{S}/efekt/el_nefes_tutma.mp3", 0.5, 2, None, 0, 0.3, 1),       # boğuk nefes
    (f"{S}/efekt/kilit.mp3", 2.2, 4, None, 0, 0, 1),                  # KLAK
    (f"{S}/efekt/el_kepenk_acilma.mp3", 2.0, 2, None, 0, 0.6, 1),     # kepenk kalkar
    (f"{S}/efekt/el_kepenk_acilma.mp3", 9.5, -3, (0.8, 5.0), 0.5, 1.0, 0.85),
    (f"{S}/efekt/el_toza_donusme.mp3", 4.6, 0, None, 0.2, 0.8, 1),
    (f"{S}/efekt/el_toza_donusme.mp3", 9.2, 2, None, 0.2, 0.8, 1),
    (f"{S}/efekt/el_toza_donusme.mp3", 13.0, 0, None, 0.2, 0.8, 0.9),
    (f"{S}/efekt/el_toza_donusme.mp3", 14.2, 4, (1.2, 3.6), 0.1, 0.6, 1),  # yanaktaki son böcek ~15,5
    (f"{S}/ortam/kus_sesleri.mp3", 6.5, -15, (0, 20), 2.5, 2.0, 1),
    (f"{S}/ortam/sehir.mp3", 6.5, -18, (0, 20), 2.5, 2.0, 1),
    (f"{S}/efekt/el_kumas_dus.mp3", 19.0, -6, None, 0, 0.2, 1),         # yere çöküş
    (f"{V}/C5_01.mp3", 19.0, 0, (0, 12.3), 0.05, 0.3, 1),               # yerde ağlama
    (f"{S}/muzik/b6_safak.mp3", 19.6, -9, (0, 23.3), 1.5, 0.0, 1),      # müzik: ilk hıçkırık → ding-dong öncesi (kısılma aşağıda)
    # --- sahne b (sabah) ---
    (f"{S}/ortam/kus_sesleri.mp3", B - 1.4, -21, (20, 37), 0.3, 1.0, 1),
    (f"{S}/ortam/sehir.mp3", B - 1.4, -24, (20, 37), 0.3, 1.0, 1),
    (f"{S}/efekt/el_buzdolabi.mp3", B - 1.4, -26, None, 0.5, 0.5, 1),
    (f"{S}/efekt/el_buzdolabi.mp3", B + 4.5, -26, None, 0.5, 0.5, 1),
    (f"{S}/efekt/el_buzdolabi.mp3", B + 10.4, -26, None, 0.5, 1.0, 1),
    (f"{S}/efekt/el_dingdong.mp3", B + 0.0, -6, None, 0, 0, 1),
    (f"{S}/efekt/el_otomatik_kapi.mp3", B + 0.0, -12, (0, 2.0), 0, 0.5, 1),
    (f"{S}/efekt/ayak_sesleri.mp3", B + 0.3, -13, (0, 3.0), 0.1, 0.4, 1),
    (f"{V}/S17_01.mp3", B + 3.3, 0, None, 0, 0, 1),                      # "bitti artık"
    (f"{V}/E2_01.mp3", B + 3.95, -1, None, 0, 0.1, 1),                  # "aaaaa" (iki soluk)
    (f"{S}/efekt/ayak_sesleri.mp3", B + 6.5, -15, (0, 0.8), 0.05, 0.3, 1),
    (f"{V}/C1_01.mp3", B + 6.7, -7, (0, 3.0), 0.05, 0.6, 1),            # çığlık sonrası panik nefesi/feryat
    (f"{V}/C3_01.mp3", B + 8.4, -9, None, 0.1, 0.5, 1),                  # boğuk ağlama (kaskatı)
    (f"{S}/efekt/el_kumas_burus.mp3", B + 7.6, -8, None, 0, 0.2, 1),     # sarılma
    (f"{V}/H3_01.mp3", B + 7.7, 0, None, 0, 0, 1),                       # "Şhh bitti kızım bitti tamam"
    (f"{S}/efekt/darbe.mp3", B + 9.55, -9, (0, 0.5), 0, 0.2, 1),         # göğse yumruk (boğuk)
    (f"{K}/public/voice/724-06/cekim2/G1_01.mp3", B + 9.58, -3, (0, 0.45), 0, 0.08, 1),  # Sabri inler
    (f"{S}/efekt/el_kumas_burus.mp3", B + 9.55, -8, None, 0, 0.2, 1),
    (f"{V}/C6_01.mp3", B + 10.6, -2, None, 0.1, 0.0, 1),                 # sarılırken hıçkırık
    (f"{S}/muzik/b6_safak.mp3", B + 7.7, -11, (19.0, 45.0), 1.2, 0.0, 1),  # müzik "Şhh" ile geri gelir
]
# müzik ilk kısmı: ding-dong'da (B) kısılır, çığlıkta (B+4.9) susar
MUZIK1_KIS = f"volume='if(lt(t,{B - 19.6:.2f}),1,if(lt(t,{B + 3.3 - 19.6:.2f}),0.22,0))':eval=frame"


def main():
    ins, flt = [], []
    for i, (f, t, g, kirp, fi, fo, hiz) in enumerate(P):
        ins += ["-i", f]
        c = []
        if kirp:
            c.append(f"atrim={kirp[0]}:{kirp[1]},asetpts=PTS-STARTPTS")
        if hiz != 1:
            c.append(f"asetrate=44100*{hiz},aresample=44100")
        c.append("aformat=sample_rates=44100:channel_layouts=stereo")
        if fi:
            c.append(f"afade=t=in:d={fi}")
        if fo:
            d = (kirp[1] - kirp[0]) if kirp else float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode()) / hiz
            c.append(f"afade=t=out:st={max(0, d - fo):.3f}:d={fo}")
        if i == 13:
            c.append(MUZIK1_KIS)
        c.append(f"volume={g}dB")
        c.append(f"adelay={int(t * 1000)}|{int(t * 1000)}")
        flt.append(f"[{i}:a]{','.join(c)}[a{i}]")
    n = len(P)
    flt.append("".join(f"[a{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0:dropout_transition=0,atrim=0:{SURE},afade=t=out:st={SURE - 1.2}:d=1.2[m]")
    ara = os.path.join(K, "out/b6p1_ham.wav")
    subprocess.run(["ffmpeg", "-y", "-v", "error", *ins, "-filter_complex", ";".join(flt), "-map", "[m]", ara], check=True)
    # tamamlanmış bölüm de -14 LUFS'a ayrıca çekilir; burada kaba seviye
    o = subprocess.run(["ffmpeg", "-i", ara, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    I = float([l for l in o.splitlines() if l.strip().startswith("I:")][-1].split()[1])
    cik = os.path.join(S, "efekt/b6p1_tam.mp3")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", ara, "-af", f"volume={-14.6 - I:.2f}dB,alimiter=limit=0.89:level=false:attack=1:release=50",
                    "-b:a", "256k", cik], check=True)
    print(cik, f"ham I={I:.1f}")


if __name__ == "__main__":
    main()
