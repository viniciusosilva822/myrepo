import type { FastifyInstance } from "fastify";
import { loginSchema, registerSchema, updateProfileSchema } from "@plataforma/shared";
import { prisma } from "../lib/prisma.js";
import {
  clearAuthCookie,
  getCurrentUser,
  hashPassword,
  requireAuth,
  setAuthCookie,
  verifyPassword,
} from "../lib/auth.js";
import { parseBody } from "../lib/validate.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    const data = parseBody(registerSchema, req.body, reply);
    if (!data) return;

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) return reply.code(409).send({ error: "E-mail já cadastrado" });

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash: await hashPassword(data.password),
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      },
    });

    const token = app.jwt.sign({ sub: user.id, role: user.role });
    setAuthCookie(reply, token);
    return reply.send({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  });

  app.post("/login", async (req, reply) => {
    const data = parseBody(loginSchema, req.body, reply);
    if (!data) return;

    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      include: { access: true },
    });
    if (!user) return reply.code(401).send({ error: "Credenciais inválidas" });

    const ok = await verifyPassword(data.password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: "Credenciais inválidas" });

    const token = app.jwt.sign({ sub: user.id, role: user.role });
    setAuthCookie(reply, token);
    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        birthDate: user.birthDate,
        access: user.access,
      },
    });
  });

  app.post("/logout", async (_req, reply) => {
    clearAuthCookie(reply);
    return reply.send({ ok: true });
  });

  app.get("/me", { preHandler: requireAuth }, async (req) => {
    const user = getCurrentUser(req);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      birthDate: user.birthDate,
      access: user.access,
    };
  });

  app.patch("/me", { preHandler: requireAuth }, async (req, reply) => {
    const data = parseBody(updateProfileSchema, req.body, reply);
    if (!data) return;
    const user = getCurrentUser(req);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: data.name ?? undefined,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        avatarUrl: data.avatarUrl ?? undefined,
      },
    });
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      avatarUrl: updated.avatarUrl,
      birthDate: updated.birthDate,
    };
  });
}
