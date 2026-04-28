import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/auth.js";
import { BADGE_DEFS } from "../lib/badges.js";
import { env } from "../lib/env.js";

const MANTRAS = [
  { text: "Eu sou o que penso. Hoje, escolho pensar em paz." },
  { text: "Minha frequência atrai minha realidade." },
  { text: "Eu mereço receber o melhor da vida." },
  { text: "Sou um canal de luz e criação." },
  { text: "Tudo o que preciso já existe dentro de mim." },
  { text: "Eu confio no fluxo. O caminho se revela conforme caminho." },
  { text: "Cada respiração é um recomeço." },
  { text: "Eu honro meu corpo, minha mente e minha alma." },
  { text: "Onde está minha atenção, está minha energia." },
  { text: "Eu sou amor em movimento." },
  { text: "Liberto-me do que não é mais meu." },
  { text: "Tenho coragem de ser quem realmente sou." },
  { text: "Sou abundância em forma humana." },
  { text: "O Universo conspira a meu favor." },
  { text: "Eu acolho minhas emoções com gentileza." },
  { text: "Hoje, escolho ser presente." },
  { text: "Sou suficiente, exatamente como sou." },
  { text: "Curo o passado vivendo plenamente o agora." },
  { text: "Cada dia é uma nova chance de elevar minha vibração." },
  { text: "Sou guiado pela minha intuição." },
  { text: "Confio no tempo certo das coisas." },
  { text: "A gratidão multiplica meus dons." },
];

const PROMPTS = [
  { text: "Quais 3 emoções estão mais presentes em mim hoje?", category: "emocional" },
  { text: "O que está pedindo para ser solto?", category: "espiritual" },
  { text: "Em que momento de hoje me senti em frequência alta?", category: "frequencia" },
  { text: "Que padrão estou repetindo que já não me serve?", category: "autoconhecimento" },
  { text: "Pelo que sou profundamente grato(a) hoje?", category: "gratidao" },
  { text: "Que verdade ainda evito olhar de frente?", category: "sombra" },
  { text: "Onde estou me sabotando?", category: "autoconhecimento" },
  { text: "Como meu corpo está se sentindo agora? Onde está tenso?", category: "corpo" },
  { text: "Que pessoa de mim está pedindo cuidado hoje?", category: "crianca-interior" },
  { text: "Que decisão pequena posso tomar agora para honrar quem sou?", category: "acao" },
  { text: "Que conversa preciso ter — com alguém ou comigo mesmo?", category: "verdade" },
  { text: "O que aprendi nas últimas 24 horas?", category: "aprendizado" },
  { text: "Onde minha intuição esteve certa esta semana?", category: "intuicao" },
  { text: "Que crença antiga está pronta para ir embora?", category: "limpeza" },
];

const MEDITATIONS = [
  {
    title: "Acolhendo a ansiedade",
    description: "Meditação guiada de 10 minutos para acalmar o sistema nervoso.",
    audioUrl: "https://exemplo.com/audio/ansiedade.mp3",
    durationSec: 600,
    category: "ansiedade",
  },
  {
    title: "Sono profundo",
    description: "Para induzir o sono com respiração 4-7-8.",
    audioUrl: "https://exemplo.com/audio/sono.mp3",
    durationSec: 1200,
    category: "sono",
  },
  {
    title: "Foco e clareza",
    description: "5 minutos para centrar a mente antes de uma tarefa importante.",
    audioUrl: "https://exemplo.com/audio/foco.mp3",
    durationSec: 300,
    category: "foco",
  },
  {
    title: "Frequência de abundância",
    description: "Visualização para abrir caminhos de prosperidade.",
    audioUrl: "https://exemplo.com/audio/abundancia.mp3",
    durationSec: 900,
    category: "abundancia",
  },
  {
    title: "Gratidão que vibra",
    description: "Eleve sua frequência conectando-se com gratidão real.",
    audioUrl: "https://exemplo.com/audio/gratidao.mp3",
    durationSec: 600,
    category: "gratidao",
  },
  {
    title: "Solfeggio 528 Hz",
    description: "Frequência do amor e da cura. Áudio contínuo.",
    audioUrl: "https://exemplo.com/audio/528hz.mp3",
    durationSec: 1800,
    category: "frequencia",
  },
];

