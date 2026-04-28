import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { oracleDeck } from "../data/tarot.js";

function startOfDayUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function dailySeed(userId: string) {
  const today = new Date().toISOString().slice(0, 10);
  let h = 0;
  for (const c of `${userId}::${today}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export async function cardRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/today", async (req) => {
    const user = getCurrentUser(req);
    const today = startOfDayUTC();
    let draw = await prisma.cardDraw.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    });
    if (!draw) {
      const card = oracleDeck[dailySeed(user.id) % oracleDeck.length]!;
      draw = await prisma.cardDraw.create({
        data: {
          userId: user.id,
          date: today,
          cardId: card.id,
          cardName: card.name,
          meaning: card.meaning,
        },
      });
    }
    const card = oracleDeck.find((c) => c.id === draw!.cardId);
    return { draw, affirmation: card?.affirmation };
  });

  app.get("/history", async (req) => {
    const user = getCurrentUser(req);
    return prisma.cardDraw.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 30,
    });
  });

  app.get("/deck", async () => oracleDeck);
}
