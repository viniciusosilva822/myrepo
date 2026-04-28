import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { WheelView } from "./WheelView";

export default async function RodaPage() {
  const latest = await api<any>("/wheel/latest");
  const history = await api<any[]>("/wheel");
  return (
    <div>
      <PageHeader
        title="Roda da Vida"
        subtitle="Avalie cada área da sua vida. Volte aqui mês a mês para acompanhar."
        icon="☸️"
      />
      <WheelView initial={latest} history={history} />
    </div>
  );
}
