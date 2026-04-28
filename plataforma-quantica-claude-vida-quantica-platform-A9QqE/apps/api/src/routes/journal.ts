import type { FastifyInstance } from "fastify";
import { journalEntrySchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { evaluateBadges } from "../lib/badges.js";

function pickPromptOfDay<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return items[dayIndex % items.length];
}

export async function journalRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/prompt-of-day", async () => {
    const prompts = await prisma.journalPrompt.findMany({ where: { active: true } });
    const prompt = pickPromptOfDay(prompts);
    return { prompt: prompt ?? null };
  });

  app.get("/", async (req) => {
    const user = getCurrentUser(req);
    return prisma.journalEntry.findMany({
      where: { userId: user.id },
      include: { prompt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  });

  app.post("/", async (req, reply) => {
    const data = parseBody(journalEntrySchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        promptId: data.promptId,
        content: data.content,
        mood: data.mood,
      },
    });
    const newBadges = await evaluateBadges(user.id, "JOURNAL");
    return reply.send({ entry, newBadges });
  });

  app.delete("/:id", async (req, reply) => {
    const user = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const entry = await prisma.journalEntry.findUnique({ where: { id } });
    if (!entry || entry.userId !== user.id) {
      return reply.code(404).send({ error: "Não encontrado" });
    }
    await prisma.journalEntry.delete({ where: { id } });
    return { ok: true };
  });
}
