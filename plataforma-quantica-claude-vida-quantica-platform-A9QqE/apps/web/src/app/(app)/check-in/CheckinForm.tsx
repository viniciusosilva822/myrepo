"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";
import { moodValues } from "@plataforma/shared";

export function CheckinForm({
  initial,
  history,
}: {
  initial: any;
  history: any[];
}) {
  const router = useRouter();
  const [frequency, setFrequency] = useState<number>(initial?.frequency ?? 5);
  const [energy, setEnergy] = useState<number>(initial?.energy ?? 5);
  const [mood, setMood] = useState<string>(initial?.mood ?? "neutro");
  const [notes, setNotes] = useState<string>(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function save() {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkins`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frequency, energy, mood, notes }),
      });
      setSavedAt(new Date());
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <h2 className="font-display text-xl mb-4">Hoje</h2>
        <Slider label="Frequência geral" value={frequency} onChange={setFrequency} />
        <Slider label="Energia física" value={energy} onChange={setEnergy} />

        <div className="mt-6">
          <div className="text-sm mb-2">Como você descreve seu humor?</div>
          <div className="flex flex-wrap gap-2">
            {moodValues.map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  mood === m
                    ? "bg-cosmos-600 border-cosmos-400 text-white"
                    : "border-white/10 text-cosmos-200/80 hover:border-white/30"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm mb-1">Algo a registrar? (opcional)</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input"
            placeholder="Algo que percebi hoje..."
          />
        </div>

        <button onClick={save} disabled={saving} className="btn-primary mt-4">
          {saving ? "Salvando..." : initial ? "Atualizar check-in" : "Salvar check-in"}
        </button>
        {savedAt && (
          <span className="ml-3 text-xs text-aurora-300">
            ✓ Salvo às {savedAt.toLocaleTimeString("pt-BR")}
          </span>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl mb-4">Últimos 14 dias</h2>
        {history.length === 0 ? (
          <p className="text-sm text-cosmos-300/60">Nenhum check-in ainda.</p>
        ) : (
          <div className="flex items-end gap-1.5 h-40">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex-1 flex flex-col items-center justify-end"
                title={`${h.date.slice(0, 10)} • ${h.frequency}/10`}
              >
                <div
                  className="w-full rounded-t bg-gradient-to-t from-cosmos-700 to-aurora-400"
                  style={{ height: `${h.frequency * 10}%` }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="text-xs text-cosmos-300/60 mt-3">
          Cada barra = sua frequência registrada do dia.
        </div>
      </Card>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-cosmos-300">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cosmos-400"
      />
    </div>
  );
}
