import type { FastifyInstance } from "fastify";
import { checkinSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { evaluateBadges } from "../lib/badges.js";

function startOfDayUTC(d = new Date()) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function checkinRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/", async (req, reply) => {
    const data = parseBody(checkinSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const today = startOfDayUTC();

    const checkin = await prisma.checkin.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      create: {
        userId: user.id,
        date: today,
        frequency: data.frequency,
        mood: data.mood,
        energy: data.energy,
        notes: data.notes,
      },
      update: {
        frequency: data.frequency,
        mood: data.mood,
        energy: data.energy,
        notes: data.notes,
      },
    });

    const newBadges = await evaluateBadges(user.id, "CHECKIN");
    return reply.send({ checkin, newBadges });
  });

  app.get("/today", async (req) => {
    const user = getCurrentUser(req);
    return prisma.checkin.findUnique({
      where: { userId_date: { userId: user.id, date: startOfDayUTC() } },
    });
  });

  app.get("/history", async (req) => {
    const user = getCurrentUser(req);
    const days = Number((req.query as any)?.days ?? 30);
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    return prisma.checkin.findMany({
      where: { userId: user.id, date: { gte: since } },
      orderBy: { date: "asc" },
    });
  });
}
