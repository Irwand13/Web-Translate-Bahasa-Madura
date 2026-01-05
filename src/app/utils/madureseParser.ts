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
  'sengko': { word: 'saya', type: 'S' },
  'engko': { word: 'saya', type: 'S' },
  'kula': { word: 'saya', type: 'S' },
  'bhadha': { word: 'kamu', type: 'S' },
  'sampean': { word: 'anda', type: 'S' },
  'dhisa': { word: 'dia', type: 'S' },
  'pole': { word: 'dia', type: 'S' },
  'oreng': { word: 'orang', type: 'S' },
  'anak': { word: 'anak', type: 'S' },
  'lake': { word: 'laki-laki', type: 'S' },
  'bine': { word: 'perempuan', type: 'S' },
  'bapa': { word: 'ayah', type: 'S' },
  'embu': { word: 'ibu', type: 'S' },
  'kanca': { word: 'teman', type: 'S' },
  'taretan': { word: 'saudara', type: 'S' },
  'murid': { word: 'murid', type: 'S' },
  'guru': { word: 'guru', type: 'S' },
  'dosen': { word: 'dosen', type: 'S' },
  'petani': { word: 'petani', type: 'S' },
  'nelayan': { word: 'nelayan', type: 'S' },
  'pedagang': { word: 'pedagang', type: 'S' },
  'ustad': { word: 'ustaz', type: 'S' },
  'santri': { word: 'santri', type: 'S' },
  'polisi': { word: 'polisi', type: 'S' },
  'tni': { word: 'tentara', type: 'S' },
  'kepala': { word: 'kepala', type: 'S' },
  'tangan': { word: 'tangan', type: 'S' },
  'mata': { word: 'mata', type: 'S' },
  'kaki': { word: 'kaki', type: 'S' },

  // Predikat - Kata Kerja
  'makan': { word: 'makan', type: 'P' },
  'ngakan': { word: 'makan', type: 'P' },
  'ngenom': { word: 'minum', type: 'P' },
  'ngombe': { word: 'minum', type: 'P' },
  'todus': { word: 'tidur', type: 'P' },
  'ngaji': { word: 'membaca', type: 'P' },
  'maos': { word: 'membaca', type: 'P' },
  'nyurat': { word: 'menulis', type: 'P' },
  'ngajar': { word: 'mengajar', type: 'P' },
  'belajar': { word: 'belajar', type: 'P' },
  'laju': { word: 'pergi', type: 'P' },
  'dateng': { word: 'datang', type: 'P' },
  'muleh': { word: 'pulang', type: 'P' },
  'berangkat': { word: 'berangkat', type: 'P' },
  'ngala': { word: 'mengambil', type: 'P' },
  'melle': { word: 'membeli', type: 'P' },
  'ngadep': { word: 'menghadap', type: 'P' },
  'ngoca': { word: 'berbicara', type: 'P' },
  'ngarti': { word: 'mengerti', type: 'P' },
  'ngantos': { word: 'menunggu', type: 'P' },
  'ngurus': { word: 'mengurus', type: 'P' },
  'ngabbi': { word: 'menghabiskan', type: 'P' },
  'kerja': { word: 'bekerja', type: 'P' },
  'istirahat': { word: 'istirahat', type: 'P' },
  'apek': { word: 'bagus', type: 'P' },
  'bagus': { word: 'bagus', type: 'P' },
  'cepet': { word: 'cepat', type: 'P' },
  'lambat': { word: 'lambat', type: 'P' },
  'rajin': { word: 'rajin', type: 'P' },
  'males': { word: 'malas', type: 'P' },
  'penter': { word: 'pintar', type: 'P' },
  'bodoh': { word: 'bodoh', type: 'P' },
  'tinggi': { word: 'tinggi', type: 'P' },
  'pendek': { word: 'pendek', type: 'P' },
  'gede': { word: 'besar', type: 'P' },
  'kene': { word: 'kecil', type: 'P' },
  'sehat': { word: 'sehat', type: 'P' },
  'sakit': { word: 'sakit', type: 'P' },
  'capek': { word: 'lelah', type: 'P' },

  
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
