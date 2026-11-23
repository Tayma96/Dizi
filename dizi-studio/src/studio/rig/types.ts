export type HairStyle =
  | "longStraight"
  | "longWavy"
  | "ponytail"
  | "bun"
  | "bob"
  | "curly"
  | "braids"
  | "shortMale"
  | "spiky"
  | "slick"
  | "buzz"
  | "balding"
  | "bald"
  | "hijab"
  /** Kırmızı Düğme: dağınık, yataktan kalkmış saç (tepede kalkık tutam) */
  | "daginik"
  /** Kırmızı Düğme: uzun katlı saç + perde kakül, uçları renkli (hair.uc) */
  | "perdeli"
  /** Kırmızı Düğme: seyrek, yağlı, dağınık saç (tepe açılmış, alına yapışık tutamlar, yağ parlaması) */
  | "yagli"
  /** Kırmızı Düğme: kısa sıkı perma (teyze) */
  | "perma";

export type Outfit =
  | "tshirt"
  | "sweater"
  | "shirt"
  | "suit"
  | "dress"
  | "cardigan"
  | "coat"
  | "hoodie"
  | "school"
  | "apron"
  | "labcoat"
  | "police"
  | "tracksuit"
  /** kabin görevlisi üniforması: ceket, bluz, fular, kanat rozeti, kalem etek */
  | "hostes"
  /** doğal lif dokuma tunik (ada halkı), ip kemer, saçaklı etek ucu */
  | "yerli"
  /** Kırmızı Düğme: beyaz atlet (kolsuz, fitilli) */
  | "atlet"
  /** Kırmızı Düğme: kurye montu (dik yaka, reflektör şeritler, göğüste uydurma logo) */
  | "kurye"
  /** Kırmızı Düğme: tek parça beyaz tulum (fermuar, kırmızı fermuar çekeceği) */
  | "tulum"
  /** Kırmızı Düğme: oversize pastel sweatshirt (düşük omuz, fitilli yaka/etek, baskı) */
  | "oversize"
  /** Kırmızı Düğme: düğmeli pijama takımı (biyeli yaka, ay-bulut desenli) */
  | "pijama";

export type Emotion =
  | "notr"
  | "baygin"
  | "mutlu"
  | "gulen"
  | "uzgun"
  | "agliyor"
  | "ofkeli"
  | "korkmus"
  | "saskin"
  | "sok"
  | "supheli"
  | "utangac"
  | "alayci"
  | "dusunceli"
  | "yorgun"
  | "soguk"
  | "kararli"
  | "igrenmis"
  /** baş ağrısı, sersemlik */
  | "aci"
  /** "Aç ağzını": ağız açık, yüz nötr */
  | "agizAcik"
  /** çığlık: dehşet, gözler fal taşı, kaşlar en yukarıda */
  | "dehset"
  /** 7/24 B5: sahte gülüş: ağız kocaman sırıtır, gözler gülmez (açık, donuk) */
  | "sahteGulus"
  /** 7/24 B5: korkudan zoraki gülümseme: kaşlar korkuyla yukarıda, ağız dişleri gösteren sırıtış */
  | "zorGulumse"
  /** 7/24 B5: mahçup: kaşlar yukarı-içe, gözler kaçamak, utangaç sırıtma + dudak ısırma, yanaklar kızarık */
  | "mahcup";

export type Gesture =
  | "rest"
  | "raf"
  | "basTut"
  | "yudum"
  | "okuma"
  | "elBelde"
  | "kollarBagli"
  | "isaret"
  | "elSalla"
  | "eliYuzunde"
  | "eliKalbinde"
  | "omuzSilk"
  | "yumruk"
  | "dusunme"
  | "telefon"
  | "tutuyor"
  | "ellerAcik"
  | "ellerYuzde"
  | "durDur"
  /** ağrıyan başını tutma (sağ el şakakta) */
  | "basTutma"
  | "golge"
  | "bastir"
  | "havaImza"
  | "havaImzaSol"
  | "kolTut"
  | "okşa"
  | "direksiyon"
  /** parmakla yanağa krem sürme (ovma) */
  | "krem"
  /** yanağını gösterme (sağ işaret parmağı yanağında) */
  | "yuzGoster"
  /** kafa kaşıma */
  | "kafaKasi"
  /** elindeki kâğıdı uzatma */
  | "uzat"
  /** 7/24 B5: "gel" diye el sallayarak çağırma (sol kol, önkol kıvrılır) */
  | "cagir"
  /** 7/24 B5: iki el göğüs önünde kenetli (hayran pozu) */
  | "ellerKenetli"
  /** Kırmızı Düğme: sol elle göbek kaşıma */
  | "gobekKasi"
  /** Kırmızı Düğme: iki el önde, slime yoğurma */
  | "slime"
  /** Kırmızı Düğme: telefonu iki eliyle YATAY tutar (film izler gibi), göbeğine dayar; prop "telefon_yatay" ile */
  | "telefonYatay";

