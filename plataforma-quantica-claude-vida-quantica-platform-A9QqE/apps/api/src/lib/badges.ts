import { prisma } from "./prisma.js";

export type BadgeTrigger =
  | "CHECKIN"
  | "JOURNAL"
  | "HABIT"
  | "MEDITATION"
  | "WHEEL"
  | "CARD";

export const BADGE_DEFS = [
  {
    code: "first-step",
    name: "Primeiro Passo",
    description: "Você fez seu primeiro check-in.",
    icon: "🌱",
    xp: 50,
    trigger: "CHECKIN",
    test: async (userId: string) =>
      (await prisma.checkin.count({ where: { userId } })) >= 1,
  },
  {
    code: "checkin-7",
    name: "Constância",
    description: "7 check-ins realizados.",
    icon: "🌿",
    xp: 100,
    trigger: "CHECKIN",
    test: async (userId: string) =>
      (await prisma.checkin.count({ where: { userId } })) >= 7,
  },
  {
    code: "checkin-30",
    name: "Despertar",
    description: "30 check-ins acumulados.",
    icon: "🌟",
    xp: 250,
    trigger: "CHECKIN",
    test: async (userId: string) =>
      (await prisma.checkin.count({ where: { userId } })) >= 30,
  },
  {
    code: "journal-1",
    name: "Voz Interior",
    description: "Sua primeira reflexão no diário.",
    icon: "📓",
    xp: 50,
    trigger: "JOURNAL",
    test: async (userId: string) =>
      (await prisma.journalEntry.count({ where: { userId } })) >= 1,
  },
  {
    code: "journal-21",
    name: "Hábito Sagrado",
    description: "21 entradas no diário.",
    icon: "🪶",
    xp: 200,
    trigger: "JOURNAL",
    test: async (userId: string) =>
      (await prisma.journalEntry.count({ where: { userId } })) >= 21,
  },
  {
    code: "meditation-1",
    name: "Silêncio",
    description: "Primeira meditação registrada.",
    icon: "🧘",
    xp: 50,
    trigger: "MEDITATION",
    test: async (userId: string) =>
      (await prisma.meditationLog.count({ where: { userId } })) >= 1,
  },
  {
    code: "meditation-10",
    name: "Presença",
    description: "10 meditações concluídas.",
    icon: "🕉️",
    xp: 150,
    trigger: "MEDITATION",
    test: async (userId: string) =>
      (await prisma.meditationLog.count({ where: { userId } })) >= 10,
  },
  {
    code: "meditation-1h",
    name: "Mergulho",
    description: "1 hora total de meditação.",
    icon: "🌊",
    xp: 100,
    trigger: "MEDITATION",
    test: async (userId: string) => {
      const agg = await prisma.meditationLog.aggregate({
        where: { userId },
        _sum: { durationSec: true },
      });
      return (agg._sum.durationSec ?? 0) >= 3600;
    },
  },
  {
    code: "habit-flow",
    name: "Fluxo",
    description: "Concluiu um hábito 7 vezes.",
    icon: "💧",
    xp: 100,
    trigger: "HABIT",
    test: async (userId: string) =>
      (await prisma.habitLog.count({ where: { userId } })) >= 7,
  },
  {
    code: "wheel-1",
    name: "Visão Clara",
    description: "Sua primeira Roda da Vida.",
    icon: "☸️",
    xp: 50,
    trigger: "WHEEL",
    test: async (userId: string) =>
      (await prisma.wheelEntry.count({ where: { userId } })) >= 1,
  },
] as const;

export async function evaluateBadges(userId: string, trigger: BadgeTrigger) {
  const candidates = BADGE_DEFS.filter((b) => b.trigger === trigger);
  const earned: { code: string; name: string; description: string; icon: string; xp: number }[] = [];

  for (const def of candidates) {
    const ok = await def.test(userId);
    if (!ok) continue;
    const badge = await prisma.badge.upsert({
      where: { code: def.code },
      create: {
        code: def.code,
        name: def.name,
        description: def.description,
        icon: def.icon,
        xp: def.xp,
      },
      update: {},
    });
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });
    if (!existing) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      earned.push({
        code: def.code,
        name: def.name,
        description: def.description,
        icon: def.icon,
        xp: def.xp,
      });
    }
  }
  return earned;
}

export async function getUserXp(userId: string) {
  const items = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
  });
  return items.reduce((s, it) => s + it.badge.xp, 0);
}

export function levelFromXp(xp: number) {
  // 1 nível a cada 250 xp acumulado, começa em 1
  return 1 + Math.floor(xp / 250);
}
