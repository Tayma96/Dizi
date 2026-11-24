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
ee.taa_render_samples = 16
ee.use_gtao = True; ee.gtao_distance = 0.6; ee.gtao_factor = 1.2
ee.use_bloom = True; ee.bloom_threshold = 1.2; ee.bloom_intensity = 0.06; ee.bloom_radius = 5
ee.use_soft_shadows = True; ee.shadow_cube_size = "2048"; ee.shadow_cascade_size = "2048"
ee.use_ssr = True
sc.view_settings.view_transform = "AgX"
sc.view_settings.look = "AgX - High Contrast"
sc.view_settings.exposure = -0.5

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
_nt = M_ATLET.node_tree; _g = _nt.nodes.new("ShaderNodeTexNoise"); _g.inputs["Scale"].default_value = 7; _g.inputs["Detail"].default_value = 4
_r = _nt.nodes.new("ShaderNodeValToRGB"); _r.color_ramp.elements[0].position = 0.62; _r.color_ramp.elements[1].position = 0.70
_nt.links.new(_g.outputs["Fac"], _r.inputs["Fac"])
_mx = _nt.nodes.new("ShaderNodeMix"); _mx.data_type = "RGBA"; _mx.inputs[6].default_value = (*srgb("e9dfc2"), 1); _mx.inputs[7].default_value = (*srgb("c4a666"), 1)
_nt.links.new(_r.outputs["Color"], _mx.inputs["Factor"]); _nt.links.new(_mx.outputs[2], _nt.nodes["Principled BSDF"].inputs["Base Color"])
M_ESOF = mat("esofman", srgb("2f3547"), 0.75, sheen=0.4)
M_SERIT = mat("serit", srgb("c4c8ce"), 0.6)
M_TERLIK = mat("terlik", srgb("2f7fd0"), 0.4)
M_SAC = mat("sac", srgb("221a16"), 0.35)
M_GOZ = mat("goz_kapak", srgb("c99684"), 0.55, sss=0.2)
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

# ------------------------------------------------------------------ göbekli adam: MakeHuman (CC0) insan modeli
sys.path.insert(0, BURADA)
import mh_karakter as mk
HEDEF = [("macrodetails/universal-male-young-averagemuscle-maxweight.target", 1.0),
         ("macrodetails/universal-male-old-averagemuscle-maxweight.target", 0.3),
         ("macrodetails/caucasian-male-young.target", 0.8), ("macrodetails/caucasian-male-old.target", 0.2),
         ("stomach/stomach-pregnant-incr.target", 0.9), ("neck/neck-double-incr.target", 1.0), ("head/head-fat-incr.target", 0.8)]
govde, ark, J = mk.kur("gobekli", HEDEF, "stomach/stomach-pregnant-incr.target", 0.22)

# --- yüz/saç/sakal maskeleri (konuma göre; renk özniteliği olarak) ve deri gölgelendiricisi

hz = J["head____head"].z; hy = J["head____head"].y
eL = J["eye.L____head"]; eR = J["eye.R____head"]
kz_ust = max(v.co.z for v in govde.data.vertices)
renk = govde.data.color_attributes.new("maske", "FLOAT_COLOR", "POINT")
for v in govde.data.vertices:
    c = v.co; sakal = sac = kas = 0.0
    if hz - 0.10 < c.z < eL.z - 0.035 and c.y < hy - 0.015:                 # çene, yanak altı, dudak üstü, boyun önü
        sakal = 1.0
    if c.z > eL.z + 0.015 and c.y > hy - 0.035 and c.z < kz_ust - 0.035:   # yanlar ve ense: kısa, seyrek saç
        sac = 1.0
    for e in (eL, eR):                                                       # kaşlar
        dx = (c.x - e.x) / 0.024; dz = (c.z - (e.z + 0.026 - 0.006 * ((c.x - e.x) / 0.024) ** 2)) / 0.0068
        r2 = dx * dx + dz * dz
        if r2 < 1 and c.y < e.y: kas = max(kas, (1 - r2) ** 0.3)
    renk.data[v.index].color = (sakal, sac, kas, 1)

