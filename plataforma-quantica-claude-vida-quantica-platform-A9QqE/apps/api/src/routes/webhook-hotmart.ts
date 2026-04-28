import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/auth.js";
import { env } from "../lib/env.js";

interface HotmartPayload {
  event:
    | "PURCHASE_APPROVED"
    | "PURCHASE_COMPLETE"
    | "PURCHASE_REFUNDED"
    | "PURCHASE_CANCELED"
    | "PURCHASE_CHARGEBACK"
    | string;
  data: {
    buyer: { email: string; name: string };
    purchase: { transaction: string; status?: string };
    product: { id: number; name?: string; ucode?: string };
  };
}

function generateTempPassword() {
  return crypto.randomBytes(9).toString("base64url");
}

export async function hotmartWebhookRoutes(app: FastifyInstance) {
  app.post("/", async (req, reply) => {
    const headerToken =
      (req.headers["x-hotmart-hottok"] as string | undefined) ??
      (req.headers["x-hotmart-token"] as string | undefined);

    if (!headerToken || headerToken !== env.HOTMART_WEBHOOK_TOKEN) {
      app.log.warn({ headerToken }, "Webhook Hotmart com token inválido");
      return reply.code(401).send({ error: "Token inválido" });
    }

    const payload = req.body as HotmartPayload;
    if (!payload?.event || !payload?.data?.buyer?.email) {
      return reply.code(400).send({ error: "Payload inválido" });
    }

    const email = payload.data.buyer.email.toLowerCase();
    const name = payload.data.buyer.name ?? "Aluno";
    const transactionId = payload.data.purchase?.transaction;
    const productCode = payload.data.product?.ucode ?? String(payload.data.product?.id ?? "");

    const grantingEvents = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
    const revokingEvents = ["PURCHASE_REFUNDED", "PURCHASE_CANCELED", "PURCHASE_CHARGEBACK"];

    if (grantingEvents.includes(payload.event)) {
      let user = await prisma.user.findUnique({ where: { email } });
      let tempPassword: string | null = null;
      if (!user) {
        tempPassword = generateTempPassword();
        user = await prisma.user.create({
          data: {
            email,
            name,
            passwordHash: await hashPassword(tempPassword),
          },
        });
      }
      await prisma.access.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          source: "HOTMART",
          status: "ACTIVE",
          externalId: transactionId,
          productCode,
        },
        update: {
          status: "ACTIVE",
          externalId: transactionId,
          productCode,
          revokedAt: null,
        },
      });
      app.log.info({ email, transactionId, tempPassword: !!tempPassword }, "Acesso concedido via Hotmart");
      return reply.send({
        ok: true,
        userId: user.id,
        tempPassword,
        message:
          "Acesso liberado. Envie ao aluno o link de login com a senha temporária (ou peça pra usar 'esqueci minha senha').",
      });
    }

    if (revokingEvents.includes(payload.event)) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        await prisma.access.updateMany({
          where: { userId: user.id },
          data: {
            status: payload.event === "PURCHASE_REFUNDED" ? "REFUNDED" : "CANCELLED",
            revokedAt: new Date(),
          },
        });
      }
      return reply.send({ ok: true });
    }

    return reply.send({ ok: true, ignored: payload.event });
  });
}
