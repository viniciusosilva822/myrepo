import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { MeditationsView } from "./MeditationsView";

export default async function MeditacoesPage() {
  const [items, stats] = await Promise.all([
    api<any[]>("/meditations"),
    api<any>("/meditations/me/stats"),
  ]);
  return (
    <div>
      <PageHeader
        title="Meditações"
        subtitle="Encontre presença. Escolha uma prática para hoje."
        icon="🧘"
      />
      <MeditationsView items={items} stats={stats} />
    </div>
  );
}
