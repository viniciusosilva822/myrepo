import type { FastifyInstance } from "fastify";
import { logMeditationSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { evaluateBadges } from "../lib/badges.js";

export async function meditationRoutes(app: FastifyInstance) {
  app.get("/", async (req) => {
    const category = (req.query as any)?.category as string | undefined;
    return prisma.meditation.findMany({
      where: { active: true, ...(category ? { category } : {}) },
      orderBy: { createdAt: "desc" },
    });
  });

  app.get("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await prisma.meditation.findUnique({ where: { id } });
    if (!item) return reply.code(404).send({ error: "Não encontrado" });
    return item;
  });

  app.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", requireAuth);

    protectedRoutes.post("/log", async (req, reply) => {
      const data = parseBody(logMeditationSchema, req.body, reply);
      if (!data) return;
      const user = getCurrentUser(req);
      const log = await prisma.meditationLog.create({
        data: {
          userId: user.id,
          meditationId: data.meditationId,
          durationSec: data.durationSec,
          category: data.category,
        },
      });
      const newBadges = await evaluateBadges(user.id, "MEDITATION");
      return reply.send({ log, newBadges });
    });

    protectedRoutes.get("/me/stats", async (req) => {
      const user = getCurrentUser(req);
      const logs = await prisma.meditationLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      const totalSec = logs.reduce((s, l) => s + l.durationSec, 0);

      const days = new Set(logs.map((l) => l.createdAt.toISOString().slice(0, 10)));
      let streak = 0;
      const cur = new Date();
      while (days.has(cur.toISOString().slice(0, 10))) {
        streak++;
        cur.setUTCDate(cur.getUTCDate() - 1);
      }

      return {
        totalSec,
        totalMinutes: Math.floor(totalSec / 60),
        sessions: logs.length,
        streak,
        recent: logs.slice(0, 10),
      };
    });
  });
}
