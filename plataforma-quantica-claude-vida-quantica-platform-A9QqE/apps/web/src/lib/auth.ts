import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import type { SessionUser } from "@plataforma/shared";

export async function getSession(): Promise<SessionUser | null> {
  const jar = cookies();
  if (!jar.get("auth_token")) return null;
  try {
    return await api<SessionUser>("/auth/me");
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return null;
    }
    throw err;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
