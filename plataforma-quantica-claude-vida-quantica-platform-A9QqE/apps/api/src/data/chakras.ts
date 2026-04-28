export interface Chakra {
  key: string;
  name: string;
  color: string;
  questionIds: number[];
  description: string;
  whenWeak: string;
  practice: string;
}

export const chakras: Chakra[] = [
  {
    key: "raiz",
    name: "Muladhara — Raiz",
    color: "#c0392b",
    questionIds: [0, 1, 2],
    description: "Base. Segurança, sobrevivência, pertencimento.",
    whenWeak: "Medos financeiros, insegurança, ansiedade pelo futuro.",
    practice: "Caminhe descalço na grama 5min e faça respiração 4-7-8.",
  },
  {
    key: "sacro",
    name: "Svadhisthana — Sacro",
    color: "#e67e22",
    questionIds: [3, 4, 5],
    description: "Criatividade, sexualidade, prazer, emoções.",
    whenWeak: "Bloqueio criativo, dificuldade de sentir prazer.",
    practice: "Dance livremente por 10 minutos com música que te mova.",
  },
  {
    key: "plexo",
    name: "Manipura — Plexo Solar",
    color: "#f1c40f",
    questionIds: [6, 7, 8],
    description: "Poder pessoal, autoestima, vontade.",
    whenWeak: "Insegurança, dificuldade de impor limites.",
    practice: "Respire conscientemente colocando a mão sobre o plexo. Repita: \"eu posso\".",
  },
  {
    key: "cardiaco",
    name: "Anahata — Cardíaco",
    color: "#27ae60",
    questionIds: [9, 10, 11],
    description: "Amor, compaixão, conexão.",
    whenWeak: "Mágoas, dificuldade de receber afeto.",
    practice: "Escreva 3 perdões: a você, a alguém, à vida.",
  },
  {
    key: "laringeo",
    name: "Vishuddha — Laríngeo",
    color: "#3498db",
    questionIds: [12, 13, 14],
    description: "Comunicação, verdade, expressão.",
    whenWeak: "Dificuldade de dizer o que sente, voz contida.",
    practice: "Cante ou recite seu mantra do dia em voz alta.",
  },
  {
    key: "frontal",
    name: "Ajna — Terceiro Olho",
    color: "#8e44ad",
    questionIds: [15, 16, 17],
    description: "Intuição, visão, clareza.",
    whenWeak: "Confusão mental, falta de foco, descrença na intuição.",
    practice: "Medite 10min focando entre as sobrancelhas.",
  },
  {
    key: "coronario",
    name: "Sahasrara — Coroa",
    color: "#9b59b6",
    questionIds: [18, 19, 20],
    description: "Espiritualidade, conexão com o todo.",
    whenWeak: "Sensação de desconexão, falta de propósito.",
    practice: "Faça 5 minutos de silêncio com gratidão pela existência.",
  },
];

export const chakraQuestions: string[] = [
  "Sinto-me seguro(a) financeiramente.",
  "Tenho um lar onde me sinto enraizado(a).",
  "Confio que minhas necessidades básicas serão supridas.",
  "Permito-me sentir prazer sem culpa.",
  "Tenho uma vida criativa ativa.",
  "Honro meus desejos e emoções.",
  "Sinto que tenho poder sobre minha própria vida.",
  "Coloco limites com clareza quando necessário.",
  "Confio nas minhas decisões.",
  "Recebo amor com a mesma facilidade com que dou.",
  "Pratico a compaixão comigo mesmo(a).",
  "Sinto-me conectado(a) com as pessoas que amo.",
  "Expresso minha verdade mesmo quando é difícil.",
  "Sinto que minha voz é ouvida e respeitada.",
  "Tenho facilidade em comunicar o que sinto.",
  "Confio na minha intuição.",
  "Tenho clareza sobre o que quero da vida.",
  "Reconheço sinais e sincronicidades no dia a dia.",
  "Sinto-me parte de algo maior que eu.",
  "Tenho prática espiritual regular.",
  "Vivo com sensação de propósito.",
];

export function scoreChakras(answers: number[]) {
  const scores: Record<string, number> = {};
  for (const ch of chakras) {
    const sum = ch.questionIds.reduce((acc, qid) => acc + (answers[qid] ?? 0), 0);
    scores[ch.key] = Math.round((sum / (ch.questionIds.length * 5)) * 100);
  }
  const entries = Object.entries(scores);
  const weakest = entries.reduce((a, b) => (a[1] <= b[1] ? a : b))[0];
  const strongest = entries.reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
  return { scores, weakest, strongest };
}
