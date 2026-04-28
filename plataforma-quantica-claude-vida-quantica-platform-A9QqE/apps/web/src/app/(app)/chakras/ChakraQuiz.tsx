"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

export function ChakraQuiz({
  data,
  previous,
}: {
  data: {
    questions: string[];
    chakras: { key: string; name: string; color: string; description: string }[];
    scale: { value: number; label: string }[];
  };
  previous: any[];
}) {
  const [answers, setAnswers] = useState<number[]>(
    Array(data.questions.length).fill(3),
  );
  const [result, setResult] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chakras/quiz`, {
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
    return (
      <Card>
        <h2 className="font-display text-2xl mb-4">Seu resultado</h2>
        <p className="text-sm text-cosmos-200/70 mb-4">
          Mais forte:{" "}
          <strong className="text-aurora-300">
            {result.detail.find((d: any) => d.key === result.result.strongest)?.name}
          </strong>{" "}
          · Mais bloqueado:{" "}
          <strong className="text-red-300">
            {result.detail.find((d: any) => d.key === result.result.weakest)?.name}
          </strong>
        </p>
        <div className="space-y-3">
          {result.detail.map((c: any) => (
            <div key={c.key}>
              <div className="flex justify-between text-sm">
                <span style={{ color: c.color }}>● {c.name}</span>
                <span>{c.score}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full"
                  style={{ width: `${c.score}%`, background: c.color }}
                />
              </div>
              <p className="text-xs text-cosmos-300/70 mt-1">
                {c.score < 50 ? c.whenWeak : c.description}
              </p>
              <p className="text-xs text-aurora-200 mt-1 italic">Prática: {c.practice}</p>
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
      <p className="text-cosmos-200/70 text-sm mb-6">
        21 afirmações. Marque o quanto cada uma descreve você.
      </p>
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
        {submitting ? "Calculando..." : "Ver meu diagnóstico"}
      </button>
      {previous.length > 0 && (
        <div className="text-xs text-cosmos-300/60 mt-4">
          Você já fez {previous.length} diagnóstico(s) anteriormente.
        </div>
      )}
    </Card>
  );
}
