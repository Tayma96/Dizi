import React from "react";
import { OUT } from "./face";
import type { Look } from "./types";

const SW = 4;

/** Hair behind the head/body. `dx` shifts with head yaw. */
export const HairBack: React.FC<{ look: Look; dx: number; sway: number }> = ({ look, dx, sway }) => {
  const { color, shade, style } = look.hair;
  const p = { fill: color, stroke: OUT, strokeWidth: SW, strokeLinejoin: "round" as const };
  switch (style) {
    case "longStraight":
      return (
        <g>
          <path d={`M ${106 + dx} 170 C 100 300 104 420 ${112 + sway} 540 L ${288 + sway} 540 C 296 420 300 300 ${294 + dx} 170 C 282 66 118 66 ${106 + dx} 170 Z`} {...p} />
          <path d={`M ${150 + sway} 530 L ${150} 380 M ${250 + sway} 530 L 250 380`} stroke={shade} strokeWidth={5} />
        </g>
      );
    case "longWavy":
      return (
        <g>
          <path
            d={`M ${108 + dx} 170 C 92 280 96 380 ${110 + sway} 470 C ${100 + sway} 520 ${150 + sway} 545 200 538 C ${250 + sway} 545 ${300 + sway} 520 ${290 + sway} 470 C 304 380 308 280 ${292 + dx} 170 C 280 70 120 70 ${108 + dx} 170 Z`}
            {...p}
          />
          <path d={`M 130 380 q 10 40 -4 80 M 270 380 q -10 40 4 80`} stroke={shade} strokeWidth={5} fill="none" />
        </g>
      );
    case "ponytail":
      return (
        <path
          d={`M ${270 + dx} 120 C ${330 + dx} 140 ${350 + sway} 250 ${330 + sway * 1.5} 420 C ${320 + sway} 450 ${300 + sway} 430 ${300 + sway} 400 C ${310 + sway} 300 ${300 + dx} 200 ${262 + dx} 150 Z`}
          {...p}
        />
      );
    case "bob":
      return <path d={`M ${100 + dx} 180 C 92 240 96 290 ${112 + sway * 0.3} 318 C 150 332 250 332 ${288 + sway * 0.3} 318 C 304 290 308 240 ${300 + dx} 180 C 290 70 110 70 ${100 + dx} 180 Z`} {...p} />;
    case "curly":
      return (
        <g>
          {[
            [110, 150, 50],
            [290, 150, 50],
            [100, 230, 46],
            [300, 230, 46],
            [112, 300, 40],
            [288, 300, 40],
            [150, 330, 34],
            [250, 330, 34],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x + dx} cy={y} r={r} {...p} />
          ))}
        </g>
      );
    case "braids":
      return (
        <g>
          {[0, 1].map((side) => {
            const x = side ? 292 : 108;
            return (
              <g key={side}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <ellipse key={i} cx={x + dx + (side ? 6 : -6) + sway * (i / 5)} cy={250 + i * 40} rx={20 - i * 1.5} ry={24} {...p} />
                ))}
                <circle cx={x + dx + (side ? 6 : -6) + sway} cy={460} r={9} fill={look.outfit.accent ?? "#e05a6a"} stroke={OUT} strokeWidth={3} />
              </g>
            );
          })}
        </g>
      );
    case "perma":
      return (
        <g>
          {[[108, 204], [292, 204], [112, 236], [288, 236]].map(([x, y], i) => <circle key={i} cx={x + dx} cy={y} r={18} {...p} />)}
        </g>
      );
    case "perdeli": {
      // uzun katlı saç: uçlar yumuşak katlarla biter, aşağı doğru uç rengine (hair.uc) geçer
      const gid = `perde-${(color + (look.hair.uc ?? "")).replace(/[^a-zA-Z0-9]/g, "")}`;
      return (
        <g>
          <defs>
            <linearGradient id={gid} x1="0" y1="330" x2="0" y2="560" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={color} />
              <stop offset="0.45" stopColor={color} />
              <stop offset="1" stopColor={look.hair.uc ?? shade} />
            </linearGradient>
          </defs>
          <path
            d={`M ${106 + dx} 170 C 96 300 100 420 ${108 + sway} 512 Q ${126 + sway} 556 ${150 + sway} 536 Q ${172 + sway} 574 ${200 + sway} 546 Q ${228 + sway} 574 ${250 + sway} 536 Q ${274 + sway} 556 ${292 + sway} 512 C 300 420 304 300 ${294 + dx} 170 C 282 64 118 64 ${106 + dx} 170 Z`}
            fill={`url(#${gid})`}
            stroke={OUT}
            strokeWidth={SW}
            strokeLinejoin="round"
          />
          <path d={`M ${138 + sway * 0.6} 400 q -6 60 ${8 + sway * 0.4} 120 M ${262 + sway * 0.6} 400 q 6 60 ${-8 + sway * 0.4} 120 M ${200 + sway * 0.8} 430 q -4 50 0 100`} stroke={shade} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
        </g>
      );
    }
    case "hijab":
      return (
        <path
          d={`M ${96 + dx} 190 C 90 90 140 52 200 52 C 260 52 310 90 ${304 + dx} 190 C 310 280 320 330 340 360 C 300 380 100 380 60 360 C 80 330 90 280 ${96 + dx} 190 Z`}
          fill={color}
          stroke={OUT}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
      );
    default:
      return null;
  }
};

