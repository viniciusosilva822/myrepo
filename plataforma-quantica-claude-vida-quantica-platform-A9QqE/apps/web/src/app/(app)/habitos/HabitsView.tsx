"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";

const SUGG_ICONS = ["🧘", "💧", "📓", "🌱", "🚶", "🍎", "📿", "🌞", "🌙", "🪞"];

export function HabitsView({
  initialHabits,
  initialLogs,
}: {
  initialHabits: any[];
  initialLogs: any[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🌱");
  const [busy, setBusy] = useState(false);

  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const logSet = new Set(
    initialLogs.map((l) => `${l.habitId}|${l.date.slice(0, 10)}`),
  );

  async function create() {
    if (name.length < 2) return;
    setBusy(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, icon, targetPerWeek: 7 }),
      });
      setName("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function toggle(habitId: string, date: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits/log`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ habitId, date }),
    });
    router.refresh();
  }

  async function archive(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/habits/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-display text-xl mb-4">Adicionar hábito</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGG_ICONS.map((i) => (
            <button
              key={i}
              onClick={() => setIcon(i)}
              className={`text-xl p-2 rounded ${
                icon === i ? "bg-cosmos-700/40" : "bg-white/5"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: meditar 10min"
            className="input"
          />
          <button onClick={create} disabled={busy} className="btn-primary">
            Criar
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl mb-4">Últimos 7 dias</h2>
        {initialHabits.length === 0 ? (
          <p className="text-sm text-cosmos-300/60">
            Nenhum hábito ainda. Comece com um pequeno.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-1 ml-44">
              {days.map((d) => (
                <div
                  key={d}
                  className="w-8 text-center text-[10px] text-cosmos-300/60"
                >
                  {new Date(d).toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3)}
                </div>
              ))}
            </div>
            {initialHabits.map((h) => (
              <div key={h.id} className="flex items-center gap-2">
                <div className="w-44 flex items-center gap-2 text-sm">
                  <span>{h.icon ?? "🌱"}</span>
                  <span className="truncate">{h.name}</span>
                </div>
                <div className="flex gap-1">
                  {days.map((d) => {
                    const done = logSet.has(`${h.id}|${d}`);
                    return (
                      <button
                        key={d}
                        onClick={() => toggle(h.id, d)}
                        className={`w-8 h-8 rounded ${
                          done
                            ? "bg-gradient-to-br from-cosmos-500 to-aurora-400"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                      />
                    );
                  })}
                </div>
                <button
                  onClick={() => archive(h.id)}
                  className="ml-2 text-xs text-cosmos-300/40 hover:text-red-300"
                >
                  remover
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
