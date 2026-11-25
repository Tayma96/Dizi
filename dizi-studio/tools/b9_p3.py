import json
import math
import os
import sys

# K dizinini (proje kökünü) bulmak için, bu dosyanın iki üst dizini varsayılır.
K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KARE = 30  # Saniye başına kare sayısı (FPS)
VF = 2 / KARE  # Titreşim veya anlık geçişler için küçük zaman dilimi

# b8y_p1 modülünün komut satırı argümanlarını okumasını engellemek için sys.argv'yi temizle.
sys.argv = [sys.argv[0]]
# b8y_p1 modülünü içe aktarmak için geçerli dizini sys.path'e ekle.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import b8y_p1 as P1  # noqa: E402  (yan açı izdüşümü için yardımcı)

# Ses dosyalarının bulunduğu dizin.
VD = f"{K}/public/voice/724-09-p3"

# sureler.json dosyasından ses sürelerini yükle.
# Bu dosyanın, Python betiğinin çalıştığı dizinde bulunduğunu varsayıyoruz.
M = json.load(open(f"{VD}/manifest.json"))

# Ses anahtarları ile senaryodaki replikler arasındaki eşleme.
TAKE = {
    "E_hassiktir": "A1_01",
    "M_aslan_hediye": "A1_02",
    "Y_sabrimiz_tukeniyor": "A1_03",
    "E_evrimini_siktirmis": "A1_04",
    "N_aslan_saldirma": "A1_05",  # Spiker sesi
    "E_kim_yazdiriyor": "A1_06",
    "E_bu_benim_el_yazim": "A1_07",
    "Y_borcunuzu_odeyin": "A1_08",
    "K_yirmi_alti": "A1_09",
    "M_yirmi_bes": "A1_10",
    "E_yirmi_uc": "A1_11",
    "K_misafir_tek_ben": "A1_12",
    "E_cok_saygideger": "A1_13",
    "Y_ece_kizim": "A1_14",  # Sabri sesi (yaratık taklidi)
    "K_tesekkurler_bezmenler": "A1_15",  # Elif'in son repliği. (A1_16 kullanılmaz)
    "M_kural_iki": "A2_01",  # Özel ses anahtarı
    "S_ece_ben_evdeyim": "A1_17",  # Sabri (telefon)
    "Y_kimseye_kapiyi_acma": "A1_18",  # Yaratık (Sabri'nin cümlesinin yankısı gibi)
    "E_abi_markette_aslan": "A1_19",
    "S_aslan_bizim": "A1_20",
    "E_abi_sen_aslan": "A1_21",
    "S_kedi_mamasi_pahali": "A1_22",
}

# Repliklerin altyazı metinleri (senaryodan alınmıştır).
METIN = {
    "E_hassiktir": "Hassiktir.",
    "M_aslan_hediye": "Aslan... bir hediye mi acaba?",
    "Y_sabrimiz_tukeniyor": "Sabrımız tükeniyor. İstenmeyen misafirler, istenmeyen yerlerde.",
    "E_evrimini_siktirmis": "Ulan evrimini siktirmiş göl kenarı canavarı! Depo sana otel mi, küflü kayıp terlik!",
    "N_aslan_saldirma": "Uzmanlar, aslanın insanlara saldırma ihtimalinin düşük olduğunu belirtiyor.",
    "E_kim_yazdiriyor": "Kim yazdırıyor lan bunu?",
    "E_bu_benim_el_yazim": "Bu benim el yazım lan!",
    "Y_borcunuzu_odeyin": "Borcunuzu ödeyin. En genç misafiri kapıya bırakın.",
    "K_yirmi_alti": "Ben yirmi altı yaşındayım!",
    "M_yirmi_bes": "Yirmi beş.",
    "E_yirmi_uc": "...Yirmi üç.",
    "K_misafir_tek_ben": "...Misafir bir tek ben miyim?",
    "E_cok_saygideger": "Seni... seni... çok saygıdeğer kemik torbası beyefendi!",
    "Y_ece_kizim": "Ece, kızım... aç kapıyı, benim.",
    "M_kural_iki": "Kural iki!",
    "S_ece_ben_evdeyim": "Ece, ben evdeyim kızım. Kimseye kapıyı açma.",
    "Y_kimseye_kapiyi_acma": "Ece, kızım... aç kapıyı, benim.",
    "E_abi_markette_aslan": "Abi! Abi, markette aslan var!",
    "S_aslan_bizim": "Aslan bizim kızım. Bekçi o.",
    "E_abi_sen_aslan": "Abi sen aslan mı besliyon?!",
    "S_kedi_mamasi_pahali": "Kedi maması pahalı kızım.",
    "K_tesekkurler_bezmenler": "Teşekkürler... sayın bezmenler."
}

# M sözlüğündeki ilgili girişlere metinleri ekle.
for r_key, t_key in TAKE.items():
    if t_key in M:
        M[t_key]["text"] = METIN.get(r_key, "")

# Replik sürelerini içeren sözlük.
D = {r: M[t]["duration"] for r, t in TAKE.items()}
R3 = lambda v: round(v, 3)  # Sayıyı 3 ondalık basamağa yuvarla
fr = lambda v: round(round(v * KARE) / KARE, 4)  # Kareye yuvarla (frame rate)
# ws (sözcük başlangıç zamanı) bu betikte kullanılmıyor, çünkü M'de kelime bazlı süreler yok.

# ------------------------------------------------------------------ Zaman Çizelgesi (sahne saniyesi)

# Bölüm 3 zamanlamaları (~55 sn)
t0_P3 = 0.0
t_ece_hassiktir = R3(t0_P3 + 1.5)
t_mert_aslan = R3(t_ece_hassiktir + D["E_hassiktir"] + 3.0)
t_yaratik_sabrimiz = R3(t0_P3 + 10.0)  # Senaryoya göre 10. saniye
t_ece_evrimini = R3(t_yaratik_sabrimiz + D["Y_sabrimiz_tukeniyor"] + 0.8)
t_tv_on = R3(t_ece_evrimini + D["E_evrimini_siktirmis"] + 1.0)
t_spiker_aslan = R3(t_tv_on)
t_fis_yazici_calis = R3(t_spiker_aslan + D["N_aslan_saldirma"] + 2.0)
t_ece_kim_yazdiriyor = R3(t_fis_yazici_calis + 4.0)
t_p3_son = R3(t0_P3 + 50.0)  # Bölüm 3'ün sonu

# Bölüm 4 zamanlamaları (~55 sn)
t0_P4 = t_p3_son
t_kural5_yakin = R3(t0_P4 + 0.5)
t_ece_el_yazim = R3(t_kural5_yakin + 1.0)
t_yaratik_borc = R3(t0_P4 + 3.0)  # Senaryoya göre 3. saniye
t_elif_26 = R3(t_yaratik_borc + D["Y_borcunuzu_odeyin"] + 1.0)
t_mert_25 = R3(t_elif_26 + D["K_yirmi_alti"] + 0.5)
t_ece_23 = R3(t_mert_25 + D["M_yirmi_bes"] + 0.5)
t_elif_misafir_mi = R3(t_ece_23 + D["E_yirmi_uc"] + 3.0)
t_ece_cok_saygideger = R3(t_elif_misafir_mi + D["K_misafir_tek_ben"] + 2.0)
t_yaratik_sabri = R3(t_ece_cok_saygideger + D["E_cok_saygideger"] + 3.0)
t_ece_kapikolu = R3(t_yaratik_sabri + D["Y_ece_kizim"] + 3.0)
t_p4_son = R3(t_ece_kapikolu + 2.0)  # Bölüm 4'ün sonu

