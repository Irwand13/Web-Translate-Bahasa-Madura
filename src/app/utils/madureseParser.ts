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
  'bhadha': { word: 'kamu', type: 'S' },
  'dhisa': { word: 'dia', type: 'S' },
  'kula': { word: 'saya', type: 'S' },
  'sampean': { word: 'anda', type: 'S' },
  
  // Subjek - Kata Benda
  'oreng': { word: 'orang', type: 'S' },
  'lake': { word: 'laki-laki', type: 'S' },
  'bine': { word: 'perempuan', type: 'S' },
  'anak': { word: 'anak', type: 'S' },
  'guru': { word: 'guru', type: 'S' },
  'murid': { word: 'murid', type: 'S' },
  'bapa': { word: 'bapak', type: 'S' },
  'embu': { word: 'ibu', type: 'S' },
  'nyama': { word: 'saudara', type: 'S' },
  'kabbi': { word: 'adik', type: 'S' },
  
  // Predikat - Kata Kerja
  'makan': { word: 'makan', type: 'P' },
  'ngakan': { word: 'makan', type: 'P' },
  'ngenom': { word: 'minum', type: 'P' },
  'ngaji': { word: 'membaca', type: 'P' },
  'nyurat': { word: 'menulis', type: 'P' },
  'marinta': { word: 'memerintah', type: 'P' },
  'ngombe': { word: 'minum', type: 'P' },
  'todus': { word: 'tidur', type: 'P' },
  'jalan': { word: 'berjalan', type: 'P' },
  'laju': { word: 'pergi', type: 'P' },
  'dateng': { word: 'datang', type: 'P' },
  'muleh': { word: 'pulang', type: 'P' },
  'ngajar': { word: 'mengajar', type: 'P' },
  'belajar': { word: 'belajar', type: 'P' },
  'maos': { word: 'membaca', type: 'P' },
  
  // Predikat - Kata Sifat
  'bagus': { word: 'bagus', type: 'P' },
  'apek': { word: 'bagus', type: 'P' },
  'cepet': { word: 'cepat', type: 'P' },
  'lalar': { word: 'cepat', type: 'P' },
  'lemot': { word: 'lambat', type: 'P' },
  'rajin': { word: 'rajin', type: 'P' },
  'males': { word: 'malas', type: 'P' },
  
  // Objek - Kata Benda
  'buku': { word: 'buku', type: 'O' },
  'pena': { word: 'pena', type: 'O' },
  'roti': { word: 'roti', type: 'O' },
  'nase': { word: 'nasi', type: 'O' },
  'jukoq': { word: 'air', type: 'O' },
  'tape': { word: 'kue', type: 'O' },
  'lesson': { word: 'pelajaran', type: 'O' },
  'tugas': { word: 'tugas', type: 'O' },
  
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
