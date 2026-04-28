import type { FastifyInstance } from "fastify";
import { wheelEntrySchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { evaluateBadges } from "../lib/badges.js";

export async function wheelRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (req) => {
    const user = getCurrentUser(req);
    return prisma.wheelEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
  });

  app.get("/latest", async (req) => {
    const user = getCurrentUser(req);
    return prisma.wheelEntry.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  });

  app.post("/", async (req, reply) => {
    const data = parseBody(wheelEntrySchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const entry = await prisma.wheelEntry.create({
      data: { userId: user.id, ...data },
    });
    const newBadges = await evaluateBadges(user.id, "WHEEL");
    return reply.send({ entry, newBadges });
  });
}
