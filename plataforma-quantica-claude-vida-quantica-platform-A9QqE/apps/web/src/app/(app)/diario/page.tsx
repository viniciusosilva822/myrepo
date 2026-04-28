import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { JournalView } from "./JournalView";

export default async function DiarioPage() {
  const [{ prompt }, entries] = await Promise.all([
    api<{ prompt: { id: string; text: string } | null }>("/journal/prompt-of-day"),
    api<any[]>("/journal"),
  ]);
  return (
    <div>
      <PageHeader
        title="Diário"
        subtitle="Escreva sem julgamento. Suas palavras são privadas."
        icon="📓"
      />
      <JournalView prompt={prompt} entries={entries} />
    </div>
  );
}
