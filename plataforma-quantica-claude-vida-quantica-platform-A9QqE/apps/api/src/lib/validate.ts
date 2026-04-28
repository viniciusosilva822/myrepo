import type { FastifyReply } from "fastify";
import type { ZodType } from "zod";

export function parseBody<T>(schema: ZodType<T>, body: unknown, reply: FastifyReply): T | null {
  const result = schema.safeParse(body);
  if (!result.success) {
    reply.code(400).send({
      error: "Dados inválidos",
      issues: result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
    return null;
  }
  return result.data;
}
