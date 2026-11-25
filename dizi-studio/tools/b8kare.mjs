// B8Kare (Inserts18 "b8_market") kompozisyonundan doğrudan kare: her kare için ayrı prm JSON'u (t0 = istenen sahne zamanı).
// Kullanım: node tools/b8kare.mjs <prmler.json (dizi: [{etiket, prm}])> <çıktı.png> [--olcek=0.3] [--sutun=6] [--yeniden]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const [liste, out] = args.filter((a) => !a.startsWith("--"));
const olcek = Number(opt.olcek ?? 0.3);
const sutun = Number(opt.sutun ?? 6);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cache = path.join(root, "out/kare_bundle");
let serve;
if ("yeniden" in opt || !fs.existsSync(path.join(cache, "index.html"))) {
  serve = await bundle({ entryPoint: path.join(root, "src/index.ts"), outDir: cache, publicDir: path.join(root, "public") });
} else serve = cache;
const browser = await openBrowser("chrome", { browserExecutable: TAR });
const kareler = JSON.parse(fs.readFileSync(liste, "utf8"));
const tmp = fs.mkdtempSync(path.join(root, "out/kt_"));
let comp = null;
for (const [i, k] of kareler.entries()) {
  const inputProps = { text: [JSON.stringify(k.prm)] };
  if (!comp) comp = await selectComposition({ serveUrl: serve, id: "B8Kare", inputProps, puppeteerInstance: browser, browserExecutable: TAR });
  const f = path.join(tmp, `${String(i).padStart(3, "0")}.png`);
  await renderStill({ composition: { ...comp, props: inputProps }, serveUrl: serve, output: f, frame: 0, inputProps, scale: olcek, puppeteerInstance: browser, browserExecutable: TAR });
  execSync(`ffmpeg -v error -y -i ${f} -vf "drawtext=text='${String(k.etiket).replace(/[':]/g, " ")}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6" ${f}.l.png && mv ${f}.l.png ${f}`);
}
await browser.close({ silent: true });
const n = kareler.length, rows = Math.ceil(n / sutun);
execSync(`python3 -c "import glob,sys;from PIL import Image;f=sorted(glob.glob(\x27${tmp}/*.png\x27));im=[Image.open(x) for x in f];w,h=im[0].size;c=${sutun};r=(len(im)+c-1)//c;o=Image.new(\x27RGB\x27,(w*min(c,len(im)),h*r));[o.paste(x,((i%c)*w,(i//c)*h)) for i,x in enumerate(im)];o.save(\x27${out}\x27)"`);
fs.rmSync(tmp, { recursive: true });
console.log("tamam", out);