/** Hair in front of the face. */
export const HairFront: React.FC<{ look: Look; dx: number }> = ({ look, dx }) => {
  const { color, shade, style } = look.hair;
  const p = { fill: color, stroke: OUT, strokeWidth: SW, strokeLinejoin: "round" as const };
  const strand = (d: string, w = 5) => <path d={d} stroke={shade} strokeWidth={w} fill="none" strokeLinecap="round" />;
  switch (style) {
    case "longStraight":
      return (
        <g>
          <path d={`M ${112 + dx} 210 C 104 110 150 82 ${200 + dx} 84 C 250 82 296 110 ${288 + dx} 210 C 268 150 236 110 ${200 + dx} 104 C 164 110 132 150 ${112 + dx} 210 Z`} {...p} />
          {strand(`M ${200 + dx} 88 L ${200 + dx} 106`, 4)}
          {strand(`M 116 220 C 110 280 112 330 110 380`)}
          {strand(`M 284 220 C 290 280 288 330 290 380`)}
        </g>
      );
    case "longWavy":
      return (
        <g>
          <path d={`M ${112 + dx} 196 C 108 110 160 82 ${205 + dx} 84 C 258 84 296 120 ${290 + dx} 200 C 276 160 250 128 ${214 + dx} 118 C 196 150 150 170 ${112 + dx} 196 Z`} {...p} />
          {strand(`M ${230 + dx} 104 C 252 116 270 140 278 168`)}
          {strand(`M ${180 + dx} 106 C 160 120 140 140 126 168`)}
          {strand(`M 112 196 C 104 260 112 320 104 380`)}
          {strand(`M 290 200 C 298 260 290 320 298 380`)}
        </g>
      );
    case "ponytail":
      return (
        <g>
          <path d={`M ${112 + dx} 190 C 104 104 156 78 ${202 + dx} 80 C 254 80 298 108 ${290 + dx} 190 C 280 150 250 124 ${200 + dx} 118 C 160 120 128 146 ${112 + dx} 190 Z`} {...p} />
          {strand(`M ${150 + dx} 100 Q ${200 + dx} 90 ${260 + dx} 110`)}
          <rect x={262 + dx} y={112} width={22} height={18} rx={6} fill={look.outfit.accent ?? "#e05a6a"} stroke={OUT} strokeWidth={3} />
        </g>
      );
    case "bun":
      return (
        <g>
          <circle cx={200 + dx} cy={64} r={44} {...p} />
          {strand(`M ${172 + dx} 60 Q ${200 + dx} 40 ${228 + dx} 62`)}
          <path d={`M ${112 + dx} 196 C 104 106 156 80 ${202 + dx} 82 C 254 82 298 108 ${290 + dx} 196 C 280 150 250 120 ${200 + dx} 116 C 160 118 128 146 ${112 + dx} 196 Z`} {...p} />
        </g>
      );
    case "bob":
      return (
        <g>
          <path d={`M ${108 + dx} 214 C 100 110 160 84 ${204 + dx} 86 C 262 86 302 124 ${292 + dx} 214 C 270 150 236 132 ${200 + dx} 128 C 168 132 130 150 ${108 + dx} 214 Z`} {...p} />
          {strand(`M ${200 + dx} 100 C 180 112 168 124 160 140`)}
        </g>
      );
    case "curly":
      return (
        <g>
          {[
            [130, 110, 40],
            [175, 88, 42],
            [225, 88, 42],
            [270, 110, 40],
            [118, 160, 30],
            [282, 160, 30],
            [200, 108, 34],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x + dx} cy={y} r={r} {...p} />
          ))}
        </g>
      );
    case "braids":
      return (
        <g>
          <path d={`M ${112 + dx} 200 C 104 106 156 80 ${202 + dx} 82 C 254 82 298 108 ${290 + dx} 200 C 284 150 260 120 ${202 + dx} 116 C 150 120 120 150 ${112 + dx} 200 Z`} {...p} />
          {strand(`M ${202 + dx} 86 L ${202 + dx} 114`, 4)}
        </g>
      );
    case "perdeli": {
      // orta ayrım + perde kakül: iki yandan yüzü çerçeveleyen kavisli tutamlar; sağda iki yıldız toka
      const L = `M ${200 + dx} 86 C ${150 + dx} 86 ${108 + dx} 118 ${108 + dx} 204 C ${108 + dx} 262 112 300 116 352 C 124 300 126 236 ${140 + dx} 190 C ${152 + dx} 150 ${174 + dx} 118 ${200 + dx} 100 Z`;
      const R = `M ${200 + dx} 86 C ${250 + dx} 86 ${292 + dx} 118 ${292 + dx} 204 C ${292 + dx} 262 288 300 284 352 C 276 300 274 236 ${260 + dx} 190 C ${248 + dx} 150 ${226 + dx} 118 ${200 + dx} 100 Z`;
      const star = (x: number, y: number, c: string, r = 9) => (
        <path d={`M ${x} ${y - r} L ${x + r * 0.3} ${y - r * 0.3} L ${x + r} ${y} L ${x + r * 0.3} ${y + r * 0.3} L ${x} ${y + r} L ${x - r * 0.3} ${y + r * 0.3} L ${x - r} ${y} L ${x - r * 0.3} ${y - r * 0.3} Z`} fill={c} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
      );
      return (
        <g>
          <path d={L} {...p} />
          <path d={R} {...p} />
          {strand(`M ${186 + dx} 98 C ${160 + dx} 124 ${140 + dx} 160 ${128 + dx} 220`, 4)}
          {strand(`M ${214 + dx} 98 C ${240 + dx} 124 ${260 + dx} 160 ${272 + dx} 220`, 4)}
          <path d={`M 118 300 L 116 350 M 282 300 L 284 350`} stroke={look.hair.uc ?? shade} strokeWidth={7} strokeLinecap="round" />
          {look.kalpToka ? (
            [[260, 126, 12], [280, 154, 9]].map(([x, y, r], i) => (
              <path key={i} d={`M ${x + dx} ${y + r * 0.9} C ${x - r * 1.6 + dx} ${y - r * 0.2} ${x - r * 0.6 + dx} ${y - r * 1.4} ${x + dx} ${y - r * 0.5} C ${x + r * 0.6 + dx} ${y - r * 1.4} ${x + r * 1.6 + dx} ${y - r * 0.2} ${x + dx} ${y + r * 0.9} Z`} fill={look.kalpToka} stroke={OUT} strokeWidth={2.5} strokeLinejoin="round" />
            ))
          ) : (
            <>
              {star(262 + dx, 128, "#ffd84a")}
              {star(280 + dx, 152, "#ff9cc8", 7)}
            </>
          )}
        </g>
      );
    }
    case "yagli":
      // seyrek, yağlı, dağınık: tepe açılmış (kafa derisi parlıyor), alına yapışık üç tutam, yanlarda kabarık karışık tutamlar
      return (
        <g>
          <path d={`M ${108 + dx} 214 C 98 170 102 132 ${124 + dx} 112 Q ${110 + dx} 96 ${134 + dx} 96 L ${150 + dx} 128 C 132 146 120 176 ${116 + dx} 214 Z`} {...p} />
          <path d={`M ${292 + dx} 214 C 302 170 298 132 ${276 + dx} 112 Q ${292 + dx} 94 ${266 + dx} 96 L ${250 + dx} 128 C 268 146 280 176 ${284 + dx} 214 Z`} {...p} />
          <path d={`M ${104 + dx} 176 q -14 2 -14 -12 M ${296 + dx} 176 q 14 2 14 -12 M ${110 + dx} 140 q -12 -4 -8 -16`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
          {[[150, 96, 136, 150], [176, 88, 170, 158], [204, 86, 208, 150], [232, 90, 248, 146]].map(([x0, y0, x1, y1], i) => (
            <path key={i} d={`M ${x0 + dx} ${y0} Q ${(x0 + x1) / 2 + (i - 1.5) * 6 + dx} ${(y0 + y1) / 2 - 6} ${x1 + dx} ${y1}`} stroke={color} strokeWidth={7 - i % 2 * 2} fill="none" strokeLinecap="round" />
          ))}
          <path d={`M ${186 + dx} 92 Q ${196 + dx} 70 ${214 + dx} 64`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
          {/* yağ parlaması */}
          <path d={`M ${176 + dx} 100 Q ${174 + dx} 122 ${172 + dx} 140 M ${206 + dx} 96 Q ${207 + dx} 116 ${208 + dx} 134`} stroke={shade} strokeWidth={2.5} fill="none" opacity={0.9} />
          <ellipse cx={192 + dx} cy={104} rx={18} ry={6} fill="#ffffff" opacity={0.35} />
        </g>
      );
    case "perma":
      // kısa, sıkı perma: başı saran küçük bukleler
      return (
        <g>
          {[[122, 150], [116, 186], [130, 118], [154, 96], [182, 86], [212, 84], [242, 92], [268, 112], [282, 146], [286, 184], [168, 110], [198, 102], [228, 106]].map(([x, y], i) => (
            <circle key={i} cx={x + dx} cy={y} r={i > 9 ? 16 : 20} {...p} />
          ))}
          {[[154, 96], [212, 84], [268, 112]].map(([x, y], i) => <path key={`s${i}`} d={`M ${x - 8 + dx} ${y} q 8 -8 16 0`} stroke={shade} strokeWidth={3} fill="none" />)}
        </g>
      );
    case "daginik":
      // yataktan kalkmış: yuvarlak, düzensiz tutamlar, tepede kalkık bir "anten" tutam, kulak üstünde taşan perçemler
      return (
        <g>
          <path
            d={`M ${112 + dx} 200 C 100 150 106 110 ${130 + dx} 98 Q ${112 + dx} 72 ${148 + dx} 80 Q ${156 + dx} 50 ${186 + dx} 70 Q ${206 + dx} 46 ${224 + dx} 70 Q ${254 + dx} 54 ${260 + dx} 86 Q ${294 + dx} 84 ${280 + dx} 114 C 298 136 296 172 ${290 + dx} 200 C 284 166 266 146 ${244 + dx} 138 Q ${232 + dx} 156 ${212 + dx} 146 Q ${190 + dx} 160 ${172 + dx} 142 Q ${150 + dx} 152 ${138 + dx} 150 C 124 162 116 180 ${112 + dx} 200 Z`}
            {...p}
          />
          <path d={`M ${108 + dx} 176 q -16 -6 -12 -22 q 10 4 16 6 M ${292 + dx} 176 q 16 -6 12 -22 q -10 4 -16 6`} {...p} strokeWidth={3} />
          <path d={`M ${204 + dx} 58 Q ${196 + dx} 26 ${222 + dx} 18 Q ${212 + dx} 36 ${214 + dx} 60`} {...p} strokeWidth={3.5} />
          {strand(`M ${160 + dx} 96 Q ${190 + dx} 88 ${214 + dx} 100`, 4)}
          {strand(`M ${232 + dx} 92 Q ${250 + dx} 100 ${262 + dx} 116`, 3.5)}
        </g>
      );
    case "shortMale":
      return (
        <g>
          <path d={`M ${112 + dx} 196 C 100 120 140 80 ${200 + dx} 80 C 262 80 302 118 ${290 + dx} 196 C 284 160 270 140 ${250 + dx} 132 C 230 146 190 150 ${150 + dx} 138 C 130 150 118 170 ${112 + dx} 196 Z`} {...p} />
          {strand(`M ${170 + dx} 96 C 190 104 220 104 ${240 + dx} 98`, 4)}
        </g>
      );
    case "spiky":
      return (
        <path
          d={`M ${112 + dx} 190 L ${104 + dx} 120 L ${140 + dx} 130 L ${142 + dx} 70 L ${180 + dx} 100 L ${200 + dx} 50 L ${222 + dx} 100 L ${262 + dx} 66 L ${262 + dx} 126 L ${300 + dx} 116 L ${290 + dx} 190 C 270 150 240 140 ${200 + dx} 140 C 160 140 130 150 ${112 + dx} 190 Z`}
          {...p}
        />
      );
    case "slick":
      return (
        <g>
          <path d={`M ${114 + dx} 186 C 104 104 152 74 ${206 + dx} 74 C 266 74 300 110 ${288 + dx} 186 C 284 140 266 116 ${236 + dx} 110 C 200 104 160 112 ${130 + dx} 140 C 122 156 116 170 ${114 + dx} 186 Z`} {...p} />
          {strand(`M ${150 + dx} 100 Q ${210 + dx} 80 ${270 + dx} 120`, 4)}
          {strand(`M ${160 + dx} 118 Q ${215 + dx} 98 ${276 + dx} 140`, 3)}
        </g>
      );
    case "buzz":
      return <path d={`M ${116 + dx} 170 C 112 104 152 84 ${200 + dx} 84 C 250 84 290 104 ${284 + dx} 170 C 270 130 240 118 ${200 + dx} 118 C 160 118 130 130 ${116 + dx} 170 Z`} fill={color} opacity={0.85} stroke={OUT} strokeWidth={3} />;
    case "balding":
      return (
        <g>
          <path d={`M ${112 + dx} 200 C 108 160 112 140 ${124 + dx} 128 L ${140 + dx} 170 C 128 180 118 190 ${112 + dx} 200 Z`} {...p} />
          <path d={`M ${288 + dx} 200 C 292 160 288 140 ${276 + dx} 128 L ${260 + dx} 170 C 272 180 282 190 ${288 + dx} 200 Z`} {...p} />
          <path d={`M ${170 + dx} 112 Q ${190 + dx} 104 ${210 + dx} 110`} stroke="#fff" strokeOpacity={0.5} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "bald":
      return <path d={`M ${165 + dx} 112 Q ${190 + dx} 100 ${215 + dx} 108`} stroke="#fff" strokeOpacity={0.5} strokeWidth={7} fill="none" strokeLinecap="round" />;
    case "hijab":
      return (
        <g>
          {/* frame around the face */}
          <path
            d={`M ${200 + dx} 60 C 130 60 96 110 ${100 + dx} 190 C 102 260 120 300 ${150 + dx} 330 C 180 350 220 350 ${250 + dx} 330 C 280 300 298 260 ${300 + dx} 190 C 304 110 270 60 ${200 + dx} 60 Z M ${200 + dx} 100 C 150 100 124 130 ${124 + dx} 180 C 124 250 150 300 ${200 + dx} 306 C 250 300 276 250 ${276 + dx} 180 C 276 130 250 100 ${200 + dx} 100 Z`}
            fill={color}
            fillRule="evenodd"
            stroke={OUT}
            strokeWidth={SW}
          />
          <path d={`M ${150 + dx} 330 Q ${200 + dx} 370 ${250 + dx} 330`} stroke={shade} strokeWidth={6} fill="none" />
          <path d={`M ${130 + dx} 120 Q ${200 + dx} 86 ${270 + dx} 120`} stroke={shade} strokeWidth={5} fill="none" />
          {look.oya ? (
            <g>
              {/* yazma deseni: küçük çiçekler */}
              {[[118, 150], [112, 220], [126, 285], [282, 150], [288, 220], [274, 285], [160, 76], [240, 76], [200, 68]].map(([x, y], i) => (
                <g key={i}>
                  <circle cx={x + dx} cy={y} r={4} fill={look.oya} opacity={0.75} />
                  <circle cx={x + dx} cy={y} r={2} fill="#fff8e0" />
                </g>
              ))}
              {/* yüz çevresinde oya: alın hizasında boncuk dizisi */}
              {new Array(13).fill(0).map((_, i) => {
                const a = Math.PI * (1.08 + i * 0.065);
                return <circle key={`o${i}`} cx={200 + dx + Math.cos(a) * 80} cy={186 + Math.sin(a) * 92} r={3} fill={look.oya} stroke={OUT} strokeWidth={1} />;
              })}
            </g>
          ) : null}
        </g>
      );
    default:
      return null;
  }
};
