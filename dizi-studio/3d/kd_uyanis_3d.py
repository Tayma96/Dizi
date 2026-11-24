"""Kırmızı Düğme · 3D kalite testi: beyaz odada uyanış (göbekli adam horluyor), 10 sn.
Blender 4.0 (GPL; çıktı bizim). Varlıkların hepsi bu betikte kodla üretilir (dış varlık yok).
Çalıştırma: xvfb-run -a blender -b --python kd_uyanis_3d.py -- [--kare N] [--cikis yol]
"""
import bpy, math, sys, json, os
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
KARE = int(argv[argv.index("--kare") + 1]) if "--kare" in argv else None
CIKIS = argv[argv.index("--cikis") + 1] if "--cikis" in argv else "/tmp/kd3d/kare_"
OLCEK = float(argv[argv.index("--olcek") + 1]) if "--olcek" in argv else 1.0
BURADA = os.path.dirname(os.path.abspath(__file__))
ZARF = json.load(open(os.path.join(BURADA, "horlama_zarf.json")))  # 30 fps kare başına 0..1 (10 sn)

# ------------------------------------------------------------------ sahne temizliği
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE"
sc.render.resolution_x = int(1080 * OLCEK)
sc.render.resolution_y = int(1920 * OLCEK)
sc.render.fps = 30
sc.frame_start, sc.frame_end = 1, 300
ee = sc.eevee
ee.taa_render_samples = 24
ee.use_gtao = True; ee.gtao_distance = 0.6; ee.gtao_factor = 1.2
ee.use_bloom = True; ee.bloom_threshold = 1.2; ee.bloom_intensity = 0.06; ee.bloom_radius = 5
ee.use_soft_shadows = True; ee.shadow_cube_size = "2048"; ee.shadow_cascade_size = "2048"
ee.use_ssr = True
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - Medium High Contrast"
sc.view_settings.exposure = -0.15

def mat(ad, renk, rough=0.6, sss=0.0, emis=None, emis_g=0.0, sheen=0.0):
    m = bpy.data.materials.new(ad); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*renk, 1)
    b.inputs["Roughness"].default_value = rough
    if sss:
        b.inputs["Subsurface Weight"].default_value = sss
        b.inputs["Subsurface Radius"].default_value = (0.9, 0.35, 0.2)
        b.inputs["Subsurface Scale"].default_value = 0.03
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
    if emis:
        b.inputs["Emission Color"].default_value = (*emis, 1)
        b.inputs["Emission Strength"].default_value = emis_g
    return m

def srgb(h):
    h = h.lstrip("#"); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)

M_TEN = mat("ten", srgb("e2b8a2"), 0.55, sss=0.25)
M_ATLET = mat("atlet", srgb("e9dfc2"), 0.85, sheen=0.3)
M_LEKE = mat("leke", srgb("c9ae73"), 0.9)
M_ESOF = mat("esofman", srgb("2f3547"), 0.75, sheen=0.4)
M_SERIT = mat("serit", srgb("c4c8ce"), 0.6)
M_TERLIK = mat("terlik", srgb("2f7fd0"), 0.4)
M_SAC = mat("sac", srgb("221a16"), 0.35)
M_GOZ = mat("goz_kapak", srgb("d2a08c"), 0.6, sss=0.2)
M_AGIZ = mat("agiz_ic", srgb("3a1216"), 0.5)
M_DIL = mat("dil", srgb("c45a64"), 0.4)
M_SAKAL = mat("sakal", srgb("3a2c26"), 0.9)
M_BEYAZ = mat("oda", srgb("f2f4f6"), 0.45)
M_KAIDE = mat("kaide", srgb("fbfcfd"), 0.25)
M_DUGME = mat("dugme", srgb("e0101e"), 0.25, emis=srgb("ff2030"), emis_g=0.6)
M_LCD = mat("lcd", srgb("101114"), 0.3)
M_LCD_YAZI = mat("lcd_yazi", srgb("ff3030"), 0.4, emis=srgb("ff2a2a"), emis_g=4.0)

# ------------------------------------------------------------------ oda (dikişsiz, köşeleri yuvarlatılmış)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.8))
oda = bpy.context.object; oda.scale = (8, 12, 3.6); oda.name = "oda"
bev = oda.modifiers.new("bev", "BEVEL"); bev.width = 0.35; bev.segments = 6
oda.data.materials.append(M_BEYAZ)
bpy.ops.object.shade_smooth()
for p in oda.data.polygons:  # içeriden görünsün
    pass
