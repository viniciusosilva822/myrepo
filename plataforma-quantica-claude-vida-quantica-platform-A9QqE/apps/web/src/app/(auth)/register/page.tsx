"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name, email, password, birthDate }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta");
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
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="glass-strong rounded-2xl p-8 w-full max-w-md">
        <Link href="/" className="block text-center mb-2">
          <span className="font-display text-3xl">Vida Quântica</span>
        </Link>
        <p className="text-center text-cosmos-200/70 text-sm mb-2">
          Criar conta
        </p>
        <p className="text-center text-cosmos-300/50 text-xs mb-6">
          Seu acesso só será liberado após a compra confirmada do curso.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Nome completo</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Senha (mínimo 8)</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">
              Data de nascimento (opcional)
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input"
            />
          </div>
          {error && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-800/50 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-cosmos-200/60">
          Já tem conta?{" "}
          <Link href="/login" className="text-cosmos-300 hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
