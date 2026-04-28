import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { EneagramQuiz } from "./EneagramQuiz";

export default async function EneagramaPage() {
  const data = await api<any>("/eneagram/quiz");
  return (
    <div>
      <PageHeader
        title="Eneagrama — descubra seu tipo"
        subtitle="27 afirmações. Responda com sinceridade — ninguém vê suas respostas."
        icon="🔺"
      />
      <EneagramQuiz data={data} />
    </div>
  );
}
