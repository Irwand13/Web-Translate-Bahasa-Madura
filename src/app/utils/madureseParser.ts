// EBNF Grammar untuk Bahasa Madura
// Kalimat = Subjek, Predikat, [Objek], [Keterangan];
// Subjek = Kata_Ganti | Kata_Benda;
// Predikat = Kata_Kerja | Kata_Sifat;
// Objek = Kata_Benda;
// Keterangan = Kata_Keterangan;

interface ParseResult {
  isValid: boolean;
  structure: string[];
  translation: string;
  tokens: {
    type: string;
    madurese: string;
    indonesian: string;
  }[];
  parseTree: ParseTreeNode | null;
}

interface ParseTreeNode {
  label: string;
  children?: ParseTreeNode[];
  word?: string;
}

// Kamus Bahasa Madura ke Indonesia
const dictionary: { [key: string]: { word: string; type: string } } = {
  // Subjek - Kata Ganti
  // === SUBJEK ===
  "sèngko'": { "word": "saya", "type": "S" },
  "bâ'na": { "word": "kamu", "type": "S" },
  "dhibi'na": { "word": "dia", "type": "S" },
  "abâ' dhibi'": { "word": "kita", "type": "S" },
  "kompoy": { "word": "kami", "type": "S" },
  "sakabbhina": { "word": "semua", "type": "S" },
  "orèng": { "word": "orang", "type": "S" },
  "na'-kana'": { "word": "anak-anak", "type": "S" },
  "rèng binè'": { "word": "perempuan", "type": "S" },
  "rèng lakè'": { "word": "laki-laki", "type": "S" },
  "orèng towa": { "word": "orang tua", "type": "S" },
  "embu'": { "word": "ibu", "type": "S" },
  "eppa'": { "word": "ayah", "type": "S" },
  "emba": { "word": "nenek/kakek", "type": "S" },
  "bhibbhi'": { "word": "bibi", "type": "S" },
  "anom": { "word": "paman", "type": "S" },
  "embhuk": { "word": "kakak (perempuan)", "type": "S" },
  "kaka'": { "word": "kakak (laki-laki)", "type": "S" },
  "alè'": { "word": "adik", "type": "S" },
  "tarètanna": { "word": "saudara", "type": "S" },
  "kanca": { "word": "teman", "type": "S" },
  "ca-kancana": { "word": "teman-teman", "type": "S" },
  "kalowarghá": { "word": "keluarga", "type": "S" },
  "kompoy": { "word": "kami", "type": "S" },
  "kompolan": { "word": "mereka", "type": "S" },
  "ghuru": { "word": "guru", "type": "S" },
  "ustad": { "word": "ustadz", "type": "S" },
  "kyai": { "word": "kiai", "type": "S" },
  "santré": { "word": "santri", "type": "S" },
  "morèd": { "word": "murid", "type": "S" },
  "tokang": { "word": "tukang", "type": "S" },
  "pongghábá": { "word": "pegawai", "type": "S" },
  "bupati": { "word": "bupati", "type": "S" },
  "kalèbun": { "word": "kepala desa", "type": "S" },
  "camat": { "word": "camat", "type": "S" },
  "polisi": { "word": "polisi", "type": "S" },
  "hakim": { "word": "hakim", "type": "S" },
  "dhukon": { "word": "dukun", "type": "S" },
  "rèng tanè": { "word": "petani", "type": "S" },
  "rèng majáng": { "word": "nelayan", "type": "S" },
  "rèng dhâgháng": { "word": "pedagang", "type": "S" },
  "rèng ngemmès": { "word": "pengemis", "type": "S" },
  "sodhâghâr": { "word": "pengusaha", "type": "S" },
  "malèng": { "word": "pencuri", "type": "S" },
  "bhâncolèng": { "word": "penjahat", "type": "S" },
  "kabulâ": { "word": "pembantu", "type": "S" },
  "sopir": { "word": "supir", "type": "S" },
  "kernét": { "word": "kenek", "type": "S" },
  "pongghaba": { "word": "pegawai negeri", "type": "S" },
  "manossa": { "word": "manusia", "type": "S" },
  "mano'": { "word": "burung", "type": "S" },
  "sapè": { "word": "sapi", "type": "S" },
  "kerbhuy": { "word": "kerbau", "type": "S" },
  "ajâm": { "word": "ayam", "type": "S" },
  "patè'": { "word": "anjing", "type": "S" },
  "kocèng": { "word": "kucing", "type": "S" },
  "embi'": { "word": "kambing", "type": "S" },
  "bhântheng": { "word": "banteng", "type": "S" },
  "bhâjá": { "word": "buaya", "type": "S" },
  "macan": { "word": "harimau", "type": "S" },
  "ghâjhá": { "word": "gajah", "type": "S" },
  "jârân": { "word": "kuda", "type": "S" },
  "bâbi": { "word": "babi", "type": "S" },
  "ketthang": { "word": "kera", "type": "S" },
  "monyèt": { "word": "monyet", "type": "S" },
  "tarbiliung": { "word": "kelinci", "type": "S" },
  "tekos": { "word": "tikus", "type": "S" },
  "olar": { "word": "ular", "type": "S" },
  "cekcek": { "word": "cicak", "type": "S" },
  "bârâkay": { "word": "biawak", "type": "S" },
  "katak": { "word": "katak", "type": "S" },
  "kepétèng": { "word": "kepiting", "type": "S" },
  "jhuko'": { "word": "ikan", "type": "S" },
  "bhândheng": { "word": "bandeng", "type": "S" },
  "jiniko'": { "word": "ikan", "type": "S" },
  "lala'": { "word": "lalat", "type": "S" },
  "nyarowan": { "word": "tawon", "type": "S" },
  "bhrâng": { "word": "lebah", "type": "S" },
  "ngè-rèngè": { "word": "kecoa", "type": "S" },
  "raprap": { "word": "rayap", "type": "S" },
  "tété": { "word": "benalu", "type": "S" },
  "concon": { "word": "keong", "type": "S" },
  "cacèng": { "word": "cacing", "type": "S" },
  "ola'": { "word": "ulat", "type": "S" },
  "bilis": { "word": "semut", "type": "S" },
  "rengage'": { "word": "nyamuk", "type": "S" },
  "sengnga'": { "word": "kalajengking", "type": "S" },
  "kèbân": { "word": "binatang", "type": "S" },
  "bhâkbhuru": { "word": "kelelawar", "type": "S" },
  "bhâlinè'": { "word": "kepik", "type": "S" },
  "bhâlen": { "word": "kumbang", "type": "S" },
  "cangkêm": { "word": "jangkrik", "type": "S" },
  "sèsèt": { "word": "capung", "type": "S" },
  "capo'": { "word": "belalang", "type": "S" },
  "bhungkana": { "word": "pohon", "type": "S" },
  "bhungkana pao": { "word": "pohon mangga", "type": "S" },
  "bhungkana nyèyor": { "word": "pohon kelapa", "type": "S" },
  "bhungkana jhâté": { "word": "pohon jati", "type": "S" },
  "bhungkana accem": { "word": "pohon asam", "type": "S" },
  "bhungkana rambutan": { "word": "pohon rambutan", "type": "S" },
  "bhungkana biuwàr": { "word": "pohon siwalan", "type": "S" },
  "kaju": { "word": "kayu", "type": "S" },
  "perrèng": { "word": "bambu", "type": "S" },
  "tabu": { "word": "tebu", "type": "S" },
  "kembhâng": { "word": "bunga", "type": "S" },
  "kembhâng malatè": { "word": "bunga melati", "type": "S" },
  "kembhâng mawar": { "word": "bunga mawar", "type": "S" },
  "dàun": { "word": "daun", "type": "S" },
  "dàun bhâkó": { "word": "daun tembakau", "type": "S" },
  "dàun tarnya'": { "word": "daun bayam", "type": "S" },
  "dàun marongghi": { "word": "daun kelor", "type": "S" },
  "ramo'": { "word": "akar", "type": "S" },
  "bhuwà": { "word": "buah", "type": "S" },
  "bhuwà pao": { "word": "buah mangga", "type": "S" },
  "bhuwà nyèyor": { "word": "buah kelapa", "type": "S" },
  "bhuwà jhâmbu": { "word": "buah jambu", "type": "S" },
  "bhuwà pakèl": { "word": "buah mangga muda", "type": "S" },
  "bhuwà komancèr": { "word": "buah asam muda", "type": "S" },
  "ghèḍḍháng": { "word": "pisang", "type": "S" },
  "paqí": { "word": "padi", "type": "S" },
  "bhâkó": { "word": "tembakau", "type": "S" },
  "jhâghung": { "word": "jagung", "type": "S" },
  "kacang": { "word": "kacang", "type": "S" },
  "kadhelli": { "word": "kedelai", "type": "S" },
  "kenthang": { "word": "kentang", "type": "S" },
  "têla": { "word": "ketela", "type": "S" },
  "komêrê": { "word": "kemiri", "type": "S" },
  "kencor": { "word": "kencur", "type": "S" },
  "komangè": { "word": "kemangi", "type": "S" },
  "kapri": { "word": "kapri", "type": "S" },
  "tarnya'": { "word": "bayam", "type": "S" },
  "kacèpèr": { "word": "kecipir", "type": "S" },
  "marongghi": { "word": "kelor", "type": "S" },
  "apokat": { "word": "alpukat", "type": "S" },
  "pakèl": { "word": "mangga muda", "type": "S" },
  "accem": { "word": "asam", "type": "S" },
  "komancèr": { "word": "asam muda", "type": "S" },
  "bângkovang": { "word": "bengkuang", "type": "S" },
  "kadungdung": { "word": "kedondong", "type": "S" },
  "jhung": { "word": "jeruk", "type": "S" },
  "pèlè": { "word": "pepaya", "type": "S" },
  "nanas": { "word": "nanas", "type": "S" },
  "salak": { "word": "salak", "type": "S" },
  "duwân": { "word": "durian", "type": "S" },
  "manggis": { "word": "manggis", "type": "S" },
  "rambutan": { "word": "rambutan", "type": "S" },
  "bhunga": { "word": "bunga", "type": "S" },
  "bhârât": { "word": "badai", "type": "S" },
  "angèn": { "word": "angin", "type": "S" },
  "angèn rajâ": { "word": "angin besar", "type": "S" },
  "angèn bhârât": { "word": "angin ribut", "type": "S" },
  "angèn kalèng busbus": { "word": "angin putting beliung", "type": "S" },
  "angèn lao'": { "word": "angin selatan", "type": "S" },
  "angèn dâjâ": { "word": "angin utara", "type": "S" },
  "angèn ghendhing": { "word": "angin tenggara", "type": "S" },
  "angèn ser-kalesserran": { "word": "angin sepoi-sepoi", "type": "S" },
  "angèn ceddhu": { "word": "angin tenang", "type": "S" },
  "ojhân": { "word": "hujan", "type": "S" },
  "ombâ'": { "word": "ombak", "type": "S" },
  "ombâ' rajâ": { "word": "ombak besar", "type": "S" },
  "panas": { "word": "panas", "type": "S" },
  "sorot": { "word": "sinar", "type": "S" },
  "ghâluḍhuk": { "word": "guntur", "type": "S" },
  "kelap": { "word": "kilat", "type": "S" },
  "bhântal": { "word": "bantal", "type": "S" },
  "kasor": { "word": "kasur", "type": "S" },
  "labâng": { "word": "pintu", "type": "S" },
  "jândelâ": { "word": "jendela", "type": "S" },
  "lantar": { "word": "lantai", "type": "S" },
  "atap": { "word": "atap", "type": "S" },
  "tembo'": { "word": "tembok", "type": "S" },
  "gheḍḍhung": { "word": "gedung", "type": "S" },
  "bengko": { "word": "rumah", "type": "S" },
  "gedḍhung sakola": { "word": "gedung sekolah", "type": "S" },
  "kompèl": { "word": "sekolah", "type": "S" },
  "kantor": { "word": "kantor", "type": "S" },
  "pasar": { "word": "pasar", "type": "S" },
  "toko": { "word": "toko", "type": "S" },
  "masèghit": { "word": "masjid", "type": "S" },
  "lambar": { "word": "lapangan", "type": "S" },
  "alun-alun": { "word": "alun-alun", "type": "S" },
  "lon-alon": { "word": "alun-alun", "type": "S" },
  "songay": { "word": "sungai", "type": "S" },
  "tasè'": { "word": "laut", "type": "S" },
  "pèngghir": { "word": "pantai", "type": "S" },
  "sombher": { "word": "sumber", "type": "S" },
  "alass": { "word": "hutan", "type": "S" },
  "ghumong": { "word": "gunung", "type": "S" },
  "bukit": { "word": "bukit", "type": "S" },
  "ḍlem": { "word": "dalam", "type": "S" },
  "bâtâs": { "word": "batas", "type": "S" },
  "ḍâlem": { "word": "dalam", "type": "S" },
  "ḍâtas": { "word": "atas", "type": "S" },
  "ḍâbâbâ": { "word": "bawah", "type": "S" },
  "ḍâkanger": { "word": "kanan", "type": "S" },
  "ḍâkacèr": { "word": "kiri", "type": "S" },
  "ḍâ'dâ'": { "word": "depan", "type": "S" },
  "ḍâburi": { "word": "belakang", "type": "S" },
  "ḍâttèng": { "word": "tengah", "type": "S" },
  "ḍâggâ": { "word": "luar", "type": "S" },
  "ḍâpong": { "word": "pinggir", "type": "S" },
  "ḍâjâ": { "word": "utara", "type": "S" },
  "ḍâlao": { "word": "selatan", "type": "S" },
  "ḍâbârâ'": { "word": "barat", "type": "S" },
  "ḍâtèmor": { "word": "timur", "type": "S" },
  "ḍâtèng": { "word": "datang", "type": "S" },
  "ḍângkat": { "word": "angkat", "type": "S" },
  "ḍângko'": { "word": "angkut", "type": "S" },
  "ḍângsur": { "word": "angsur", "type": "S" },
  "ḍâtar": { "word": "antar", "type": "S" },
  "ḍâtokar": { "word": "bertengkar", "type": "S" },
  "ḍâbâcâ": { "word": "baca", "type": "S" },

  // Predikat - Kata Kerja
 
  "ngala'": { "word": "mengambil", "type": "P" },
  "mellè": { "word": "membeli", "type": "P" },
  "ngajhâr": { "word": "mengajar", "type": "P" },
  "ngabâs": { "word": "melihat", "type": "P" },
  "ngoca'": { "word": "berkata/mengatakan", "type": "P" },
  "macà": { "word": "membaca", "type": "P" },
  "nolès": { "word": "menulis", "type": "P" },
  "nangès": { "word": "menangis", "type": "P" },
  "èn-maèn": { "word": "bermain", "type": "P" },
  "ajhâlân": { "word": "berjalan", "type": "P" },
  "ngakan": { "word": "makan", "type": "P" },
  "ngènom": { "word": "minum", "type": "P" },
  "amassa'": { "word": "memasak", "type": "P" },
  "aghábây": { "word": "membuat", "type": "P" },
  "nyambi": { "word": "membawa", "type": "P" },
  "mowang": { "word": "membuang", "type": "P" },
  "maddhek": { "word": "membangun", "type": "P" },
  "majâr": { "word": "membayar", "type": "P" },
  "majhaghâ": { "word": "bangun", "type": "P" },
  "makalowar": { "word": "mengeluarkan", "type": "P" },
  "mantong": { "word": "menunggu", "type": "P" },
  "marè": { "word": "selesai", "type": "P" },
  "maso'": { "word": "masuk", "type": "P" },
  "matè'è": { "word": "membunuh", "type": "P" },
  "mator": { "word": "mengatur", "type": "P" },
  "mattong": { "word": "menunggu", "type": "P" },
  "mèghâ'": { "word": "menangkap", "type": "P" },
  "mekkèr": { "word": "berpikir", "type": "P" },
  "melltong": { "word": "memilih", "type": "P" },
  "menta": { "word": "meminta", "type": "P" },
  "mokol": { "word": "memukul", "type": "P" },
  "mongkor": { "word": "membelakangi", "type": "P" },
  "morè": { "word": "mengikuti", "type": "P" },
  "mosna": { "word": "habis", "type": "P" },
  "motong": { "word": "memotong", "type": "P" },
  "mowa": { "word": "mengangkut", "type": "P" },
  "ngaddhu": { "word": "mengadu", "type": "P" },
  "ngadhi": { "word": "mengadili", "type": "P" },
  "ngajhâghâ": { "word": "mengajak", "type": "P" },
  "ngakko": { "word": "mengaku", "type": "P" },
  "ngambâng": { "word": "mengapung", "type": "P" },
  "ngambâ'": { "word": "mencegat", "type": "P" },
  "ngangghep": { "word": "menganggap", "type": "P" },
  "ngangka'": { "word": "mengangkat", "type": "P" },
  "ngangko'": { "word": "mengangkut", "type": "P" },
  "ngaollè": { "word": "mendapat", "type": "P" },
  "ngaro": { "word": "mengancam", "type": "P" },
  "ngator": { "word": "mengatur", "type": "P" },
  "ngawasè": { "word": "mengawasi", "type": "P" },
  "ngèḍḍhâ": { "word": "bangun tidur", "type": "P" },
  "ngènga'": { "word": "mengingat", "type": "P" },
  "ngènjâm": { "word": "meminjam", "type": "P" },
  "ngèrèm": { "word": "mengirim", "type": "P" },
  "ngobbar": { "word": "membakar", "type": "P" },
  "ngocèk": { "word": "mengaduk", "type": "P" },
  "ngoddhi": { "word": "mencoba", "type": "P" },
  "ngoko": { "word": "memelihara", "type": "P" },
  "ngola'": { "word": "menggoreng", "type": "P" },
  "ngollè": { "word": "mendapat", "type": "P" },
  "ngomong": { "word": "berbicara", "type": "P" },
  "ngorèng": { "word": "menggoreng", "type": "P" },
  "nyalè": { "word": "mencela", "type": "P" },
  "nyare": { "word": "mencari", "type": "P" },
  "nyèbâ'": { "word": "membelah", "type": "P" },
  "nyèkèl": { "word": "mencekik", "type": "P" },
  "ngagheng": { "word": "bersin", "type": "P" },
  "ngabâng": { "word": "mengangkasa", "type": "P" },
  "ngellos": { "word": "membelai", "type": "P" },
  "ngeccèt": { "word": "mengecat", "type": "P" },
  "nyathet": { "word": "mencatat", "type": "P" },
  "ngélaè": { "word": "menceboki", "type": "P" },
  "nyalaka'è": { "word": "mencederai", "type": "P" },
  "nyegghâ": { "word": "mencegah", "type": "P" },
  "nyegghât": { "word": "mencegat", "type": "P" },
  "nyekkel": { "word": "mencekik", "type": "P" },
  "nyalko": { "word": "menceletuk", "type": "P" },
  "nabu'": { "word": "mencabut", "type": "P" },
  "ngarbut": { "word": "mencabut", "type": "P" },
  "nyakar": { "word": "mencakar", "type": "P" },
  "meccot": { "word": "mencambuk", "type": "P" },
  "ngeppel": { "word": "mengepal", "type": "P" },
  "ngèpè'": { "word": "mengepit", "type": "P" },
  "ngomprès": { "word": "mengompres", "type": "P" },
  "ngebbhu!": { "word": "mengepul", "type": "P" },
  "ngeppong": { "word": "mengepung", "type": "P" },
  "agarèt": { "word": "mengerat", "type": "P" },
  "ngrekket": { "word": "mengerikiti", "type": "P" },
  "ngroyok": { "word": "mengeroyok", "type": "P" },
  "ngaro'": { "word": "mengeruk", "type": "P" },
  "makaceba": { "word": "mengejutkan", "type": "P" },

  
  // Objek - Kata Benda
  'beras': { word: 'beras', type: 'O' },
  'gula': { word: 'gula', type: 'O' },
  'kopi': { word: 'kopi', type: 'O' },
  'teh': { word: 'teh', type: 'O' },
  'susu': { word: 'susu', type: 'O' },
  'ikan': { word: 'ikan', type: 'O' },
  'daging': { word: 'daging', type: 'O' },
  'ayam': { word: 'ayam', type: 'O' },
  'telor': { word: 'telur', type: 'O' },
  'sayur': { word: 'sayur', type: 'O' },

  'pisang': { word: 'pisang', type: 'O' },
  'mangga': { word: 'mangga', type: 'O' },
  'apel': { word: 'apel', type: 'O' },
  'jeruk': { word: 'jeruk', type: 'O' },
  'kelapa': { word: 'kelapa', type: 'O' },

  'meja': { word: 'meja', type: 'O' },
  'kursi': { word: 'kursi', type: 'O' },
  'lemari': { word: 'lemari', type: 'O' },
  'pintu': { word: 'pintu', type: 'O' },
  'jendela': { word: 'jendela', type: 'O' },

  'baju': { word: 'baju', type: 'O' },
  'celana': { word: 'celana', type: 'O' },
  'sarung': { word: 'sarung', type: 'O' },
  'sepatu': { word: 'sepatu', type: 'O' },
  'sandal': { word: 'sandal', type: 'O' },

  'hp': { word: 'handphone', type: 'O' },
  'laptop': { word: 'laptop', type: 'O' },
  'komputer': { word: 'komputer', type: 'O' },
  'charger': { word: 'charger', type: 'O' },

  'sepeda': { word: 'sepeda', type: 'O' },
  'motor': { word: 'motor', type: 'O' },
  'mobil': { word: 'mobil', type: 'O' },
  'truk': { word: 'truk', type: 'O' },

  'buku': { word: 'buku', type: 'O' },
  'pena': { word: 'pena', type: 'O' },
  'pensil': { word: 'pensil', type: 'O' },
  'penghapus': { word: 'penghapus', type: 'O' },
  'penggaris': { word: 'penggaris', type: 'O' },

  'tugas': { word: 'tugas', type: 'O' },
  'pekerjaan': { word: 'pekerjaan', type: 'O' },
  'pelajaran': { word: 'pelajaran', type: 'O' },
  'ujian': { word: 'ujian', type: 'O' },

  'uang': { word: 'uang', type: 'O' },
  'dompet': { word: 'dompet', type: 'O' },
  'tiket': { word: 'tiket', type: 'O' },
  'surat': { word: 'surat', type: 'O' },

  'obat': { word: 'obat', type: 'O' },
  'masker': { word: 'masker', type: 'O' },
  'vitamin': { word: 'vitamin', type: 'O' },

  'rumah': { word: 'rumah', type: 'O' },
  'sekolah': { word: 'sekolah', type: 'O' },
  'kampus': { word: 'kampus', type: 'O' },
  'pasar': { word: 'pasar', type: 'O' },
  'masjid': { word: 'masjid', type: 'O' },

  // Keterangan - Kata Keterangan
  'dhibi': { word: 'di sini', type: 'K' },
  'dika': { word: 'di sana', type: 'K' },
  'ngala': { word: 'tadi', type: 'K' },
  'sateya': { word: 'sekarang', type: 'K' },
  'sabban': { word: 'besok', type: 'K' },
  'semalem': { word: 'kemarin', type: 'K' },
  'enggi': { word: 'iya', type: 'K' },
  'ta': { word: 'tidak', type: 'K' },
  'badha': { word: 'ada', type: 'K' },
  'tadha': { word: 'tidak ada', type: 'K' },
  'kalaban': { word: 'dengan', type: 'K' },
  'bi': { word: 'di', type: 'K' },
  'ka': { word: 'ke', type: 'K' },
  'se': { word: 'yang', type: 'K' },

  // Tempat
  'rumah': { word: 'di rumah', type: 'K' },
  'sekolah': { word: 'di sekolah', type: 'K' },
  'kampus': { word: 'di kampus', type: 'K' },
  'pasar': { word: 'di pasar', type: 'K' },
  'masjid': { word: 'di masjid', type: 'K' },

  'dalam': { word: 'di dalam', type: 'K' },
  'luar': { word: 'di luar', type: 'K' },
  'atas': { word: 'di atas', type: 'K' },
  'bawah': { word: 'di bawah', type: 'K' },
  'depan': { word: 'di depan', type: 'K' },
  'belakang': { word: 'di belakang', type: 'K' },
  'samping': { word: 'di samping', type: 'K' },

  // Waktu
  'sateya': { word: 'sekarang', type: 'K' },
  'ngala': { word: 'tadi', type: 'K' },
  'sabban': { word: 'besok', type: 'K' },
  'semalem': { word: 'kemarin', type: 'K' },
  'pagi': { word: 'pagi', type: 'K' },
  'siang': { word: 'siang', type: 'K' },
  'sore': { word: 'sore', type: 'K' },
  'malem': { word: 'malam', type: 'K' },

  // Cara / kondisi
  'cepet': { word: 'dengan cepat', type: 'K' },
  'alon': { word: 'pelan-pelan', type: 'K' },
  'pelan': { word: 'perlahan', type: 'K' },
  'atiati': { word: 'hati-hati', type: 'K' },
  'rame': { word: 'ramai', type: 'K' },
  'sepi': { word: 'sepi', type: 'K' },

  // Sebab / tujuan
  'polana': { word: 'karena', type: 'K' },
  'ben': { word: 'supaya', type: 'K' },
  'ka': { word: 'ke', type: 'K' },
  'bi': { word: 'di', type: 'K' },
  'kalaban': { word: 'dengan', type: 'K' },

  // Penegasan
  'engghi': { word: 'iya', type: 'K' },
  'ta': { word: 'tidak', type: 'K' },
  'badha': { word: 'ada', type: 'K' },
  'tadha': { word: 'tidak ada', type: 'K' },

};