const CONTENTS = [
  {
    title: "Manual da Frequência",
    type: "EBOOK" as const,
    description: "Guia prático para identificar e elevar sua frequência diária.",
    url: "https://exemplo.com/ebooks/manual-frequencia.pdf",
    category: "fundamentos",
    isFeatured: true,
  },
  {
    title: "Os 7 Chakras na Prática",
    type: "EBOOK" as const,
    description: "Como reconhecer bloqueios e equilibrar sua energia.",
    url: "https://exemplo.com/ebooks/chakras.pdf",
    category: "energia",
  },
  {
    title: "Aula Bônus: Crença e Realidade",
    type: "VIDEO" as const,
    description: "Como suas crenças moldam o que você atrai.",
    url: "https://exemplo.com/videos/crenca-realidade.mp4",
    durationSec: 1800,
    category: "fundamentos",
    isFeatured: true,
  },
  {
    title: "Físico e Emocional: a Conexão",
    type: "ARTICLE" as const,
    description: "Como o corpo expressa o que a alma cala.",
    url: "https://exemplo.com/artigos/corpo-emocao",
    category: "corpo",
  },
];

async function main() {
  console.log("→ Seed iniciado");

  // Admin
  if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    const admin = await prisma.user.upsert({
      where: { email: env.ADMIN_EMAIL.toLowerCase() },
      create: {
        email: env.ADMIN_EMAIL.toLowerCase(),
        name: "Admin",
        passwordHash: await hashPassword(env.ADMIN_PASSWORD),
        role: "ADMIN",
      },
      update: { role: "ADMIN" },
    });
    console.log(`✓ Admin: ${admin.email}`);
  }

  // Aluno demo
  const demo = await prisma.user.upsert({
    where: { email: "aluno@vidaquantica.com" },
    create: {
      email: "aluno@vidaquantica.com",
      name: "Aluno Demo",
      passwordHash: await hashPassword("demo1234"),
    },
    update: {},
  });
  await prisma.access.upsert({
    where: { userId: demo.id },
    create: {
      userId: demo.id,
      source: "MANUAL",
      status: "ACTIVE",
    },
    update: { status: "ACTIVE", revokedAt: null },
  });
  console.log(`✓ Aluno demo: aluno@vidaquantica.com / demo1234`);

  // Mantras
  await prisma.mantra.deleteMany();
  await prisma.mantra.createMany({ data: MANTRAS });
  console.log(`✓ ${MANTRAS.length} mantras`);

  // Prompts
  await prisma.journalPrompt.deleteMany();
  await prisma.journalPrompt.createMany({ data: PROMPTS });
  console.log(`✓ ${PROMPTS.length} prompts de diário`);

  // Meditações
  await prisma.meditation.deleteMany();
  await prisma.meditation.createMany({ data: MEDITATIONS });
  console.log(`✓ ${MEDITATIONS.length} meditações`);

  // Conteúdos
  await prisma.content.deleteMany();
  await prisma.content.createMany({ data: CONTENTS });
  console.log(`✓ ${CONTENTS.length} conteúdos`);

  // Lives
  await prisma.live.deleteMany();
  const inOneWeek = new Date();
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  await prisma.live.createMany({
    data: [
      {
        title: "Live: O que é viver em alta frequência?",
        description: "Encontro ao vivo. Tire suas dúvidas.",
        scheduledAt: inOneWeek,
        joinUrl: "https://meet.google.com/abc-defg-hij",
      },
    ],
  });
  console.log(`✓ Lives criadas`);

  // Badges
  for (const def of BADGE_DEFS) {
    await prisma.badge.upsert({
      where: { code: def.code },
      create: {
        code: def.code,
        name: def.name,
        description: def.description,
        icon: def.icon,
        xp: def.xp,
      },
      update: {
        name: def.name,
        description: def.description,
        icon: def.icon,
        xp: def.xp,
      },
    });
  }
  console.log(`✓ ${BADGE_DEFS.length} badges`);

  console.log("✅ Seed concluído");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
