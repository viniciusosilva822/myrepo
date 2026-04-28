import { api } from "@/lib/api";
import { Card, Empty, PageHeader } from "@/components/ui";

export default async function LivesPage() {
  const data = await api<{ upcoming: any[]; past: any[] }>("/lives");
  return (
    <div>
      <PageHeader
        title="Lives & encontros"
        subtitle="Encontros ao vivo com perguntas. Entre em contato direto com a mentoria."
        icon="🎙️"
      />

      <section className="mb-8">
        <h2 className="font-display text-xl mb-3">Próximos</h2>
        {data.upcoming.length === 0 ? (
          <Empty>Nenhum encontro agendado por enquanto.</Empty>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {data.upcoming.map((l) => (
              <Card key={l.id}>
                <div className="text-cosmos-300 text-xs uppercase">
                  {new Date(l.scheduledAt).toLocaleString("pt-BR")}
                </div>
                <h3 className="font-display text-2xl mt-2">{l.title}</h3>
                {l.description && (
                  <p className="text-cosmos-200/70 text-sm mt-2">{l.description}</p>
                )}
                {l.joinUrl && (
                  <a
                    href={l.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary inline-block mt-4 text-sm"
                  >
                    Entrar
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl mb-3">Encontros anteriores</h2>
        {data.past.length === 0 ? (
          <Empty>Ainda sem gravações disponíveis.</Empty>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {data.past.map((l) => (
              <Card key={l.id}>
                <div className="text-cosmos-300/60 text-xs uppercase">
                  {new Date(l.scheduledAt).toLocaleDateString("pt-BR")}
                </div>
                <h3 className="font-display text-lg mt-1">{l.title}</h3>
                {l.recordingUrl && (
                  <a
                    href={l.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs mt-3 inline-block"
                  >
                    Assistir gravação
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
