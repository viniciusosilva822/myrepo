import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { getUserXp, levelFromXp } from "../lib/badges.js";

function startOfDayUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (req) => {
    const user = getCurrentUser(req);
    const today = startOfDayUTC();
    const sinceWeek = new Date();
    sinceWeek.setUTCDate(sinceWeek.getUTCDate() - 7);

    const [
      todayCheckin,
      checkinsWeek,
      journalCount,
      meditationAgg,
      meditationsRecent,
      todaysCard,
      latestWheel,
      mantras,
      upcomingLive,
    ] = await Promise.all([
      prisma.checkin.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      }),
      prisma.checkin.findMany({
        where: { userId: user.id, date: { gte: sinceWeek } },
        orderBy: { date: "asc" },
      }),
      prisma.journalEntry.count({ where: { userId: user.id } }),
      prisma.meditationLog.aggregate({
        where: { userId: user.id },
        _sum: { durationSec: true },
        _count: true,
      }),
      prisma.meditationLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.cardDraw.findUnique({
        where: { userId_date: { userId: user.id, date: today } },
      }),
      prisma.wheelEntry.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.mantra.findMany({ where: { active: true } }),
      prisma.live.findFirst({
        where: { scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: "asc" },
      }),
    ]);

    const xp = await getUserXp(user.id);
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const mantra =
      mantras.length > 0 ? mantras[dayIndex % mantras.length] : null;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      gamification: {
        xp,
        level: levelFromXp(xp),
        nextLevelAt: levelFromXp(xp) * 250,
      },
      today: {
        checkin: todayCheckin,
        card: todaysCard,
        mantra,
      },
      stats: {
        checkinsThisWeek: checkinsWeek.length,
        journalEntries: journalCount,
        meditationMinutes: Math.floor((meditationAgg._sum.durationSec ?? 0) / 60),
        meditationSessions: meditationAgg._count,
      },
      checkinsWeek,
      meditationsRecent,
      latestWheel,
      upcomingLive,
    };
  });
}
