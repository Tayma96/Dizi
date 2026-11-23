import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { castById, type CastMember } from "../cast";
import { Character } from "../rig/Character";
import { Rozet } from "../rig/dugme";
import type { Pose } from "../rig/types";
import { SANS } from "../../dizi/fonts";
import { KD_BASLIK } from "../engine/KirmiziDugme";
import { KdYayinBG } from "../sets/dugme";

/* =====================================================================================
 * Kırmızı Düğme · STİL DENEMESİ (kompozisyon KDStil → ornekler/kd-stil.png)
 * Aynı iki karakter (göbekli adam + influencer) üç imza stilde. Hepsi yalnız Kırmızı Düğme için opt-in:
 *   1) Renkli kontur  : KdKontur filtresi (siyah çizgi → karakterin kendi koyu rengi, titrek el çizgisi, sıcak gölge bandı, kâğıt)
 *   2) Büyük kafa     : Look alanları basOlcek, gozStili "kd", yanakIsaret, agizOlcek (rig'de hazır)
 *   3) Sticker        : KdSticker filtresi (kalın beyaz kenar, yumuşak gölge, kâğıt dokusu) + soluk mekân
 * Diğer dizilerin rig görünümü değişmez.
 * ===================================================================================== */

const INK = "#24181c";

/** Stil 1 ve 3 filtreleri. `kaynat`: çizgi titremesinin tohumu (her 3 karede değişir: 10 fps el çizimi hissi). */
export const KdStilFiltreleri: React.FC<{ kaynat: number }> = ({ kaynat }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      {([["gobek", "#7a3416"], ["infl", "#8a1f6a"]] as const).map(([ad, renk]) => (
        <filter key={ad} id={`kdKontur-${ad}`} x="-12%" y="-8%" width="124%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={kaynat} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" result="w" />
          {/* koyu çizgileri ayıkla (parlaklık < ~0,135) */}
          <feColorMatrix in="w" type="luminanceToAlpha" result="lum" />
          <feComponentTransfer in="lum" result="koyu"><feFuncA type="discrete" tableValues="1 1 0 0 0 0 0 0 0 0 0 0 0 0 0" /></feComponentTransfer>
          <feComposite in="koyu" in2="w" operator="in" result="cizgi0" />
          <feMorphology in="cizgi0" operator="dilate" radius={2.4} result="cizgi1" />
          <feFlood floodColor={renk} result="renk" />
          <feComposite in="renk" in2="cizgi1" operator="in" result="cizgi" />
          {/* sıcak gölge bandı: biçimin sağ-alt kenarında düz renk blok */}
          <feOffset in="w" dx={-18} dy={-10} result="kay" />
          <feComposite in="w" in2="kay" operator="out" result="bant" />
          <feFlood floodColor="#ff5a2a" floodOpacity={0.5} />
          <feComposite in2="bant" operator="in" result="sicak" />
          {/* kâğıt dokusu (karakterin içinde) */}
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 -0.9 0.5" result="g2" />
          <feComposite in="g2" in2="w" operator="in" result="doku" />
          {/* riso baskı kayması: renk dolguları çizgi katmanından hafifçe kaymış basılır (imza) */}
          <feOffset in="w" dx={7} dy={5} result="wk" />
          <feOffset in="sicak" dx={7} dy={5} result="sk" />
          <feMerge><feMergeNode in="wk" /><feMergeNode in="sk" /><feMergeNode in="doku" /><feMergeNode in="cizgi" /></feMerge>
        </filter>
      ))}
      <filter id="kdSticker" x="-20%" y="-12%" width="140%" height="124%" colorInterpolationFilters="sRGB">
        <feMorphology in="SourceAlpha" operator="dilate" radius={17} result="d" />
        <feGaussianBlur in="d" stdDeviation={1.2} result="d2" />
        <feFlood floodColor="#ffffff" />
        <feComposite in2="d2" operator="in" result="kenar" />
        <feOffset in="d" dx={10} dy={16} result="o" />
        <feGaussianBlur in="o" stdDeviation={10} result="ob" />
        <feFlood floodColor="#2a1030" floodOpacity={0.38} />
        <feComposite in2="ob" operator="in" result="golge" />
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={2} seed={9} result="t" />
        <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.45  0 0 0 -1.1 0.62" result="t2" />
        <feComposite in="t2" in2="d" operator="in" result="kagit" />
        {/* kesik kâğıt: karakter ince bir koyu kontura sahip, beyaz kenarın iç çizgisi */}
        <feMorphology in="SourceAlpha" operator="dilate" radius={18.5} result="d3" />
        <feComposite in="d3" in2="d2" operator="out" result="dis" />
        <feFlood floodColor="#d8c8d8" />
        <feComposite in2="dis" operator="in" result="disCizgi" />
        <feMerge><feMergeNode in="golge" /><feMergeNode in="disCizgi" /><feMergeNode in="kenar" /><feMergeNode in="SourceGraphic" /><feMergeNode in="kagit" /></feMerge>
      </filter>
    </defs>
  </svg>
);

