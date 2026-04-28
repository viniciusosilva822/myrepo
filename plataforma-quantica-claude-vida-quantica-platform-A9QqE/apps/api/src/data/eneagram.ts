export interface EneagramType {
  num: number;
  name: string;
  motto: string;
  strengths: string;
  shadow: string;
  growth: string;
}

export const eneagramTypes: EneagramType[] = [
  {
    num: 1,
    name: "O Perfeccionista",
    motto: "Sou bom e correto.",
    strengths: "Ético, organizado, idealista.",
    shadow: "Crítica interna constante, rigidez.",
    growth: "Praticar imperfeição consciente. Soltar o controle.",
  },
  {
    num: 2,
    name: "O Prestativo",
    motto: "Sou amável.",
    strengths: "Generoso, acolhedor, empático.",
    shadow: "Ajuda esperando reconhecimento, dificuldade de pedir.",
    growth: "Cuidar de si com a mesma dedicação dos outros.",
  },
  {
    num: 3,
    name: "O Realizador",
    motto: "Sou bem-sucedido.",
    strengths: "Focado, eficiente, motivador.",
    shadow: "Vive da imagem, evita sentimentos.",
    growth: "Ser, não fazer. Permitir vulnerabilidade.",
  },
  {
    num: 4,
    name: "O Individualista",
    motto: "Sou único.",
    strengths: "Sensível, criativo, profundo.",
    shadow: "Inveja, melancolia, sensação de faltar algo.",
    growth: "Reconhecer o que já tem. Estabilidade emocional.",
  },
  {
    num: 5,
    name: "O Investigador",
    motto: "Sou capaz e perspicaz.",
    strengths: "Analítico, calmo, observador.",
    shadow: "Isolamento, avareza emocional.",
    growth: "Sair da mente, entrar no corpo. Compartilhar.",
  },
  {
    num: 6,
    name: "O Leal",
    motto: "Faço o que devo.",
    strengths: "Comprometido, responsável, leal.",
    shadow: "Ansiedade, dúvida, pensamento catastrófico.",
    growth: "Confiar em si e na vida. Coragem.",
  },
  {
    num: 7,
    name: "O Entusiasta",
    motto: "Sou feliz.",
    strengths: "Otimista, versátil, espontâneo.",
    shadow: "Foge da dor, dificuldade de finalizar.",
    growth: "Ficar com o que dói. Praticar foco.",
  },
  {
    num: 8,
    name: "O Desafiador",
    motto: "Sou forte.",
    strengths: "Líder, justo, protetor.",
    shadow: "Controle, dureza, evita vulnerabilidade.",
    growth: "Permitir-se ser cuidado. Suavidade.",
  },
  {
    num: 9,
    name: "O Pacificador",
    motto: "Estou em paz.",
    strengths: "Tranquilo, conciliador, presente.",
    shadow: "Procrastinação, evita conflito, se anula.",
    growth: "Despertar para o próprio desejo. Agir.",
  },
];

// 27 perguntas (3 por tipo)
export const eneagramQuestions: { text: string; type: number }[] = [
  { text: "Tenho um padrão alto e percebo erros rapidamente.", type: 1 },
  { text: "Sinto incômodo quando algo está fora do lugar.", type: 1 },
  { text: "Tenho uma voz crítica interna muito ativa.", type: 1 },
  { text: "Adoro ajudar os outros, é onde me sinto mais útil.", type: 2 },
  { text: "Tenho dificuldade em pedir ajuda.", type: 2 },
  { text: "Costumo perceber as necessidades alheias antes das minhas.", type: 2 },
  { text: "Foco em metas e resultados.", type: 3 },
  { text: "Me preocupo com a imagem que passo.", type: 3 },
  { text: "Tenho dificuldade em parar de produzir.", type: 3 },
  { text: "Sinto-me diferente das outras pessoas.", type: 4 },
  { text: "Tenho emoções intensas e profundas.", type: 4 },
  { text: "Frequentemente sinto que falta algo na minha vida.", type: 4 },
  { text: "Preciso de tempo sozinho para recarregar.", type: 5 },
  { text: "Gosto de entender as coisas antes de agir.", type: 5 },
  { text: "Reservo minha energia para o que considero essencial.", type: 5 },
  { text: "Imagino cenários ruins antes que aconteçam.", type: 6 },
  { text: "Sou muito leal a quem confio.", type: 6 },
  { text: "Sinto ansiedade frente a decisões importantes.", type: 6 },
  { text: "Me animo facilmente com novas ideias e projetos.", type: 7 },
  { text: "Evito ficar em situações desconfortáveis.", type: 7 },
  { text: "Tenho dificuldade em terminar o que comecei.", type: 7 },
  { text: "Vou direto ao ponto, sem rodeios.", type: 8 },
  { text: "Defendo quem amo com firmeza.", type: 8 },
  { text: "Tenho dificuldade em mostrar fragilidade.", type: 8 },
  { text: "Prefiro evitar conflitos.", type: 9 },
  { text: "Costumo concordar para manter a paz.", type: 9 },
  { text: "Posso me distrair em coisas pequenas e adiar o importante.", type: 9 },
];

export function scoreEneagram(answers: number[]) {
  const scores: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) scores[i] = 0;
  eneagramQuestions.forEach((q, idx) => {
    scores[q.type]! += answers[idx] ?? 0;
  });
  let topType = 1;
  let topScore = -Infinity;
  for (const [n, s] of Object.entries(scores)) {
    if (s > topScore) {
      topScore = s;
      topType = Number(n);
    }
  }
  return { scores, topType };
}
