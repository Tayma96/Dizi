/* 7/24 Bölüm 3 eklemeleri (titiz yeniden yapım):
 *  telefon_mesaj · Ece'nin elinde telefon: annenin mesajı, yazma, "Gönderilemedi", "Servis yok"
 *  yer_pov       · Ece yerde (gözünden): elleriyle geri geri sürünür, kapıda dev adam
 *  tezgah_el     · Ece'nin tarafından tezgâh: el bilekten kopar / sandviçle döner, barkod, birleşme, ödeme
 *  el_raf        · reyon (yer seviyesi): el parmaklarıyla yürür, rafa tırmanır, paketli sandviçi alır, döner
 *  Ortak: Kopuk el (sırt görünüşü, parmak uçlarında yürür), paketli üçgen sandviç. */
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const O = "#141012";
const SANS = "Inter, Arial, sans-serif";
const ECE_TEN = "#f0c8a8", ECE_TEN2 = "#dcac88", KAZAK = "#c8902a", KAZAK2 = "#a8741a";
const EL = "#a8ac98", EL2 = "#90967e", EL3 = "#6e7462", TIRNAK = "#d4ccb0", ET = "#5a1a1e", LIF = "#7a1e24";
const ease = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export type Insert9Kind = "telefon_mesaj" | "yer_pov" | "tezgah_el" | "el_raf";
export const INSERT9_KINDS: Insert9Kind[] = ["telefon_mesaj", "yer_pov", "tezgah_el", "el_raf"];

/* ---------------------------------------------------------------- ortak çizimler */

/** Kopuk el, sırttan/yandan (örümcek gibi parmak uçlarında). yon: 1 sağa, -1 sola. adim: yürüyüş fazı. kavra 0..1: parmaklar bir şeyi kavrar.
 *  kopuk: bilekte et + sarkan lifler. Koordinat: avuç merkezi (0,0), zemin y=+80 (s=1). */