export type Viseme = "X" | "A" | "E" | "I" | "O" | "U" | "M" | "F" | "L";

export type MouthCue = { t: number; v: Viseme };

export type Prop = "none" | "telefon" | "poset" | "fincan" | "mektup" | "canta" | "cicek" | "bicak" | "anahtar" | "kitap" | "kalem" | "tepsi" | "ilac" | "pano" | "bardak" | "sopa" | "telsiz" | "fener" | "ahize" | "kagit" | "sozlesme" | "kagit_top" | "cikolata" | "onluk_top" | "ambalaj" | "para" | "kasik" | "tablet" | "hindistan" | "slime" | "telefon_arka" | "telefon_yatay" | "tesbih" | "kolonya";

export type Look = {
  name: string;
  gender: "f" | "m";
  age: "child" | "teen" | "adult" | "old";
  build: "slim" | "normal" | "heavy";
  skin: string;
  skinShade: string;
  hair: { style: HairStyle; color: string; shade: string; /** perdeli: saç uçlarının rengi */ uc?: string };
  iris: string;
  facialHair?: "mustache" | "beard" | "stubble" | "goatee";
  outfit: {
    type: Outfit;
    top: string;
    topShade: string;
    bottom: string;
    shoes: string;
    /** tie / scarf / vest / inner shirt colour */
    accent?: string;
  };
  glasses?: string;
  /** korkunç yüz: çökük göz çukurları, kanlı gözler, iğne ucu göz bebekleri, dikişli yara, çatlak dudak, sivri dişler */
  korkunc?: boolean;
  earrings?: string;
  blush?: boolean;
  mole?: boolean;
  /** kaşta yara izi */
  scar?: boolean;
  /** sağ bilekte hasta bilekliği */
  bileklik?: boolean;
  /** yüzde kan (0-1): alında yarık, yanaktan süzülen kan */
  kan?: number;
  /** yırtık, kirli giysi */
  yirtik?: boolean;
  /** reçineli yaprak sargıları (alın ve kol) */
  sargi?: boolean;
  /** deniz kabuğu kolye rengi */
  kolye?: string;
  /** göğüste yaka kartı (isim) */
  isimlik?: string;
  /** başörtüsünde yazma deseni ve oya rengi */
  oya?: string;
  /** sağ yanakta iri sivilce */
  sivilce?: boolean;
  /* ---- Kırmızı Düğme (hepsi isteğe bağlı) ---- */
  /* ---- Kırmızı Düğme stil denemesi (opt-in) ---- */
  /** baş ölçeği çarpanı (büyük kafa stili ~1,35) */
  basOlcek?: number;
  /** imza göz tasarımı: "kd" = yuvarlak-kare iris, tek büyük parlama + küçük yıldız, kalın kapak */
  gozStili?: "kd";
  /** imza yanak işareti: "yastik" (yastık izi), "kalp" (üç minik kalp çil) */
  yanakIsaret?: "yastik" | "kalp";
  /** ağız ölçeği (esnek, abartılı ifadeler) */
  agizOlcek?: number;
  /** imza rozet: göğüste minik altıgen (petek) rozet; içinde karakterin simgesi */
  rozet?: { simge: "cips" | "kalp" | "simsek" | "damla" | "ay" | "dambil"; renk: string };
  /** boy çarpanı (silüet ayrımı için; 1 = normal) */
  boy?: number;
  /** omuz/gövde genişliği çarpanı (kabarık mont, geniş omuz) */
  omuzEn?: number;
  /** bütün vücut kilosu 0..1: geniş yüz + gıdı, kalın boyun/ense, kalın kol ve bacak, geniş kalça */
  kilo?: number;
  /** 1 haftalık sakal: noktalı kirli sakal yoğunluğu 0..1 (maske gibi düz dolgu değil) */
  sakalNokta?: number;
  /** şiş, morumsu göz altları */
  gozAlti?: boolean;
  /** kollarda/omuzlarda kıl */
  kil?: boolean;
  /** giyside lekeler */
  leke?: boolean;
  /** üstünde cips kırıntıları */
  kirinti?: boolean;
  /** tek terlik: sağ ayakta yalnız çorap */
  tekTerlik?: boolean;
  /** kask izi: saçta basık halka, alında ter parlaması */
  kaskIzi?: boolean;
  /** kablolu kulaklık (kulaktan göğse sarkan beyaz kablo) */
  kulaklikKablo?: boolean;
  /** takma tırnak rengi */
  tirnak?: string;
  /** alına itilmiş uyku maskesi rengi */
  uykuMaskesi?: string;
  /** tavşan terlik rengi */
  tavsanTerlik?: string;
  /** gözlük zinciri rengi (boncuklu) */
  gozlukZinciri?: string;
  /** hırka/pijama düğmelerinin rengi (pijamada yalnız biri bu renkte) */
  dugmeRenk?: string;
  /** ter bandı rengi */
  terBandi?: string;
  /** göğüste çapraz bel çantası rengi */
  belCantasi?: string;
  /** kalp toka rengi (perdeli saçta yıldızların yerine) */
  kalpToka?: string;
  /** göbek 0..1 (öne/yana taşan yuvarlak karın) */
  gobek?: number;
  /** atlet göbekte yukarı sıyrılmış: altta ince ten şeridi + göbek deliği */
  gobekAcik?: boolean;
  /** terlik (parmaklar görünür) */
  terlik?: string;
  /** pantolon yan şeridi (eşofman) */
  serit?: string;
  /** kask: kabuk rengi, şerit rengi, vizör açık mı */
  kask?: { renk: string; serit?: string; vizorAcik?: boolean };
  /** sırtta teslimat çantası (önden omuz üstünde ve yanlarda görünür) */
  sirtCanta?: { renk: string; kenar: string };
  /** kar maskesi (siyah örgü, göz yarığı + ağız deliği) */
  karMaske?: string;
  /** eldiven rengi (eller bu renkte) */
  eldiven?: string;
  /** makyaj */
  makyaj?: { ruj?: string; far?: string; eyeliner?: boolean; isilti?: boolean };
  /** halka küpe rengi */
  halka?: string;
  /** bilekte saç lastiği (scrunchie) rengi */
  toka?: string;
  /** sol bilekte kol saati (kayış rengi) */
  saat?: string;
  /** kulakta küçük kulaklık (renk) */
  kulaklik?: string;
  /** ayakkabı bağcığı rengi (bağlı ayakkabı) */
  bagcik?: string;
  /** buruşuk, tozlu giysi (kaçırılmış, yerde yatmış) */
  kirisik?: boolean;
  /** göğüs baskısı / logo: "vinn" (kurye), "blob" (sweatshirt), "cep" (gömlek cebi + kalem) */
  baski?: "vinn" | "blob" | "cep" | "kedi";
  /** sıvalı kollar (gömlek) */
  sivali?: boolean;
};

