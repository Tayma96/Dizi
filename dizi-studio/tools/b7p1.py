"""7/24 B7 Parça 1 ("Deste") çekim senaryosu + replik manifesti.
Kullanım: python3 tools/b7p1.py  -> public/episodes/724-07.json, public/voice/724-07/manifest.json
Replikler kullanıcının metninden AYNEN (docs/diziler/724/bolumler.md "Bölüm 7, Parça 1").
"""
import json, os

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CK = f"{K}/public/voice/724-07/cekim"
ECE, ANNE = "ece_ev", "anne724"


def act(dur, shot, cast=None, **kw):
    b = {"type": "action", "dur": dur, "shot": shot}
    if cast:
        b["cast"] = cast
    b.update(kw)
    return b


def line(who, text, take, shot=None, cast=None, **kw):
    b = {"type": "line", "who": who, "text": text, "emotion": "notr", "gapAfter": 0.25, "_take": take}
    if shot:
        b["shot"] = shot
    if cast:
        b["cast"] = cast
    b.update(kw)
    return b


UYKU = {"emotion": "korkmus", "eyesClosed": 0.55, "sacDagin": True}
sahneler = [
    {"id": "a", "set": "banyo_kapi", "time": "gunduz", "title": "Deste", "look": "sicak", "transition": "kesme",
     "music": {"name": "muzik/banyo_komik", "volume": 0.2}, "ambience": {"name": "ortam/banyo_sabah", "volume": 0.25},
     "isaretler": {"anne_m": {"x": 420, "y": 1900, "size": 1300}, "ece_esik": {"x": 800, "y": 1660, "size": 1020}, "ece_yan": {"x": 700, "y": 1840, "size": 1240}},
     "cast": {ANNE: {"mark": "anne_m", "emotion": "notr", "bak": {"x": 0.7, "y": -0.05, "yaw": 0.4}}, ECE: {"mark": "ece_esik", "hidden": True, **UYKU}},
     "beats": [
         line(ANNE, "Eceee uyan kız artık", "A01a_01", {"type": "orta", "on": ANNE, "move": "yaklas"}, {ANNE: {"gesture": "elBelde"}}, etiket="18:00"),
         {"type": "insert", "kind": "cep_deste", "dur": 1.5},
         line(ANNE, "yuhh", "A02a_01", None, None, ekle={"kind": "para_say", "text": ["anne"]}),
         line(ANNE, "Eceeee", "A03b_01", {"type": "yakin", "on": ANNE, "move": "sarsinti"}, {ANNE: {"emotion": "ofkeli", "prop": "para", "gesture": "tutuyor", "bak": {"x": 0.7, "y": -0.05, "yaw": 0.45}}}),
         act(2.0, {"type": "genis", "move": "sabit"}, {ECE: {"hidden": False, "enter": "sag", "mark": "ece_esik", **UYKU, "gesture": "kafaKasi"}, ANNE: {"lookAt": ECE}}),
         line(ANNE, "nerden geldi bu paralar nasıl bi marketmiş lan o", "A04b_01", {"type": "iki", "on": ANNE, "with": ECE, "move": "yaklas"},
              {ANNE: {"emotion": "ofkeli", "gesture": "tutuyor", "prop": "para", "lookAt": ECE}, ECE: {"eyesClosed": 0.3, "lookAt": ANNE}}),
         line(ECE, "anneee dev gibi böcek vardı markette ölüyodummm", "E01a_01", {"type": "orta", "on": ECE, "move": "yaklas"},
              {ECE: {"emotion": "dehset", "eyesClosed": 0, "gesture": "ellerAcik", "gozSok": 0.6, "lookAt": ANNE}}),
         line(ANNE, "Böcek evde de var terliği vur geç", "A05a_01", {"type": "yakin", "on": ANNE, "move": "sabit"},
              {ANNE: {"emotion": "alayci", "gesture": "omuzSilk", "prop": "para"}}),
         line(ANNE, "para diyorum Ece para bu para ne alakaaaa?", "A06b_01", {"type": "orta", "on": ANNE, "move": "sarsinti"},
              {ANNE: {"emotion": "ofkeli", "gesture": "tutuyor", "prop": "para"}}),
         line(ECE, "çok mu ya o kadar ver bi bakıyım", "E02b_01", {"type": "iki", "on": ECE, "with": ANNE, "move": "yaklas"},
              {ECE: {"mark": "ece_yan", "yuruSure": 0.7, "emotion": "supheli", "gozSok": 0, "gesture": "uzat", "lookAt": ANNE}}),
         line(ECE, "yüz, iki yüz, yüz, iki yüz", "E03a_01", None, None, ekle={"kind": "para_say", "text": ["ece"]}),
         line(ECE, "Oha lan ne çok para", "E04b_01", {"type": "yakin", "on": ECE, "move": "yaklas"},
              {ECE: {"emotion": "mutlu", "gozSok": 1, "prop": "para", "gesture": "tutuyor"}}),
         line(ECE, "aauuv ah ah acıyo", "E05a_01", None, {ECE: {"emotion": "aci", "gozSok": 0}}, ekle={"kind": "kulak_cek"}),
         line(ANNE, "nerden geldi bu para?", "A07a_01", {"type": "iki", "on": ANNE, "with": ECE, "move": "yaklas"},
              {ANNE: {"emotion": "ofkeli", "gesture": "rest", "prop": None, "lookAt": ECE}, ECE: {"emotion": "aci", "prop": None, "gesture": "rest", "basEgim": 8}}),
         line(ECE, "şimdi olanları anlatırsam hem bana inanmaz hem de tekrar gitmeme izin vermez", "E06a_01", {"type": "yakin", "on": ECE, "move": "yaklas"},
              {ECE: {"emotion": "dusunceli", "basEgim": 0, "bakSira": [{"at": 0, "x": -0.6, "y": -0.2, "yaw": -0.2}, {"at": 2.4, "x": 0.5, "y": -0.25, "yaw": 0.15}, {"at": 4.2, "x": -0.6, "y": -0.2, "yaw": -0.2}]}},
              voiceover=True),
         line(ECE, "ama çok para lan", "E07b_01", {"type": "yakin", "on": ECE, "move": "sabit"}, {ECE: {"emotion": "mutlu", "bak": {"x": 0, "y": -0.35}}}),
         line(ANNE, "git elini yüzünü yıka bu paranın hesabını vereceksin bana!", "A08a_01", {"type": "orta", "on": ANNE, "move": "yaklas"},
              {ANNE: {"emotion": "ofkeli", "gesture": "elBelde", "lookAt": ECE}}),
         act(1.3, {"type": "genis", "move": "sabit"}, {ECE: {"mark": "anne_m", "yuruSure": 1.0, "emotion": "uzgun"}, ANNE: {"exit": "sag"}}),
     ]},
    {"id": "b", "set": "banyo_ayna", "time": "gunduz", "title": "Ayna", "look": "sicak", "transition": "kesme",
     "cast": {ECE: {"mark": "ece", "emotion": "dusunceli", "sacDagin": True, "bak": {"x": 0, "y": 0}}},
     "beats": [act(3.2, {"type": "orta", "on": ECE, "move": "yaklas"},
                   {ECE: {"bakSira": [{"at": 0, "x": 0, "y": 0}, {"at": 1.2, "x": -0.4, "y": -0.2, "yaw": -0.1}, {"at": 2.3, "x": 0, "y": 0}]}})]},
]


def main():
    kay = json.load(open(f"{CK}/manifest.json"))
    man = {}
    for s in sahneler:
        for i, b in enumerate(s["beats"]):
            if b["type"] == "line":
                man[f"{s['id']}_{i + 1:02d}"] = kay[b.pop("_take")]
    json.dump(man, open(f"{K}/public/voice/724-07/manifest.json", "w"), ensure_ascii=False, indent=1)
    ep = {"series": "724", "seriesTitle": "7/24", "episode": "724-07", "episodeNo": 7, "title": "Bölüm 7 · Parça 1", "endCard": False, "scenes": sahneler}
    json.dump(ep, open(f"{K}/public/episodes/724-07.json", "w"), ensure_ascii=False, indent=1)
    top = sum((man[f"{s['id']}_{i + 1:02d}"]["duration"] + b.get("gapAfter", 0.3)) if b["type"] == "line" else b["dur"] for s in sahneler for i, b in enumerate(s["beats"]))
    print(f"toplam ≈ {top:.1f} sn")


if __name__ == "__main__":
    main()
