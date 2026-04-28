"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { wheelAreas } from "@plataforma/shared";

const LABELS: Record<string, string> = {
  saude: "Saúde",
  carreira: "Carreira",
  financas: "Finanças",
  relacionamentos: "Relacionamentos",
  familia: "Família",
  espiritualidade: "Espiritualidade",
  lazer: "Lazer",
  desenvolvimento: "Desenvolvimento",
};

type State = Record<(typeof wheelAreas)[number], number>;

const blank = (): State => ({
  saude: 5,
  carreira: 5,
  financas: 5,
  relacionamentos: 5,
  familia: 5,
  espiritualidade: 5,
  lazer: 5,
  desenvolvimento: 5,
});

export function WheelView({
  initial,
  history,
}: {
  initial: any;
  history: any[];
}) {
  const router = useRouter();
  const [state, setState] = useState<State>(() => {
    if (!initial) return blank();
    const s = blank();
    for (const k of wheelAreas) (s as any)[k] = initial[k] ?? 5;
    return s;
  });
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wheel`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...state, notes }),
      });
      setNotes("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <h2 className="font-display text-xl mb-4">Como você se avalia hoje?</h2>
        {wheelAreas.map((k) => (
          <div key={k} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{LABELS[k]}</span>
              <span className="text-cosmos-300">{state[k]}/10</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={state[k]}
              onChange={(e) =>
                setState((s) => ({ ...s, [k]: Number(e.target.value) }))
              }
              className="w-full accent-cosmos-400"
            />
          </div>
        ))}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações (opcional)"
          rows={2}
          className="input mt-2"
        />
        <button onClick={save} disabled={saving} className="btn-primary mt-3">
          {saving ? "Salvando..." : "Salvar avaliação"}
        </button>
      </Card>

      <Card>
        <h2 className="font-display text-xl mb-4">Sua roda</h2>
        <RadarChart values={state} />
        <div className="mt-6">
          <div className="text-sm text-cosmos-200 mb-2">Avaliações anteriores</div>
          {history.length === 0 ? (
            <p className="text-xs text-cosmos-300/60">Nenhuma ainda.</p>
          ) : (
            <ul className="text-xs space-y-1 text-cosmos-200/70">
              {history.slice(0, 8).map((h) => {
                const avg =
                  wheelAreas.reduce((s, k) => s + ((h as any)[k] ?? 0), 0) /
                  wheelAreas.length;
                return (
                  <li key={h.id} className="flex justify-between">
                    <span>
                      {new Date(h.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span>média {avg.toFixed(1)}/10</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}

function RadarChart({ values }: { values: State }) {
  const size = 280;
  const c = size / 2;
  const r = c - 20;
  const labels = wheelAreas;
  const points = labels.map((k, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const v = values[k] / 10;
    return {
      x: c + Math.cos(angle) * r * v,
      y: c + Math.sin(angle) * r * v,
      lx: c + Math.cos(angle) * (r + 12),
      ly: c + Math.sin(angle) * (r + 12),
      label: LABELS[k],
    };
  });
  const path =
    points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <circle
          key={f}
          cx={c}
          cy={c}
          r={r * f}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
        />
      ))}
      {points.map((p, i) => (
        <line
          key={i}
          x1={c}
          y1={c}
          x2={c + ((p.lx - c) * r) / (r + 12)}
          y2={c + ((p.ly - c) * r) / (r + 12)}
          stroke="rgba(255,255,255,0.05)"
        />
      ))}
      <path d={path} fill="rgba(139,92,246,0.35)" stroke="#a78bfa" strokeWidth={1.5} />
      {points.map((p, i) => (
        <text
          key={i}
          x={p.lx}
          y={p.ly}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(245,243,255,0.7)"
        >
          {p.label}
        </text>
      ))}
    </svg>
  );
}
