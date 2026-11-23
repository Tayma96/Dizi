"""video -> 0,25 sn kareleri -> kontak sayfaları. kullanım: kontak.py video.mp4 cikis_dizini [t0 t1] [adim] [sutun] [w]"""
import subprocess, sys, os, glob
from PIL import Image, ImageDraw, ImageFont

vid, out = sys.argv[1], sys.argv[2]
t0 = float(sys.argv[3]) if len(sys.argv) > 3 else 0
t1 = float(sys.argv[4]) if len(sys.argv) > 4 else 999
step = float(sys.argv[5]) if len(sys.argv) > 5 else 0.25
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 8
W = int(sys.argv[7]) if len(sys.argv) > 7 else 216
os.makedirs(out, exist_ok=True)
for f in glob.glob(f"{out}/k_*.png"):
    os.remove(f)
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vid]).decode())
t1 = min(t1, dur - 0.001)
# kare kare doğru: 30 fps'te t -> kare round(t*30)
times = []
t = t0
while t <= t1 + 1e-6:
    times.append(round(t, 3))
    t += step
fr = ";".join([])
frames = []
tmp = f"{out}/_tmp"
os.makedirs(tmp, exist_ok=True)
# tüm kareleri bir kez çıkar
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(max(0, t0 - 0.02)), "-to", str(t1 + 0.1), "-i", vid, "-vsync", "0", f"{tmp}/%05d.png"], check=True)
allf = sorted(glob.glob(f"{tmp}/*.png"))
base = round(max(0, t0 - 0.02) * 30)
font = ImageFont.load_default()
H = None
per = cols * 4
pages = [times[i:i + per] for i in range(0, len(times), per)]
for pi, pg in enumerate(pages):
    ims = []
    for tt in pg:
        k = round(tt * 30) - base
        k = max(0, min(len(allf) - 1, k))
        im = Image.open(allf[k]).convert("RGB")
        h = int(im.height * W / im.width)
        im = im.resize((W, h))
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 58, 14], fill=(0, 0, 0))
        d.text((2, 1), f"{tt:.2f}", fill=(255, 255, 0), font=font)
        ims.append(im)
    h = ims[0].height
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * W + (cols - 1) * 3, rows * h + (rows - 1) * 3), (40, 40, 40))
    for i, im in enumerate(ims):
        sheet.paste(im, ((i % cols) * (W + 3), (i // cols) * (h + 3)))
    sheet.save(f"{out}/k_{pi:02d}_{pg[0]:.2f}.png")
for f in allf:
    os.remove(f)
print(len(pages), "sayfa")