# Bölüm 5 zamanlamaları (~55 sn)
t0_P5 = t_p4_son
t_mert_kural_iki = R3(t0_P5 + 0.5)
t_telefon_calar = R3(t_mert_kural_iki + D["M_kural_iki"] + 1.0)
t_sabri_telefon = R3(t_telefon_calar + 2.0)
t_yaratik_telefon_yankı = R3(t_sabri_telefon + 0.5)
t_ece_abi_aslan = R3(t_yaratik_telefon_yankı + D["Y_kimseye_kapiyi_acma"] + 0.5)
t_sabri_aslan_bizim = R3(t_ece_abi_aslan + D["E_abi_markette_aslan"] + 0.5)
t_aslan_depo_onune_yatar = R3(t_sabri_aslan_bizim + D["S_aslan_bizim"] + 1.5)
t_ece_abi_sen_aslan = R3(t_aslan_depo_onune_yatar + 1.0)
t_sabri_kedi_mamasi = R3(t_ece_abi_sen_aslan + D["E_abi_sen_aslan"] + 0.5)
t_isiklar_geri_gelir = R3(t_sabri_kedi_mamasi + D["S_kedi_mamasi_pahali"] + 1.0)
t_fis_yazici_misafir_teslim = R3(t_isiklar_geri_gelir + 2.0)
t_elif_kayip = R3(t_fis_yazici_misafir_teslim + 4.0)
t_elif_tesekkurler = R3(t_elif_kayip + 2.0)
t_kararma_basla = R3(t_elif_tesekkurler + D["K_tesekkurler_bezmenler"] + 0.2)
SON = R3(t_kararma_basla + 1.5)  # Bölümün toplam süresi (1.5 sn kararma ile)

# ------------------------------------------------------------------ YAN yerleşim (Ece)
# b9_p2.py'deki EK (ayakta, kapıya yaslı) referans alınıyor.
EK = P1.yI(1.42, 1.74, 1.6)
SE = EK[2] / 1000  # Ölçeklendirme faktörü
FK = [EK[0], EK[1] - 0.765 * EK[2]]  # Ayakta yüzün konumu

# El hedefleri (ekran koordinatları, Ece'nin pozisyonuna göre)
YAN_L = [EK[0] - 120 * SE, EK[1] - 420 * SE]
YAN_R = [EK[0] + 115 * SE, EK[1] - 410 * SE]
KAPI_SL, KAPI_SR = [EK[0] - 235 * SE, EK[1] - 650 * SE], [EK[0] + 240 * SE, EK[1] - 650 * SE]
CEP_L = [EK[0] - 95 * SE, EK[1] - 450 * SE]
KUM = [EK[0] - 175 * SE, EK[1] - 770 * SE]
KASA_EL_L = [EK[0] - 200 * SE, EK[1] - 550 * SE]  # Ece'nin sol eli fiş yazıcısında
KASA_EL_R = [EK[0] + 180 * SE, EK[1] - 540 * SE]  # Ece'nin sağ eli fiş üzerinde
ACIK_AGIZ_L = [EK[0] - 120 * SE, EK[1] - 480 * SE]  # Ağzını kapatmak için sol el
ACIK_AGIZ_R = [EK[0] + 120 * SE, EK[1] - 480 * SE]  # Ağzını kapatmak için sağ el
TELEFON_TUT_L = [EK[0] - 250 * SE, EK[1] - 700 * SE]  # Telefonu tutan sol el
TELEFON_TUT_R = [EK[0] - 100 * SE, EK[1] - 700 * SE]  # Telefonu tutan sağ el
EL_CEK_MERT_L = [EK[0] + 100 * SE, EK[1] - 500 * SE]  # Mert'in Ece'nin bileğini tuttuğu yer (Ece'nin sol kolu)
EL_CEK_MERT_R = [EK[0] + 150 * SE, EK[1] - 550 * SE]  # Mert'in Ece'nin bileğini tuttuğu yer (Ece'nin sağ kolu)

# Ece'nin vücut hareketleri (yer)
YER = [[0, *EK]]
YER += [[t_ece_hassiktir - 0.01, *EK], [t_ece_hassiktir + 0.05, EK[0] + 5, EK[1], EK[2]], [t_ece_hassiktir + 0.25, *EK]]
YER += [[t_tv_on - 0.5, *EK], [t_tv_on, EK[0] - 10, EK[1] - 5, EK[2]]]
YER += [[t_fis_yazici_calis - 0.5, *EK], [t_fis_yazici_calis + 0.5, EK[0] - 10, EK[1] + 10, EK[2]]]
YER += [[t_ece_kim_yazdiriyor - 0.05, EK[0] - 5, EK[1] + 15, EK[2]], [t_ece_kim_yazdiriyor + 0.2, EK[0] - 15, EK[1] + 25, EK[2]]]
YER += [[t_p3_son, EK[0] - 15, EK[1] + 25, EK[2]]]

YER += [[t0_P4, *EK]]
YER += [[t_ece_el_yazim - 0.05, EK[0] - 5, EK[1] + 10, EK[2]], [t_ece_el_yazim + 0.2, EK[0] - 15, EK[1] + 25, EK[2]]]
YER += [[t_elif_26 - 0.5, *EK], [t_elif_26, EK[0] - 10, EK[1] + 5, EK[2]]]
YER += [[t_mert_25 - 0.5, *EK], [t_mert_25, EK[0] - 10, EK[1] + 5, EK[2]]]
YER += [[t_ece_23 - 0.5, *EK], [t_ece_23, EK[0] - 10, EK[1] + 5, EK[2]]]
YER += [[t_elif_misafir_mi - 0.5, *EK], [t_elif_misafir_mi, EK[0] - 10, EK[1] + 5, EK[2]]]
YER += [[t_ece_cok_saygideger - 0.05, EK[0] + 5, EK[1], EK[2]], [t_ece_cok_saygideger + 0.2, EK[0] - 5, EK[1] + 5, EK[2]]]
YER += [[t_yaratik_sabri - 0.5, *EK], [t_yaratik_sabri + 0.5, EK[0] + 10, EK[1] + 5, EK[2]]]
YER += [[t_ece_kapikolu - 0.05, EK[0] + 15, EK[1] + 10, EK[2]], [t_ece_kapikolu + 0.2, EK[0] + 20, EK[1] + 15, EK[2]]]
YER += [[t_p4_son, EK[0] + 20, EK[1] + 15, EK[2]]]

YER += [[t0_P5, *EK]]
YER += [[t_mert_kural_iki - 0.05, EK[0] + 10, EK[1] + 5, EK[2]], [t_mert_kural_iki + 0.1, EK[0] + 5, EK[1], EK[2]]]
YER += [[t_telefon_calar - 0.2, *EK], [t_telefon_calar + 0.2, EK[0] - 5, EK[1] + 5, EK[2]]]
YER += [[t_sabri_telefon - 0.2, EK[0] - 10, EK[1] + 10, EK[2]], [t_sabri_telefon + 0.2, EK[0] - 15, EK[1] + 15, EK[2]]]
YER += [[t_ece_abi_aslan - 0.2, EK[0] - 15, EK[1] + 15, EK[2]], [t_ece_abi_aslan + 0.2, EK[0] - 10, EK[1] + 10, EK[2]]]
YER += [[t_aslan_depo_onune_yatar - 1.0, *EK], [t_aslan_depo_onune_yatar, EK[0] - 5, EK[1] + 5, EK[2]]]
YER += [[t_isiklar_geri_gelir - 0.5, *EK], [t_isiklar_geri_gelir + 0.5, EK[0] - 10, EK[1] - 10, EK[2]]]
YER += [[t_fis_yazici_misafir_teslim - 0.5, EK[0] - 10, EK[1] - 10, EK[2]], [t_fis_yazici_misafir_teslim + 0.5, EK[0] - 15, EK[1] - 15, EK[2]]]
YER += [[t_elif_kayip - 0.5, EK[0] - 15, EK[1] - 15, EK[2]], [t_elif_kayip + 0.5, *EK]]
YER += [[SON, *EK]]
YER.sort(key=lambda k: k[0])

