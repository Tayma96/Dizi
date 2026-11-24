// Bir bölümden (GKK-B1) çok sayıda kareyi TEK paketle alır ve şerit (tile) yapar.
// Kullanım: node tools/kareler.mjs <episodeId> <part> <çıktı.png> <sn1> <sn2> ... [--olcek=0.3] [--sutun=8]
// Ya da B7Kare için: node tools/kareler.mjs --b7 <props.json listesi> ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const TAR = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const pos = args.filter((a) => !a.startsWith("--"));
const [ep, part, out, ...secs] = pos;
const olcek = Number(opt.olcek ?? 0.3);
const sutun = Number(opt.sutun ?? 8);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cache = path.join(root, "out/kare_bundle");
let serve;
if ("yeniden" in opt || !fs.existsSync(path.join(cache, "index.html"))) {
  serve = await bundle({ entryPoint: path.join(root, "src/index.ts"), outDir: cache, publicDir: path.join(root, "public") });
} else {
  serve = cache;
  execSync(`cp -ru ${path.join(root, "public")}/. ${path.join(cache, "public")}/`);
}
const browser = await openBrowser("chrome", { browserExecutable: TAR });
const inputProps = { episodeId: ep, part: Number(part) };
const comp = await selectComposition({ serveUrl: serve, id: "GKK-B1", inputProps, puppeteerInstance: browser, browserExecutable: TAR });
const tmp = fs.mkdtempSync(path.join(root, "out/kt_"));
const files = [];
for (const [i, s] of secs.entries()) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(Number(s) * comp.fps));
  const f = path.join(tmp, `${String(i).padStart(3, "0")}.png`);
  await renderStill({ composition: comp, serveUrl: serve, output: f, frame, inputProps, scale: olcek, puppeteerInstance: browser, browserExecutable: TAR });
  // saniye etiketi
  execSync(`ffmpeg -v error -y -i ${f} -vf "drawtext=text='${s}':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6" ${f}.l.png && mv ${f}.l.png ${f}`);
  files.push(f);
}
await browser.close({ silent: true });
const rows = Math.ceil(files.length / sutun);
execSync(`ffmpeg -v error -y -framerate 1 -i ${tmp}/%03d.png -vf "tile=${Math.min(sutun, files.length)}x${rows}:color=black" -frames:v 1 ${out}`);
fs.rmSync(tmp, { recursive: true });
console.log("tamam", out, comp.durationInFrames / comp.fps, "sn");