def deri_malzeme():
    m = bpy.data.materials.new("ten_mh"); m.use_nodes = True; nt = m.node_tree; N_ = nt.nodes
    bsdf = N_["Principled BSDF"]
    bsdf.inputs["Roughness"].default_value = 0.48
    bsdf.inputs["Subsurface Weight"].default_value = 0.18; bsdf.inputs["Subsurface Radius"].default_value = (1.0, 0.4, 0.25)
    bsdf.inputs["Subsurface Scale"].default_value = 0.02
    at = N_.new("ShaderNodeVertexColor"); at.layer_name = "maske"
    ay = N_.new("ShaderNodeSeparateColor"); nt.links.new(at.outputs["Color"], ay.inputs["Color"])
    gur = N_.new("ShaderNodeTexNoise"); gur.inputs["Scale"].default_value = 900; gur.inputs["Detail"].default_value = 2
    esik = N_.new("ShaderNodeValToRGB"); esik.color_ramp.elements[0].position = 0.5; esik.color_ramp.elements[1].position = 0.62
    nt.links.new(gur.outputs["Fac"], esik.inputs["Fac"])
    ten = N_.new("ShaderNodeRGB"); ten.outputs[0].default_value = (*srgb("cf9f86"), 1)
    koyu = N_.new("ShaderNodeRGB"); koyu.outputs[0].default_value = (*srgb("2c221e"), 1)
    # sakal: noktalı (gürültü eşiği × maske)
    m1 = N_.new("ShaderNodeMath"); m1.operation = "MULTIPLY"; nt.links.new(ay.outputs[0], m1.inputs[0]); nt.links.new(esik.outputs["Color"], m1.inputs[1])
    m1b = N_.new("ShaderNodeMath"); m1b.operation = "MULTIPLY"; m1b.inputs[1].default_value = 0.75; nt.links.new(m1.outputs[0], m1b.inputs[0])
    # saç: maske × yoğun gürültü; kaş: düz
    gur2 = N_.new("ShaderNodeTexNoise"); gur2.inputs["Scale"].default_value = 300
    m2 = N_.new("ShaderNodeMath"); m2.operation = "MULTIPLY"; nt.links.new(ay.outputs[1], m2.inputs[0]); nt.links.new(gur2.outputs["Fac"], m2.inputs[1])
    m2b = N_.new("ShaderNodeMath"); m2b.operation = "MULTIPLY"; m2b.inputs[1].default_value = 1.6; nt.links.new(m2.outputs[0], m2b.inputs[0])
    top = N_.new("ShaderNodeMath"); top.operation = "ADD"; top.use_clamp = True; nt.links.new(m1b.outputs[0], top.inputs[0]); nt.links.new(m2b.outputs[0], top.inputs[1])
    top2 = N_.new("ShaderNodeMath"); top2.operation = "ADD"; top2.use_clamp = True; nt.links.new(top.outputs[0], top2.inputs[0]); nt.links.new(ay.outputs[2], top2.inputs[1])
    mix = N_.new("ShaderNodeMix"); mix.data_type = "RGBA"
    nt.links.new(top2.outputs[0], mix.inputs["Factor"]); nt.links.new(ten.outputs[0], mix.inputs[6]); nt.links.new(koyu.outputs[0], mix.inputs[7])
    nt.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    # ince deri dokusu (kabarcık)
    bump = N_.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.08
    gur3 = N_.new("ShaderNodeTexNoise"); gur3.inputs["Scale"].default_value = 1400
    nt.links.new(gur3.outputs["Fac"], bump.inputs["Height"]); nt.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return m
govde.data.materials.append(deri_malzeme())

# --- kapalı gözler: göz çukuruna ten renginde göz kapağı küreleri
for e in (eL, eR):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.0128, location=(e.x, e.y - 0.002, e.z), segments=32, ring_count=16)
    g = bpy.context.object; g.data.materials.append(M_GOZ); bpy.ops.object.shade_smooth()
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(e.x, e.y - 0.0118, e.z - 0.0015), segments=24, ring_count=12)
    kir = bpy.context.object; kir.scale = (0.0125, 0.0016, 0.0011); kir.data.materials.append(M_SAC); bpy.ops.object.shade_smooth()
    for o_ in (g, kir):
        o_.parent = ark; o_.parent_type = "BONE"; o_.parent_bone = "head"
        o_.matrix_parent_inverse = (ark.matrix_world @ ark.data.bones["head"].matrix_local @ __import__("mathutils").Matrix.Translation((0, ark.data.bones["head"].length, 0))).inverted()

# --- giysiler: gövde yüzeyinden kopya (aynı ağırlıklar), normal boyunca dışarı itilir
def baskin_kemik(v):
    en, ad_ = 0, None
    for g in v.groups:
        if g.weight > en: en, ad_ = g.weight, govde.vertex_groups[g.group].name
    return ad_