# Ece'nin sol el hareketleri
ELL = [[0, *YAN_L]]
ELL += [[t_ece_hassiktir - 0.05, *YAN_L], [t_ece_hassiktir + 0.05, *ACIK_AGIZ_L], [t_ece_hassiktir + 0.3, *YAN_L]]
ELL += [[t_fis_yazici_calis + 0.5, *YAN_L], [t_fis_yazici_calis + 1.0, *KASA_EL_L]]
ELL += [[t_ece_kim_yazdiriyor + 0.05, *KASA_EL_L], [t_ece_kim_yazdiriyor + 0.25, *KASA_EL_L]]
ELL += [[t_p3_son, *KASA_EL_L]]

ELL += [[t0_P4, *KASA_EL_L]]
ELL += [[t_ece_el_yazim - 0.05, *YAN_L], [t_ece_el_yazim + 0.05, *ACIK_AGIZ_L], [t_ece_el_yazim + 0.3, *YAN_L]]
ELL += [[t_ece_cok_saygideger - 0.05, *YAN_L], [t_ece_cok_saygideger + 0.05, *ACIK_AGIZ_L], [t_ece_cok_saygideger + 0.25, *YAN_L]]
ELL += [[t_yaratik_sabri + 1.0, *YAN_L], [t_ece_kapikolu + 0.05, KAPI_SL[0] - 10 * SE, KAPI_SL[1]]]
ELL += [[t_p4_son, KAPI_SL[0] - 10 * SE, KAPI_SL[1]]]

ELL += [[t0_P5, KAPI_SL[0] - 10 * SE, KAPI_SL[1]]]
ELL += [[t_mert_kural_iki + 0.05, *EL_CEK_MERT_L]]
ELL += [[t_telefon_calar + 0.05, *YAN_L], [t_telefon_calar + 0.3, *TELEFON_TUT_L]]
ELL += [[t_sabri_telefon + D["S_ece_ben_evdeyim"] + 0.5, *TELEFON_TUT_L]]
ELL += [[t_aslan_depo_onune_yatar + 0.5, *TELEFON_TUT_L], [t_isiklar_geri_gelir - 0.2, *YAN_L]]
ELL += [[SON, *YAN_L]]

# Ece'nin sağ el hareketleri
ELR = [[0, *YAN_R]]
ELR += [[t_ece_hassiktir - 0.05, *YAN_R], [t_ece_hassiktir + 0.05, *ACIK_AGIZ_R], [t_ece_hassiktir + 0.3, *YAN_R]]
ELR += [[t_fis_yazici_calis + 0.5, *YAN_R], [t_fis_yazici_calis + 1.0, *KASA_EL_R]]
ELR += [[t_ece_kim_yazdiriyor + 0.05, *KASA_EL_R], [t_ece_kim_yazdiriyor + 0.25, *KASA_EL_R]]
ELR += [[t_p3_son, *KASA_EL_R]]

ELR += [[t0_P4, *KASA_EL_R]]
ELR += [[t_ece_el_yazim - 0.05, *YAN_R], [t_ece_el_yazim + 0.05, *ACIK_AGIZ_R], [t_ece_el_yazim + 0.3, *YAN_R]]
ELR += [[t_ece_cok_saygideger - 0.05, *YAN_R], [t_ece_cok_saygideger + 0.05, *ACIK_AGIZ_R], [t_ece_cok_saygideger + 0.25, *YAN_R]]
ELR += [[t_yaratik_sabri + 1.0, *YAN_R], [t_ece_kapikolu + 0.05, KAPI_SR[0] - 10 * SE, KAPI_SR[1]]]
ELR += [[t_p4_son, KAPI_SR[0] - 10 * SE, KAPI_SR[1]]]

ELR += [[t0_P5, KAPI_SR[0] - 10 * SE, KAPI_SR[1]]]
ELR += [[t_mert_kural_iki + 0.05, *EL_CEK_MERT_R]]
ELR += [[t_telefon_calar + 0.05, *YAN_R], [t_telefon_calar + 0.3, *TELEFON_TUT_R]]
ELR += [[t_sabri_telefon + D["S_ece_ben_evdeyim"] + 0.5, *TELEFON_TUT_R]]
ELR += [[t_aslan_depo_onune_yatar + 0.5, *TELEFON_TUT_R], [t_isiklar_geri_gelir - 0.2, *YAN_R]]
ELR += [[SON, *YAN_R]]


# Baş dönme animasyonu yardımcı fonksiyonu
def don(t, a, b, sure=0.55):
    """Önce gözler (0.15 sn), sonra baş yaylı döner"""
    return [[R3(t), *a], [R3(t + 0.15), b[0], b[1], a[2]], [R3(t + 0.15 + sure), *b]]

# Kamera hedefleri (yan görünüm için)
SOL = [-0.75, 0.35, -0.5]  # Mert ve Elif (ekran solu, yerde)
TV = [-0.55, -0.75, -0.45]  # Duvar TV'si (sol-yukarı)
KAPI = [0.75, 0.15, 0.7]  # Kapı (arkasında, sağ omuz)
KASA = [-0.65, 0.2, 0.6]  # Kasa
ON = [0.0, 0.05, 0.0]  # Ece'nin önü

# Ece'nin bakış yönü
BAK = ([[0, *KAPI]]  # Başlangıçta kapıya bakıyor
       + don(t_ece_hassiktir - 0.1, KAPI, ON, 0.3) + [[t_ece_hassiktir + 0.5, *ON]]
       + don(t_mert_aslan - 0.1, ON, SOL, 0.5) + [[t_mert_aslan + 0.5, *SOL]]
       + don(t_yaratik_sabrimiz - 0.1, SOL, KAPI, 0.5) + [[t_yaratik_sabrimiz + 0.5, *KAPI]]
       + don(t_tv_on - 0.1, KAPI, TV, 0.5) + [[t_tv_on + 0.5, *TV]]
       + don(t_fis_yazici_calis - 0.1, TV, KASA, 0.5) + [[t_fis_yazici_calis + 0.5, *KASA]]
       + [[t_p3_son, *KASA]]

       + [[t0_P4, *KASA]]
       + don(t_ece_el_yazim - 0.1, KASA, KAPI, 0.5) + [[t_ece_el_yazim + 0.5, *KAPI]]
       + don(t_elif_26 - 0.1, KAPI, SOL, 0.5) + [[t_elif_26 + 0.5, *SOL]]
       + don(t_ece_cok_saygideger - 0.1, SOL, KAPI, 0.5) + [[t_ece_cok_saygideger + 0.5, *KAPI]]
       + don(t_yaratik_sabri - 0.1, KAPI, KAPI, 0.3) + [[t_yaratik_sabri + 0.5, *KAPI]]
       + [[t_p4_son, *KAPI]]

       + [[t0_P5, *KAPI]]
       + don(t_mert_kural_iki - 0.1, KAPI, ON, 0.3) + [[t_mert_kural_iki + 0.5, *ON]]
       + don(t_telefon_calar - 0.1, ON, ON, 0.3) + [[t_telefon_calar + 0.5, *ON]]
       + don(t_sabri_telefon - 0.1, ON, ON, 0.3) + [[t_sabri_telefon + 0.5, *ON]]
       + don(t_aslan_depo_onune_yatar - 0.1, ON, KAPI, 0.5) + [[t_aslan_depo_onune_yatar + 0.5, *KAPI]]
       + don(t_isiklar_geri_gelir - 0.1, KAPI, ON, 0.5) + [[t_isiklar_geri_gelir + 0.5, *ON]]
       + don(t_elif_kayip - 0.1, ON, SOL, 0.5) + [[t_elif_kayip + 0.5, *SOL]]
       + [[SON, *SOL]])