const KopukEl: React.FC<{ x: number; y: number; s: number; yon?: number; adim?: number; kavra?: number; kopuk?: boolean; rot?: number; f: number }> = ({ x, y, s, yon = 1, adim = 0, kavra = 0, kopuk = true, rot = 0, f }) => {
  // parmak: 3 boğum (uzun-orta-uç), uçlara doğru incelir; boğumlarda kırışık, uçta tırnak
  const parmak = (i: number) => {
    const d = i - 1.5;
    const lift = Math.max(0, Math.sin(adim * Math.PI * 2 + (i % 2 ? Math.PI : 0))) * 24;
    const L = i === 0 ? 0.82 : i === 3 ? 0.78 : i === 1 ? 1.06 : 1; // işaret, orta, yüzük, serçe
    const bx = 50 - Math.abs(d) * 5, by = -30 + d * 16;
    const j1x = bx + 30 * L - kavra * 8, j1y = by - 46 * L + kavra * 18 - lift * 0.5;
    const j2x = j1x + 26 * L - kavra * 20, j2y = j1y + 40 * L - lift * 0.3 + kavra * 10;
    const tx = j2x + 14 * L - kavra * 26, ty = 78 + d * 6 - lift - kavra * 46;
    const w = (i === 3 ? 0.78 : i === 0 ? 0.92 : 1) * 1.0;
    const seg = (x1: number, y1: number, x2: number, y2: number, w1: number, key: string) => (
      <g key={key}>
        <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={O} strokeWidth={w1 + 7} strokeLinecap="round" />
        <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={i % 2 ? EL2 : EL} strokeWidth={w1} strokeLinecap="round" />
      </g>
    );
    return (
      <g key={i}>
        {seg(bx, by, j1x, j1y, 25 * w, "a")}
        {seg(j1x, j1y, j2x, j2y, 21 * w, "b")}
        {seg(j2x, j2y, tx, ty, 17 * w, "c")}
        <path d={`M ${j1x - 8} ${j1y - 3} q 8 -7 16 0 M ${j1x - 6} ${j1y + 3} q 6 -4 12 0`} stroke={EL3} strokeWidth={2} fill="none" />
        <path d={`M ${j2x - 5} ${j2y - 4} q 6 -4 11 1`} stroke={EL3} strokeWidth={1.8} fill="none" />
        <path d={`M ${tx - 2} ${ty - 14} q 7 2 8 12 q -6 3 -11 0 Z`} fill={TIRNAK} stroke={O} strokeWidth={1.8} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * yon} ${s})`}>
      <ellipse cx={14} cy={86} rx={92} ry={15} fill="#000" opacity={0.3} />
      {[3, 2].map(parmak)}
      {kopuk ? (
        <g>
          {/* bilek: ıslak, koyu simbiyot lifleri sarkar ve kıvranır */}
          {new Array(11).fill(0).map((_, i) => {
            const yy = -36 + i * 7, sw = Math.sin(f / 4 + i * 1.3);
            return <path key={i} d={`M -60 ${yy} q ${-22 - (i % 3) * 10} ${8 + sw * 9} ${-38 - (i % 2) * 16} ${20 + i * 2 + sw * 6} q -8 6 -6 14`} stroke={i % 3 === 0 ? "#2a0a10" : i % 2 ? LIF : "#a83a40"} strokeWidth={i % 3 === 0 ? 6 : 4} fill="none" strokeLinecap="round" />;
          })}
          <ellipse cx={-62} cy={-6} rx={19} ry={36} fill={ET} stroke={O} strokeWidth={3} />
          <ellipse cx={-62} cy={-10} rx={7} ry={11} fill="#e2d6c0" stroke="#8a7a60" strokeWidth={1.5} />
          <ellipse cx={-58} cy={8} rx={5} ry={7} fill="#e2d6c0" opacity={0.8} />
          <path d="M -66 -30 q 4 18 -2 40" stroke="#ff8a8a" strokeWidth={2} opacity={0.5} fill="none" />
        </g>
      ) : null}
      {/* el sırtı: biçim, tendonlar, damarlar, boğum çıkıntıları */}
      <path d="M -62 -42 Q -26 -60 34 -52 Q 64 -40 64 -2 Q 60 28 26 36 Q -28 40 -62 28 Z" fill={EL} stroke={O} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M -50 -36 Q -10 -50 38 -40" stroke={EL2} strokeWidth={4} fill="none" opacity={0.7} />
      {[-30, -14, 2, 18].map((k, i) => <path key={k} d={`M -46 ${k * 0.55 - 6} Q 0 ${k * 0.8 - 8} ${44} ${k - 10 + i * 2}`} stroke={EL3} strokeWidth={3} fill="none" opacity={0.55} />)}
      <path d="M -40 -12 q 14 -10 26 2 q 10 10 24 -2 M -30 10 q 16 -6 30 4" stroke="#5a6a7a" strokeWidth={2.5} fill="none" opacity={0.55} />
      {[-30, -12, 6, 22].map((k) => <ellipse key={k} cx={50} cy={k} rx={9} ry={7} fill={EL2} stroke={EL3} strokeWidth={1.5} />)}
      {new Array(8).fill(0).map((_, i) => <path key={i} d={`M ${-30 + i * 9} ${-44 + (i % 3) * 4} l 2 -5`} stroke={EL3} strokeWidth={1.5} opacity={0.6} />)}
      {/* başparmak (2 boğum) */}
      <path d={`M -8 26 L ${18 - kavra * 6} ${52 - kavra * 14} L ${42 - kavra * 26} ${74 - kavra * 40}`} stroke={O} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M -8 26 L ${18 - kavra * 6} ${52 - kavra * 14} L ${42 - kavra * 26} ${74 - kavra * 40}`} stroke={EL} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M ${36 - kavra * 26} ${62 - kavra * 40} q 8 3 9 13 q -6 3 -12 0 Z`} fill={TIRNAK} stroke={O} strokeWidth={1.8} />
      {[1, 0].map(parmak)}
    </g>
  );
};

/** Paketli üçgen sandviç (yandan, kesik yüzü görünür): şeffaf ambalaj, ekmek, marul, ton balığı, domates, etiket ve barkod. */
const Sandvic: React.FC<{ x: number; y: number; s: number; rot?: number; barkodYuz?: boolean }> = ({ x, y, s, rot = 0, barkodYuz }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {/* ambalaj (dik üçgen kutu) */}
    <path d="M -90 50 L 90 50 L -90 -110 Z" fill="#eef4f8" opacity={0.55} stroke="#8a98a4" strokeWidth={4} strokeLinejoin="round" />
    {/* ekmek dilimleri ve iç */}
    <path d="M -84 44 L 76 44 L -84 -98 Z" fill="#e8c88a" stroke="#a8803a" strokeWidth={3} />
    <path d="M -74 34 L 52 34 L -74 -76 Z" fill="#f4e4c0" />
    <path d="M -74 2 Q -50 -8 -30 4 Q -10 14 10 4 L 20 14 Q 0 22 -20 14 Q -46 4 -74 14 Z" fill="#6aa84a" />
    <path d="M -74 14 L 22 14 L 36 24 L -74 24 Z" fill="#d8c8a0" />
    {new Array(8).fill(0).map((_, i) => <circle key={i} cx={-64 + i * 11} cy={19} r={3} fill="#b8a478" />)}
    <path d="M -74 -10 L -6 -10 L -14 -2 L -74 -2 Z" fill="#d84a3a" />
    {/* parlama */}
    <path d="M -80 30 L -80 -70" stroke="#ffffff" strokeWidth={6} opacity={0.35} strokeLinecap="round" />
    {/* etiket */}
    <g transform={barkodYuz ? "translate(-30 -10) scale(1.25)" : ""}>
      <rect x={-86} y={-50} width={78} height={44} rx={4} fill="#ffffff" stroke="#6a6a6a" strokeWidth={2} />
      <text x={-47} y={-37} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={9.5} fill="#c8402a">TON BALIKLI</text>
      {new Array(18).fill(0).map((_, i) => <rect key={i} x={-80 + i * 3.6} y={-31} width={i % 3 === 0 ? 2.2 : 1.2} height={17} fill="#111" />)}
      <text x={-47} y={-9} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={6} fill="#333">869 0123 456789</text>
    </g>
  </g>
);

/* ---------------------------------------------------------------- telefon_mesaj */

/** Ece'nin elinde telefon (gözünden): kilit ekranında annenin bildirimi → sohbet açılır → yazar → gönderir →
 *  "Gönderilemedi" (kırmızı !) + üstte "Mesaj gönderilemedi · Servis yok" → tekrar dener → yine olmaz. text[0]: başlangıç sn. */
const TelefonMesaj: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps + Number(text?.[0] ?? 0);
  const titre = Math.sin(f * 1.9) * 3 + Math.sin(f * 3.3) * 2;
  const px = 170, py = 230, pw = 740, ph = 1460;
  const acik = t > 1.1;
  const yazi = "Anne marketteyim çok korkuyorum";
  const n = Math.max(0, Math.min(yazi.length, Math.floor((t - 1.6) * 11)));
  const gonder = t > 4.6;
  const bekle1 = t > 4.6 && t < 5.4;
  const hata = t > 5.4;
  const tekrar = t > 6.6 && t < 7.3;
  const toast = interpolate(t, [5.4, 5.7, 8.6, 9.0], [0, 1, 1, 0], clamp);
  const keyX = n < yazi.length ? 120 + ((n * 137) % 500) : 640, keyY = 1010 + ((n * 53) % 3) * 90;
  const bas = t > 1.6 && t < 4.5 ? (Math.floor(t * 11) % 2 ? 1 : 0) : t > 4.4 && t < 4.7 ? 1 : (t > 6.6 && t < 6.9 ? 1 : 0);
  const thumbX = t < 1.1 ? 380 : t < 4.4 ? keyX : t < 6.4 ? 660 : 560;
  const thumbY = t < 1.1 ? 760 : t < 4.4 ? keyY : t < 6.4 ? 900 : 560;
  const spin = (f * 18) % 360;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0c0d10", overflow: "hidden" }}>
      {/* karanlık market (bulanık), ekran ışığı */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(14px)" }}>
        <rect width={1080} height={1920} fill="#121418" />
        {[0, 1, 2, 3].map((r) => new Array(8).fill(0).map((_, i) => <rect key={`${r}${i}`} x={i * 140} y={160 + r * 280} width={110} height={180} fill={["#5a2a2a", "#2a3a5a", "#5a4a2a", "#2a4a3a"][(i + r) % 4]} opacity={0.35} />))}
        <rect x={0} y={1550} width={1080} height={370} fill="#3a1a14" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(160,190,255,0.16) 0%, rgba(0,0,0,0) 70%)" }} />
      <AbsoluteFill style={{ transform: `translate(${titre}px, ${titre * 0.7}px)` }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <rect x={px - 22} y={py - 22} width={pw + 44} height={ph + 44} rx={86} fill="#1c1e22" stroke={O} strokeWidth={8} />
        </svg>
        <div style={{ position: "absolute", left: px, top: py, width: pw, height: ph, borderRadius: 70, overflow: "hidden", background: acik ? "#ece5dd" : "linear-gradient(180deg,#1a2a4a,#0a1020)", fontFamily: SANS }}>
          {/* durum çubuğu: saat, SERVİS YOK, boş çubuklar */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 90, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 54px", color: acik ? "#111" : "#fff", fontWeight: 800, fontSize: 34, background: acik ? "#f6f6f6" : "transparent" }}>
            <span>01:07</span>
            <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26, color: "#d8402a", fontWeight: 900 }}>Servis yok</span>
              <span style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>{[14, 20, 26, 32].map((h, i) => <span key={i} style={{ width: 8, height: h, border: `2px solid ${acik ? "#999" : "#888"}`, borderRadius: 2, opacity: hata && f % 20 < 10 ? 0.3 : 1 }} />)}</span>
              <span style={{ width: 48, height: 24, border: `3px solid ${acik ? "#111" : "#fff"}`, borderRadius: 6, display: "inline-flex", padding: 2 }}><span style={{ width: "28%", background: "#d8402a", borderRadius: 2 }} /></span>
            </span>
          </div>
          {!acik ? (
            <div>
              <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", color: "#fff", fontSize: 150, fontWeight: 300 }}>01:07</div>
              <div style={{ position: "absolute", left: 30, right: 30, top: 520, borderRadius: 36, background: "rgba(245,245,247,0.95)", padding: "26px 30px", display: "flex", gap: 22, alignItems: "center", transform: `scale(${interpolate(t, [0.1, 0.4], [0.9, 1], clamp)})`, opacity: interpolate(t, [0.05, 0.3], [0, 1], clamp) }}>
                <div style={{ width: 90, height: 90, borderRadius: 22, background: "#25d366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 46 }}>A</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 36 }}><span>Annem ❤</span><span style={{ fontWeight: 600, fontSize: 26, color: "#888" }}>şimdi</span></div>
                  <div style={{ fontWeight: 600, fontSize: 32, color: "#333", marginTop: 4 }}>Kızım uyuyamadım, iyi misin? İlk gecen nasıl geçti?</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* sohbet başlığı */}
              <div style={{ position: "absolute", top: 90, left: 0, right: 0, height: 120, background: "#075e54", color: "#fff", display: "flex", alignItems: "center", padding: "0 34px", gap: 22 }}>
                <div style={{ width: 76, height: 76, borderRadius: 38, background: "#cfd8dc", color: "#555", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 36 }}>A</div>
                <div><div style={{ fontWeight: 900, fontSize: 38 }}>Annem ❤</div><div style={{ fontSize: 24, opacity: 0.85 }}>bağlanıyor…</div></div>
              </div>
              {/* gelen mesaj */}
              <div style={{ position: "absolute", top: 260, left: 34, maxWidth: 560, background: "#fff", borderRadius: 26, padding: "20px 26px", fontSize: 34, color: "#111", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }}>Kızım uyuyamadım, iyi misin? İlk gecen nasıl geçti?<div style={{ textAlign: "right", fontSize: 22, color: "#999", marginTop: 6 }}>01:06</div></div>
              {/* giden mesaj */}
              {gonder ? (
                <div style={{ position: "absolute", top: 480, right: 34, maxWidth: 560, background: "#dcf8c6", borderRadius: 26, padding: "20px 26px", fontSize: 34, color: "#111" }}>
                  {yazi}
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 6, fontSize: 22, color: "#999" }}>
                    01:07 {bekle1 || tekrar ? <span style={{ display: "inline-block", width: 22, height: 22, border: "3px solid #999", borderTopColor: "transparent", borderRadius: 11, transform: `rotate(${spin}deg)` }} /> : <span>🕓</span>}
                  </div>
                </div>
              ) : null}
              {hata && !tekrar ? (
                <div style={{ position: "absolute", top: 640, right: 34, display: "flex", alignItems: "center", gap: 12, color: "#d8402a", fontWeight: 900, fontSize: 30 }}>
                  <span style={{ width: 44, height: 44, borderRadius: 22, background: "#d8402a", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>!</span>
                  Gönderilemedi · Tekrar denemek için dokun
                </div>
              ) : null}
              {/* yazma kutusu + klavye */}
              {!gonder ? (
                <div>
                  <div style={{ position: "absolute", bottom: 560, left: 24, right: 120, height: 92, background: "#fff", borderRadius: 46, display: "flex", alignItems: "center", padding: "0 30px", fontSize: 34, color: "#111" }}>
                    {yazi.slice(0, n)}<span style={{ width: 3, height: 40, background: "#25d366", marginLeft: 2, opacity: f % 16 < 8 ? 1 : 0 }} />
                  </div>
                  <div style={{ position: "absolute", bottom: 560, right: 24, width: 92, height: 92, borderRadius: 46, background: "#25d366", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>➤</div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 540, background: "#d1d4da", padding: 18, boxSizing: "border-box" }}>
                    {["qwertyuıopğü", "asdfghjklşi", "zxcvbnmöç"].map((row, r) => (
                      <div key={r} style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 14 }}>
                        {row.split("").map((c, i) => <div key={i} style={{ width: 50, height: 96, borderRadius: 10, background: "#fff", boxShadow: "0 2px 0 #9a9ea4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#111" }}>{c}</div>)}
                      </div>
                    ))}
                    <div style={{ margin: "0 auto", width: 520, height: 90, borderRadius: 10, background: "#fff", boxShadow: "0 2px 0 #9a9ea4" }} />
                  </div>
                </div>
              ) : null}
              {/* üst uyarı */}
              {toast > 0 ? (
                <div style={{ position: "absolute", left: 30, right: 30, top: 100 + (toast - 1) * 180, borderRadius: 30, background: "#2a2a2e", color: "#fff", padding: "24px 28px", display: "flex", alignItems: "center", gap: 18, fontSize: 32, fontWeight: 800 }}>
                  <span style={{ width: 50, height: 50, borderRadius: 25, background: "#d8402a", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>!</span>
                  <span>Mesaj gönderilemedi<br /><span style={{ fontSize: 26, fontWeight: 600, opacity: 0.8 }}>Servis yok. Şebeke bulunamadı.</span></span>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {/* eller: sol el telefonu tutar, sağ başparmak dokunur */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d={`M -60 2100 Q 60 1760 ${px + 10} ${py + ph - 240}`} stroke={O} strokeWidth={230} strokeLinecap="round" fill="none" />
          <path d={`M -60 2100 Q 60 1760 ${px + 10} ${py + ph - 240}`} stroke={ECE_TEN} strokeWidth={216} strokeLinecap="round" fill="none" />
          <path d="M -120 2100 L -20 1860" stroke={KAZAK} strokeWidth={260} strokeLinecap="round" />
          {[0, 1, 2].map((i) => <path key={i} d={`M ${px - 30} ${py + ph - 420 - i * 120} q 40 -10 70 10`} stroke={O} strokeWidth={56} strokeLinecap="round" fill="none" />)}
          {[0, 1, 2].map((i) => <path key={`k${i}`} d={`M ${px - 30} ${py + ph - 420 - i * 120} q 40 -10 70 10`} stroke={ECE_TEN} strokeWidth={44} strokeLinecap="round" fill="none" />)}
          {/* sağ el: kısa, dolgun başparmak ekrana dokunur; avuç ve diğer parmaklar telefonun sağ altında */}
          <g transform={`translate(${px + thumbX} ${py + thumbY + bas * 6})`}>
            <path d="M 260 330 Q 420 380 560 520 L 760 820 L 260 900 Q 120 640 170 420 Z" fill={ECE_TEN} stroke={O} strokeWidth={6} strokeLinejoin="round" />
            <path d="M 520 620 L 900 760 L 900 1300 L 420 1150 Z" fill={KAZAK} stroke={O} strokeWidth={6} />
            <path d="M 470 640 L 860 780" stroke={KAZAK2} strokeWidth={9} />
            <path d="M 4 10 Q 50 150 190 330" stroke={O} strokeWidth={128} strokeLinecap="round" fill="none" />
            <path d="M 4 10 Q 50 150 190 330" stroke={ECE_TEN} strokeWidth={116} strokeLinecap="round" fill="none" />
            <path d="M 70 150 q 26 18 52 12" stroke={ECE_TEN2} strokeWidth={5} fill="none" />
            <path d="M -22 -6 Q 4 -36 34 -14 Q 40 18 14 30 Q -14 26 -22 -6 Z" fill="#f8e0d0" stroke={ECE_TEN2} strokeWidth={3} />
            <path d="M 230 520 q 40 10 70 40" stroke={ECE_TEN2} strokeWidth={5} fill="none" />
          </g>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- yer_pov */

/** Ece yerde, gözünden: kapının aydınlık dikdörtgeninde dev adam (alttan), Ece'nin elleri yere basıp geri iter.
 *  Kamera geri gider (adam küçülür), adam bir adım içeri atar. */
const YerPov: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const geri = interpolate(f, [0, dur], [0, 1], { ...clamp, easing: (x) => x * (2 - x) });
  const sc = lerp(1.18, 0.92, geri);
  const adimAt = interpolate(t, [1.4, 2.2], [0, 1], { ...clamp, easing: ease });
  const iter = Math.sin(t * 7);
  const S = 3600;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0b0d", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "50% 62%" }}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {/* tavan (alttan bakış), floresan */}
          <rect width={1080} height={1920} fill="#2a2c30" />
          <path d="M 0 0 L 1080 0 L 860 420 L 220 420 Z" fill="#3a3e44" />
          <rect x={360} y={120} width={360} height={36} rx={8} fill="#e8f0f4" opacity={0.75} />
          {/* kapı: dışarısı sabah alacası, kepenk yukarıda */}
          <rect x={150} y={420} width={780} height={1260} fill="#9ab0c4" />
          <rect x={150} y={420} width={780} height={70} fill="#5a6066" />
          {new Array(5).fill(0).map((_, i) => <path key={i} d={`M 150 ${430 + i * 12} H 930`} stroke="#3a3e42" strokeWidth={3} />)}
          <rect x={130} y={420} width={24} height={1260} fill="#1a1c1e" /><rect x={926} y={420} width={24} height={1260} fill="#1a1c1e" />
          {/* zemin (perspektif) */}
          <path d="M -200 1920 L 150 1680 L 930 1680 L 1280 1920 Z" fill="#8a8e92" />
          {new Array(7).fill(0).map((_, i) => <path key={i} d={`M ${150 + i * 130} 1680 L ${-200 + i * 247} 1920`} stroke="#6a6e72" strokeWidth={3} />)}
        </svg>
        {/* dev adam: alttan, kapıyı dolduruyor (siluet + yüz) */}
        <div style={{ position: "absolute", left: 540 - 0.2 * S, top: 1700 - 0.98 * S + adimAt * 60, filter: "brightness(0.55) contrast(1.15)" }}>
          <Character look={castById("iri724")} size={S} pose={{ emotion: "ofkeli", lookX: 0, lookY: 0.6, yaw: 0, seed: 4 }} />
        </div>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(255,240,220,0.0) 40%, rgba(0,0,0,0.0) 60%)" }} />
      </AbsoluteFill>
      {/* Ece'nin elleri (alt kenar), yere basıp geri iter */}
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {[-1, 1].map((d) => {
          const x = 540 + d * 300 + d * iter * 10, y = 1760 - Math.max(0, iter * d) * 30;
          return (
            <g key={d}>
              <path d={`M ${x + d * 120} 2100 L ${x} ${y}`} stroke={O} strokeWidth={150} strokeLinecap="round" />
              <path d={`M ${x + d * 120} 2100 L ${x} ${y}`} stroke={ECE_TEN} strokeWidth={138} strokeLinecap="round" />
              <path d={`M ${x + d * 180} 2140 L ${x + d * 80} 1930`} stroke={KAZAK} strokeWidth={190} strokeLinecap="round" />
              {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${x - d * 20 + k * 22 * -d} ${y - 30} l ${-d * 20} ${-50}`} stroke={O} strokeWidth={34} strokeLinecap="round" />)}
              {[0, 1, 2, 3].map((k) => <path key={`i${k}`} d={`M ${x - d * 20 + k * 22 * -d} ${y - 30} l ${-d * 20} ${-50}`} stroke={ECE_TEN} strokeWidth={24} strokeLinecap="round" />)}
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- tezgah_el */