GOVDE_K = {"spine01", "spine02", "spine03", "spine04", "spine05", "breast.L", "breast.R", "clavicle.L", "clavicle.R", "neck01"}
BACAK_K = {"pelvis.L", "pelvis.R", "upperleg01.L", "upperleg01.R", "upperleg02.L", "upperleg02.R", "lowerleg01.L", "lowerleg01.R", "lowerleg02.L", "lowerleg02.R", "root"}
bel_z = J["spine05____head"].z + 0.03 if "spine05____head" in J else 0.98
boyun_z = J["neck01____head"].z - 0.02
ayak_z = J["foot.L____head"].z + 0.06
def giysi(ad_, secici, malz, itme):
    vs = govde.data.vertices
    secili = [p.index for p in govde.data.polygons if sum(1 for i in p.vertices if secici(vs[i])) * 2 >= len(p.vertices)]
    bpy.ops.object.select_all(action="DESELECT"); govde.select_set(True); bpy.context.view_layer.objects.active = govde
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.select_all(action="DESELECT"); bpy.ops.object.mode_set(mode="OBJECT")
    for i in secili: govde.data.polygons[i].select = True
    bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.duplicate(); bpy.ops.mesh.separate(type="SELECTED"); bpy.ops.object.mode_set(mode="OBJECT")
    yeni = [o for o in bpy.context.selected_objects if o is not govde][0]; yeni.name = ad_
    yeni.data.materials.clear(); yeni.data.materials.append(malz)
    if yeni.data.shape_keys: 
        yeni.active_shape_key_index = 0
    d = yeni.modifiers.new("it", "DISPLACE"); d.direction = "NORMAL"; d.strength = itme; d.mid_level = 0
    yeni.modifiers.move(len(yeni.modifiers) - 1, 0)
    s_ = yeni.modifiers.new("kal", "SOLIDIFY"); s_.thickness = 0.004; s_.offset = 1
    return yeni
KOL_K = {"upperarm01.L","upperarm01.R","upperarm02.L","upperarm02.R","lowerarm01.L","lowerarm01.R","lowerarm02.L","lowerarm02.R","wrist.L","wrist.R","shoulder01.L","shoulder01.R"}
koltuk_z = J["upperarm01.L____head"].z - 0.03
omuz_x = abs(J["upperarm01.L____head"].x)
def atlet_sec(v):
    c = v.co
    if c.z >= koltuk_z:
        return 0.05 < abs(c.x) < 0.11 and c.z < boyun_z + 0.03        # askılar (omuz üstünden önden arkaya)
    if baskin_kemik(v) in KOL_K: return False
    if c.z < bel_z + 0.11 and c.y < -0.10: return False                  # alt göbek dışarıda (atlet yukarı sıyrılmış)
    if c.z < bel_z - 0.02: return False
    if c.z < koltuk_z: return abs(c.x) < omuz_x + 0.02                     # gövde
    return 0.045 < abs(c.x) < 0.115 and c.z < boyun_z + 0.02              # askılar
atlet = giysi("atlet", atlet_sec, M_ATLET, 0.006)
esof = giysi("esofman", lambda v: baskin_kemik(v) in BACAK_K and ayak_z < v.co.z < bel_z + 0.04, M_ESOF, 0.007)
for o in (govde, atlet, esof):
    sd = o.modifiers.new("sub", "SUBSURF"); sd.levels = 1; sd.render_levels = 2

# yatır: sırtüstü (önü yukarı), baş +Y yönünde
ark.rotation_euler = (-math.pi / 2, 0, math.radians(-28))
ark.location = (-0.9, 0.2, 0.17)

# ------------------------------------------------------------------ animasyon
pb = ark.pose.bones
for k in pb: k.rotation_mode = "XYZ"
def kf(kemik_, ozellik, deger, kare):
    b = pb[kemik_]; setattr(b, ozellik, deger); b.keyframe_insert(ozellik, frame=kare)
# dinlenme pozu: kollar bedenin yanında, hafif açık; baş biraz yana düşmüş
for s_, i in (("L", 1), ("R", -1)):
    kf(f"upperarm01.{s_}", "rotation_euler", (math.radians(32 * -i), 0, math.radians(38)), 1)
    kf(f"lowerarm01.{s_}", "rotation_euler", (math.radians(-12), 0, 0), 1)
nk = govde.data.shape_keys.key_blocks["nefes"]
for f in range(1, 301, 2):
    z = ZARF[min(len(ZARF) - 1, f - 1)]
    nef = 0.5 + 0.5 * math.sin(f / 22.0)
    nk.value = 0.25 + 0.55 * nef + 0.35 * z; nk.keyframe_insert("value", frame=f)
    kf("spine03", "rotation_euler", (math.radians(-1.5 * nef), 0, 0), f)
    kf("jaw", "rotation_euler", (math.radians(3 + 14 * z), 0, 0), f)
    kf("head", "rotation_euler", (math.radians(-2 + 2 * z), 0, math.radians(8 + 2 * math.sin(f / 37))), f)
