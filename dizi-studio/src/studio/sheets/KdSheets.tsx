import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { castById } from "../cast";
import { Character } from "../rig/Character";
import type { Pose } from "../rig/types";
import { VinnLogo } from "../rig/dugme";
import { SANS } from "../../dizi/fonts";
import { KdEvBG, KdEvFG, KdMarketOnuBG, KdMarketOnuFG, KdCaddeBG, KuryeMotor, KacirmaVan, KdYayinBG, KdYayinFG, YayinArayuz } from "../sets/dugme";
import { BeyazOda, petekBul, proj, type Kam, type OdaKarakter } from "../sets/beyazoda";
import { FpsEl, KD_BASLIK, type KolTuru } from "../engine/KirmiziDugme";

/* =====================================================================================
 * Kırmızı Düğme · kontrol sayfaları
 *   KDKadro     bütün karakterler + 4. kişi seçenekleri + beyaz oda kıyafet seçenekleri + FPS el seçenekleri
 *   KDMekanlar  8 kare: beyaz oda (başlangıç / final), ev, market önü, cadde (takip / kavşak), yayın odası, kask içi
 * ===================================================================================== */

const INK = "#24181c";
const lbl: React.CSSProperties = { fontFamily: SANS, fontWeight: 900, fontSize: 40, color: INK, textAlign: "center", lineHeight: 1.1 };
const sub: React.CSSProperties = { fontFamily: SANS, fontWeight: 800, fontSize: 25, color: "#5a4a50", textAlign: "center", lineHeight: 1.2, marginTop: 6 };
const baslik: React.CSSProperties = { fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 64, color: "#c8101e", padding: "26px 40px 6px" };

const Kisi: React.FC<{ id: string; pose?: Pose; ad: string; alt?: string; w?: number; size?: number; children?: React.ReactNode }> = ({ id, pose, ad, alt, w = 470, size = 900, children }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ height: size * 0.99, width: w, position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
      <Character look={castById(id)} size={size} pose={{ seed: id.length * 3, ...pose }} />
      {children}
    </div>
    <div style={lbl}>{ad}</div>
    {alt ? <div style={sub}>{alt}</div> : null}
  </div>
);

const Kart: React.FC<{ w: number; h: number; ad: string; alt?: string; bg?: string; children: React.ReactNode }> = ({ w, h, ad, alt, bg = "#fff", children }) => (
  <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: w, height: h, background: bg, borderRadius: 28, overflow: "hidden", position: "relative", border: `5px solid ${INK}` }}>{children}</div>
    <div style={{ ...lbl, marginTop: 12 }}>{ad}</div>
    {alt ? <div style={sub}>{alt}</div> : null}
  </div>
);

const Ipucu: React.FC<{ maddeler: string[] }> = ({ maddeler }) => (
  <div style={{ width: 560, background: "#fff6f7", border: `5px solid #c8101e`, borderRadius: 28, padding: "28px 32px", alignSelf: "center" }}>
    <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 48, color: "#c8101e", marginBottom: 12 }}>İnce ipuçları</div>
    {maddeler.map((m) => <div key={m} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36, color: INK, lineHeight: 1.25, marginBottom: 14 }}>• {m}</div>)}
  </div>
);

/** Kask yakın plan: vizörün ardında yüz, kayan şehir ışığı yansımaları, müzikle kafa sallama. */
export const KaskYakin: React.FC<{ w: number; h: number; frame: number }> = ({ w, h, frame }) => {
  const sal = Math.sin(frame / 4.2);
  const size = h * 3.4;
  return (
    <div style={{ width: w, height: h, position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(circle at 30% 30%, #3a2a5a, #0a0a1e 70%)" }}>
      {new Array(14).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: ((i * 137 + frame * 9) % (w + 200)) - 100, top: (i * 71) % h, width: 60 + (i % 4) * 30, height: 60 + (i % 4) * 30, borderRadius: "50%", background: i % 3 ? "#ffa04a" : "#ff6ab0", opacity: 0.35, filter: "blur(10px)" }} />
      ))}
      <div style={{ position: "absolute", left: w / 2 - size * 0.2, top: -size * 0.035 + sal * 8 }}>
        <Character look={castById("kd_kurye")} size={size} pose={{ emotion: "gulen", tilt: sal * 7, kaskYansima: ((frame * 14) % 260) - 130, speech: { cues: [{ t: 0, v: Math.floor(frame / 5) % 2 ? "A" : "E" }, { t: 99, v: "E" }], from: 0 }, golgesiz: true }} />
      </div>
      {[0, 1, 2].map((i) => {
        const k = ((frame / 30 + i / 3) % 1);
        return <div key={i} style={{ position: "absolute", left: w * (0.12 + i * 0.36), top: h * (0.8 - 0.6 * k), fontSize: 70, color: "#ffd84a", opacity: 1 - k, fontWeight: 900, textShadow: "0 0 12px #ff6ab0" }}>♪</div>;
      })}
    </div>
  );
};

