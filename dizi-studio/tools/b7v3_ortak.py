"""7/24 B7 v3 ortak yardımcılar: kamera (taşma kırpması), anahtar kare kurucular, vuruş/JSON yazımı."""
import json, os

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30

# görünüm başına dünya sınırları (kadrajda siyah boşluk olmasın)
SINIR = {"kapi": (-380, 1560, 0, 1920), "ayna": (0, 1080, 0, 1920), "salon": (0, 1080, 0, 1920), "antre": (0, 1080, 0, 1920)}


def kirp(view, cx, cy, z, pay=8):
    x0, x1, y0, y1 = SINIR[view]
    hw, hh = 540 / z + pay, 960 / z + pay
    cx = min(max(cx, x0 + hw), x1 - hw)
    cy = min(max(cy, y0 + hh), y1 - hh)
    return [round(cx, 1), round(cy, 1), round(z, 3)]


class Kamera:
    """Kesmeli kamera: kes(t, cx, cy, z) yeni çekim; it(t, cx, cy, z) aynı çekimde yumuşak hareket."""

    def __init__(self, view):
        self.view, self.k = view, []

    def kes(self, t, cx, cy, z):
        if self.k:
            self.k.append([round(t - 0.004, 3)] + self.k[-1][1:])
        self.k.append([round(t, 3)] + kirp(self.view, cx, cy, z))
        return self

    def it(self, t, cx, cy, z):
        self.k.append([round(t, 3)] + kirp(self.view, cx, cy, z))
        return self


def man_yukle(*yollar):
    M = {}
    for y in yollar:
        p = f"{K}/public/voice/{y}/manifest.json"
        if os.path.exists(p):
            M.update(json.load(open(p)))
    return M


def b7(t0, cam, ort, **ek):
    p = {"t0": round(t0, 3), "cam": cam, **ort}
    p.update(ek)
    return {"kind": "b7_banyo", "text": [json.dumps(p, ensure_ascii=False)]}


def yaz(ep_id, baslik, sahneler, man_src, end_card=False):
    """sahneler: [{id, set, beats, ...}]; satır vuruşlarında _take → manifest anahtarına çevrilir."""
    man = {}
    for sc in sahneler:
        for i, b in enumerate(sc["beats"]):
            if b["type"] == "line":
                man[f"{sc['id']}_{i + 1:02d}"] = man_src[b.pop("_take")]
    os.makedirs(f"{K}/public/voice/{ep_id}", exist_ok=True)
    json.dump(man, open(f"{K}/public/voice/{ep_id}/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 7, "title": baslik, "endCard": end_card, "scenes": sahneler}
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)


def sirala(k):
    """anahtar kareleri zamana göre sırala (aynı zamanlı olanların sırası korunur)"""
    return sorted(k, key=lambda r: r[0])
