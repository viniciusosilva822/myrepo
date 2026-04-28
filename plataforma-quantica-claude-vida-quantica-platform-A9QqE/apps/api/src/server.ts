import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import { env } from "./lib/env.js";
import { authRoutes } from "./routes/auth.js";
import { checkinRoutes } from "./routes/checkin.js";
import { journalRoutes } from "./routes/journal.js";
import { habitRoutes } from "./routes/habits.js";
import { meditationRoutes } from "./routes/meditation.js";
import { wheelRoutes } from "./routes/wheel.js";
import { cardRoutes } from "./routes/card.js";
import { numerologyRoutes } from "./routes/numerology.js";
import { chakraRoutes } from "./routes/chakras.js";
import { eneagramRoutes } from "./routes/eneagram.js";
import { libraryRoutes } from "./routes/library.js";
import { livesRoutes } from "./routes/lives.js";
import { communityRoutes } from "./routes/community.js";
import { badgesRoutes } from "./routes/badges.js";
import { dashboardRoutes } from "./routes/dashboard.js";
import { mantraRoutes } from "./routes/mantra.js";
import { breathingRoutes } from "./routes/breathing.js";
import { adminRoutes } from "./routes/admin.js";
import { hotmartWebhookRoutes } from "./routes/webhook-hotmart.js";

const app = Fastify({
  logger: { level: env.NODE_ENV === "production" ? "info" : "debug" },
});

await app.register(cors, {
  origin: [env.WEB_URL],
  credentials: true,
});

await app.register(cookie);

await app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: "auth_token", signed: false },
  sign: { expiresIn: env.JWT_EXPIRES_IN },
});

app.get("/health", async () => ({ ok: true, ts: Date.now() }));

await app.register(authRoutes, { prefix: "/auth" });
await app.register(hotmartWebhookRoutes, { prefix: "/webhooks/hotmart" });
await app.register(dashboardRoutes, { prefix: "/dashboard" });
await app.register(checkinRoutes, { prefix: "/checkins" });
await app.register(journalRoutes, { prefix: "/journal" });
await app.register(habitRoutes, { prefix: "/habits" });
await app.register(meditationRoutes, { prefix: "/meditations" });
await app.register(breathingRoutes, { prefix: "/breathing" });
await app.register(wheelRoutes, { prefix: "/wheel" });
await app.register(cardRoutes, { prefix: "/cards" });
await app.register(numerologyRoutes, { prefix: "/numerology" });
await app.register(chakraRoutes, { prefix: "/chakras" });
await app.register(eneagramRoutes, { prefix: "/eneagram" });
await app.register(libraryRoutes, { prefix: "/library" });
await app.register(livesRoutes, { prefix: "/lives" });
await app.register(communityRoutes, { prefix: "/community" });
await app.register(badgesRoutes, { prefix: "/badges" });
await app.register(mantraRoutes, { prefix: "/mantras" });
await app.register(adminRoutes, { prefix: "/admin" });

const port = env.PORT;
const host = "0.0.0.0";

app
  .listen({ port, host })
  .then(() => app.log.info(`API rodando em http://${host}:${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