const FpsKart: React.FC<{ kol: KolTuru; sol?: boolean }> = ({ kol, sol }) => {
  const k: Kam = { x: 2.35, y: 1.6, z: 3.2, yaw: 72, pitch: -16, f: 900, cy: 900 };
  const h = proj(k, petekBul("sag", 3.2, 1.3, 3.45).c);
  return (
    <div style={{ width: 1080, height: 1920, transform: "scale(0.9)", transformOrigin: "0 0", position: "absolute", left: -36, top: -560 }}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <BeyazOda k={k} durum={{ derz: 1, dalga: 30, anaBas: 1, anaLed: 1, sayac: 1, kirmizi: 0.08, t: 0, kaide: false }} frame={0} ekstra={<FpsEl x={h.x} y={h.y + 6} s={1.25} aci={sol ? 30 : -30} kol={kol} sol={sol} bas={0.6} />} />
      </svg>
    </div>
  );
};

export const KDKadro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#f3ece6" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 30, padding: "30px 40px 0" }}>
        <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 120, color: "#e8202e", textShadow: "0 6px 0 #9a0a16" }}>Kırmızı Düğme</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: INK }}>Kadro tasarımı (taslak) · adlar geçici</div>
      </div>
      {/* SATIR 1 */}
      <div style={baslik}>1 · Ana karakterler</div>
      <div style={{ display: "flex", gap: 10, padding: "0 30px", alignItems: "flex-end" }}>
        <Kisi id="kd_gobek" ad="Göbekli Adam" alt="38 · atlet, eşofman, terlik" pose={{ gesture: "gobekKasi", emotion: "mutlu" }} />
        <Kisi id="kd_kurye" ad="Motokurye (kasklı)" alt="24 · uydurma marka VINN!" pose={{ emotion: "mutlu" }} />
        <Kisi id="kd_kurye_kasksiz" ad="Motokurye (kasksız)" alt="sırtta teslimat çantası" pose={{ emotion: "mutlu", lookX: 0.5 }} />
        <Kisi id="kd_influencer" ad="Influencer" alt="19 · perde kakül, pembe uçlar" pose={{ gesture: "slime", prop: "slime", emotion: "gulen" }} />
        <Kisi id="kd_maskeli" ad="Kar maskeli" alt="kaçıran · siyah, eldivenli" pose={{ emotion: "soguk", gesture: "yumruk" }} />
        <Kart w={560} h={900} ad="Kask içi yakın plan" alt="müzikle kafa sallar, yüz vizörün ardında" bg="#0a0a1e"><KaskYakin w={560} h={900} frame={frame + 12} /></Kart>
        <Kart w={430} h={900} ad="Teslimat çantası (arkadan)" alt="logo uydurma, gerçek firma değil" bg="#e9e2da">
          <svg viewBox="0 0 430 900" width={430} height={900}>
            <rect x={45} y={200} width={340} height={430} rx={34} fill="#18a39a" stroke={INK} strokeWidth={8} />
            <rect x={45} y={200} width={340} height={70} rx={30} fill="#1fb8ae" stroke={INK} strokeWidth={8} />
            <path d="M 45 270 H 385" stroke="#f4f22e" strokeWidth={16} />
            <VinnLogo x={215} y={420} s={2.2} />
            <rect x={45} y={540} width={340} height={30} fill="#e4eaee" stroke={INK} strokeWidth={5} />
            <path d="M 120 630 v 60 M 310 630 v 60" stroke="#20262b" strokeWidth={22} strokeLinecap="round" />
          </svg>
        </Kart>
        <Kart w={700} h={900} ad="Kaçırma minibüsü" alt="koyu gri van · plaka çamurlu, okunmaz · sürücü siluet" bg="#1a1830">
          <svg viewBox="0 0 700 900" width={700} height={900}>
            <rect width={700} height={900} fill="#1a1830" />
            <rect y={810} width={700} height={90} fill="#26232c" />
            <rect y={360} width={700} height={50} fill="#26232c" />
            <KacirmaVan x={350} y={350} s={0.4} view="on" frame={0} />
            <KacirmaVan x={360} y={800} s={0.58} view="yan" acik={0.8} frame={0} yon={1} />
            <text x={350} y={420} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={26} fill="#c8c0d0">önden</text>
            <text x={350} y={880} textAnchor="middle" fontFamily="DiziSans, Arial" fontWeight={900} fontSize={26} fill="#c8c0d0">yandan · kayar kapı açık</text>
          </svg>
        </Kart>
      </div>
      {/* SATIR 2 */}
      <div style={baslik}>2 · 4. kişi: üç seçenek (ilk bakışta kurban; aslında içeriden)</div>
      <div style={{ display: "flex", gap: 70, padding: "0 40px" }}>
        {([
          ["kd_dorduncu_a", "A · Düzgün memur tipi", "33 · gözlüklü, ütülü gömlek", ["Gömleği ütülü, hiç buruşmamış", "Kol saati hâlâ kolunda (herkesin eşyası alınmış)", "Ayakkabıları sıkı bağlı, bağcıklar düğme kırmızısı", "Cebinde kalemi düzgün duruyor"], { emotion: "notr" }],
          ["kd_dorduncu_b", "B · Sakin genç kadın", "27 · trençkot, topuz", ["Topuzu bozulmamış, kıyafeti tozsuz", "Altın saat kolunda", "Beyaz ayakkabılar lekesiz, kırmızı bağcık", "Herkes korkarken sakin; gözleri odayı tarıyor"], { emotion: "dusunceli" }],
          ["kd_dorduncu_c", "C · Masum üniversiteli", "20 · bukleli, yeşil kapüşonlu", ["Kulağında minicik siyah kulaklık (telsiz?)", "Kapüşon ipleri eşit, giysi temiz", "Kırmızı bağcıklar çift düğüm", "Güven veren gülümseme; ilk 'yardım' eden o"], { emotion: "mutlu" }],
        ] as [string, string, string, string[], Pose][]).map(([id, ad, alt, m, p]) => (
          <div key={id} style={{ display: "flex", gap: 10 }}>
            <Kisi id={id} ad={ad} alt={alt} pose={p} w={780} />
            <Ipucu maddeler={m} />
          </div>
        ))}
      </div>
      {/* SATIR 3 */}
      <div style={baslik}>3 · Beyaz odada görünüş: iki seçenek</div>
      <div style={{ display: "flex", gap: 0, padding: "0 30px" }}>
        <div style={{ display: "flex", flexDirection: "column", background: "#ffffff88", borderRadius: 30, padding: "10px 0" }}>
          <div style={{ ...lbl, fontSize: 44 }}>Seçenek 1 · Kendi kıyafetleri (buruşuk, tozlu)</div>
          <div style={{ display: "flex" }}>
            <Kisi id="kd_gobek_oda" ad="Göbekli" pose={{ emotion: "korkmus", sacDagin: true }} w={500} size={820} />
            <Kisi id="kd_kurye_oda" ad="Kurye" alt="kaskı, çantası yok" pose={{ emotion: "supheli", sacDagin: true }} w={500} size={820} />
            <Kisi id="kd_influencer_oda" ad="Influencer" alt="makyaj dağılmış" pose={{ emotion: "agliyor", sacDagin: true, tears: 0.5 }} w={500} size={820} />
            <Kisi id="kd_dorduncu_a" ad="4. kişi" alt="tertemiz (ipucu)" pose={{ emotion: "notr" }} w={500} size={820} />
          </div>
        </div>
        <div style={{ width: 40 }} />
        <div style={{ display: "flex", flexDirection: "column", background: "#ffffff88", borderRadius: 30, padding: "10px 0" }}>
          <div style={{ ...lbl, fontSize: 44 }}>Seçenek 2 · Herkese aynı beyaz tulum (çoraplı)</div>
          <div style={{ display: "flex" }}>
            <Kisi id="kd_gobek_tulum" ad="Göbekli" pose={{ emotion: "korkmus" }} w={500} size={820} />
            <Kisi id="kd_kurye_tulum" ad="Kurye" pose={{ emotion: "supheli" }} w={500} size={820} />
            <Kisi id="kd_influencer_tulum" ad="Influencer" pose={{ emotion: "uzgun" }} w={500} size={820} />
            <Kisi id="kd_dorduncu_a_tulum" ad="4. kişi" alt="saati yine kolunda (ipucu)" pose={{ emotion: "notr" }} w={500} size={820} />
          </div>
        </div>
      </div>
      {/* SATIR 4 */}
      <div style={baslik}>4 · Kanca (FPS) için el seçenekleri: kimin eli düğmeye basıyor?</div>
      <div style={{ display: "flex", gap: 60, padding: "0 50px" }}>
        {([["notr", "Nötr: beyaz tulum kolu", "kimin olduğu belli değil"], ["atlet", "Göbekli: çıplak kol", "atletli, kıllı önkol"], ["kurye", "Kurye: mont + eldiven", "reflektör şerit"], ["gomlek", "4. kişi (A): sol el", "gömlek manşeti + saat (büyük ipucu)"]] as [KolTuru, string, string][]).map(([kol, ad, alt]) => (
          <Kart key={kol} w={1020} h={1100} ad={ad} alt={alt} bg="#eef4f7"><FpsKart kol={kol} sol={kol === "gomlek"} /></Kart>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ===================================================================== MEKÂNLAR */
const Grade: React.FC<{ tur: "ev" | "sokak" | "yayin" | "oda" }> = ({ tur }) => {
  if (tur === "ev")
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(100deg, #9cc4ff 0%, #6a7ab8 45%, #2a2a50 100%)", mixBlendMode: "multiply", opacity: 0.75 }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 0% 60%, #6ab0ff55, transparent 55%)", mixBlendMode: "screen" }} />
      </>
    );
  if (tur === "sokak")
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(160deg, #ffc890 0%, #c88a6a 35%, #5a5288 75%, #2a2a50 100%)", mixBlendMode: "multiply", opacity: 0.72 }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 25% 25%, #ffa64a44, transparent 50%)", mixBlendMode: "screen" }} />
      </>
    );
  if (tur === "yayin")
    return (
      <>
        <AbsoluteFill style={{ background: "linear-gradient(90deg, #ffffff 0%, #f8d8f4 35%, #c8a0f0 75%, #8a6ad8 100%)", mixBlendMode: "multiply", opacity: 0.6 }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 0% 45%, #ffffff40, transparent 45%)", mixBlendMode: "screen" }} />
      </>
    );
  return <AbsoluteFill style={{ background: "linear-gradient(180deg, #f4fbff, #dbe9f2)", mixBlendMode: "multiply", opacity: 0.35 }} />;
};

const KisiYer: React.FC<{ id: string; x: number; y: number; size: number; pose?: Pose; style?: React.CSSProperties }> = ({ id, x, y, size, pose, style }) => (
  <div style={{ position: "absolute", left: x - size * 0.2, top: y - size * 0.985, ...style }}>
    <Character look={castById(id)} size={size} pose={{ seed: id.length, ...pose }} />
  </div>
);

export type KdMekan = "oda_bas" | "oda_final" | "ev" | "market" | "takip" | "kavsak" | "yayin" | "kask";
const ODA_KAR = (): OdaKarakter[] => [
  { look: castById("kd_gobek_tulum"), x: -1.15, z: 3.15, pose: { yaw: 0.45, lookX: 0.6, emotion: "saskin" } },
  { look: castById("kd_influencer_tulum"), x: 1.15, z: 3.25, pose: { yaw: -0.45, lookX: -0.6, emotion: "korkmus" } },
  { look: castById("kd_kurye_tulum"), x: -1.05, z: 5.5, pose: { yaw: 0.35, emotion: "supheli" } },
  { look: castById("kd_dorduncu_a_tulum"), x: 1.05, z: 5.6, pose: { yaw: -0.3, emotion: "notr" } },
];

/** Tek mekân karesi (1080×1920), ışık tasarımıyla. */
export const KdMekanKare: React.FC<{ m: KdMekan; frame: number }> = ({ m, frame }) => {
  const svg = (c: React.ReactNode) => <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{c}</svg>;
  switch (m) {
    case "oda_bas": {
      const k: Kam = { x: 0, y: 1.6, z: 0.9, yaw: 0, pitch: -6, f: 800, cy: 860 };
      return <AbsoluteFill>{svg(<BeyazOda k={k} durum={{ derz: 0, dalga: -1, anaBas: 0, anaLed: 0, sayac: 0, kirmizi: 0, t: 0 }} karakterler={ODA_KAR()} frame={frame} />)}<Grade tur="oda" /></AbsoluteFill>;
    }
    case "oda_final": {
      const k: Kam = { x: 0, y: 1.25, z: 0.6, yaw: 2, pitch: 2, f: 760, cy: 900 };
      const P = [petekBul("arka", 0, 2.2, 8), petekBul("sol", -3.2, 1.6, 5.5), petekBul("sag", 3.2, 2.0, 4.4), petekBul("tavan", 0.6, 3.4, 4.8), petekBul("arka", -2, 1.0, 8)];
      const kar = ODA_KAR();
      kar[0].pose = { ...kar[0].pose, emotion: "sok", gesture: "basTut", yaw: -0.2, lookY: -0.6 };
      kar[1].pose = { ...kar[1].pose, emotion: "dehset", gesture: "ellerYuzde", lookY: -0.4 };
      kar[2].pose = { ...kar[2].pose, emotion: "korkmus", lookY: -0.5 };
      kar[3].pose = { ...kar[3].pose, emotion: "soguk", yaw: -0.1 };
      return (
        <AbsoluteFill>
          {svg(<BeyazOda k={k} karakterler={kar} frame={frame} durum={{
            derz: 1, dalga: 8, anaBas: 1, anaLed: 1, sayac: 1, kirmizi: 0.4, t: 5.0,
            bolmeler: P.map((p) => ({ petek: p, acik: 1 })),
            nesneler: [
              { petek: P[0], t0: 4.7, tur: "terlik", hiz: 6, yan: [0, 2, 0] }, { petek: P[1], t0: 4.65, tur: "simit", hiz: 5, yan: [0, 2.5, -2] },
              { petek: P[2], t0: 4.75, tur: "ordek", hiz: 4.5, yan: [0, 2, -1.5] }, { petek: P[3], t0: 4.6, tur: "caydanlik", hiz: 2, yan: [0, 0, -1] },
              { petek: P[4], t0: 4.8, tur: "top", hiz: 7, yan: [1, 3, 0], boy: 0.34 },
            ],
          }} />)}
        </AbsoluteFill>
      );
    }
    case "ev":
      return (
        <AbsoluteFill style={{ background: "#000" }}>
          {svg(<KdEvBG frame={frame} />)}
          {/* kanepede uzanmış: başı sol kolçakta, telefon yüzünün üstünde, sol eli göbekte */}
          <div style={{ position: "absolute", left: 590 - 180, top: 1150 - 450, transform: "rotate(-84deg)", transformOrigin: "50% 50%" }}>
            <Character look={castById("kd_gobek")} size={900} pose={{ gesture: "gobekKasi", emotion: "gulen", armR: { upper: 104, fore: -96, ul: 0.8, fl: 0.9 }, prop: "telefon", lookX: 0.8, lookY: -0.3, golgesiz: true, tilt: 12 }} />
          </div>
          {/* telefon ekranının yüze vuran soğuk ışığı (dolgu) */}
          <AbsoluteFill style={{ background: "radial-gradient(circle at 34% 38%, #cfe6ff66, transparent 18%)", mixBlendMode: "screen" }} />
          {svg(<KdEvFG frame={frame} />)}
          <Grade tur="ev" />
        </AbsoluteFill>
      );
    case "market":
      return (
        <AbsoluteFill>
          {svg(<KdMarketOnuBG frame={frame} />)}
          <KisiYer id="kd_gobek" x={655} y={1450} size={340} pose={{ prop: "poset", gesture: "tutuyor", emotion: "mutlu", yaw: -0.3 }} />
          {svg(<KacirmaVan x={330} y={1810} s={0.82} view="yan" acik={1} frame={frame} />)}
          <KisiYer id="kd_maskeli" x={250} y={1850} size={640} pose={{ emotion: "soguk", yaw: 0.6, lookX: 0.9, gesture: "uzat" }} />
          {svg(<KdMarketOnuFG frame={frame} />)}
          <Grade tur="sokak" />
        </AbsoluteFill>
      );
    case "takip":
      return (
        <AbsoluteFill>
          {svg(<KdCaddeBG frame={frame} view="takip" />)}
          <KisiYer id="kd_kurye" x={540} y={1790} size={1260} pose={{ body: "sit", hideLegs: true, gesture: "direksiyon", emotion: "gulen", tilt: Math.sin(frame / 4) * 6, kaskYansima: (frame * 10) % 200 - 100, golgesiz: true }} />
          {svg(<KuryeMotor x={540} y={1760} s={1} frame={frame} />)}
          <Grade tur="sokak" />
        </AbsoluteFill>
      );
    case "kavsak":
      return (
        <AbsoluteFill>
          {svg(<><KdCaddeBG frame={frame} view="kavsak" /><KacirmaVan x={420} y={1720} s={0.85} view="on" frame={frame} /></>)}
          <Grade tur="sokak" />
        </AbsoluteFill>
      );
    case "yayin":
      return (
        <AbsoluteFill>
          {svg(<KdYayinBG frame={frame} />)}
          <KisiYer id="kd_influencer" x={470} y={1740} size={1160} pose={{ body: "sit", gesture: "slime", prop: "slime", emotion: "gulen", lookX: 0.4 }} />
          {svg(<KdYayinFG frame={frame} />)}
          <Grade tur="yayin" />
          {svg(<YayinArayuz frame={frame} aslan={0.5} ax={720} ay={560} as={0.5} />)}
        </AbsoluteFill>
      );
    case "kask":
      return <AbsoluteFill><KaskYakin w={1080} h={1920} frame={frame} /></AbsoluteFill>;
  }
};

const MEKANLAR: [KdMekan, string, string][] = [
  ["oda_bas", "A · Beyaz oda (uyanış)", "dikişsiz, kaynaksız soğuk ışık, gölgesiz; tek düğme"],
  ["oda_final", "A · Beyaz oda (final)", "altıgen petekler, yüzlerce düğme, sürgülü bölmeler"],
  ["ev", "B · Göbekli adamın salonu", "gece · TV mavisi + telefon ışığı"],
  ["market", "C · Çınar Market önü", "gece · sodyum turuncusu + vitrin beyazı"],
  ["takip", "D · Cadde: sürüş takip", "yol ve lambalar akar · motor önden"],
  ["kavsak", "D · Kavşak", "minibüsün çarptığı yer · trafik ışığı"],
  ["yayin", "E · Influencer odası", "ring ışık + pembe/mor LED · arkada karanlık kapı"],
  ["kask", "D · Kask içi yakın plan", "vizörde kayan şehir ışıkları"],
];

export const KDMekanlar: React.FC = () => {
  const frame = useCurrentFrame();
  const S = 0.6;
  return (
    <AbsoluteFill style={{ background: "#16121a" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 30, padding: "24px 40px 10px" }}>
        <div style={{ fontFamily: KD_BASLIK, fontWeight: 800, fontSize: 96, color: "#ff3a4a" }}>Kırmızı Düğme</div>
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: "#f4eef0" }}>Mekânlar ve ışık (taslak)</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: "0 24px" }}>
        {MEKANLAR.map(([m, ad, alt]) => (
          <div key={m} style={{ width: 1080 * S, display: "flex", flexDirection: "column" }}>
            <div style={{ width: 1080 * S, height: 1920 * S, overflow: "hidden", position: "relative", borderRadius: 18 }}>
              <div style={{ width: 1080, height: 1920, transform: `scale(${S})`, transformOrigin: "0 0", position: "absolute" }}>
                <KdMekanKare m={m} frame={frame} />
              </div>
            </div>
            <div style={{ ...lbl, color: "#fff", fontSize: 34, marginTop: 10 }}>{ad}</div>
            <div style={{ ...sub, color: "#c8bcc4", fontSize: 24, marginBottom: 18 }}>{alt}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
