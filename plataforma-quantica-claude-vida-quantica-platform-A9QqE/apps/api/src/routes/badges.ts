import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { getCurrentUser, requireAuth } from "../lib/auth.js";
import { BADGE_DEFS, getUserXp, levelFromXp } from "../lib/badges.js";

export async function badgesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAuth);

  app.get("/", async (req) => {
    const user = getCurrentUser(req);
    const earned = await prisma.userBadge.findMany({
      where: { userId: user.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    });
    const earnedCodes = new Set(earned.map((b) => b.badge.code));
    const all = BADGE_DEFS.map((def) => ({
      code: def.code,
      name: def.name,
      description: def.description,
      icon: def.icon,
      xp: def.xp,
      earned: earnedCodes.has(def.code),
      earnedAt: earned.find((e) => e.badge.code === def.code)?.earnedAt ?? null,
    }));
    const xp = await getUserXp(user.id);
    return {
      xp,
      level: levelFromXp(xp),
      nextLevelAt: levelFromXp(xp) * 250,
      badges: all,
    };
  });
}
