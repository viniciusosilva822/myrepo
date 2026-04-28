"use client";

import { useRouter } from "next/navigation";
import type { SessionUser } from "@plataforma/shared";

export function TopBar({ user }: { user: SessionUser }) {
  const router = useRouter();
  async function logout() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
    router.refresh();
  }
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-white/5">
      <div className="text-sm text-cosmos-200/70">
        Olá, <span className="text-white">{user.name.split(" ")[0]}</span> ✨
      </div>
      <button onClick={logout} className="btn-ghost text-xs">
        Sair
      </button>
    </header>
  );
}