oda.data.flip_normals() if hasattr(oda.data, "flip_normals") else None

# kaide + düğme
bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=1.0, location=(0.0, 2.2, 0.5), vertices=64)
kaide = bpy.context.object; kaide.data.materials.append(M_KAIDE); bpy.ops.object.shade_smooth()
b2 = kaide.modifiers.new("b", "BEVEL"); b2.width = 0.02; b2.segments = 4
bpy.ops.mesh.primitive_cylinder_add(radius=0.11, depth=0.05, location=(0.0, 2.2, 1.03), vertices=64)
d1 = bpy.context.object; d1.data.materials.append(M_DUGME); bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(0.0, 2.2, 1.05), segments=48, ring_count=24)
d2 = bpy.context.object; d2.scale = (1, 1, 0.42); d2.data.materials.append(M_DUGME); bpy.ops.object.shade_smooth()
bpy.ops.mesh.primitive_cube_add(size=1, location=(0.0, 1.89, 0.78))
lcd = bpy.context.object; lcd.scale = (0.14, 0.02, 0.06); lcd.data.materials.append(M_LCD)
bpy.ops.object.text_add(location=(0.0, 1.875, 0.765), rotation=(math.pi / 2, 0, 0))
yazi = bpy.context.object; yazi.data.body = "001"; yazi.data.size = 0.07; yazi.data.align_x = "CENTER"
yazi.data.materials.append(M_LCD_YAZI)

# ------------------------------------------------------------------ göbekli adam (ayakta kurulur, sonra yatırılır)
# deri iskeleti (skin modifier): (konum, yarıçap)
N = {
    "pelvis": ((0, 0, 0.95), 0.21), "gobek": ((0, -0.12, 1.12), 0.31), "gogus": ((0, -0.02, 1.33), 0.25),
    "boyun": ((0, 0, 1.50), 0.115),
    "omuzL": ((0.25, 0, 1.40), 0.105), "dirsekL": ((0.36, 0.02, 1.14), 0.078), "bilekL": ((0.40, -0.02, 0.92), 0.052),
    "omuzR": ((-0.25, 0, 1.40), 0.105), "dirsekR": ((-0.36, 0.02, 1.14), 0.078), "bilekR": ((-0.40, -0.02, 0.92), 0.052),
    "kalcaL": ((0.13, 0, 0.90), 0.135), "dizL": ((0.14, -0.01, 0.52), 0.092), "ayakL": ((0.14, 0, 0.11), 0.062),
    "kalcaR": ((-0.13, 0, 0.90), 0.135), "dizR": ((-0.14, -0.01, 0.52), 0.092), "ayakR": ((-0.14, 0, 0.11), 0.062),
}
E = [("pelvis", "gobek"), ("gobek", "gogus"), ("gogus", "boyun"), ("gogus", "omuzL"), ("omuzL", "dirsekL"), ("dirsekL", "bilekL"),
     ("gogus", "omuzR"), ("omuzR", "dirsekR"), ("dirsekR", "bilekR"), ("pelvis", "kalcaL"), ("kalcaL", "dizL"), ("dizL", "ayakL"),
     ("pelvis", "kalcaR"), ("kalcaR", "dizR"), ("dizR", "ayakR")]
ad = list(N)
me = bpy.data.meshes.new("govde")
me.from_pydata([N[a][0] for a in ad], [(ad.index(a), ad.index(b)) for a, b in E], [])
govde = bpy.data.objects.new("govde", me); sc.collection.objects.link(govde)
bpy.context.view_layer.objects.active = govde; govde.select_set(True)
sk = govde.modifiers.new("skin", "SKIN"); sk.branch_smoothing = 0.8
for i, a in enumerate(ad):
    r = N[a][1]
    sv = govde.data.skin_vertices[0].data[i]
    sv.radius = (r, r * (1.15 if a in ("gobek", "gogus", "pelvis") else 1.0))