export function parseMadurese(sentence: string): ParseResult {
  // Normalisasi input
  const normalized = sentence.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  
  const tokens: { type: string; madurese: string; indonesian: string }[] = [];
  const structure: string[] = [];
  let hasSubject = false;
  let hasPredicate = false;
  
  // Tokenisasi dan identifikasi jenis kata
  for (const word of words) {
    if (dictionary[word]) {
      const { word: translation, type } = dictionary[word];
      tokens.push({
        type: type,
        madurese: word,
        indonesian: translation,
      });
      
      if (!structure.includes(type)) {
        structure.push(type);
      }
      
      if (type === 'S') hasSubject = true;
      if (type === 'P') hasPredicate = true;
    } else {
      // Kata tidak dikenali, tetap tambahkan
      tokens.push({
        type: 'UNKNOWN',
        madurese: word,
        indonesian: word,
      });
    }
  }
  
  // Validasi struktur minimal (harus ada S dan P)
  const isValid = hasSubject && hasPredicate;
  
  // Generate terjemahan
  const translation = tokens.map(t => t.indonesian).join(' ');
  
  // Generate parse tree
  const parseTree = isValid ? generateParseTree(tokens) : null;
  
  return {
    isValid,
    structure,
    translation: translation.charAt(0).toUpperCase() + translation.slice(1),
    tokens,
    parseTree,
  };
}

