import { api } from "@/lib/api";
import { Card, PageHeader } from "@/components/ui";

export default async function CartaPage() {
  const { draw, affirmation } = await api<{
    draw: { cardName: string; meaning: string; date: string };
    affirmation?: string;
  }>("/cards/today");

  const history = await api<any[]>("/cards/history");

  return (
    <div>
      <PageHeader
        title="Carta do dia"
        subtitle="Uma mensagem do oráculo para hoje. Sua carta é única e se renova a cada dia."
        icon="🔮"
      />

      <Card className="mb-6 bg-gradient-to-br from-cosmos-800/50 to-cosmos-900/60 text-center py-10">
        <div className="text-cosmos-300/60 text-xs uppercase tracking-widest">
          {new Date(draw.date).toLocaleDateString("pt-BR")}
        </div>
        <div className="font-display text-6xl my-4">{draw.cardName}</div>
        <p className="text-cosmos-100/90 max-w-xl mx-auto text-lg">
          {draw.meaning}
        </p>
        {affirmation && (
          <div className="mt-6 italic text-aurora-300 text-sm">
            “{affirmation}”
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl mb-4">Suas cartas anteriores</h2>
        {history.length <= 1 ? (
          <p className="text-sm text-cosmos-300/60">Volte amanhã para uma nova carta.</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-3">
            {history.slice(1).map((c) => (
              <li key={c.id} className="border border-white/10 rounded-lg p-3">
                <div className="text-xs text-cosmos-300/60">
                  {new Date(c.date).toLocaleDateString("pt-BR")}
                </div>
                <div className="font-display text-lg">{c.cardName}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
