"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao entrar");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-strong rounded-2xl p-8 w-full max-w-md">
        <Link href="/" className="block text-center mb-2">
          <span className="font-display text-3xl">Vida Quântica</span>
        </Link>
        <p className="text-center text-cosmos-200/70 text-sm mb-8">
          Acesse sua área exclusiva
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-cosmos-100 block mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="text-sm text-cosmos-100 block mb-1">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-cosmos-200/60">
          Já comprou o curso e ainda não tem conta?{" "}
          <Link href="/register" className="text-cosmos-300 hover:underline">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
