import type { FastifyInstance } from "fastify";

export async function breathingRoutes(app: FastifyInstance) {
  app.get("/techniques", async () => [
    {
      id: "4-7-8",
      name: "Respiração 4-7-8",
      description: "Acalma o sistema nervoso. Ideal antes de dormir.",
      cycle: [
        { phase: "inspirar", durationSec: 4 },
        { phase: "segurar", durationSec: 7 },
        { phase: "expirar", durationSec: 8 },
      ],
      rounds: 4,
    },
    {
      id: "coerencia",
      name: "Coerência cardíaca",
      description: "5 minutos. Equilibra emoção e foco.",
      cycle: [
        { phase: "inspirar", durationSec: 5 },
        { phase: "expirar", durationSec: 5 },
      ],
      rounds: 30,
    },
    {
      id: "quadrada",
      name: "Respiração quadrada",
      description: "Foco e clareza mental.",
      cycle: [
        { phase: "inspirar", durationSec: 4 },
        { phase: "segurar", durationSec: 4 },
        { phase: "expirar", durationSec: 4 },
        { phase: "segurar", durationSec: 4 },
      ],
      rounds: 6,
    },
    {
      id: "wim-hof-suave",
      name: "Energização suave",
      description: "Aumenta vitalidade pela manhã.",
      cycle: [
        { phase: "inspirar", durationSec: 2 },
        { phase: "expirar", durationSec: 3 },
      ],
      rounds: 30,
    },
  ]);
}