govde.data.skin_vertices[0].data[ad.index("pelvis")].use_root = True
sub = govde.modifiers.new("sub", "SUBSURF"); sub.levels = 3; sub.render_levels = 3
bpy.ops.object.modifier_apply(modifier="skin"); bpy.ops.object.modifier_apply(modifier="sub")
bpy.ops.object.shade_smooth()
# malzemeler: konuma göre bölgeler
for m_ in (M_TEN, M_ATLET, M_ESOF, M_TERLIK):
    govde.data.materials.append(m_)
for p in govde.data.polygons:
    c = p.center
    if c.z < 0.16:
        p.material_index = 3  # terlik/ayak
    elif c.z < 0.97 or (c.z < 1.03 and c.y > -0.30):
        p.material_index = 2  # eşofman
    elif c.z < 1.46 and abs(c.x) < 0.245 and not (c.z < 1.06 and c.y < -0.30):
        p.material_index = 1  # atlet (alt göbek dışarıda)
    else:
        p.material_index = 0  # ten

def kure(ad_, loc, olc, malz, seg=48):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=loc, segments=seg, ring_count=seg // 2)
    o = bpy.context.object; o.name = ad_; o.scale = olc; o.data.materials.append(malz); bpy.ops.object.shade_smooth()
    return o

bas = kure("bas", (0, -0.01, 1.70), (0.135, 0.15, 0.155), M_TEN)
gidi = kure("gidi", (0, -0.08, 1.58), (0.12, 0.09, 0.07), M_TEN)
burun = kure("burun", (0, -0.155, 1.69), (0.035, 0.04, 0.04), M_TEN)
kulakL = kure("kulakL", (0.135, 0, 1.69), (0.02, 0.04, 0.05), M_TEN)
kulakR = kure("kulakR", (-0.135, 0, 1.69), (0.02, 0.04, 0.05), M_TEN)
gozL = kure("gozL", (0.05, -0.13, 1.735), (0.032, 0.02, 0.016), M_GOZ)   # kapalı göz kapağı
gozR = kure("gozR", (-0.05, -0.13, 1.735), (0.032, 0.02, 0.016), M_GOZ)
agiz = kure("agiz", (0, -0.145, 1.625), (0.035, 0.02, 0.022), M_AGIZ)
dil = kure("dil", (0, -0.15, 1.617), (0.025, 0.012, 0.01), M_DIL)
elL = kure("elL", (0.41, -0.03, 0.86), (0.055, 0.04, 0.07), M_TEN)
elR = kure("elR", (-0.41, -0.03, 0.86), (0.055, 0.04, 0.07), M_TEN)
# sakal gölgesi: çene ve gıdıyı saran ince, koyu, yarı saydam kabuk
sakal = kure("sakal", (0, -0.05, 1.62), (0.14, 0.13, 0.09), M_SAKAL)
M_SAKAL.blend_method = "BLEND"; M_SAKAL.node_tree.nodes["Principled BSDF"].inputs["Alpha"].default_value = 0.35
# seyrek, yağlı saç: yan tutamlar + tepede birkaç yatık tel
sac = []
for sx in (1, -1):
    sac.append(kure(f"sacyan{sx}", (sx * 0.12, 0.04, 1.76), (0.03, 0.08, 0.05), M_SAC))
for i, ox in enumerate((-0.04, 0.0, 0.04)):
    bpy.ops.curve.primitive_bezier_curve_add(location=(0, 0, 0))
    cv = bpy.context.object; cv.data.bevel_depth = 0.006; cv.data.bevel_resolution = 2
    pts = cv.data.splines[0].bezier_points
    pts[0].co = (0.12, -0.04 + ox, 1.78); pts[0].handle_left = pts[0].co; pts[0].handle_right = (0.08, -0.06 + ox, 1.86)
    pts[1].co = (-0.12, 0.02 + ox, 1.80); pts[1].handle_right = pts[1].co; pts[1].handle_left = (-0.06, -0.02 + ox, 1.87)
    cv.data.materials.append(M_SAC); sac.append(cv)
# atletin üstünde lekeler
lekeler = [kure(f"leke{i}", p, (0.05, 0.012, 0.04), M_LEKE, 24) for i, p in enumerate(((0.08, -0.39, 1.16), (-0.1, -0.36, 1.26)))]

