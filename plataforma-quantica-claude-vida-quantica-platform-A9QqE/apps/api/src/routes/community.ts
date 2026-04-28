import type { FastifyInstance } from "fastify";
import { createPostSchema, reactToPostSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";

export async function communityRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (req) => {
    const kind = (req.query as any)?.kind as string | undefined;
    return prisma.post.findMany({
      where: kind ? { kind: kind as any } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        reactions: true,
      },
    });
  });

  app.post("/", async (req, reply) => {
    const data = parseBody(createPostSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const post = await prisma.post.create({
      data: { userId: user.id, kind: data.kind, content: data.content },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        reactions: true,
      },
    });
    return reply.send(post);
  });

  app.delete("/:id", async (req, reply) => {
    const user = getCurrentUser(req);
    const { id } = req.params as { id: string };
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return reply.code(404).send({ error: "Não encontrado" });
    if (post.userId !== user.id && user.role !== "ADMIN") {
      return reply.code(403).send({ error: "Sem permissão" });
    }
    await prisma.post.delete({ where: { id } });
    return { ok: true };
  });

  app.post("/react", async (req, reply) => {
    const data = parseBody(reactToPostSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const existing = await prisma.postReaction.findUnique({
      where: {
        postId_userId_reaction: {
          postId: data.postId,
          userId: user.id,
          reaction: data.reaction,
        },
      },
    });
    if (existing) {
      await prisma.postReaction.delete({ where: { id: existing.id } });
      return { reacted: false };
    }
    await prisma.postReaction.create({
      data: { postId: data.postId, userId: user.id, reaction: data.reaction },
    });
    return { reacted: true };
  });
}
