import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { ChakraQuiz } from "./ChakraQuiz";

export default async function ChakrasPage() {
  const data = await api<any>("/chakras/quiz");
  const previous = await api<any[]>("/chakras/me");
  return (
    <div>
      <PageHeader
        title="Diagnóstico de chakras"
        subtitle="Responda com a primeira sensação. Resultado em segundos."
        icon="🌈"
      />
      <ChakraQuiz data={data} previous={previous} />
    </div>
  );
}
