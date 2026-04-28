import type { FastifyInstance } from "fastify";
import { chakraQuizSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { chakraQuestions, chakras, scoreChakras } from "../data/chakras.js";

export async function chakraRoutes(app: FastifyInstance) {
  app.get("/quiz", async () => ({
    questions: chakraQuestions,
    chakras: chakras.map(({ key, name, color, description }) => ({
      key,
      name,
      color,
      description,
    })),
    scale: [
      { value: 1, label: "Discordo totalmente" },
      { value: 2, label: "Discordo" },
      { value: 3, label: "Neutro" },
      { value: 4, label: "Concordo" },
      { value: 5, label: "Concordo totalmente" },
    ],
  }));

  app.register(async (r) => {
    r.addHook("preHandler", requireAuth);

    r.post("/quiz", async (req, reply) => {
      const data = parseBody(chakraQuizSchema, req.body, reply);
      if (!data) return;
      const user = getCurrentUser(req);
      const result = scoreChakras(data.answers);

      const saved = await prisma.chakraResult.create({
        data: {
          userId: user.id,
          scores: result.scores as any,
          weakest: result.weakest,
          strongest: result.strongest,
        },
      });

      const detail = chakras.map((c) => ({
        ...c,
        score: result.scores[c.key] ?? 0,
      }));

      return reply.send({
        result: { ...result, id: saved.id },
        detail,
      });
    });

    r.get("/me", async (req) => {
      const user = getCurrentUser(req);
      return prisma.chakraResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
    });
  });
}
