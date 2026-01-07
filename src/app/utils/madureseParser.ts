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
  'sengko': { word: 'saya', type: 'S' },
  'bana': { word: 'kamu', type: 'S' },
  'sampean': { word: 'anda', type: 'S' },
  'kula sadajah': { word: 'kami', type: 'S' },
  'oreng-oreng rowa': { word: 'mereka', type: 'S' },

  // Subjek - orang
  'oreng': { word: 'orang', type: 'S' },
  'lake': { word: 'laki-laki', type: 'S' },
  'bine': { word: 'perempuan', type: 'S' },
  'na-kana': { word: 'anak', type: 'S' },
  'ghuruh': { word: 'guru', type: 'S' },
  'murid': { word: 'murid', type: 'S' },
  'bapa': { word: 'bapak', type: 'S' },
  'embu': { word: 'ibu', type: 'S' },
  'ale': { word: 'adik', type: 'S' },
  'kakakna': { word: 'kakak', type: 'S' },
  
  // Predikat - Kata Kerja
  'ngakan': { word: 'makan', type: 'P' },
  'ngenom': { word: 'minum', type: 'P' },
  'macah': { word: 'membaca', type: 'P' },
  'noles': { word: 'menulis', type: 'P' },
  'marinta': { word: 'memerintah', type: 'P' },
  'tedung': { word: 'tidur', type: 'P' },
  'ajhalen': { word: 'berjalan', type: 'P' },
  'mangkat': { word: 'pergi', type: 'P' },
  'dateng': { word: 'datang', type: 'P' },
  'muleh': { word: 'pulang', type: 'P' },
  'ngajar': { word: 'mengajar', type: 'P' },
  'ajher': { word: 'belajar', type: 'P' },
  
  // Predikat - Kata Sifat
  'bhagus': { word: 'bagus', type: 'P' },
  'apek': { word: 'bagus', type: 'P' },
  'cepet': { word: 'cepat', type: 'P' },
  'laon': { word: 'lambat', type: 'P' },
  'males': { word: 'malas', type: 'P' },
  'budhuh': { word: 'bodoh', type: 'P' },
  'ghanteng': { word: 'tampan', type: 'P' },
  'raddin'  : { word: 'cantik', type: 'P' },
  'jhubet': { word: 'jelek', type: 'P' },
  
  // Objek - Kata Benda
  'buku': { word: 'buku', type: 'O' },
  'bolpen': { word: 'pena', type: 'O' },
  'roti': { word: 'roti', type: 'O' },
  'nase': { word: 'nasi', type: 'O' },
  'jukok': { word: 'ikan', type: 'O' },
  'pangajharan': { word: 'pelajaran', type: 'O' },
  'tugas': { word: 'tugas', type: 'O' },
  'ajem': { word: 'ayam', type: 'O' },
  "pesse": { word: 'uang', type: 'O' },
  'embik': { word: 'kambing', type: 'O' },
  'sape': { word: 'sapi', type: 'O' },
  
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
      sentence: "guru ngajar pangajharan dhibi",
      isValid: true,
      structure: "S - P - O - K",
      meaning: "Guru mengajar pelajaran di sini",
    },
    {
      sentence: "na'-kana' amain ",
      isValid: true,
      structure: "S - P",
      meaning: "Anak belajar",
    },
    {
      sentence: "embik laju ka dika",
      isValid: true,
      structure: "S - P - K - K",
      meaning: "kambing pergi ke sana",
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