KOLTEST = [float(x) for x in argv[argv.index("--kolR") + 1].split(",")] if "--kolR" in argv else None
# uykuda göbek kaşıma (5,0-8,0 sn): sağ el göbeğe gider, kaşır, geri döner
for f in (range(1, 301, 3) if not KOLTEST else []):
    t = f / 30
    g = max(0.0, min(1.0, (t - 4.8) / 0.6)) * max(0.0, min(1.0, (8.2 - t) / 0.6)); g = g * g * (3 - 2 * g)
    kas = math.sin(t * 9) * 0.5 * g
    kf("upperarm01.R", "rotation_euler", (math.radians(-32 + 57 * g), math.radians(-55 * g), math.radians(38 - 8 * g)), f)
    kf("lowerarm01.R", "rotation_euler", (math.radians(-12 * (1 - g)), 0, math.radians(-110 * g + 9 * kas)), f)
    kf("wrist.R", "rotation_euler", (0, 0, math.radians(15 * kas)), f)
if KOLTEST:
    for f in (1, 300):
        kf("upperarm01.R", "rotation_euler", tuple(math.radians(a) for a in KOLTEST[:3]), f)
        kf("lowerarm01.R", "rotation_euler", tuple(math.radians(a) for a in KOLTEST[3:]), f)

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
hedef = bpy.data.objects.new("hedef", None); sc.collection.objects.link(hedef); hedef.location = (-0.78, 0.50, 0.30)
cd.dof.focus_object = hedef
# kamera: yatan bedenin üstünde, baş kadrajın üstünde (beden ekseni dikey), yavaş itme
from mathutils import Matrix
bas_w = ark.matrix_world @ ark.pose.bones["head"].head
ayak_w = ark.matrix_world @ ark.pose.bones["foot.L"].head
eks = (bas_w - ayak_w); eks.z = 0; eks.normalize()
yan = Vector((eks.y, -eks.x, 0))
yuz = bas_w + eks * 0.16 + Vector((0, 0, 0.08)); gob = ark.matrix_world @ ark.pose.bones["spine03"].head + Vector((0, 0, 0.22))
M = yuz * 0.38 + gob * 0.62
hedef.location = yuz
def kam_poz(t):
    e = t * t * (3 - 2 * t)
    poz = M + yan * (0.42 - 0.12 * e) - eks * (0.10 - 0.05 * e) + Vector((0, 0, 1.30 - 0.32 * e))
    bak = (M + eks * (0.04 * e) - poz).normalized()
    ust = (eks - bak * eks.dot(bak)).normalized()
    z_ = -bak; x_ = ust.cross(z_)
    R = Matrix((x_, ust, z_)).transposed().to_4x4(); R.translation = poz
    return R
for f in range(1, 301, 2):
    kam.matrix_world = kam_poz((f - 1) / 299)
    kam.keyframe_insert("location", frame=f); kam.keyframe_insert("rotation_euler", frame=f)
cd.lens = 30

# ------------------------------------------------------------------ render
if "--genel" in argv:  # poz denetimi: bütün beden, tepeden
    kam.constraints.clear(); kam.animation_data_clear(); kam.location = (-0.85, 0.25, 3.2); kam.rotation_euler = (0, 0, math.radians(-28)); cd.dof.use_dof = False
if "--kontrol" in argv:
    sc.frame_set(60); dg = bpy.context.evaluated_depsgraph_get()
    for o in (govde, atlet, esof):
        ev = o.evaluated_get(dg); pts = [ev.matrix_world @ v.co for v in ev.to_mesh().vertices]
        print("KUTU", o.name, [round(min(p[i] for p in pts), 2) for i in range(3)], [round(max(p[i] for p in pts), 2) for i in range(3)])
    print("KAM", tuple(round(x, 2) for x in kam.matrix_world.translation), "HEDEF", tuple(hedef.location))
    for k_ in ("head", "jaw", "spine03", "spine05", "foot.L"):
        pbk = ark.pose.bones[k_]; print("KEMIK", k_, tuple(round(x, 2) for x in (ark.matrix_world @ pbk.head)))
    sys.exit(0)
os.makedirs(os.path.dirname(CIKIS), exist_ok=True)
sc.render.image_settings.file_format = "PNG"
if KARE is not None:
    sc.frame_set(KARE); sc.render.filepath = f"{CIKIS}{KARE:04d}.png"
    bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = CIKIS
    bpy.ops.render.render(animation=True)
