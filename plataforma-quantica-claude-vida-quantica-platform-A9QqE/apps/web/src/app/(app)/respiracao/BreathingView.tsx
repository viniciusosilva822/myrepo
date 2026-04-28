"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui";

interface Technique {
  id: string;
  name: string;
  description: string;
  cycle: { phase: string; durationSec: number }[];
  rounds: number;
}

export function BreathingView({ techniques }: { techniques: Technique[] }) {
  const [active, setActive] = useState<Technique | null>(null);
  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [secLeft, setSecLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running || !active) return;
    setSecLeft(active.cycle[phaseIdx]!.durationSec);
    timerRef.current = setInterval(() => {
      setSecLeft((s) => {
        if (s > 1) return s - 1;
        setPhaseIdx((p) => {
          const next = p + 1;
          if (next >= active.cycle.length) {
            setRound((r) => {
              if (r >= active.rounds) {
                setRunning(false);
                return 1;
              }
              return r + 1;
            });
            return 0;
          }
          return next;
        });
        return active.cycle[phaseIdx]?.durationSec ?? 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, active, phaseIdx]);

  function start(t: Technique) {
    setActive(t);
    setPhaseIdx(0);
    setRound(1);
    setSecLeft(t.cycle[0]!.durationSec);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    setActive(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  if (active && running) {
    const phase = active.cycle[phaseIdx]!;
    const scale = phase.phase === "inspirar" ? 1.4 : phase.phase === "expirar" ? 0.7 : 1;
    return (
      <Card className="text-center py-12">
        <div className="text-cosmos-300/70 text-xs uppercase">{active.name}</div>
        <div className="text-sm text-cosmos-200/60 mt-1">
          Round {round} de {active.rounds}
        </div>

        <div className="flex justify-center my-10">
          <div
            className="w-48 h-48 rounded-full bg-gradient-to-br from-cosmos-500 to-aurora-400 transition-transform"
            style={{
              transform: `scale(${scale})`,
              transitionDuration: `${phase.durationSec}s`,
            }}
          />
        </div>

        <div className="font-display text-3xl capitalize">{phase.phase}</div>
        <div className="font-display text-6xl my-4">{secLeft}</div>

        <button onClick={stop} className="btn-ghost mt-4">
          Encerrar
        </button>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {techniques.map((t) => (
        <Card key={t.id}>
          <h3 className="font-display text-2xl">{t.name}</h3>
          <p className="text-cosmos-200/70 text-sm mt-2">{t.description}</p>
          <div className="text-xs text-cosmos-300/60 mt-3">
            {t.rounds} rounds · ciclo:{" "}
            {t.cycle.map((c) => `${c.phase} ${c.durationSec}s`).join(" → ")}
          </div>
          <button onClick={() => start(t)} className="btn-primary mt-4">
            Começar
          </button>
        </Card>
      ))}
    </div>
  );
}
