import type { FastifyInstance } from "fastify";
import {
  createContentSchema,
  createLiveSchema,
  createMantraSchema,
  createMeditationSchema,
  grantAccessSchema,
} from "@plataforma/shared";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { hashPassword, requireAdmin } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAdmin);

  app.get("/stats", async () => {
    const [users, withAccess, checkins, journals, meditations] = await Promise.all([
      prisma.user.count(),
      prisma.access.count({ where: { status: "ACTIVE" } }),
      prisma.checkin.count(),
      prisma.journalEntry.count(),
      prisma.meditationLog.count(),
    ]);
    return { users, withAccess, checkins, journals, meditations };
  });

  app.get("/users", async (req) => {
    const q = (req.query as any)?.q as string | undefined;
    return prisma.user.findMany({
      where: q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: { access: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  });

  app.post("/grant", async (req, reply) => {
    const data = parseBody(grantAccessSchema, req.body, reply);
    if (!data) return;
    const email = data.email.toLowerCase();
    let user = await prisma.user.findUnique({ where: { email } });
    let tempPassword: string | null = null;
    if (!user) {
      tempPassword = crypto.randomBytes(9).toString("base64url");
      user = await prisma.user.create({
        data: {
          email,
          name: data.name,
          passwordHash: await hashPassword(tempPassword),
        },
      });
    }
    await prisma.access.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        source: data.source === "manual" ? "MANUAL" : "ADMIN",
        status: "ACTIVE",
      },
      update: { status: "ACTIVE", revokedAt: null },
    });
    return reply.send({ user, tempPassword });
  });

  app.post("/revoke/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    await prisma.access.updateMany({
      where: { userId },
      data: { status: "CANCELLED", revokedAt: new Date() },
    });
    return { ok: true };
  });

  // ===== Mantras =====
  app.get("/mantras", async () =>
    prisma.mantra.findMany({ orderBy: { createdAt: "desc" } }),
  );
  app.post("/mantras", async (req, reply) => {
    const data = parseBody(createMantraSchema, req.body, reply);
    if (!data) return;
    return prisma.mantra.create({ data });
  });
  app.delete("/mantras/:id", async (req) => {
    const { id } = req.params as { id: string };
    await prisma.mantra.delete({ where: { id } });
    return { ok: true };
  });

  // ===== Meditações =====
  app.get("/meditations", async () =>
    prisma.meditation.findMany({ orderBy: { createdAt: "desc" } }),
  );
  app.post("/meditations", async (req, reply) => {
    const data = parseBody(createMeditationSchema, req.body, reply);
    if (!data) return;
    return prisma.meditation.create({ data });
  });
  app.delete("/meditations/:id", async (req) => {
    const { id } = req.params as { id: string };
    await prisma.meditation.update({ where: { id }, data: { active: false } });
    return { ok: true };
  });

  // ===== Conteúdos / Biblioteca =====
  app.get("/contents", async () =>
    prisma.content.findMany({ orderBy: { createdAt: "desc" } }),
  );
  app.post("/contents", async (req, reply) => {
    const data = parseBody(createContentSchema, req.body, reply);
    if (!data) return;
    return prisma.content.create({ data });
  });
  app.delete("/contents/:id", async (req) => {
    const { id } = req.params as { id: string };
    await prisma.content.update({ where: { id }, data: { published: false } });
    return { ok: true };
  });

  // ===== Lives =====
  app.get("/lives", async () =>
    prisma.live.findMany({ orderBy: { scheduledAt: "desc" } }),
  );
  app.post("/lives", async (req, reply) => {
    const data = parseBody(createLiveSchema, req.body, reply);
    if (!data) return;
    return prisma.live.create({
      data: { ...data, scheduledAt: new Date(data.scheduledAt) },
    });
  });
  app.delete("/lives/:id", async (req) => {
    const { id } = req.params as { id: string };
    await prisma.live.delete({ where: { id } });
    return { ok: true };
  });

  // ===== Prompts de diário =====
  app.get("/journal-prompts", async () =>
    prisma.journalPrompt.findMany({ orderBy: { createdAt: "desc" } }),
  );
  app.post("/journal-prompts", async (req, reply) => {
    const body = req.body as { text?: string; category?: string };
    if (!body?.text || body.text.length < 5) {
      return reply.code(400).send({ error: "Texto muito curto" });
    }
    return prisma.journalPrompt.create({
      data: { text: body.text, category: body.category },
    });
  });
}
