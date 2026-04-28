import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";

export async function livesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async () => {
    const now = new Date();
    const upcoming = await prisma.live.findMany({
      where: { scheduledAt: { gte: now } },
      orderBy: { scheduledAt: "asc" },
      take: 10,
    });
    const past = await prisma.live.findMany({
      where: { scheduledAt: { lt: now }, recordingUrl: { not: null } },
      orderBy: { scheduledAt: "desc" },
      take: 20,
    });
    return { upcoming, past };
  });

  app.post("/:id/rsvp", async (req, reply) => {
    const user = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const live = await prisma.live.findUnique({ where: { id } });
    if (!live) return reply.code(404).send({ error: "Live não encontrada" });
    const existing = await prisma.liveAttendance.findUnique({
      where: { userId_liveId: { userId: user.id, liveId: id } },
    });
    if (existing) {
      await prisma.liveAttendance.delete({ where: { id: existing.id } });
      return { rsvp: false };
    }
    await prisma.liveAttendance.create({ data: { userId: user.id, liveId: id, rsvp: true } });
    return { rsvp: true };
  });
}
