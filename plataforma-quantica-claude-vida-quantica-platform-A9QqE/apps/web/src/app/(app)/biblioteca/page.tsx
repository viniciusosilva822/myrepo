import { api } from "@/lib/api";
import { Card, Empty, PageHeader } from "@/components/ui";

const TYPE_ICON: Record<string, string> = {
  EBOOK: "📕",
  AUDIO: "🎧",
  VIDEO: "🎬",
  ARTICLE: "📝",
};
const TYPE_LABEL: Record<string, string> = {
  EBOOK: "E-book",
  AUDIO: "Áudio",
  VIDEO: "Vídeo",
  ARTICLE: "Artigo",
};

export default async function BibliotecaPage() {
  const items = await api<any[]>("/library");
  const featured = items.filter((i) => i.isFeatured);
  const grouped = items.reduce<Record<string, any[]>>((acc, it) => {
    (acc[it.type] ??= []).push(it);
    return acc;
  }, {});
  return (
    <div>
      <PageHeader
        title="Biblioteca"
        subtitle="Conteúdos extras: e-books, áudios, vídeos e artigos exclusivos."
        icon="📚"
      />

      {featured.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl mb-3">Em destaque</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map((c) => (
              <Item key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      {Object.entries(grouped).map(([type, list]) => (
        <section key={type} className="mb-10">
          <h2 className="font-display text-xl mb-3">
            {TYPE_ICON[type]} {TYPE_LABEL[type]}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {list.map((c) => (
              <Item key={c.id} c={c} />
            ))}
          </div>
        </section>
      ))}

      {items.length === 0 && <Empty>Nenhum conteúdo disponível ainda.</Empty>}
    </div>
  );
}

function Item({ c }: { c: any }) {
  return (
    <Card>
      <div className="text-2xl">{TYPE_ICON[c.type]}</div>
      <h3 className="font-display text-lg mt-2">{c.title}</h3>
      {c.category && (
        <div className="text-cosmos-300/60 text-xs uppercase mt-1">
          {c.category}
        </div>
      )}
      {c.description && (
        <p className="text-cosmos-200/70 text-sm mt-2 line-clamp-3">
          {c.description}
        </p>
      )}
      <a
        href={c.url}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost text-xs mt-3 inline-block"
      >
        Acessar
      </a>
    </Card>
  );
}