# Ece'nin duyguları
DUYGU = [[0, "korkmus"], [t_ece_hassiktir, "dehset"], [t_mert_aslan, "dehset"], [t_yaratik_sabrimiz, "dehset"],
         [t_ece_evrimini, "ofkeli"], [t_tv_on, "saskin"], [t_fis_yazici_calis, "supheli"],
         [t_ece_kim_yazdiriyor, "saskin"], [t0_P4, "saskin"], [t_ece_el_yazim, "dehset"],
         [t_elif_26, "supheli"], [t_ece_23, "uzgun"], [t_elif_misafir_mi, "dehset"],
         [t_ece_cok_saygideger - 0.1, "ofkeli"], [t_ece_cok_saygideger + 0.1, "notr"],  # Öfke -> zorla kibar
         [t_yaratik_sabri, "mutlu"], [t0_P5, "mutlu"], [t_mert_kural_iki, "dehset"],
         [t_telefon_calar, "saskin"], [t_ece_abi_aslan, "dehset"], [t_aslan_depo_onune_yatar, "saskin"],
         [t_ece_abi_sen_aslan, "alayci"], [t_isiklar_geri_gelir, "yorgun"], [t_elif_kayip, "saskin"],
         [t_elif_tesekkurler, "dehset"], [SON, "dehset"]]

# Ece'nin başını yana eğme (tilt)
TILT = [[0, 0], [t_ece_hassiktir, 5], [t_mert_aslan, -5], [t_yaratik_sabrimiz, 5], [t_ece_evrimini, -5],
        [t_tv_on, 3], [t_fis_yazici_calis, -3], [t_ece_kim_yazdiriyor, -7],
        [t_ece_el_yazim, -7], [t_elif_26, 3], [t_ece_23, 0], [t_elif_misafir_mi, -5],
        [t_ece_cok_saygideger, 5], [t_yaratik_sabri, 2],
        [t_mert_kural_iki, -2], [t_telefon_calar, 0], [t_ece_abi_aslan, -5], [t_aslan_depo_onune_yatar, 0],
        [t_ece_abi_sen_aslan, -3], [t_isiklar_geri_gelir, 5], [t_elif_kayip, 0], [t_elif_tesekkurler, -5],
        [SON, -5]]

# Ece'nin öne eğilme (egil)
EGIL = [[0, 0], [t_fis_yazici_calis, 5], [t_ece_kim_yazdiriyor, 10], [t_ece_el_yazim, 8],
        [t_ece_cok_saygideger, -5], [t_yaratik_sabri, 2], [t_ece_kapikolu, 8],
        [t_isiklar_geri_gelir, -10], [t_fis_yazici_misafir_teslim, -8], [t_elif_kayip, 0],
        [SON, 0]]

# Ece'nin gözlerini kısma
GOZKIS = [[0, 0, 0], [t_ece_hassiktir, 0.3, 0.3], [t_mert_aslan, 0.4, 0.4], [t_yaratik_sabrimiz, 0.5, 0.5],
          [t_ece_evrimini, 0.6, 0.5], [t_tv_on, 0, 0], [t_fis_yazici_calis, 0.2, 0.2],
          [t_ece_kim_yazdiriyor, 0.3, 0.3], [t_ece_el_yazim, 0.4, 0.4], [t_elif_misafir_mi, 0.5, 0.5],
          [t_ece_cok_saygideger, 0.6, 0.5], [t_yaratik_sabri, 0, 0],
          [t_mert_kural_iki, 0.3, 0.3], [t_telefon_calar, 0, 0], [t_ece_abi_aslan, 0.5, 0.5],
          [t_aslan_depo_onune_yatar, 0.2, 0.2], [t_elif_kayip, 0.3, 0.3], [t_elif_tesekkurler, 0.4, 0.4],
          [SON, 0.4, 0.4]]

# Ece'nin göz kırpma hareketleri
GOZ = [[0, 0]]
for t_val in [t_ece_hassiktir, t_yaratik_sabrimiz, t_ece_evrimini, t_fis_yazici_calis, t_ece_el_yazim, t_elif_26,
              t_ece_23, t_elif_misafir_mi, t_ece_cok_saygideger, t_yaratik_sabri, t_mert_kural_iki, t_telefon_calar,
              t_ece_abi_aslan, t_ece_abi_sen_aslan, t_elif_kayip, t_elif_tesekkurler]:
    GOZ += [[t_val, 0], [R3(t_val + 0.06), 1], [R3(t_val + 0.12), 0]]
GOZ += [[SON, 0]]

# Ece'nin gözleri şaşkınlık (şok)
GOZSOK = [[0, 0], [t_ece_hassiktir, 0.4], [t_mert_aslan, 0.6], [t_yaratik_sabrimiz, 0.7],
          [t_ece_evrimini, 0.3], [t_tv_on, 0.8], [t_fis_yazici_calis, 0.5],
          [t_ece_kim_yazdiriyor, 0.8], [t_ece_el_yazim, 1.0], [t_elif_misafir_mi, 0.9],
          [t_ece_cok_saygideger, 0], [t_yaratik_sabri, 0.2],
          [t_mert_kural_iki, 0.7], [t_telefon_calar, 0.4], [t_ece_abi_aslan, 0.9],
          [t_aslan_depo_onune_yatar, 0.6], [t_elif_kayip, 0.8], [t_elif_tesekkurler, 1.0],
          [SON, 1.0]]

# Ece'nin nefes alıp verme yoğunluğu
NEFES = [[0, 1.0], [t_ece_hassiktir, 1.5], [t_mert_aslan, 1.8], [t_yaratik_sabrimiz, 2.0],
         [t_ece_evrimini, 1.0], [t_tv_on, 0.8], [t_fis_yazici_calis, 1.2],
         [t_ece_kim_yazdiriyor, 1.5], [t_ece_el_yazim, 1.8], [t_elif_misafir_mi, 2.0],
         [t_ece_cok_saygideger, 1.0], [t_yaratik_sabri, 0.8],
         [t_mert_kural_iki, 1.5], [t_telefon_calar, 0.8], [t_ece_abi_aslan, 1.8],
         [t_aslan_depo_onune_yatar, 1.0], [t_elif_kayip, 1.5], [t_elif_tesekkurler, 2.0],
         [SON, 2.0]]

# Ece'nin konuşma animasyonları (sadece zaman, ağız ipuçları için boş liste)
KONUS = [{"t": R3(t_ece_hassiktir + VF), "cues": []},
         {"t": R3(t_ece_evrimini + VF), "cues": []},
         {"t": R3(t_ece_kim_yazdiriyor + VF), "cues": []},
         {"t": R3(t_ece_el_yazim + VF), "cues": []},
         {"t": R3(t_ece_23 + VF), "cues": []},
         {"t": R3(t_ece_cok_saygideger + VF), "cues": []},
         {"t": R3(t_ece_abi_aslan + VF), "cues": []},
         {"t": R3(t_ece_abi_sen_aslan + VF), "cues": []}
         ]

