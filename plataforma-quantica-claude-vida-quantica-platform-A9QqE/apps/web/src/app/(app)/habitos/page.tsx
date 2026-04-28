import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { HabitsView } from "./HabitsView";

export default async function HabitosPage() {
  const data = await api<{ habits: any[]; logs: any[] }>("/habits");
  return (
    <div>
      <PageHeader
        title="Hábitos"
        subtitle="Pequenas práticas que constroem grandes transformações."
        icon="🌱"
      />
      <HabitsView initialHabits={data.habits} initialLogs={data.logs} />
    </div>
  );
}