# ------------------------------------------------------------------ iskelet
arm = bpy.data.armatures.new("iskelet"); ark = bpy.data.objects.new("iskelet", arm); sc.collection.objects.link(ark)
bpy.context.view_layer.objects.active = ark; bpy.ops.object.mode_set(mode="EDIT")
def kemik(ad_, bas_, son, ebeveyn=None):
    b = arm.edit_bones.new(ad_); b.head = bas_; b.tail = son
    if ebeveyn: b.parent = arm.edit_bones[ebeveyn]; b.use_connect = False
    return b
kemik("kok", (0, 0, 0.95), (0, 0, 1.05))
kemik("gobek", (0, -0.02, 1.0), (0, -0.30, 1.12), "kok")
kemik("omurga", (0, 0, 1.05), (0, 0, 1.32), "kok")
kemik("boyun", (0, 0, 1.32), (0, 0, 1.55), "omurga")
kemik("bas", (0, 0, 1.55), (0, 0, 1.85), "boyun")
kemik("cene", (0, -0.03, 1.66), (0, -0.14, 1.61), "bas")
for s, sx in (("L", 1), ("R", -1)):
    kemik(f"omuz{s}", (sx * 0.08, 0, 1.40), (sx * 0.25, 0, 1.40), "omurga")
    kemik(f"kol{s}", (sx * 0.25, 0, 1.40), (sx * 0.36, 0.02, 1.14), f"omuz{s}")
    kemik(f"onkol{s}", (sx * 0.36, 0.02, 1.14), (sx * 0.40, -0.02, 0.92), f"kol{s}")
    kemik(f"el{s}", (sx * 0.40, -0.02, 0.92), (sx * 0.41, -0.03, 0.80), f"onkol{s}")
    kemik(f"uyluk{s}", (sx * 0.13, 0, 0.90), (sx * 0.14, -0.01, 0.52), "kok")
    kemik(f"baldir{s}", (sx * 0.14, -0.01, 0.52), (sx * 0.14, 0, 0.11), f"uyluk{s}")
bpy.ops.object.mode_set(mode="OBJECT")

def bagla(o, kemik_):
    o.parent = ark; o.parent_type = "BONE"; o.parent_bone = kemik_
    # kemiğe bağlarken dünya konumunu koru
    o.matrix_parent_inverse = (ark.matrix_world @ ark.pose.bones[kemik_].matrix @ __import__("mathutils").Matrix.Translation((0, ark.pose.bones[kemik_].length, 0))).inverted()

# gövdeyi otomatik ağırlıkla (ısı yöntemi) iskelete bağla
bpy.ops.object.select_all(action="DESELECT"); govde.select_set(True); ark.select_set(True)
bpy.context.view_layer.objects.active = ark
bpy.ops.object.parent_set(type="ARMATURE_AUTO")
for o in [bas, gidi, burun, kulakL, kulakR, gozL, gozR, sakal] + sac:
    bagla(o, "bas")
for o in (agiz, dil):
    bagla(o, "cene")
bagla(elL, "elL"); bagla(elR, "elR")
for o in lekeler:
    bagla(o, "omurga")

# yatır: sırtüstü (önü yukarı), baş +Y yönünde
ark.rotation_euler = (-math.pi / 2, 0, math.radians(-28))
ark.location = (-0.9, 0.2, 0.30)

# ------------------------------------------------------------------ animasyon (horlama zarfına bağlı)
pb = ark.pose.bones
for k in pb:
    k.rotation_mode = "XYZ"
def kf(kemik_, ozellik, deger, kare):
    b = pb[kemik_]; setattr(b, ozellik, deger); b.keyframe_insert(ozellik, frame=kare)
for f in range(1, 301, 2):
    z = ZARF[min(len(ZARF) - 1, f - 1)]
    nef = 0.5 + 0.5 * math.sin(f / 22.0)
    kf("gobek", "scale", (1 + 0.05 * nef, 1 + 0.10 * nef + 0.04 * z, 1 + 0.05 * nef), f)
    kf("omurga", "rotation_euler", (math.radians(1.5 * nef), 0, 0), f)
    kf("cene", "rotation_euler", (math.radians(4 + 16 * z), 0, 0), f)
    kf("bas", "rotation_euler", (math.radians(-2 + 3 * z), math.radians(2 * math.sin(f / 37)), 0), f)
