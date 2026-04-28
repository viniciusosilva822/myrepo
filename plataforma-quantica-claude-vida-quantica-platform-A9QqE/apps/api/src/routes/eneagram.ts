import type { FastifyInstance } from "fastify";
import { eneagramQuizSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";
import { eneagramQuestions, eneagramTypes, scoreEneagram } from "../data/eneagram.js";

export async function eneagramRoutes(app: FastifyInstance) {
  app.get("/quiz", async () => ({
    questions: eneagramQuestions.map((q) => q.text),
    types: eneagramTypes,
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
      const data = parseBody(eneagramQuizSchema, req.body, reply);
      if (!data) return;
      const user = getCurrentUser(req);
      const result = scoreEneagram(data.answers);
      const top = eneagramTypes.find((t) => t.num === result.topType)!;

      const saved = await prisma.eneagramResult.create({
        data: {
          userId: user.id,
          topType: result.topType,
          scores: result.scores as any,
        },
      });

      return reply.send({
        result: { ...result, id: saved.id },
        type: top,
      });
    });

    r.get("/me", async (req) => {
      const user = getCurrentUser(req);
      return prisma.eneagramResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
    });
  });
}
