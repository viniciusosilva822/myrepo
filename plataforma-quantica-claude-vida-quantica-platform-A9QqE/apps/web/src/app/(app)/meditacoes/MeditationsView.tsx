"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui";

interface Meditation {
  id: string;
  title: string;
  description: string | null;
  audioUrl: string;
  durationSec: number;
  category: string;
}

export function MeditationsView({
  items,
  stats,
}: {
  items: Meditation[];
  stats: { totalMinutes: number; sessions: number; streak: number };
}) {
  const router = useRouter();
  const [active, setActive] = useState<Meditation | null>(null);
  const [filter, setFilter] = useState<string>("todos");
  const audioRef = useRef<HTMLAudioElement>(null);

  const cats = Array.from(new Set(items.map((m) => m.category)));
  const filtered = filter === "todos" ? items : items.filter((m) => m.category === filter);

  async function logSession(seconds: number, m?: Meditation) {
    if (seconds < 30) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meditations/log`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        meditationId: m?.id,
        durationSec: Math.floor(seconds),
        category: m?.category,
      }),
    });
    router.refresh();
  }

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !active) return;
    let started = Date.now();
    const onPlay = () => (started = Date.now());
    const onEnded = () => logSession((Date.now() - started) / 1000, active);
    const onPause = () => logSession((Date.now() - started) / 1000, active);
    a.addEventListener("play", onPlay);
    a.addEventListener("ended", onEnded);
    a.addEventListener("pause", onPause);
    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <>
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <Card>
          <div className="text-xs text-cosmos-300/70 uppercase">Tempo total</div>
          <div className="font-display text-3xl">{stats.totalMinutes}min</div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70 uppercase">Sessões</div>
          <div className="font-display text-3xl">{stats.sessions}</div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70 uppercase">Streak</div>
          <div className="font-display text-3xl">{stats.streak}🔥</div>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilter("todos")}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            filter === "todos" ? "bg-cosmos-600 border-cosmos-400" : "border-white/10"
          }`}
        >
          todos
        </button>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-sm border ${
              filter === c ? "bg-cosmos-600 border-cosmos-400" : "border-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((m) => (
          <Card key={m.id}>
            <div className="text-xs text-cosmos-300 uppercase">{m.category}</div>
            <h3 className="font-display text-2xl mt-1">{m.title}</h3>
            {m.description && (
              <p className="text-cosmos-200/70 text-sm mt-2">{m.description}</p>
            )}
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-cosmos-300/60">
                {Math.round(m.durationSec / 60)}min
              </span>
              <button
                onClick={() => setActive(m)}
                className="btn-ghost text-sm"
              >
                Tocar
              </button>
            </div>
          </Card>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-50"
          onClick={() => setActive(null)}
        >
          <div
            className="glass-strong rounded-2xl p-6 max-w-md w-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-cosmos-300 text-xs uppercase">{active.category}</div>
            <h3 className="font-display text-2xl mt-1 mb-3">{active.title}</h3>
            <audio
              ref={audioRef}
              src={active.audioUrl}
              controls
              autoPlay
              className="w-full"
            />
            <p className="text-xs text-cosmos-300/60 mt-3">
              Sua sessão é registrada automaticamente quando o áudio termina ou pausa.
            </p>
            <button
              onClick={() => setActive(null)}
              className="btn-ghost text-sm mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