/** Ece'nin tarafından tezgâh. text[0]: "ayril" | "kasa", text[1]: başlangıç sn.
 *  ayril: adamın kolu tezgâhta, parmaklar tıkırdar → lifler gerilir, el kopar, tezgâha düşer → doğrulur, döner → karşı kenardan aşağı iner.
 *  kasa : el karşı kenardan sandviçle tırmanır → ortaya bırakır → geri çekilir → Ece'nin elleri sandviçi alır, barkod (bip),
 *         ekranda TON BALIKLI SANDVİÇ 15,00 ₺ → sandviçi bırakır → el zıplayıp bileğe takılır, lifler örülür → adam 20 TL bırakır, sandviçi alır. */
const TezgahEl: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mod = text?.[0] ?? "ayril";
  const t = f / fps + Number(text?.[1] ?? 0);
  const bilek = { x: 760, y: 1070 };
  const per = (y: number) => 0.85 + ((y - 980) / 620) * 0.75; // derinlik ölçeği
  // ---- el konumu
  let hx = bilek.x - 40, hy = bilek.y + 40, yon = -1, kavra = 0, adim = 0, kopuk = false, rot = 0, sandEl = false;
  let sx = 520, sy = 1330, sandGorun = false, sandRot = 0, eceEl = 0, birles = 0, para = 0, adamAl = 0, bip = false, ekran = 0, lifGer = 0;
  if (mod === "ayril") {
    const ger = interpolate(t, [0.9, 1.8], [0, 1], { ...clamp, easing: ease });
    const dus = interpolate(t, [1.8, 2.2], [0, 1], { ...clamp, easing: (x) => x * x });
    const dogrul = interpolate(t, [2.3, 2.9], [0, 1], { ...clamp, easing: ease });
    const git = interpolate(t, [3.0, 4.6], [0, 1], clamp);
    lifGer = t < 2.6 ? ger : Math.max(0, 1 - (t - 2.6) * 4);
    kopuk = ger > 0.6;
    hx = bilek.x - 40 - 30 * ger; hy = bilek.y + 40 + 20 * ger;
    if (dus > 0) { hx = lerp(hx, 700, dus); hy = lerp(hy, 1180, dus); rot = 160 * (1 - dogrul) * Math.min(1, dus * 2); }
    if (dogrul > 0) rot = 160 * (1 - dogrul);
    if (git > 0) { hx = lerp(700, 380, git); hy = lerp(1180, 1010, git); yon = -1; adim = t * 2.4; }
    kavra = t < 0.9 ? Math.max(0, Math.sin(t * 9)) * 0.4 : 0; // tıkırdatma
  } else {
    sandGorun = true;
    const tir = interpolate(t, [0, 1.4], [0, 1], { ...clamp, easing: ease });
    const gel = interpolate(t, [1.5, 2.7], [0, 1], { ...clamp, easing: ease });
    const ger = interpolate(t, [2.8, 3.5], [0, 1], { ...clamp, easing: ease });
    kopuk = true;
    hy = lerp(1060, 990, tir); hx = 500; yon = 1; rot = -60 * (1 - tir);
    sx = hx + 70; sy = hy - 30; sandEl = true;
    if (gel > 0) { hx = lerp(500, 470, gel); hy = lerp(990, 1260, gel); adim = t * 2.4; sx = hx + 80; sy = hy - 20; }
    if (t > 2.7) { sandEl = false; sx = 560; sy = 1300; }
    if (ger > 0) { hx = lerp(470, 720, ger); hy = lerp(1260, 1060, ger); yon = 1; adim = t * 2.4; }
    // Ece'nin elleri: al (3.5-4.1), barkod (4.1-4.7, bip 4.5), bırak (4.8-5.3)
    eceEl = interpolate(t, [3.5, 3.9, 5.0, 5.5], [0, 1, 1, 0], { ...clamp, easing: ease });
    const kaldir = interpolate(t, [3.8, 4.2, 4.8, 5.2], [0, 1, 1, 0], { ...clamp, easing: ease });
    if (t > 3.6) { sx = lerp(560, 520, kaldir); sy = lerp(1300, 1540, kaldir); sandRot = -18 * kaldir; }
    bip = t > 4.45 && t < 4.6;
    ekran = interpolate(t, [4.5, 4.6], [0, 1], clamp);
    // birleşme (5.2-6.0): el zıplar, bileğe takılır
    birles = interpolate(t, [5.2, 6.0], [0, 1], { ...clamp, easing: ease });
    if (birles > 0) {
      hx = lerp(720, bilek.x - 40, birles); hy = lerp(1060, bilek.y + 40, birles) - Math.sin(birles * Math.PI) * 180;
      rot = -360 * birles; kopuk = birles < 0.9; adim = 0;
    }
    if (t > 6.0) { hx = bilek.x - 40; hy = bilek.y + 40; rot = 0; kopuk = false; }
    lifGer = birles > 0.6 ? (1 - birles) * 2.5 : 0;
    // ödeme (6.3-7.0) + sandviçi alma (7.2-8.0)
    para = interpolate(t, [6.3, 7.0], [0, 1], { ...clamp, easing: ease });
    adamAl = interpolate(t, [7.2, 8.0], [0, 1], { ...clamp, easing: ease });
    if (para > 0 && adamAl === 0) { hx = lerp(bilek.x - 40, 600, para); hy = lerp(bilek.y + 40, 1180, para); }
    if (adamAl > 0) { hx = lerp(600, 600, adamAl); hy = lerp(1180, 1260, Math.min(1, adamAl * 2)) - (adamAl > 0.5 ? (adamAl - 0.5) * 2 * 500 : 0); kavra = Math.min(1, adamAl * 2); sx = hx + 40; sy = hy + 20; sandRot = 0; }
  }
  const s = per(hy);
  const flk = random(`te${Math.floor(f / 3)}`) > 0.93 ? 0.88 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1c20", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(7px)" }}>
        <rect width={1080} height={1100} fill="#9ea4ac" />
        {[0, 1, 2].map((r) => new Array(8).fill(0).map((_, i) => <rect key={`${r}${i}`} x={i * 140} y={160 + r * 240} width={110} height={190} fill={["#c84a3a", "#3a6ac8", "#e8c43a", "#3aa86a"][(i + r) % 4]} opacity={0.45} />))}
      </svg>
      {/* dev adam tezgâhın karşısında: yüzü Ece'ye (aşağı) bakar, alttan ışık */}
      <div style={{ position: "absolute", left: 600 - 0.2 * 2600, top: -250, filter: `brightness(${0.82 * flk}) contrast(1.1)` }}>
        <Character look={castById("iri724")} size={2600} pose={{ emotion: mod === "ayril" && t > 2.4 && t < 3.4 ? "alayci" : "soguk", lookX: -0.1, lookY: 0.55, yaw: -0.06, seed: 4, armR: { upper: 0, fore: 0, ul: 0.01, fl: 0.01 } }} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)" }} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: `brightness(${flk})` }}>
        <defs>
          <linearGradient id="tz_ust" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d8d4cc" /><stop offset="1" stopColor="#f0ece4" /></linearGradient>
        </defs>
        {/* adamın sağ kolu: omuzdan dirseğe, ön kol tezgâhta, bilek bize doğru */}
        <path d={`M 900 700 Q 960 930 ${bilek.x + 90} ${bilek.y - 30}`} stroke={O} strokeWidth={214} strokeLinecap="round" fill="none" />
        <path d={`M 900 700 Q 960 930 ${bilek.x + 90} ${bilek.y - 30}`} stroke="#2a241e" strokeWidth={200} strokeLinecap="round" fill="none" />
        {/* tezgâh üstü */}
        <path d="M -40 1040 L 1120 1040 L 1180 1920 L -100 1920 Z" fill="url(#tz_ust)" />
        <path d="M -40 1040 L 1120 1040" stroke="#8a867e" strokeWidth={6} />
        {new Array(6).fill(0).map((_, i) => <path key={i} d={`M ${-40 + i * 230} 1040 L ${-100 + i * 256} 1920`} stroke="#d0ccc4" strokeWidth={2} />)}
        {/* kasa ekranı (Ece'ye dönük) + kart okuyucu + barkod tabancası */}
        <g>
          <rect x={30} y={820} width={330} height={250} rx={12} fill="#1a1c1e" stroke={O} strokeWidth={6} />
          <rect x={48} y={838} width={294} height={200} fill="#06200e" />
          <text x={64} y={890} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={26} fill="#3aff8a" opacity={ekran}>TON BALIKLI SNDV</text>
          <text x={64} y={940} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={44} fill="#3aff8a" opacity={ekran}>15,00 ₺</text>
          <text x={64} y={1010} fontFamily="'Courier New', monospace" fontSize={22} fill="#3aff8a" opacity={0.5}>CAN MARKET 7/24</text>
          <rect x={150} y={1070} width={90} height={40} fill="#2a2c2e" />
        </g>
        {/* para */}
        {para > 0 ? (
          <g transform={`translate(${lerp(760, 640, para)} ${lerp(1100, 1420, para)}) rotate(${-12 + para * 6})`}>
            <rect x={-110} y={-52} width={220} height={104} rx={6} fill="#c8a8d8" stroke={O} strokeWidth={3} />
            <rect x={-96} y={-40} width={192} height={80} rx={4} fill="none" stroke="#8a5aa8" strokeWidth={3} />
            <text x={-70} y={10} fontFamily={SANS} fontWeight={900} fontSize={42} fill="#5a2a7a">20</text>
            <circle cx={50} cy={0} r={26} fill="none" stroke="#8a5aa8" strokeWidth={3} />
          </g>
        ) : null}
        {/* sandviç */}
        {sandGorun && adamAl < 0.98 ? <Sandvic x={sx} y={sy} s={per(sy) * 1.5} rot={sandRot} barkodYuz={eceEl > 0.5} /> : null}
        {/* manşet (ön kolun ucu, tezgâhta) */}
        <path d={`M ${bilek.x + 20} ${bilek.y - 90} Q ${bilek.x + 60} ${bilek.y - 10} ${bilek.x + 10} ${bilek.y + 70}`} stroke="#1c1814" strokeWidth={12} fill="none" />
        {/* bilek ucu: el yokken çıplak et ve lifler */}
        {kopuk || lifGer > 0 ? (
          <g>
            <ellipse cx={bilek.x - 20} cy={bilek.y + 30} rx={46} ry={34} fill={ET} stroke={O} strokeWidth={4} />
            <ellipse cx={bilek.x - 20} cy={bilek.y + 28} rx={14} ry={11} fill="#e8dcc8" />
            {new Array(16).fill(0).map((_, i) => {
              const ox = bilek.x - 56 + i * 6, oy = bilek.y + 22 + (i % 4) * 5;
              const ger = lifGer > 0.02;
              const ex = ger ? hx + 70 - i * 7 : ox - 8 - (i % 4) * 9, ey = ger ? hy - 30 + (i % 3) * 8 : oy + 34 + (i % 3) * 16 + Math.sin(f / 4 + i) * 7;
              const sag = ger ? 40 + (i % 5) * 18 : 10;
              const w = i % 4 === 0 ? 7 : i % 2 ? 4.5 : 3;
              return (
                <g key={i} opacity={ger ? Math.min(1, lifGer * 1.4) : 0.45}>
                  <path d={`M ${ox} ${oy} Q ${(ox + ex) / 2 + Math.sin(f / 3 + i) * 16} ${(oy + ey) / 2 + sag} ${ex} ${ey}`} stroke={i % 4 === 0 ? "#2a0a10" : i % 2 ? LIF : "#a83a40"} strokeWidth={w} fill="none" strokeLinecap="round" />
                  {i % 3 === 0 ? <path d={`M ${ox} ${oy} Q ${(ox + ex) / 2 + Math.sin(f / 3 + i) * 16} ${(oy + ey) / 2 + sag - 2} ${ex} ${ey}`} stroke="#ffc8c8" strokeWidth={1.2} fill="none" opacity={0.5} /> : null}
                </g>
              );
            })}
          </g>
        ) : null}
        {/* el */}
        {adamAl < 0.99 || mod === "ayril" ? <KopukEl x={hx} y={hy} s={s * 1.6} yon={yon} adim={adim} kavra={kavra} kopuk={kopuk} rot={rot} f={f} /> : null}
        {/* el sandviçi taşıyorsa: sandviç elin önünde */}
        {sandEl ? <Sandvic x={sx} y={sy} s={per(sy) * 1.4} rot={-8} /> : null}
        {/* Ece'nin elleri: titreyerek sandviçi alır; sol elde barkod tabancası */}
        {eceEl > 0 ? (
          <g transform={`translate(${Math.sin(f * 2.3) * 4} ${(1 - eceEl) * 500})`}>
            <path d={`M ${sx - 60} ${sy + 60} L 380 2100`} stroke={O} strokeWidth={150} strokeLinecap="round" />
            <path d={`M ${sx - 60} ${sy + 60} L 380 2100`} stroke={ECE_TEN} strokeWidth={138} strokeLinecap="round" />
            <path d="M 300 1820 L 460 2100" stroke={KAZAK} strokeWidth={200} strokeLinecap="round" />
            {[0, 1, 2, 3].map((k) => <path key={k} d={`M ${sx - 40 + k * 22} ${sy + 50} l ${4} ${-60}`} stroke={O} strokeWidth={30} strokeLinecap="round" />)}
            {[0, 1, 2, 3].map((k) => <path key={`f${k}`} d={`M ${sx - 40 + k * 22} ${sy + 50} l ${4} ${-60}`} stroke={ECE_TEN} strokeWidth={21} strokeLinecap="round" />)}
            {/* barkod tabancası (sağ el) */}
            <g transform={`translate(${lerp(980, 720, Math.min(1, eceEl * 1.4))} ${lerp(1800, 1560, Math.min(1, eceEl * 1.4))}) rotate(-30)`}>
              <path d="M -50 -40 L 90 -40 L 90 30 L 10 30 L 0 160 L -50 160 Z" fill="#2a2c30" stroke={O} strokeWidth={5} strokeLinejoin="round" />
              <rect x={70} y={-34} width={16} height={58} fill={bip ? "#ff3a3a" : "#7a1a1a"} />
              <path d="M 0 160 L 300 400" stroke={ECE_TEN} strokeWidth={110} strokeLinecap="round" />
              <path d="M 120 260 L 400 480" stroke={KAZAK} strokeWidth={170} strokeLinecap="round" />
            </g>
            {bip ? <path d={`M ${sx - 120} ${sy - 30} L ${sx + 60} ${sy - 30}`} stroke="#ff2a2a" strokeWidth={4} opacity={0.9} /> : null}
          </g>
        ) : null}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- el_raf */

