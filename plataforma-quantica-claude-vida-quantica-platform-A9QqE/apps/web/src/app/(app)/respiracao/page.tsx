import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { BreathingView } from "./BreathingView";

export default async function RespiracaoPage() {
  const techniques = await api<any[]>("/breathing/techniques");
  return (
    <div>
      <PageHeader
        title="Respiração consciente"
        subtitle="Sua respiração é a ponte entre corpo e mente."
        icon="🌬️"
      />
      <BreathingView techniques={techniques} />
    </div>
  );
}
