import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { NumerologyForm } from "./NumerologyForm";

export default async function NumerologiaPage() {
  const history = await api<any[]>("/numerology/history");
  return (
    <div>
      <PageHeader
        title="Mapa numerológico"
        subtitle="Os números do seu nome e nascimento revelam padrões de alma."
        icon="🔢"
      />
      <NumerologyForm history={history} />
    </div>
  );
}
