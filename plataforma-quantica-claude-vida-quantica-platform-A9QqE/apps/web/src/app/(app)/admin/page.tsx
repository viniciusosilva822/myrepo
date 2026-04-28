import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { Card, PageHeader } from "@/components/ui";
import { AdminPanel } from "./AdminPanel";

export default async function AdminPage() {
  const me = await getSession();
  if (!me || me.role !== "ADMIN") redirect("/dashboard");

  const [stats, users, mantras, meditations, contents, lives] = await Promise.all([
    api<any>("/admin/stats"),
    api<any[]>("/admin/users"),
    api<any[]>("/admin/mantras"),
    api<any[]>("/admin/meditations"),
    api<any[]>("/admin/contents"),
    api<any[]>("/admin/lives"),
  ]);

  return (
    <div>
      <PageHeader
        title="Painel admin"
        subtitle="Gerencie alunos, conteúdos, mantras e encontros."
        icon="⚙️"
      />
      <div className="grid md:grid-cols-5 gap-3 mb-8">
        <Card>
          <div className="text-xs text-cosmos-300/70">Alunos</div>
          <div className="font-display text-3xl">{stats.users}</div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70">Acessos ativos</div>
          <div className="font-display text-3xl">{stats.withAccess}</div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70">Check-ins</div>
          <div className="font-display text-3xl">{stats.checkins}</div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70">Diários</div>
          <div className="font-display text-3xl">{stats.journals}</div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70">Meditações</div>
          <div className="font-display text-3xl">{stats.meditations}</div>
        </Card>
      </div>

      <AdminPanel
        users={users}
        mantras={mantras}
        meditations={meditations}
        contents={contents}
        lives={lives}
      />
    </div>
  );
}
