"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";

const KINDS = [
  { value: "GRATIDAO", label: "Gratidão", icon: "🙏" },
  { value: "CONQUISTA", label: "Conquista", icon: "🌟" },
  { value: "REFLEXAO", label: "Reflexão", icon: "💭" },
];

const REACTIONS = [
  { value: "LUZ", icon: "✨" },
  { value: "AMOR", icon: "💜" },
  { value: "GRATIDAO", icon: "🙏" },
];

export function CommunityFeed({ initial }: { initial: any[] }) {
  const router = useRouter();
  const [kind, setKind] = useState("GRATIDAO");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  async function publish() {
    if (content.length < 2) return;
    setBusy(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/community`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, content }),
      });
      setContent("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function react(postId: string, reaction: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/community/react`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId, reaction }),
    });
    router.refresh();
  }

  return (
    <>
      <Card className="mb-6">
        <div className="flex gap-2 mb-3">
          {KINDS.map((k) => (
            <button
              key={k.value}
              onClick={() => setKind(k.value)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                kind === k.value
                  ? "bg-cosmos-600 border-cosmos-400"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              {k.icon} {k.label}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Compartilhe com a comunidade..."
          className="input"
        />
        <div className="flex justify-end mt-2">
          <button onClick={publish} disabled={busy} className="btn-primary">
            Publicar
          </button>
        </div>
      </Card>

      <div className="space-y-3">
        {initial.length === 0 ? (
          <Card>
            <p className="text-sm text-cosmos-300/60">Seja o primeiro a publicar.</p>
          </Card>
        ) : (
          initial.map((p) => {
            const k = KINDS.find((x) => x.value === p.kind);
            return (
              <Card key={p.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-cosmos-300 text-xs">
                      {k?.icon} {k?.label} ·{" "}
                      <span className="text-cosmos-200/70">{p.user.name}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{p.content}</p>
                  </div>
                  <div className="text-xs text-cosmos-300/40">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {REACTIONS.map((r) => {
                    const count = p.reactions.filter(
                      (x: any) => x.reaction === r.value,
                    ).length;
                    return (
                      <button
                        key={r.value}
                        onClick={() => react(p.id, r.value)}
                        className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                      >
                        {r.icon} {count > 0 ? count : ""}
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
}
