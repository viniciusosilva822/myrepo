import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: "STUDENT" | "ADMIN" };
    user: { sub: string; role: "STUDENT" | "ADMIN" };
  }
}