# uykusunda göbek kaşıma (5,0-8,0 sn): sağ kol göbeğe gider, el kaşır, geri döner
for f in range(1, 301, 3):
    t = f / 30
    g = max(0.0, min(1.0, (t - 4.8) / 0.6)) * max(0.0, min(1.0, (8.2 - t) / 0.6))
    g = g * g * (3 - 2 * g)
    kas = math.sin(t * 9) * 0.5 * g
    kf("kolR", "rotation_euler", (math.radians(-35 * g), math.radians(10 * g), math.radians(-28 * g)), f)
    kf("onkolR", "rotation_euler", (math.radians(-55 * g + 10 * kas), 0, math.radians(-25 * g)), f)
    kf("elR", "rotation_euler", (math.radians(20 * kas), 0, 0), f)

# ------------------------------------------------------------------ arka planda öbürleri (odak dışı, basit biçimler)
for i, (loc, renk, rz) in enumerate((((1.4, 3.4, 0.18), "18a39a", 70), ((1.2, 1.0, 0.16), "cbb8f4", -20), ((-1.6, 3.6, 0.17), "7a3a6a", 15))):
    m_ = mat(f"obur{i}", srgb(renk), 0.7)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.17, depth=1.5, location=loc, rotation=(math.pi / 2, 0, math.radians(rz)))
    o = bpy.context.object; o.data.materials.append(m_)
    bev_ = o.modifiers.new("b", "BEVEL"); bev_.width = 0.15; bev_.segments = 8
    bpy.ops.object.shade_smooth()

# ------------------------------------------------------------------ ışık (kaynağı görünmeyen soğuk beyaz; ama düz değil)
def isik(ad_, tur, loc, rot, guc, renk, boy=1.0):
    l = bpy.data.lights.new(ad_, tur); l.energy = guc; l.color = renk
    if tur == "AREA": l.size = boy
    o = bpy.data.objects.new(ad_, l); sc.collection.objects.link(o); o.location = loc; o.rotation_euler = rot
    return o
isik("tavan", "AREA", (0, 0.5, 3.5), (0, 0, 0), 900, (0.92, 0.96, 1.0), 6.0)      # anahtar: tavandan yumuşak
isik("dolgu", "AREA", (2.5, -2.0, 1.6), (math.radians(70), 0, math.radians(50)), 180, (0.95, 0.97, 1.0), 3.0)
isik("arka", "AREA", (-2.0, 3.5, 1.2), (math.radians(-75), 0, math.radians(200)), 260, (1.0, 1.0, 1.0), 2.0)  # kenar ışığı
isik("dugme", "POINT", (0.0, 2.2, 1.2), (0, 0, 0), 25, (1.0, 0.15, 0.15))
w = bpy.data.worlds.new("dunya"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs["Color"].default_value = (0.85, 0.88, 0.92, 1); w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.35

# ------------------------------------------------------------------ kamera (alçak açı, yavaş itme; alan derinliği)
cd = bpy.data.cameras.new("kam"); kam = bpy.data.objects.new("kam", cd); sc.collection.objects.link(kam); sc.camera = kam
cd.lens = 32; cd.sensor_fit = "VERTICAL"; cd.sensor_height = 24 * 1920 / 1080 * 0.5
cd.dof.use_dof = True; cd.dof.aperture_fstop = 2.2
hedef = bpy.data.objects.new("hedef", None); sc.collection.objects.link(hedef); hedef.location = (-0.22, 1.42, 0.40)
cd.dof.focus_object = hedef
tr = kam.constraints.new("TRACK_TO"); tr.target = hedef; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
for f, loc in ((1, (0.95, 0.55, 1.10)), (300, (0.62, 0.92, 0.82))):
    kam.location = loc; kam.keyframe_insert("location", frame=f)
for fc in kam.animation_data.action.fcurves:
    for k in fc.keyframe_points:
        k.interpolation = "BEZIER"; k.easing = "EASE_IN_OUT"

# ------------------------------------------------------------------ render
os.makedirs(os.path.dirname(CIKIS), exist_ok=True)
sc.render.image_settings.file_format = "PNG"
if KARE is not None:
    sc.frame_set(KARE); sc.render.filepath = f"{CIKIS}{KARE:04d}.png"
    bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = CIKIS
    bpy.ops.render.render(animation=True)
