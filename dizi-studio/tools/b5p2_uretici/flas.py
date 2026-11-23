"""Işığa duyarlı epilepsi denetimi (yaklaşık, WCAG 2.3.1 / ITU-R BT.1702 mantığı):
kare başına ortalama parlaklık (Y, 0-255); >= %10 (25,5) değişim = geçiş; zıt iki geçiş = 1 flaş;
herhangi 1 sn'lik pencerede flaş sayısı <= 3 olmalı. Kullanım: flas.py video.mp4"""
import subprocess, sys, re
vid = sys.argv[1]
out = subprocess.run(["ffmpeg", "-v", "error", "-i", vid, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"], capture_output=True, text=True).stdout
Y = [float(m) for m in re.findall(r"YAVG=([\d.]+)", out)]
fps = 30
# geçişler: art arda karelerde aynı yönde biriken değişim >= 25.5
tr = []  # (kare, yön)
i = 0
while i < len(Y) - 1:
    j = i
    d = 0
    while j < len(Y) - 1 and j - i < 4:
        d = Y[j + 1] - Y[i]
        if abs(d) >= 25.5:
            break
        j += 1
    if abs(d) >= 25.5:
        tr.append((j + 1, 1 if d > 0 else -1))
        i = j + 1
    else:
        i += 1
# aynı yönde art arda gelen geçişler (balast kekemesi) tek geçiş sayılır
alt = []
for f, d in tr:
    if alt and alt[-1][1] == d:
        continue
    alt.append((f, d))
mx, at = 0, 0
for k in range(len(Y)):
    n = sum(1 for f, d in alt if k <= f < k + fps) // 2
    if n > mx:
        mx, at = n, k
print(f"kare: {len(Y)}  geçiş: {len(alt)}  1 sn'de en çok flaş (zıt geçiş çifti): {mx} (t={at / fps:.2f} sn)  sınır: 3")
print("geçişler (sn, yön):", [(round(f / fps, 2), d) for f, d in tr])
