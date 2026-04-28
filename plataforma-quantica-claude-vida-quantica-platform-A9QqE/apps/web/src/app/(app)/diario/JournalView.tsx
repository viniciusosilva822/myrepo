"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";

export function JournalView({
  prompt,
  entries,
}: {
  prompt: { id: string; text: string } | null;
  entries: any[];
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (content.trim().length < 1) return;
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/journal`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ promptId: prompt?.id, content }),
      });
      setContent("");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <div className="text-cosmos-300/70 text-xs uppercase tracking-widest mb-1">
            Pergunta de hoje
          </div>
          <p className="font-display text-2xl mb-4">
            {prompt?.text ?? "O que está vivo em você agora?"}
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Escreva livremente..."
            className="input resize-none"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-cosmos-300/60">
              {content.length} caracteres
            </span>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Salvando..." : "Salvar reflexão"}
            </button>
          </div>
        </Card>
      </div>
      <div>
        <Card>
          <h2 className="font-display text-xl mb-4">Histórico</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-cosmos-300/60">Nada registrado ainda.</p>
          ) : (
            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {entries.map((e) => (
                <li key={e.id} className="border-l-2 border-cosmos-500/40 pl-3">
                  <div className="text-xs text-cosmos-300/60">
                    {new Date(e.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  {e.prompt && (
                    <div className="text-xs text-cosmos-200/70 italic">
                      “{e.prompt.text}”
                    </div>
                  )}
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {e.content.length > 220
                      ? e.content.slice(0, 220) + "..."
                      : e.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