# Ece karakteri tanımı
ECE = {"id": "ece_sivil", "onKol": True, "dogalKol": True, "yay": 1, "yer": YER, "elL": ELL, "elR": ELR,
       "bak": BAK, "duygu": DUYGU, "tilt": TILT, "egil": EGIL, "gozKis": GOZKIS, "goz": GOZ, "gozSok": GOZSOK,
       "nefes": NEFES, "yerOtur": [[0, 0]], "konus": KONUS, "sacDagin": 0.6,
       "tutL": [[0, None], [t_fis_yazici_calis + 0.9, "kagit"], [t_ece_kim_yazdiriyor + D["E_kim_yazdiriyor"] + 0.5, None],
                [t_ece_kapikolu + 0.05, "kapiKol"], [t_p4_son + 0.1, None],
                [t_telefon_calar + 0.25, "telefon"], [t_isiklar_geri_gelir - 0.2, None]],
       "tutR": [[0, None], [t_fis_yazici_calis + 0.9, "kagit"], [t_ece_kim_yazdiriyor + D["E_kim_yazdiriyor"] + 0.5, None],
                [t_ece_kapikolu + 0.05, "kapiKol"], [t_p4_son + 0.1, None],
                [t_telefon_calar + 0.25, "telefon"], [t_isiklar_geri_gelir - 0.2, None]],
       "isaretAci": 140, "ezil": [[0, 0]]}

# Spiker karakteri (TV ekranı için)
SPIKER = {"yer": [[0, 270, 760, 720]], "duygu": [[0, "notr"]], "bak": [[0, 0.02, 0.0, 0.05]],
          "tilt": [[0, 0]], "konus": [{"t": R3(t_spiker_aslan + VF), "cues": []}], "goz": [[0, 0]]}

# Kapı altı detayları (ışık, gölgeler, levha)
GX, GW, PX, PW = 0.74, 0.22, 0.93, 0.13
KA = [[0, 0.9, GX, GW, -1, 0, 1]]  # Başlangıçta ayak gölgesi yok
TIT = [[0, 0]]
LEVHA = [[0, 11]]
LEVHADY = [[0, 0]]

# P3 ışık kararma zamanlamaları
FLOR_KARARMA_P3_START = R3(t0_P3 + 0.1)
FLOR_KARARMA_P3_END = R3(FLOR_KARARMA_P3_START + 1.5)

# ------------------------------------------------------------------ Kamera (yan) ve Kurgu
P1.SINIR["yan"] = (0, 1080, 0, 1920)
kp = lambda cx, cy, z: P1.kirp("yan", cx, cy, z)

# Yan görünüm kamerası
CAMY = [[0] + kp(EK[0] + 30, EK[1] + 300, 1.7),
        [FLOR_KARARMA_P3_START] + kp(EK[0] + 30, EK[1] + 300, 1.7),
        [FLOR_KARARMA_P3_END] + kp(EK[0] - 100, EK[1] - 50, 2.5),
        [t_mert_aslan - 0.5] + kp(EK[0] - 100, EK[1] - 50, 2.5),
        [t_yaratik_sabrimiz - 0.5] + kp(EK[0] + 20, FK[1] + 120, 2.35),
        [t_ece_evrimini - 0.5] + kp(EK[0] + 20, FK[1] + 120, 2.35),
        [t_tv_on - 0.5] + kp(EK[0] - 150, FK[1] - 170, 1.9),
        [t_fis_yazici_calis - 0.5] + kp(KASA[0] * 1920, KASA[1] * 1080, 2.5),
        [t_ece_kim_yazdiriyor - 0.5] + kp(KASA[0] * 1920, KASA[1] * 1080 + 100, 3.0),
        [t_p3_son - 0.1] + kp(KASA[0] * 1920, KASA[1] * 1080 + 100, 3.0),

        [t0_P4] + kp(KASA[0] * 1920, KASA[1] * 1080 + 100, 3.0),
        [t_ece_el_yazim - 0.5] + kp(EK[0] + 20, FK[1] + 120, 2.35),
        [t_elif_26 - 0.5] + kp(EK[0] - 100, FK[1] + 40, 2.05),
        [t_ece_cok_saygideger - 0.5] + kp(EK[0] + 20, FK[1] + 120, 2.35),
        [t_yaratik_sabri - 0.5] + kp(EK[0] + 20, FK[1] + 120, 2.35),
        [t_ece_kapikolu - 0.5] + kp(EK[0] + 100, EK[1] - 100, 2.8),
        [t_p4_son - 0.1] + kp(EK[0] + 100, EK[1] - 100, 2.8),

        [t0_P5] + kp(EK[0] + 100, EK[1] - 100, 2.8),
        [t_mert_kural_iki - 0.5] + kp(EK[0] - 50, EK[1] + 50, 2.2),
        [t_telefon_calar - 0.5] + kp(EK[0] - 100, EK[1] - 100, 2.5),
        [t_sabri_telefon - 0.5] + kp(EK[0] - 100, EK[1] - 100, 2.5),
        [t_ece_abi_aslan - 0.5] + kp(EK[0] - 100, EK[1] - 100, 2.5),
        [t_aslan_depo_onune_yatar - 0.5] + kp(EK[0] + 20, FK[1] + 120, 2.35),
        [t_isiklar_geri_gelir - 0.5] + kp(EK[0] - 100, EK[1] + 50, 2.0),
        [t_fis_yazici_misafir_teslim - 0.5] + kp(KASA[0] * 1920, KASA[1] * 1080 + 100, 3.0),
        [t_elif_kayip - 0.5] + kp(SOL[0] * 1920, SOL[1] * 1080, 2.2),
        [t_elif_tesekkurler - 0.5] + kp(SOL[0] * 1920, SOL[1] * 1080, 2.2),
        [SON] + kp(SOL[0] * 1920, SOL[1] * 1080, 2.2)]

# Kurgu (görünüm geçişleri)
KURGU = [[0, "yan"],
         [t_mert_aslan, "fps"],
         [t_yaratik_sabrimiz - 0.5, "yan"],
         [t_tv_on, "tv"],
         [t_fis_yazici_calis - 0.5, "yan"],
         [t_p3_son, "yan"],

         [t0_P4, "yan"],
         [t_elif_26 - 0.5, "fps"],
         [t_ece_cok_saygideger - 0.5, "yan"],
         [t_yaratik_sabri - 0.5, "yan"],
         [t_p4_son, "yan"],

         [t0_P5, "yan"],
         [t_telefon_calar - 0.5, "yan"],
         [t_aslan_depo_onune_yatar - 0.5, "fps"],
         [t_isiklar_geri_gelir - 0.5, "yan"],
         [t_elif_kayip - 0.5, "fps"],
         [SON, "fps"]]

# Sarsıntı efektleri (titreşim)
SARS = [[0, 0],
        [t_ece_hassiktir + 0.03, 0.25], [t_ece_hassiktir + 0.15, 0],
        [t_ece_evrimini + 0.03, 0.3], [t_ece_evrimini + 0.15, 0],
        [t_mert_kural_iki + 0.03, 0.4], [t_mert_kural_iki + 0.15, 0],
        [t_yaratik_telefon_yankı + 0.03, 0.5], [t_yaratik_telefon_yankı + 0.15, 0],
        [t_elif_tesekkurler + 0.03, 0.3], [t_elif_tesekkurler + 0.15, 0]]

