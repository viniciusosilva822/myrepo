"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

export function EneagramQuiz({
  data,
}: {
  data: {
    questions: string[];
    types: any[];
    scale: { value: number; label: string }[];
  };
}) {
  const [answers, setAnswers] = useState<number[]>(
    Array(data.questions.length).fill(3),
  );
  const [result, setResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/eneagram/quiz`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      setResult(await res.json());
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const t = result.type;
    return (
      <Card>
        <div className="text-cosmos-300/70 text-xs uppercase">Seu tipo dominante</div>
        <div className="font-display text-6xl my-2">{t.num}</div>
        <h2 className="font-display text-2xl">{t.name}</h2>
        <p className="italic text-aurora-300 mt-1">“{t.motto}”</p>
        <div className="grid md:grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <div className="text-cosmos-300 uppercase text-xs">Forças</div>
            <p className="text-cosmos-100/90 mt-1">{t.strengths}</p>
          </div>
          <div>
            <div className="text-red-300 uppercase text-xs">Sombra</div>
            <p className="text-cosmos-100/90 mt-1">{t.shadow}</p>
          </div>
          <div>
            <div className="text-aurora-300 uppercase text-xs">Crescimento</div>
            <p className="text-cosmos-100/90 mt-1">{t.growth}</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm mb-2">Distribuição</div>
          {Object.entries(result.result.scores)
            .sort(([, a]: any, [, b]: any) => b - a)
            .map(([num, s]: any) => (
              <div key={num} className="flex items-center gap-2 text-xs mb-1">
                <span className="w-4 text-cosmos-300">{num}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cosmos-500 to-aurora-400"
                    style={{ width: `${(s / 15) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-cosmos-300/60">{s}</span>
              </div>
            ))}
        </div>
        <button onClick={() => setResult(null)} className="btn-ghost mt-6">
          Refazer
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <ol className="space-y-5">
        {data.questions.map((q, i) => (
          <li key={i}>
            <div className="text-sm mb-2">
              <span className="text-cosmos-300/60">{i + 1}.</span> {q}
            </div>
            <div className="flex gap-2">
              {data.scale.map((s) => (
                <button
                  key={s.value}
                  onClick={() =>
                    setAnswers((a) => {
                      const c = [...a];
                      c[i] = s.value;
                      return c;
                    })
                  }
                  className={`flex-1 py-2 rounded text-xs ${
                    answers[i] === s.value
                      ? "bg-cosmos-600 text-white"
                      : "bg-white/5 text-cosmos-200/60 hover:bg-white/10"
                  }`}
                >
                  {s.value}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button onClick={submit} disabled={submitting} className="btn-primary mt-6">
        {submitting ? "Analisando..." : "Descobrir meu tipo"}
      </button>
    </Card>
  );
}
