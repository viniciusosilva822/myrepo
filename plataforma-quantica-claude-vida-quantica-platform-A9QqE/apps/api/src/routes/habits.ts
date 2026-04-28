import type { FastifyInstance } from "fastify";
import { completeHabitSchema, createHabitSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { evaluateBadges } from "../lib/badges.js";

function dateOnly(input?: string) {
  const d = input ? new Date(input) : new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function habitRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (req) => {
    const user = getCurrentUser(req);
    const habits = await prisma.habit.findMany({
      where: { userId: user.id, archived: false },
      orderBy: { createdAt: "asc" },
    });
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 30);
    const logs = await prisma.habitLog.findMany({
      where: { userId: user.id, date: { gte: since } },
    });
    return { habits, logs };
  });

  app.post("/", async (req, reply) => {
    const data = parseBody(createHabitSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const habit = await prisma.habit.create({
      data: { ...data, userId: user.id },
    });
    return reply.send(habit);
  });

  app.delete("/:id", async (req, reply) => {
    const user = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const habit = await prisma.habit.findUnique({ where: { id } });
    if (!habit || habit.userId !== user.id) {
      return reply.code(404).send({ error: "Não encontrado" });
    }
    await prisma.habit.update({ where: { id }, data: { archived: true } });
    return { ok: true };
  });

  app.post("/log", async (req, reply) => {
    const data = parseBody(completeHabitSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const habit = await prisma.habit.findUnique({ where: { id: data.habitId } });
    if (!habit || habit.userId !== user.id) {
      return reply.code(404).send({ error: "Hábito não encontrado" });
    }
    const date = dateOnly(data.date);
    const existing = await prisma.habitLog.findUnique({
      where: { habitId_date: { habitId: habit.id, date } },
    });
    if (existing) {
      await prisma.habitLog.delete({ where: { id: existing.id } });
      return reply.send({ toggled: "off" });
    }
    await prisma.habitLog.create({
      data: { habitId: habit.id, userId: user.id, date },
    });
    const newBadges = await evaluateBadges(user.id, "HABIT");
    return reply.send({ toggled: "on", newBadges });
  });
}
