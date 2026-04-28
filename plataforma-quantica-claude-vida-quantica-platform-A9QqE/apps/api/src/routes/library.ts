import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

export async function libraryRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (req) => {
    const type = (req.query as any)?.type as string | undefined;
    return prisma.content.findMany({
      where: {
        published: true,
        ...(type ? { type: type as any } : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  });

  app.get("/featured", async () => {
    return prisma.content.findMany({
      where: { published: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  });

  app.get("/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await prisma.content.findUnique({ where: { id } });
    if (!item || !item.published) {
      return reply.code(404).send({ error: "Não encontrado" });
    }
    return item;
  });
}
