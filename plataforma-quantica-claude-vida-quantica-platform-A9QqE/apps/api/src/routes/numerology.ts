import type { FastifyInstance } from "fastify";
import { numerologyInputSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { calculateNumerology } from "../lib/numerology.js";

export async function numerologyRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.post("/", async (req, reply) => {
    const data = parseBody(numerologyInputSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const birth = new Date(data.birthDate);
    const result = calculateNumerology(data.fullName, birth);

    const report = await prisma.numerologyReport.create({
      data: {
        userId: user.id,
        fullName: data.fullName,
        birthDate: birth,
        lifePath: result.lifePath,
        destiny: result.destiny,
        soulUrge: result.soulUrge,
        personality: result.personality,
        payload: result as any,
      },
    });

    return reply.send({ report, ...result });
  });

  app.get("/history", async (req) => {
    const user = getCurrentUser(req);
    return prisma.numerologyReport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  });
}