const yer = (look: CastMember, pose: Pose, x: number, y: number, size: number, filtre?: string, aci = 0) => (
  <div style={{ position: "absolute", left: x - size * 0.2, top: y - size * 0.985, filter: filtre ? `url(#${filtre})` : undefined, transform: aci ? `rotate(${aci}deg)` : undefined, transformOrigin: "50% 90%" }}>
    <Character look={look} size={size} pose={{ golgesiz: !!filtre, kirpmaz: true, ...pose }} />
  </div>
);

const GOBEK_POZ: Pose = { gesture: "gobekKasi", emotion: "agizAcik", eyesClosed: 0.3, seed: 4 };
const INFL_POZ: Pose = { gesture: "slime", prop: "slime", emotion: "gulen", seed: 7 };
const ROZET_G = { rozet: { simge: "cips" as const, renk: "#f2a03a" } };
const ROZET_I = { rozet: { simge: "kalp" as const, renk: "#ff4a8a" } };

const PW = 1380, PH = 1560;

const Panel: React.FC<{ no: string; ad: string; notlar: [string, string][]; children: React.ReactNode; bg: string }> = ({ no, ad, notlar, children, bg }) => (
  <div style={{ width: PW, display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginBottom: 14 }}>
      <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 92, color: "#e8202e", lineHeight: 1 }}>{no}</div>
      <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 62, color: INK, lineHeight: 1 }}>{ad}</div>
    </div>
    <div style={{ width: PW, height: PH, position: "relative", overflow: "hidden", borderRadius: 36, background: bg, border: `6px solid ${INK}` }}>{children}</div>
    <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
      {notlar.map(([b, t]) => (
        <div key={b} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: INK, lineHeight: 1.28 }}>
          <span style={{ fontWeight: 900, color: "#c8101e" }}>{b}: </span>{t}
        </div>
      ))}
    </div>
  </div>
);