/** Reyon, yer seviyesinden: perspektif koridor; sağda "SANDVİÇ" soğutmalı rafı. El ön soldan girer, koridorda ilerler,
 *  rafın dikmesine tırmanır, paketli sandviçi kavrayıp çeker, yere atlar, sandviçle kameraya doğru (sol alttan) geri yürür. */
const ElRaf: React.FC<{ dur: number; text?: string[] }> = ({ text }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps + Number(text?.[0] ?? 0);
  const key: [number, number, number, number, number][] = [
    // t, x, y, s, rot
    [0, 180, 1780, 1.6, 0], [1.6, 560, 1420, 0.95, 0], [2.6, 800, 1470, 1.15, 0], [3.6, 860, 1080, 1.15, -78],
    [4.3, 880, 1040, 1.15, -78], [4.7, 860, 1500, 1.15, 0], [7.0, 140, 1880, 1.75, 0],
  ];
  let i = 0;
  while (i < key.length - 2 && t > key[i + 1][0]) i++;
  const [t0, x0, y0, s0, r0] = key[i], [t1, x1, y1, s1, r1] = key[i + 1];
  const k = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
  const kk = i === 4 ? k * k : ease(k);
  const hx = lerp(x0, x1, kk), hy = lerp(y0, y1, kk), hs = lerp(s0, s1, kk), hr = lerp(r0, r1, kk);
  const yuruyor = !(t > 3.6 && t < 4.3) && !(t > 4.3 && t < 4.75);
  const adim = yuruyor ? t * 2.6 : 0;
  const yon = t > 4.7 ? -1 : 1;
  const kavra = interpolate(t, [3.7, 4.1], [0, 1], clamp);
  const aldi = t > 4.1;
  const flk = random(`er${Math.floor(f / 3)}`) > 0.94 ? 0.85 : 1;
  const VP = { x: 540, y: 760 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1c20", overflow: "hidden" }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: `brightness(${flk})` }}>
        {/* tavan + floresanlar */}
        <path d={`M 0 0 L 1080 0 L ${VP.x + 120} ${VP.y - 60} L ${VP.x - 120} ${VP.y - 60} Z`} fill="#e4e8ea" />
        {[0.15, 0.35, 0.6].map((q, j) => <path key={j} d={`M ${lerp(300, VP.x - 30, q)} ${lerp(80, VP.y - 70, q)} L ${lerp(780, VP.x + 30, q)} ${lerp(80, VP.y - 70, q)}`} stroke="#ffffff" strokeWidth={lerp(34, 6, q)} opacity={0.9} />)}
        {/* zemin */}
        <path d={`M 0 1920 L 1080 1920 L ${VP.x + 120} ${VP.y + 60} L ${VP.x - 120} ${VP.y + 60} Z`} fill="#b8bcc0" />
        {new Array(9).fill(0).map((_, j) => <path key={j} d={`M ${-400 + j * 235} 1920 L ${VP.x - 120 + j * 30} ${VP.y + 60}`} stroke="#9aa0a4" strokeWidth={3} />)}
        {[0.2, 0.42, 0.62, 0.78, 0.9].map((q, j) => <path key={`h${j}`} d={`M ${lerp(0, VP.x - 120, q)} ${lerp(1920, VP.y + 60, q)} L ${lerp(1080, VP.x + 120, q)} ${lerp(1920, VP.y + 60, q)}`} stroke="#9aa0a4" strokeWidth={3} />)}
        {/* sol raf (perspektif, ürünler) */}
        <path d={`M 0 140 L ${VP.x - 120} ${VP.y - 60} L ${VP.x - 120} ${VP.y + 60} L 0 1700 Z`} fill="#5a6068" />
        {[0.12, 0.34, 0.56, 0.78].map((q, j) => (
          <g key={j}>
            <path d={`M 0 ${lerp(140, 1700, q)} L ${VP.x - 120} ${lerp(VP.y - 60, VP.y + 60, q)}`} stroke="#c8ccd0" strokeWidth={10} />
            {new Array(9).fill(0).map((_, m) => {
              const p0 = m / 9, p1 = (m + 0.8) / 9;
              const yA = lerp(140, 1700, q), yB = lerp(VP.y - 60, VP.y + 60, q);
              const xa = lerp(0, VP.x - 120, p0), xb = lerp(0, VP.x - 120, p1);
              const ya = lerp(yA, yB, p0), yb = lerp(yA, yB, p1);
              const h = lerp(190, 30, p0);
              return <path key={m} d={`M ${xa} ${ya - 8} L ${xb} ${yb - 8} L ${xb} ${yb - 8 - h * 0.86} L ${xa} ${ya - 8 - h}`} fill={["#c84a3a", "#3a6ac8", "#e8c43a", "#3aa86a", "#a84ac8"][(m + j) % 5]} stroke="#222" strokeWidth={2} />;
            })}
          </g>
        ))}
        {/* sağ: SANDVİÇ soğutmalı rafı (yakında) */}
        <path d={`M 760 300 L 1080 160 L 1080 1820 L 760 1560 Z`} fill="#dfe6ea" stroke={O} strokeWidth={6} />
        <rect x={790} y={340} width={250} height={70} rx={8} fill="#2a7ac8" />
        <text x={915} y={388} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={38} fill="#fff">SANDVİÇ</text>
        {[700, 1110, 1500].map((y, j) => <path key={j} d={`M 760 ${y} L 1080 ${y - 40}`} stroke="#8a969c" strokeWidth={14} />)}
        {/* raftaki sandviçler (biri alınır) */}
        {[0, 1, 2].map((m) => <Sandvic key={`a${m}`} x={830 + m * 90} y={650 - m * 12} s={0.62} />)}
        {[0, 1, 2].map((m) => (m === 0 && aldi ? null : <Sandvic key={`b${m}`} x={850 + m * 88} y={1060 - m * 12} s={0.66} />))}
        {[0, 1].map((m) => <Sandvic key={`c${m}`} x={860 + m * 96} y={1450 - m * 12} s={0.7} />)}
        <rect x={760} y={300} width={22} height={1260} fill="#9aa4aa" />
        {/* el + taşınan sandviç */}
        <KopukEl x={hx} y={hy} s={hs * 0.9} yon={yon} adim={adim} kavra={t > 4.1 && t < 4.7 ? 1 : kavra} rot={hr} f={f} />
        {aldi ? <Sandvic x={hx + (yon > 0 ? 70 : -70) * hs} y={hy - 40 * hs} s={hs * 0.62} rot={yon > 0 ? -10 : 10} /> : null}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Insert9: React.FC<{ kind: Insert9Kind; dur: number; text?: string[] }> = ({ kind, dur, text }) => {
  switch (kind) {
    case "telefon_mesaj": return <TelefonMesaj dur={dur} text={text} />;
    case "yer_pov": return <YerPov dur={dur} />;
    case "tezgah_el": return <TezgahEl dur={dur} text={text} />;
    case "el_raf": return <ElRaf dur={dur} text={text} />;
    default: return null;
  }
};