# Ortak sahne parametreleri
ORTAK = {"saat": [[0, "00:19"]], "kapi": [[0, 0]], "flor": [[0, 0.85]], "lamba": [[0, 0]],
         "titre": {"yan": 0.5, "tv": 0.3, "fps": 0.7},
         "eceArkada": True, "odak": [[0, 0]], "depo": [[0, 0]], "depoKol": [[0, 0]], "toz": [[0, 0]],
         "sars": SARS, "anime": {}, "animeMerkez": {},
         "levha": LEVHA, "levhaDy": LEVHADY, "kanatTit": TIT, "kapiAltBas": 0.6, "kapiAlt": KA,
         "ayakkabi": [[0, 1.63, 1.69, 79, 0]], "ayakkabiIz": [1.68, 1.9],
         "tvYayin": {"jen": R3(t_tv_on + 0.1), "sp": R3(t_spiker_aslan), "term": [], "kapat": R3(t_tv_on + D["N_aslan_saldirma"] + 1.0)},
         "karart": [[0, 0], [t_kararma_basla, 0], [SON, 1]],
         "kurgu": KURGU,
         "cam": {"yan": CAMY, "tv": [[0, 540, 820, 1.12], [SON, 540, 800, 1.16]]},
         "kar": {"yan": {"ece": ECE}, "tv": {"spiker": SPIKER}},
         "fx": []}

# Işık kararma ve geri gelme animasyonu
ORTAK["flor"] = [[0, 0.85],
                 [FLOR_KARARMA_P3_START, 0.85],
                 [FLOR_KARARMA_P3_END, 0.12],
                 [t_isiklar_geri_gelir, 0.12],
                 [t_isiklar_geri_gelir + 1.0, 0.85],
                 [SON, 0.85]]

# Titreşim yoğunluğunu karanlıkta artır
ORTAK["titre"]["yan"] = [[0, 0.5], [FLOR_KARARMA_P3_END - 0.1, 0.5], [FLOR_KARARMA_P3_END, 1.2],
                         [t_isiklar_geri_gelir, 1.2], [t_isiklar_geri_gelir + 0.5, 0.5], [SON, 0.5]]
ORTAK["titre"]["fps"] = ORTAK["titre"]["yan"]

# ------------------------------------------------------------------ FPS karakterleri ve kamera
MZ = -3.9
KZ = MZ + 0.1

# Mert karakteri (FPS görünümünde)
mert = {"id": "mert724", "w": [-0.42, -0.55, MZ], "boy": 1.75,
        "q": {"onKol": True, "dogalKol": True, "yay": 1, "duygu": [[0, "dehset"]],
              "bak": [[0, 0.2, -0.6, 0.15]],
              "tilt": [[0, -3]], "elR3": [[0, -0.05, 0.62, MZ + 0.3]], "elL3": [[0, -0.55, 0.5, MZ + 0.15]],
              "gozSok": [[0, 0.8]], "nefes": [[0, 3.5]]}}

# Elif karakteri (FPS görünümünde)
elif_kiz = {"id": "kacan724", "w": [-0.04, -0.74, KZ], "boy": 1.65, "tutam3": [-0.27, 0.66, MZ + 0.25],
        "q": {"onKol": True, "dogalKol": True, "yay": 1, "sacDagin": 0.5, "duygu": [[0, "dehset"]],
              "bak": [[0, -0.1, -0.6, -0.08]],
              "tilt": [[0, 6]], "egil": [[0, -8]], "elL3": [-0.27, 0.66, MZ + 0.25], "elR3": [[0, 0.3, 0.42, KZ + 0.25]],
              "gozSok": [[0, 1]], "nefes": [[0, 4]]}}

# FPS karakterlerinin aynalanması (b9_p2.py'den alınmıştır)
def _ayna(q):
    for a, b_ in (("elL3", "elR3"), ("tutL", "tutR")):
        if a in q:
            q[a], q[b_] = q.get(b_), q.get(a)
        elif b_ in q:
            q[a], q[b_] = q.get(b_), None
        if q.get(a) is None: q.pop(a, None)
        if q.get(b_) is None: q.pop(b_, None)
    if "bak" in q:
        q["bak"] = [[k[0], -k[1], k[2], -k[3]] for k in q["bak"]]

_ayna(mert["q"])
_ayna(elif_kiz["q"])

# Aslan'ın FPS görünümündeki hareketleri (gözleri P3'te, tümü P5'te)
ASLAN_FPS_POS = []
ASLAN_FPS_POS.append([R3(t_mert_aslan - 0.5), 1.0, 0.0, 0.0, 0, 0, 0, -1])
ASLAN_FPS_POS.append([R3(t_mert_aslan), 0.5, -0.05, 0.0, 0, 0.5, 0.2, -1])  # Gözler yaklaşıyor
ASLAN_FPS_POS.append([R3(t_mert_aslan + D["M_aslan_hediye"] + 0.5), 0.5, -0.05, 0.0, 0, 0.5, 0.2, -1])

x_aslan_start = 0.5
x_aslan_end = -0.05
ASLAN_FPS_POS.append([R3(t_aslan_depo_onune_yatar - 0.5), 1.0, 0.0, 0.0, 0, 0, 0, -1])
ASLAN_FPS_POS.append([R3(t_aslan_depo_onune_yatar), x_aslan_start, 0.0, 0.0, 0, 0.8, 0.5, -1])  # Aslan belirir
ASLAN_FPS_POS.append([R3(t_aslan_depo_onune_yatar + 2.0), x_aslan_end, 0.0, 0.0, 0, 0.8, 0.5, -1])  # Aslan yatar
ASLAN_FPS_POS.append([R3(t_isiklar_geri_gelir - 0.1), x_aslan_end, 0.0, 0.0, 0, 0.8, 0.5, -1])
ASLAN_FPS_POS.append([R3(t_elif_tesekkurler + D["K_tesekkurler_bezmenler"] / 2.0), x_aslan_end, 0.0, 0.0, 0, 0.8, 0.5, 0.5])  # Aslan başını kaldırır
ASLAN_FPS_POS.append([SON, x_aslan_end, 0.0, 0.0, 0, 0.8, 0.5, 0.5])

# FPS kamerası
FPS_SHARED_CAM = [[0, 0.02, 1.6, -1.28, -180, 13, -2],
                  [t_mert_aslan - 0.5, 0.02, 1.6, -1.28, -180, 13, -2],
                  [t_mert_aslan, 0.02, 1.6, -1.28, -180, 5, -2],
                  [t_mert_aslan + D["M_aslan_hediye"] + 0.5, 0.02, 1.6, -1.28, -180, 5, -2],
                  [t_aslan_depo_onune_yatar - 0.5, 0.02, 1.6, -1.28, -180, 13, -2],
                  [t_aslan_depo_onune_yatar, 0.02, 1.6, -1.28, -180, 5, -2],
                  [t_aslan_depo_onune_yatar + 2.0, 0.02, 1.6, -1.28, -180, 5, -2],
                  [t_isiklar_geri_gelir - 0.1, 0.02, 1.6, -1.28, -180, 5, -2],
                  [t_elif_kayip - 0.5, 0.02, 1.6, -1.28, -180, 8, -2],
                  [SON, 0.02, 1.6, -1.28, -180, 8, -2]]

# FPS sahne parametreleri
FPS_COMMON = {"mekan": "depo", "kacis": {"kar": [mert, elif_kiz]}, "kam": FPS_SHARED_CAM,
              "sallan": [[0, 0, 2.8]], "aslan": ASLAN_FPS_POS,
              "titreme": [[0, 0.7], [SON, 0.7]],
              "sars": SARS,
              "fov": [[0, 1.05], [SON, 1.6]], "kalp": [[0, 0.5], [SON, 0.8]], "sac": [[0, 9]],
              "karart": [[0, 0], [t_kararma_basla, 0], [SON, 1]]}

