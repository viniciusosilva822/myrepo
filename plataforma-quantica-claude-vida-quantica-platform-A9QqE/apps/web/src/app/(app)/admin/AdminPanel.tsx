"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui";

const API = process.env.NEXT_PUBLIC_API_URL!;

const TABS = ["Alunos", "Mantras", "Meditações", "Conteúdos", "Lives"] as const;

export function AdminPanel({
  users,
  mantras,
  meditations,
  contents,
  lives,
}: {
  users: any[];
  mantras: any[];
  meditations: any[];
  contents: any[];
  lives: any[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Alunos");
  return (
    <div>
      <div className="flex gap-2 mb-4 border-b border-white/5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm border-b-2 ${
              tab === t
                ? "border-cosmos-400 text-white"
                : "border-transparent text-cosmos-300/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Alunos" && <UsersTab users={users} />}
      {tab === "Mantras" && <MantrasTab items={mantras} />}
      {tab === "Meditações" && <MeditationsTab items={meditations} />}
      {tab === "Conteúdos" && <ContentsTab items={contents} />}
      {tab === "Lives" && <LivesTab items={lives} />}
    </div>
  );
}

function UsersTab({ users }: { users: any[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  async function grant() {
    const res = await fetch(`${API}/admin/grant`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name, source: "manual" }),
    });
    const data = await res.json();
    if (data.tempPassword) setTempPassword(data.tempPassword);
    setEmail("");
    setName("");
    router.refresh();
  }

  async function revoke(id: string) {
    if (!confirm("Revogar acesso?")) return;
    await fetch(`${API}/admin/revoke/${id}`, {
      method: "POST",
      credentials: "include",
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="font-display text-lg mb-3">Liberar acesso manual</h3>
        <div className="grid md:grid-cols-3 gap-2">
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <input
            placeholder="email@..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <button onClick={grant} className="btn-primary">
            Liberar
          </button>
        </div>
        {tempPassword && (
          <div className="mt-3 text-sm bg-aurora-500/10 border border-aurora-500/30 rounded p-3">
            Senha temporária para o aluno:{" "}
            <code className="font-mono">{tempPassword}</code>
          </div>
        )}
      </Card>
      <Card>
        <table className="w-full text-sm">
          <thead className="text-left text-cosmos-300/60">
            <tr>
              <th className="py-2">Nome</th>
              <th>E-mail</th>
              <th>Acesso</th>
              <th>Origem</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/5">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.access?.status ?? "—"}</td>
                <td>{u.access?.source ?? "—"}</td>
                <td className="text-right">
                  {u.access?.status === "ACTIVE" && (
                    <button
                      onClick={() => revoke(u.id)}
                      className="text-xs text-red-300 hover:underline"
                    >
                      revogar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function MantrasTab({ items }: { items: any[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  async function add() {
    if (text.length < 2) return;
    await fetch(`${API}/admin/mantras`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    router.refresh();
  }
  async function del(id: string) {
    await fetch(`${API}/admin/mantras/${id}`, { method: "DELETE", credentials: "include" });
    router.refresh();
  }
  return (
    <Card>
      <div className="flex gap-2 mb-4">
        <input value={text} onChange={(e) => setText(e.target.value)} className="input" placeholder="Novo mantra..." />
        <button onClick={add} className="btn-primary">Adicionar</button>
      </div>
      <ul className="space-y-2">
        {items.map((m) => (
          <li key={m.id} className="flex justify-between items-center text-sm">
            <span>“{m.text}”</span>
            <button onClick={() => del(m.id)} className="text-xs text-red-300">remover</button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MeditationsTab({ items }: { items: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    audioUrl: "",
    durationSec: 600,
    category: "ansiedade",
  });
  async function add() {
    await fetch(`${API}/admin/meditations`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...form, title: "", audioUrl: "" });
    router.refresh();
  }
  return (
    <Card>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <input className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="URL do áudio" value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} />
        <input className="input" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input className="input" type="number" placeholder="Duração (segundos)" value={form.durationSec} onChange={(e) => setForm({ ...form, durationSec: Number(e.target.value) })} />
        <textarea className="input md:col-span-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <button onClick={add} className="btn-primary">Adicionar meditação</button>

      <ul className="mt-6 space-y-2 text-sm">
        {items.map((m) => (
          <li key={m.id} className="flex justify-between border-b border-white/5 py-2">
            <span>{m.title} <span className="text-cosmos-300/50">· {m.category}</span></span>
            <span className="text-cosmos-300/60">{Math.round(m.durationSec / 60)}min</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ContentsTab({ items }: { items: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", url: "", type: "EBOOK", category: "" });
  async function add() {
    await fetch(`${API}/admin/contents`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ ...form, title: "", url: "" });
    router.refresh();
  }
  return (
    <Card>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <input className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="EBOOK">E-book</option>
          <option value="AUDIO">Áudio</option>
          <option value="VIDEO">Vídeo</option>
          <option value="ARTICLE">Artigo</option>
        </select>
        <input className="input" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <textarea className="input md:col-span-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <button onClick={add} className="btn-primary">Publicar</button>

      <ul className="mt-6 space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.id} className="flex justify-between border-b border-white/5 py-2">
            <span>{c.title} <span className="text-cosmos-300/50">· {c.type}</span></span>
            <span className={c.published ? "text-aurora-300" : "text-cosmos-300/40"}>
              {c.published ? "publicado" : "oculto"}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function LivesTab({ items }: { items: any[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", scheduledAt: "", joinUrl: "", recordingUrl: "" });
  async function add() {
    await fetch(`${API}/admin/lives`, {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...form,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        joinUrl: form.joinUrl || undefined,
        recordingUrl: form.recordingUrl || undefined,
      }),
    });
    setForm({ title: "", description: "", scheduledAt: "", joinUrl: "", recordingUrl: "" });
    router.refresh();
  }
  return (
    <Card>
      <div className="grid md:grid-cols-2 gap-2 mb-4">
        <input className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
        <input className="input" placeholder="Link da live (Zoom/Meet)" value={form.joinUrl} onChange={(e) => setForm({ ...form, joinUrl: e.target.value })} />
        <input className="input" placeholder="URL da gravação (após)" value={form.recordingUrl} onChange={(e) => setForm({ ...form, recordingUrl: e.target.value })} />
        <textarea className="input md:col-span-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <button onClick={add} className="btn-primary">Agendar</button>

      <ul className="mt-6 space-y-2 text-sm">
        {items.map((l) => (
          <li key={l.id} className="flex justify-between border-b border-white/5 py-2">
            <span>{l.title}</span>
            <span className="text-cosmos-300/60">
              {new Date(l.scheduledAt).toLocaleString("pt-BR")}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
