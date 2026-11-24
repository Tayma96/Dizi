"""MakeHuman (CC0) temel modelinden karakter kurulumu, Blender içinde. Kod bizim; varlıklar CC0 (makehumancommunity/makehuman).
kur_gobekli() → (govde, iskelet, kiyafetler). Koordinat: MH (Y yukarı, Z ön, desimetre) → Blender (Z yukarı, -Y ön, metre).
"""
import bpy, json, math, os
from mathutils import Vector

VERI = os.path.join(os.path.dirname(os.path.abspath(__file__)), "varliklar", "mh", "makehuman", "data")


def _obj_oku():
    V, F, grp = [], [], None
    for satir in open(os.path.join(VERI, "3dobjs", "base.obj")):
        if satir.startswith("v "):
            x, y, z = map(float, satir.split()[1:4]); V.append([x, y, z])
        elif satir.startswith("g "):
            grp = satir.split()[1]
        elif satir.startswith("f ") and grp == "body":
            F.append([int(t.split("/")[0]) - 1 for t in satir.split()[1:]])
    return V, F


def _hedef(V, yol, w):
    if w == 0: return
    for satir in open(os.path.join(VERI, "targets", yol)):
        if not satir.strip() or satir[0] == "#": continue
        p = satir.split(); i = int(p[0])
        V[i][0] += w * float(p[1]); V[i][1] += w * float(p[2]); V[i][2] += w * float(p[3])


def _hedef_delta(n, yol, w):
    d = {}
    for satir in open(os.path.join(VERI, "targets", yol)):
        if not satir.strip() or satir[0] == "#": continue
        p = satir.split(); d[int(p[0])] = (w * float(p[1]), w * float(p[2]), w * float(p[3]))
    return d


def mh2b(v):
    return Vector((v[0] * 0.1, -v[2] * 0.1, v[1] * 0.1))


def kur(ad, hedefler, nefes_hedefi=None, nefes_w=0.0):
    V, F = _obj_oku()
    for yol, w in hedefler:
        _hedef(V, yol, w)
    # yalnız gövde köşeleri
    kullan = sorted({i for f in F for i in f})
    yeni = {o: n for n, o in enumerate(kullan)}
    me = bpy.data.meshes.new(ad)
    me.from_pydata([mh2b(V[i]) for i in kullan], [], [[yeni[i] for i in f] for f in F])
    me.update()
    ob = bpy.data.objects.new(ad, me); bpy.context.scene.collection.objects.link(ob)
    for p in me.polygons: p.use_smooth = True
    # nefes şekil anahtarı (göbek)
    if nefes_hedefi:
        ob.shape_key_add(name="Basis")
        sk = ob.shape_key_add(name="nefes")
        d = _hedef_delta(len(V), nefes_hedefi, nefes_w)
        for o, (dx, dy, dz) in d.items():
            if o in yeni:
                sk.data[yeni[o]].co = sk.data[yeni[o]].co + Vector((dx * 0.1, -dz * 0.1, dy * 0.1))
    # iskelet
    sk_ = json.load(open(os.path.join(VERI, "rigs", "default.mhskel")))
    J = {k: sum((mh2b(V[i]) for i in idx), Vector()) / len(idx) for k, idx in sk_["joints"].items()}
    arm = bpy.data.armatures.new(ad + "_iskelet"); ark = bpy.data.objects.new(ad + "_iskelet", arm)
    bpy.context.scene.collection.objects.link(ark)
    bpy.context.view_layer.objects.active = ark
    bpy.ops.object.mode_set(mode="EDIT")
    B = sk_["bones"]
    sira = []
    def ekle(b):
        if b in sira: return
        if B[b]["parent"]: ekle(B[b]["parent"])
        sira.append(b)
    for b in B: ekle(b)
    for b in sira:
        e = arm.edit_bones.new(b); e.head = J[B[b]["head"]]; e.tail = J[B[b]["tail"]]
        if (e.tail - e.head).length < 1e-4: e.tail = e.head + Vector((0, 0, 0.01))
        pl = sk_["planes"].get(B[b]["rotation_plane"]) if B[b].get("rotation_plane") else None
        if pl:
            a, b_, c = (J[x] for x in pl)
            n = (b_ - a).cross(c - b_)
            if n.length > 1e-6: e.align_roll(n.normalized())
        if B[b]["parent"]: e.parent = arm.edit_bones[B[b]["parent"]]
    bpy.ops.object.mode_set(mode="OBJECT")
    # ağırlıklar
    W = json.load(open(os.path.join(VERI, "rigs", "default_weights.mhw")))["weights"]
    for b, liste in W.items():
        vg = ob.vertex_groups.new(name=b)
        for i, w in liste:
            if i in yeni: vg.add([yeni[i]], w, "REPLACE")
    ob.parent = ark
    mod = ob.modifiers.new("iskelet", "ARMATURE"); mod.object = ark; mod.use_deform_preserve_volume = True
    return ob, ark, J
