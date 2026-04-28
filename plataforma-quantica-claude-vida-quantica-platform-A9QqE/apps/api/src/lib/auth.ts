import type { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma.js";

export interface AuthPayload {
  sub: string;
  role: "STUDENT" | "ADMIN";
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function setAuthCookie(reply: FastifyReply, token: string) {
  const isProd = process.env.NODE_ENV === "production";
  reply.setCookie("auth_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookie(reply: FastifyReply) {
  reply.clearCookie("auth_token", { path: "/" });
}

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: "Não autorizado" });
  }
  const payload = req.user as AuthPayload;
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { access: true },
  });
  if (!user) return reply.code(401).send({ error: "Usuário não encontrado" });
  if (user.role !== "ADMIN") {
    if (!user.access || user.access.status !== "ACTIVE") {
      return reply.code(403).send({ error: "Acesso inativo. Compre o curso Vida Quântica." });
    }
  }
  (req as any).currentUser = user;
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  await requireAuth(req, reply);
  if (reply.sent) return;
  const user = (req as any).currentUser;
  if (user.role !== "ADMIN") {
    return reply.code(403).send({ error: "Acesso restrito" });
  }
}

export function getCurrentUser(req: FastifyRequest) {
  return (req as any).currentUser as Awaited<
    ReturnType<typeof prisma.user.findUnique>
  > & { access: any };
}
