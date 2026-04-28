import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";

export async function mantraRoutes(app: FastifyInstance) {
  app.get("/today", async () => {
    const items = await prisma.mantra.findMany({ where: { active: true } });
    if (items.length === 0) {
      return { mantra: { text: "Eu sou o que penso. Hoje eu escolho pensar em paz.", author: null } };
    }
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const mantra = items[dayIndex % items.length];
    return { mantra };
  });
}