# Ses efekti yardımcı fonksiyonu
def E(t, isim, vol=0.5, **kw):
    return {"name": isim if "/" in isim else f"efekt/{isim}", "at": round(t, 3), "volume": vol, **kw}


if __name__ == "__main__":
    ep_id = "724-09-p3"

    # Yan görünüm (b8_market) insert'i oluşturan fonksiyon
    def yan(t0):
        return {"kind": "b8_market", "text": [json.dumps({**ORTAK, "t0": round(t0, 3)}, ensure_ascii=False, separators=(",", ":"))]}

    # FPS görünümü (b8_fps) insert'i oluşturan fonksiyon
    def fps(t0):
        return {"kind": "b8_fps", "text": [json.dumps({**FPS_COMMON, "t0": round(t0, 3)}, separators=(",", ":"))]}

    # Genel insert oluşturan fonksiyon
    def ins(t0, t1, ekle, sfx=None):
        bb = {"type": "insert", "dur": R3(t1 - t0), **ekle}
        if sfx:
            bb["sfx"] = sfx
        return bb

    # Replik (line) oluşturan fonksiyon
    def line(r_key, who, t0, t1, ekle, label=None, sfx=None):
        bb = {"type": "line", "who": who, "text": METIN[r_key], "emotion": "notr", "gapAfter": max(0.1, R3((t1 - t0) - D[r_key])), "ekle": ekle, "_r": r_key}
        if label is not None:
            bb["label"] = label
        if sfx:
            bb["sfx"] = sfx
        return bb

    # Bölümün sahnelerini (beats) oluştur
    beats = []

    # --------- Bölüm 3: Karanlık (~50 sn) ---------
    # 0-2: Işıklar söner, Ece "Hassiktir."
    beats.append(ins(t0_P3, t_ece_hassiktir, yan(t0_P3), [E(FLOR_KARARMA_P3_START - t0_P3 + 0.1, "b9_floresan", 0.16)]))
    beats.append(line("E_hassiktir", "ece_sivil", t_ece_hassiktir, t_mert_aslan - 0.5, yan(t_ece_hassiktir), sfx=[E(0.0, "b8y4_ece_nefes", 0.35)]))
    # 2-10: FPS: karanlık reyonda iki parlak göz yaklaşır (aslan) Mert ve Elif'in arkasında. Donarlar. Mert replik.
    beats.append(ins(t_mert_aslan - 0.5, t_yaratik_sabrimiz - 0.5, fps(t_mert_aslan - 0.5), [E(t_mert_aslan - (t_mert_aslan - 0.5) + 0.05, "muzik/b9_dehset", 0.32, zarf=[[0, 0], [0.5, 1], [7, 1]])]))
    beats.append(line("M_aslan_hediye", "mert724", t_mert_aslan, t_yaratik_sabrimiz - 0.5, fps(t_mert_aslan)))
    # 10-16: Kapı ardından yaratık (spiker sesi, emredici)
    beats.append(line("Y_sabrimiz_tukeniyor", "yaratik724b", t_yaratik_sabrimiz, t_ece_evrimini, yan(t_yaratik_sabrimiz), label=""))
    # 16-24: Ece küfür
    beats.append(line("E_evrimini_siktirmis", "ece_sivil", t_ece_evrimini, t_tv_on - 0.5, yan(t_ece_evrimini), sfx=[E(0.0, "el_kapi_arkasi_gum", 0.3)]))
    # 24-34: TV kendi kendine açılır (karanlıkta tek ışık): spiker repliği.
    beats.append(line("N_aslan_saldirma", "spiker", t_spiker_aslan, t_fis_yazici_calis - 0.5, yan(t_spiker_aslan), sfx=[E(0.0, "b9_haber_jenerik", 0.55)]))
    # 34-45: Kasadaki fiş yazıcısı kendiliğinden çalışır, uzun bir fiş çıkar. Ece fişi okur.
    beats.append(ins(t_fis_yazici_calis - 0.5, t_ece_kim_yazdiriyor, yan(t_fis_yazici_calis - 0.5), [E(0.0, "fis_yazici", 0.7)]))
    beats.append(line("E_kim_yazdiriyor", "ece_sivil", t_ece_kim_yazdiriyor, t_p3_son - 0.5, yan(t_ece_kim_yazdiriyor)))
    # 45-55: Ece fişi koparır; KANCA: fişin başında büyük harflerle "KURAL 5" — kesme.
    beats.append(ins(t_p3_son - 0.5, t_p3_son, {"type": "insert", "kind": "kurallar", "dur": R3(t_p3_son - (t_p3_son - 0.5)), "text": ["5", "", "Depodakine hakaret eden, ona bir misafir borçludur."]},
                     sfx=[E(0.0, "kagit_yirtma", 0.7), E(0.0, "muzik/b9_dehset", 0.2, zarf=[[0, 1], [0.5, 0]])]))

    # --------- Bölüm 4: Borç (~55 sn) ---------
    # 0-3: Fiş yakın: "5. DEPODAKİNE HAKARET EDEN, ONA BİR MİSAFİR BORÇLUDUR." Ece lamine kâğıda döner: aynı satır orada da, kendi el yazısıyla.
    beats.append(ins(t0_P4, t_ece_el_yazim, {"type": "insert", "kind": "kurallar", "dur": R3(t_ece_el_yazim - t0_P4), "text": ["5", "", "Depodakine hakaret eden, ona bir misafir borçludur."]},
                     sfx=[E(0.0, "muzik/b9_dehset", 0.3, zarf=[[0, 0], [0.5, 1], [3, 1]])]))
    beats.append(line("E_bu_benim_el_yazim", "ece_sivil", t_ece_el_yazim, t_yaratik_borc, yan(t_ece_el_yazim)))
    # 3-12: Yaratık "Borcunuzu ödeyin. En genç misafiri kapıya bırakın."
    beats.append(line("Y_borcunuzu_odeyin", "yaratik724b", t_yaratik_borc, t_elif_26, yan(t_yaratik_borc), label=""))
    # 12-26: Herkes Elif'e döner. Yaş hesaplaması.
    beats.append(line("K_yirmi_alti", "kacan724", t_elif_26, t_mert_25, fps(t_elif_26)))
    beats.append(line("M_yirmi_bes", "mert724", t_mert_25, t_ece_23, fps(t_mert_25)))
    beats.append(line("E_yirmi_uc", "ece_sivil", t_ece_23, t_elif_misafir_mi, yan(t_ece_23)))
    beats.append(line("K_misafir_tek_ben", "kacan724", t_elif_misafir_mi, t_ece_cok_saygideger, fps(t_elif_misafir_mi)))
    # 24-34: Ece yeni bir küfre başlar, ağzını eliyle kapatıp yutar (kural 5!).
    beats.append(line("E_cok_saygideger", "ece_sivil", t_ece_cok_saygideger, t_yaratik_sabri, yan(t_ece_cok_saygideger)))
    # 34-44: Kapının ardından Sabri'nin sesi (taklit). Ece'nin yüzü yumuşar.
    beats.append(line("Y_ece_kizim", "yaratik724b", t_yaratik_sabri, t_ece_kapikolu, yan(t_yaratik_sabri), label=""))
    # 44-55: KANCA: Ece'nin eli kapı kolunda; kol aşağı inmeye başlar — kesme.
    beats.append(ins(t_ece_kapikolu, t_p4_son, yan(t_ece_kapikolu), sfx=[E(0.0, "kapi_kolu_hareket", 0.6), E(0.0, "muzik/b9_dehset", 0.2, zarf=[[0, 1], [0.5, 0]])]))

    # --------- Bölüm 5: Bekçi (~55 sn) ---------
    # 0-3: KANCA: Mert Ece'nin bileğini yakalar. "Kural iki!"
    beats.append(ins(t0_P5, t_mert_kural_iki, yan(t0_P5), sfx=[E(0.0, "muzik/b9_dehset", 0.3, zarf=[[0, 0], [0.5, 1], [3, 1]])]))
    beats.append(line("M_kural_iki", "mert724", t_mert_kural_iki, t_telefon_calar, yan(t_mert_kural_iki)))
    # 3-14: Ece'nin telefonu çalar: ekranda "SABRİ ABİ". Sabri telefonda, yaratık yankı yapar.
    beats.append(ins(t_telefon_calar, t_sabri_telefon, {"type": "insert", "kind": "telefon_ekran", "dur": R3(t_sabri_telefon - t_telefon_calar), "text": ["SABRİ ABİ"]},
                     sfx=[E(0.0, "telefon_calma", 0.7)]))
    beats.append(line("S_ece_ben_evdeyim", "sabri", t_sabri_telefon, t_yaratik_telefon_yankı, yan(t_sabri_telefon)))
    beats.append(line("Y_kimseye_kapiyi_acma", "yaratik724b", t_yaratik_telefon_yankı, t_ece_abi_aslan, yan(t_yaratik_telefon_yankı), label=""))
    # 14-24: Ece panik "Abi! Abi, markette aslan var!" — sabri sakin "Aslan bizim kızım. Bekçi o."
    beats.append(line("E_abi_markette_aslan", "ece_sivil", t_ece_abi_aslan, t_sabri_aslan_bizim, yan(t_ece_abi_aslan)))
    beats.append(line("S_aslan_bizim", "sabri", t_sabri_aslan_bizim, t_aslan_depo_onune_yatar - 0.5, yan(t_sabri_aslan_bizim)))
    # 24-34: Aslan karanlıktan çıkar, Ece'nin yanından geçip depo kapısının önüne yatar.
    beats.append(ins(t_aslan_depo_onune_yatar - 0.5, t_ece_abi_sen_aslan, fps(t_aslan_depo_onune_yatar - 0.5),
                     sfx=[E(t_aslan_depo_onune_yatar - (t_aslan_depo_onune_yatar - 0.5), "b9_aslan_adim", 0.8), E(0.0, "muzik/b9_aslan", 0.34, zarf=[[0, 0], [0.5, 1], [5, 1]])]))
    beats.append(line("E_abi_sen_aslan", "ece_sivil", t_ece_abi_sen_aslan, t_sabri_kedi_mamasi, fps(t_ece_abi_sen_aslan)))
    beats.append(line("S_kedi_mamasi_pahali", "sabri", t_sabri_kedi_mamasi, t_isiklar_geri_gelir - 0.5, fps(t_sabri_kedi_mamasi)))
    # 34-44: Rahatlama: Ece yere çöker, Mert güler, ışıklar geri gelir. Fiş yazıcısı yeniden çalışır: "MİSAFİR TESLİM ALINDI."
    beats.append(ins(t_isiklar_geri_gelir - 0.5, t_fis_yazici_misafir_teslim, yan(t_isiklar_geri_gelir - 0.5),
                     sfx=[E(0.0, "b9_floresan_on", 0.2), E(0.0, "muzik/b9_aslan", 0.2, zarf=[[0, 1], [0.5, 0]])]))
    beats.append(ins(t_fis_yazici_misafir_teslim, t_elif_kayip, {"type": "insert", "kind": "kurallar", "dur": R3(t_elif_kayip - t_fis_yazici_misafir_teslim), "text": ["", "", "MİSAFİR TESLİM ALINDI."]},
                     sfx=[E(0.0, "fis_yazici", 0.7), E(0.0, "muzik/b9_aslan", 0.3, zarf=[[0, 0], [0.5, 1], [3, 1]])]))
    # 44-55: BÖLÜM SONU KANCASI: Ece ve Mert yavaşça döner: Elif'in oturduğu yerde yalnız kırmızı mini elbisenin parıltılı kolyesi ve diğer beyaz ayakkabısı. Kapının ardından ELİF'İN sesiyle: "Teşekkürler... sayın bezmenler." Aslan başını kaldırıp kapıya bakar. Kararma.
    beats.append(ins(t_elif_kayip, t_elif_tesekkurler, fps(t_elif_kayip)))
    beats.append(line("K_tesekkurler_bezmenler", "kacan724", t_elif_tesekkurler, t_kararma_basla, fps(t_elif_tesekkurler), sfx=[E(0.0, "muzik/b9_aslan", 0.2, zarf=[[0, 1], [0.5, 0]])]))
    beats.append(ins(t_kararma_basla, SON, {"type": "insert", "kind": "bos", "dur": R3(SON - t_kararma_basla)}, sfx=[E(0.0, "muzik/b9_aslan", 0.2, zarf=[[0, 0], [0.5, 1]])]))

    # Manifest dosyasını oluştur ve kaydet
    final_manifest = {}
    line_index = 1
    for bb in beats:
        if bb["type"] == "line":
            r_key_for_take = bb.pop("_r")  # "_r" anahtarını beats'ten çıkar
            # Manifeste "i_01", "i_02" gibi anahtarlar ekle
            final_manifest[f"i_{line_index:02d}"] = M[TAKE[r_key_for_take]]
            line_index += 1
    # Ayrıca TAKE'deki tüm ses dosyalarını manifest'e ekle, eğer henüz eklenmediyse (örneğin spiker gibi)
    for t_key in TAKE.values():
        if t_key not in final_manifest and t_key in M: # Ensure we don't overwrite i_NN keys.
            final_manifest[t_key] = M[t_key]


    os.makedirs(VD, exist_ok=True) # Ses dizinini oluştur
    json.dump(final_manifest, open(f"{VD}/manifest.json", "w"), ensure_ascii=False, indent=1)

    # Ortam müziği zarfı
    amb = [[0, 0.24],
           [FLOR_KARARMA_P3_START, 0.24], [FLOR_KARARMA_P3_END, 0.1],
           [t_isiklar_geri_gelir, 0.1], [t_isiklar_geri_gelir + 0.5, 0.24],
           [SON, 0.24]]

    # Sahne tanımı
    sah = {"id": "i", "set": "market_kapi", "time": "gece", "title": "Market · Aslan", "transition": "kesme", "cast": {},
           "ambience": {"name": "ortam/b8_market_gece", "volume": 0.24, "zarf": amb},
           "music": {"name": "yok"},
           "beats": beats}
    
    # Bölüm tanımı
    ep = {"series": "724", "seriesTitle": "7/24", "episode": ep_id, "episodeNo": 9, "title": "Bölüm 9 · Parça 3-5", "endCard": False, "scenes": [sah]}
    
    # Bölüm JSON dosyasını kaydet
    os.makedirs(f"{K}/public/episodes", exist_ok=True)
    json.dump(ep, open(f"{K}/public/episodes/{ep_id}.json", "w"), ensure_ascii=False, indent=1)

    print(f"Toplam süre: {SON:.2f} saniye. (Bölüm 3 sonu: {t_p3_son:.2f}, Bölüm 4 sonu: {t_p4_son:.2f})")