function generateParseTree(tokens: { type: string; madurese: string; indonesian: string }[]): ParseTreeNode {
  const root: ParseTreeNode = {
    label: 'Kalimat',
    children: [],
  };
  
  const groups: { [key: string]: ParseTreeNode } = {
    S: { label: 'Subjek', children: [] },
    P: { label: 'Predikat', children: [] },
    O: { label: 'Objek', children: [] },
    K: { label: 'Keterangan', children: [] },
  };
  
  // Kelompokkan token berdasarkan tipe
  for (const token of tokens) {
    if (groups[token.type]) {
      groups[token.type].children!.push({
        label: token.madurese,
        word: token.indonesian,
      });
    }
  }
  
  // Tambahkan ke root sesuai urutan SPOK
  if (groups.S.children!.length > 0) root.children!.push(groups.S);
  if (groups.P.children!.length > 0) root.children!.push(groups.P);
  if (groups.O.children!.length > 0) root.children!.push(groups.O);
  if (groups.K.children!.length > 0) root.children!.push(groups.K);
  
  return root;
}

export function getEBNFGrammar(): string {
  return `Kalimat = Subjek, Predikat, [Objek], [Keterangan];

Subjek = Kata_Ganti | Kata_Benda;
Predikat = Kata_Kerja | Kata_Sifat;
Objek = Kata_Benda;
Keterangan = Kata_Keterangan | Kata_Tempat | Kata_Waktu;

Kata_Ganti = "sengko" | "bhadha" | "dhisa" | "kula" | "sampean";
Kata_Benda = "oreng" | "anak" | "guru" | "buku" | "nase" | ...;
Kata_Kerja = "makan" | "ngenom" | "ngaji" | "laju" | "dateng" | ...;
Kata_Sifat = "apek" | "cepet" | "rajin" | ...;
Kata_Keterangan = "dhibi" | "dika" | "sateya" | "kalaban" | ...;`;
}

export function getExampleSentences(): { 
  sentence: string; 
  isValid: boolean; 
  structure: string;
  meaning: string;
}[] {
  return [
    {
      sentence: "sengko makan nase",
      isValid: true,
      structure: "S - P - O",
      meaning: "Saya makan nasi",
    },
    {
      sentence: "guru ngajar lesson dhibi",
      isValid: true,
      structure: "S - P - O - K",
      meaning: "Guru mengajar pelajaran di sini",
    },
    {
      sentence: "anak belajar",
      isValid: true,
      structure: "S - P",
      meaning: "Anak belajar",
    },
    {
      sentence: "dhisa laju ka dika",
      isValid: true,
      structure: "S - P - K - K",
      meaning: "Dia pergi ke sana",
    },
    {
      sentence: "makan nase",
      isValid: false,
      structure: "P - O",
      meaning: "Tidak valid: tidak ada subjek",
    },
    {
      sentence: "buku apek",
      isValid: true,
      structure: "S - P",
      meaning: "Buku bagus",
    },
    {
      sentence: "murid ngaji buku bi dhibi",
      isValid: true,
      structure: "S - P - O - K - K",
      meaning: "Murid membaca buku di sini",
    },
  ];
}

export type { ParseResult, ParseTreeNode };