export const KDStil: React.FC = () => {
  const frame = useCurrentFrame();
  const g = castById("kd_gobek");
  const inf = castById("kd_influencer");
  const kaynat = 1 + Math.floor(frame / 3) % 4;
  return (
    <AbsoluteFill style={{ background: "#f3ece6" }}>
      <KdStilFiltreleri kaynat={kaynat} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 30, padding: "30px 60px 10px" }}>
        <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 120, color: "#e8202e", textShadow: "0 6px 0 #9a0a16" }}>Kırmızı Düğme</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 50, color: INK }}>İmza stil denemesi · aynı iki karakter, üç kimlik</div>
      </div>
      <div style={{ display: "flex", gap: 70, padding: "20px 60px" }}>
        {/* 1 · RENKLİ KONTUR */}
        <Panel no="1" ad="Renkli kontur" bg="#f6ecda" notlar={[
          ["Tanınırlık", "Siyah çizgi yok: her karakter kendi renginin koyusuyla, titrek el çizgisiyle çizilir; renk dolguları çizgiden hafif kayık basılır (riso baskı), çizgi 3 karede bir \"kaynar\". Tipik düz vektörden en net ayrılan stil."],
          ["Maliyet", "Düşük. Rig'e dokunmadan karakteri saran tek filtre (renkli çizgi + titreme + sıcak gölge bandı + kâğıt dokusu). Render biraz yavaşlar."],
          ["Kitle", "Defter karalaması, zine sıcaklığı; samimi ve el yapımı. Gerilimde titreşim artırılabilir (beyaz odada anlam taşır)."],
        ]}>
          <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <filter id="kdFirca" colorInterpolationFilters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={2} seed={kaynat} /><feDisplacementMap in="SourceGraphic" scale={40} xChannelSelector="R" yChannelSelector="G" /></filter>
            </defs>
            <g filter="url(#kdFirca)">
              <ellipse cx={420} cy={880} rx={330} ry={560} fill="#ffc8a0" />
              <ellipse cx={980} cy={820} rx={320} ry={580} fill="#e4ccff" />
              <path d="M 80 1380 Q 700 1300 1300 1400" stroke="#7a3416" strokeWidth={8} fill="none" />
            </g>
            {[[180, 260, "#e8202e"], [1180, 300, "#8a1f6a"], [700, 180, "#f2a03a"]].map(([x, y, c], i) => (
              <path key={i} d={`M ${x} ${(y as number) - 34} Q ${x} ${y} ${(x as number) + 34} ${y} Q ${x} ${y} ${x} ${(y as number) + 34} Q ${x} ${y} ${(x as number) - 34} ${y} Q ${x} ${y} ${x} ${(y as number) - 34} Z`} fill={c as string} filter="url(#kdFirca)" />
            ))}
          </svg>
          {yer({ ...g, ...ROZET_G }, GOBEK_POZ, 420, 1470, 1280, "kdKontur-gobek")}
          {yer({ ...inf, ...ROZET_I }, INFL_POZ, 990, 1470, 1280, "kdKontur-infl")}
          <AbsoluteFill style={{ background: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.5 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>\")", mixBlendMode: "multiply", opacity: 0.28 }} />
        </Panel>

        {/* 2 · BÜYÜK KAFA – İFADE GÖZLERİ */}
        <Panel no="2" ad="Büyük kafa · ifade gözleri" bg="linear-gradient(160deg, #ffd6e8 0%, #e6d8ff 55%, #cff4ea 100%)" notlar={[
          ["Tanınırlık", "Kafa/vücut ~1:3,5, imza göz (yuvarlak-kare iris, tek büyük parlama + yıldız) ve her karakterin yanak işareti; tek bir ekran görüntüsünden bile \"bizim dizi\" okunur."],
          ["Maliyet", "Orta. Look alanları hazır (basOlcek, gozStili, yanakIsaret, agizOlcek). Yakın planda duygu çok güçlü; geniş planda kadraj ve jestler kafa oranına göre yeniden ayarlanmalı."],
          ["Kitle", "En yüksek sevimlilik; ifadeler meme ve sticker olarak paylaşılır. Risk: göbekli adamın \"biraz çirkin\" yanı yumuşar."],
        ]}>
          <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
            {new Array(14).fill(0).map((_, i) => <circle key={i} cx={random(`b${i}`) * PW} cy={random(`c${i}`) * PH * 0.8} r={30 + random(`r${i}`) * 90} fill="#ffffff" opacity={0.25} />)}
            {new Array(10).fill(0).map((_, i) => { const x = random(`sx${i}`) * PW, y = random(`sy${i}`) * PH * 0.7, r = 14 + random(`sr${i}`) * 16; return <path key={`s${i}`} d={`M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`} fill="#ffffff" opacity={0.85} />; })}
            <ellipse cx={PW / 2} cy={1470} rx={620} ry={40} fill="#a890d8" opacity={0.3} />
          </svg>
          {yer({ ...g, ...ROZET_G, basOlcek: 1.5, boy: 0.86, gozStili: "kd", yanakIsaret: "yastik", agizOlcek: 1.35 }, { ...GOBEK_POZ, emotion: "agizAcik", eyesClosed: 0.12, lookX: 0.3 }, 420, 1470, 1180)}
          {yer({ ...inf, ...ROZET_I, basOlcek: 1.5, boy: 0.86, gozStili: "kd", yanakIsaret: "kalp", agizOlcek: 1.35 }, { ...INFL_POZ, emotion: "mutlu", lookX: -0.3, tilt: 6 }, 990, 1470, 1180)}
        </Panel>

        {/* 3 · STICKER / KESİK KÂĞIT */}
        <Panel no="3" ad="Sticker · kesik kâğıt" bg="#ddd" notlar={[
          ["Tanınırlık", "Kalın beyaz sticker kenarı, yumuşak gölge, hafif eğik duruş; mekân solgun, karakterler patlar. Her kare bir sticker albümü sayfası gibi; küçük önizlemede bile öne çıkar."],
          ["Maliyet", "Düşük. Tek filtre (genişletilmiş beyaz kenar + gölge + kâğıt dokusu) ve mekânda doygunluk düşürme. Hareketli sahnede ucuz ve kararlı."],
          ["Kitle", "Telefon kılıfı, defter ve sticker kültürüne yakın; sticker paketi olarak doğal uzanır. Risk: dramatik anlarda fazla \"kolaj\" durabilir."],
        ]}>
          <div style={{ position: "absolute", left: (PW - 1080 * 1.0) / 2, top: -260, width: 1080, height: 1920, filter: "saturate(0.35) brightness(1.15) blur(2px)", opacity: 0.85 }}>
            <svg viewBox="0 0 1080 1920" width={1080} height={1920}><KdYayinBG frame={frame} /></svg>
          </div>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffffff44, #ffffff88)" }} />
          {yer({ ...g, ...ROZET_G }, GOBEK_POZ, 430, 1450, 1220, "kdSticker", -3)}
          {yer({ ...inf, ...ROZET_I }, INFL_POZ, 980, 1450, 1220, "kdSticker", 2.5)}
        </Panel>
      </div>
      {/* İMZA İŞARET */}
      <div style={{ margin: "34px 60px 0", background: "#ffffff", border: `5px solid ${INK}`, borderRadius: 36, padding: "26px 40px", display: "flex", alignItems: "center", gap: 46 }}>
        <div style={{ width: 1500 }}>
          <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 58, color: "#e8202e" }}>İmza işaret: altıgen rozet</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 32, color: INK, lineHeight: 1.3 }}>
            Her karakterin üstünde, beyaz odanın peteğinden gelen minik bir altıgen rozet ve içinde kendi simgesi. Biçim hep aynı, simge kişiye özel: seriyi sahiplendiren tekrar eden işaret. Kırmızı mantar düğme bilinçli olarak yalnız 4. kişinin ipuçlarında kalır; herkese verilirse ipucu değeri kaybolur.
          </div>
        </div>
        {([["cips", "#f2a03a", "Göbekli"], ["simsek", "#f4f22e", "Kurye"], ["kalp", "#ff4a8a", "Influencer"], ["damla", "#fff06a", "Kolonya Teyze"], ["ay", "#8ab8f4", "Uykucu"], ["dambil", "#c8f03a", "Sporcu Abi"]] as const).map(([sm, rk, ad]) => (
          <div key={sm} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 230 }}>
            <svg width={150} height={150} viewBox="0 0 150 150"><Rozet x={75} y={75} r={62} simge={sm} renk={rk} /></svg>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: INK }}>{ad}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
