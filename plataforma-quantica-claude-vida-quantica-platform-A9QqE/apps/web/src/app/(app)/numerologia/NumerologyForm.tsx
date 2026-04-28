"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";

export function NumerologyForm({ history }: { history: any[] }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function calc(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/numerology`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ fullName, birthDate }),
      });
      const data = await res.json();
      setResult(data);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <h2 className="font-display text-xl mb-4">Calcular meu mapa</h2>
        <form onSubmit={calc} className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Nome completo de batismo</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm block mb-1">Data de nascimento</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Calculando..." : "Calcular"}
          </button>
        </form>

        {history.length > 0 && (
          <div className="mt-6">
            <div className="text-sm text-cosmos-200 mb-2">Mapas anteriores</div>
            <ul className="text-xs text-cosmos-300/70 space-y-1">
              {history.map((h) => (
                <li key={h.id}>
                  {new Date(h.createdAt).toLocaleDateString("pt-BR")} —{" "}
                  {h.fullName} (vida {h.lifePath})
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl mb-4">Seu mapa</h2>
        {!result ? (
          <p className="text-sm text-cosmos-300/60">
            Preencha os dados para ver os números regentes da sua vida.
          </p>
        ) : (
          <div className="space-y-4">
            <Number n={result.lifePath} title="Caminho de Vida" m={result.meanings.lifePath} />
            <Number n={result.destiny} title="Destino" m={result.meanings.destiny} />
            <Number n={result.soulUrge} title="Alma" m={result.meanings.soulUrge} />
            <Number n={result.personality} title="Personalidade" m={result.meanings.personality} />
          </div>
        )}
      </Card>
    </div>
  );
}

function Number({
  n,
  title,
  m,
}: {
  n: number;
  title: string;
  m?: { title: string; description: string };
}) {
  return (
    <div className="border-l-4 border-cosmos-500 pl-4">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-4xl text-cosmos-300">{n}</span>
        <span className="text-cosmos-100">{title}</span>
      </div>
      {m && (
        <>
          <div className="text-aurora-300 text-sm font-semibold">{m.title}</div>
          <p className="text-cosmos-200/80 text-sm mt-1">{m.description}</p>
        </>
      )}
    </div>
  );
}
