const VOWELS = new Set("AEIOUÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÄËÏÖÜY");

const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const MEANINGS: Record<number, { title: string; description: string }> = {
  1: {
    title: "O Pioneiro",
    description: "Liderança, iniciativa e originalidade. Você nasceu para abrir caminhos.",
  },
  2: {
    title: "O Diplomata",
    description: "Cooperação, sensibilidade e equilíbrio. Você floresce em parcerias.",
  },
  3: {
    title: "O Comunicador",
    description: "Expressão, criatividade e alegria. Sua voz inspira os outros.",
  },
  4: {
    title: "O Construtor",
    description: "Estrutura, disciplina e estabilidade. Você cria fundações sólidas.",
  },
  5: {
    title: "O Aventureiro",
    description: "Liberdade, mudança e versatilidade. A vida te chama para experimentar.",
  },
  6: {
    title: "O Cuidador",
    description: "Amor, família e responsabilidade. Você é o porto seguro de muitos.",
  },
  7: {
    title: "O Místico",
    description: "Sabedoria, introspecção e espiritualidade. Sua jornada é interior.",
  },
  8: {
    title: "O Realizador",
    description: "Poder, abundância e justiça. Você manifesta no mundo material.",
  },
  9: {
    title: "O Humanitário",
    description: "Compaixão, serviço e finalização. Você é uma alma antiga.",
  },
  11: {
    title: "O Mestre Intuitivo",
    description: "Número-mestre. Inspiração espiritual elevada e missão de iluminar.",
  },
  22: {
    title: "O Mestre Construtor",
    description: "Número-mestre. Capacidade de transformar visões em realidade concreta.",
  },
  33: {
    title: "O Mestre Curador",
    description: "Número-mestre. Amor incondicional, ensino e cura coletiva.",
  },
};

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

function letters(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, (m) => m)
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÄËÏÖÜY]/g, "");
}

function ascii(letter: string) {
  return letter
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function calculateNumerology(fullName: string, birthDate: Date) {
  const cleaned = letters(fullName);
  let vowelSum = 0;
  let consonantSum = 0;
  let totalSum = 0;
  for (const ch of cleaned) {
    const a = ascii(ch);
    const value = LETTER_VALUES[a] ?? 0;
    totalSum += value;
    if (VOWELS.has(ch)) vowelSum += value;
    else consonantSum += value;
  }

  const lifePath = reduce(
    birthDate.getUTCDate() + (birthDate.getUTCMonth() + 1) + birthDate.getUTCFullYear(),
  );
  const destiny = reduce(totalSum);
  const soulUrge = reduce(vowelSum);
  const personality = reduce(consonantSum);

  return {
    lifePath,
    destiny,
    soulUrge,
    personality,
    meanings: {
      lifePath: MEANINGS[lifePath],
      destiny: MEANINGS[destiny],
      soulUrge: MEANINGS[soulUrge],
      personality: MEANINGS[personality],
    },
  };
}