export type ArmPose = { upper: number; fore: number; ul?: number; fl?: number };

export type Pose = {
  emotion?: Emotion;
  gesture?: Gesture;
  /** Override individual arms (degrees). upper: + outward, fore: + outward bend */
  armL?: ArmPose;
  armR?: ArmPose;
  /** gaze -1..1 */
  lookX?: number;
  lookY?: number;
  /** head turn -1 (to screen left) .. 1 (to screen right) */
  yaw?: number;
  /** head tilt degrees */
  tilt?: number;
  /** kos: bel üstü karşıdan koşu döngüsü (0.3 sn adım); sendele: tek seferlik öne savrulma (sendeleK ile) */
  body?: "stand" | "sit" | "walk" | "kos";
  /** koşu fazı kaydırma (kare) */
  kosFaz?: number;
  /** koşu fazını doğrudan ver (radyan; adım zamanlarına kilitlemek için) */
  kosPh?: number;
  /** 7/24 B4: anime şok gözleri 0..1 (göz akı büyür, bebek nokta olur) */
  gozSok?: number;
  /** yutkunma ilerlemesi 0..1 (dışı: yok) */
  yutkun?: number;
  /** önlüğü çıkarma ilerlemesi 0..1 (at kuyruğuna takılma dahil) */
  onlukCikar?: number;
  /** saç dağınık (önlük takılmasından kalan teller) */
  sacDagin?: boolean;
  /** elindekini yere çarpma: çarpma anına göre zaman (sn; <0 hazırlık) */
  yereAt?: number;
  /** sendeleme ilerlemesi 0..1 */
  sendeleK?: number;
  /** diz çökme 0..1 (önden: sol diz yerde, sağ ayak basılı, diz yukarıda); geçiş için ara değerler */
  diz?: number;
  /** önlük giyme ilerlemesi 0..1 (0: elde katlı, 0,45: başın üstünde, 0,7: üstüne iner, 1: giyili, bağlı) */
  onluk?: number;
  /** bacakları çizme (yatakta, battaniye altında) */
  hideLegs?: boolean;
  /** bacak açıları (derece, kalçadan): [sol, sağ]; yerde dağınık yatış için */
  legRot?: [number, number];
  /** zemin gölgesini çizme (yerde yatarken) */
  golgesiz?: boolean;
  /** Lip sync: viseme cues (seconds) starting at frame `from` of the current sequence */
  speech?: { cues: MouthCue[]; from: number };
  /** Random mouth flaps when no cues are available */
  talk?: [number, number][];
  tears?: number;
  pale?: number;
  sweat?: boolean;
  /** sivilcenin üstünde krem */
  krem?: boolean;
  /** sağ elde lacivert mürekkep lekesi */
  murekkep?: boolean;
  /** alında serin yaprak */
  yaprak?: boolean;
  wet?: boolean;
  prop?: Prop;
  eyesClosed?: number;
  /** Breathing intensity multiplier (1 normal, 3 panting) */
  breath?: number;
  seed?: number;
  /** 7/24 B5: göz kırpmaz (sahte Sabri) */
  kirpmaz?: boolean;
  /** 7/24 B5: yüzde mum gibi, maske gibi parlaklık 0..1 */
  mumParlak?: number;
  /** 7/24 B5: yağmurda ıslanmış (omuzlar koyu, başta damlalar, çeneden damlayan su) 0..1 */
  yagmur?: number;
  /** 7/24 B5: nefes çekme (hıığğ) ilerlemesi 0..1 */
  hik?: number;
  /** 7/24 B5: kahkaha sarsıntısı (omuzlar, baş) 0..1 */
  kahkaha?: number;
  /** Kırmızı Düğme: kask vizöründe kayan yansımanın yatay kayması (px) */
  kaskYansima?: number;
  /** 7/24 B5: omuzlar düşük (mahçup) 0..1 */
  omuzDus?: number;
  /** 7/24 B5 p2 (opt-in): iki eliyle ağzını kapatır 0..1 (eller aşağıdan gelir); kolları çağıran ayarlar */
  agizKapa?: number;
  /** 7/24 B5 p2 (opt-in): ağzı kapalı ellerin titremesi 0..1 */
  elTitre?: number;
  /** 7/24 B5 p2 (opt-in): dudak titremesi 0..1 */
  dudakTitre?: number;
  /** 7/24 B5 p2 (opt-in): ağzı tek elle kapatır ("sag" = kadraj sağındaki el); öteki kol serbest */
  agizKapaEl?: "sag" | "sol";
  /** 7/24 B6 (opt-in): popo üstü yere çökme 0..1 (1: yerde oturur, dizler yukarıda, ayaklar önde); ara değerler çöküş */
  yerOtur?: number;
  /** 7/24 B6 (opt-in): hıçkırarak ağlama şiddeti 0..1 (kendi ritmi: 2-3 hızlı içe çekiş + uzun sarsıntılı veriş;
   *  omuzlar sıçrar, baş sarsılır, gözler sıkılır, ağız açılıp kapanır) */
  hickir?: number;
  /** 7/24 B6 (opt-in): hıçkırık ritminin faz kayması (sn) */
  hickirFaz?: number;
  /** 7/24 B6 (opt-in): ağlama ağzı açıklığı 0..1 (köşeler aşağı, üst dişler, titreyen alt dudak); konuşurken vizem öncelikli */
  aglaAgiz?: number;
  /** 7/24 B6 (opt-in): kolu çizme (sarılmada kol ayrıca çizilir) */
  kolGizle?: "l" | "r" | "ikisi";
};
