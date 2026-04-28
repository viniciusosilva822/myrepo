import { api } from "@/lib/api";
import { Card, PageHeader } from "@/components/ui";

export default async function ConquistasPage() {
  const data = await api<{
    xp: number;
    level: number;
    nextLevelAt: number;
    badges: {
      code: string;
      name: string;
      description: string;
      icon: string;
      xp: number;
      earned: boolean;
      earnedAt: string | null;
    }[];
  }>("/badges");

  return (
    <div>
      <PageHeader
        title="Conquistas"
        subtitle="Cada passo conta. Sua jornada está sendo guardada aqui."
        icon="🏅"
      />
      <Card className="mb-6">
        <div className="text-cosmos-300/60 text-xs uppercase">Nível atual</div>
        <div className="font-display text-6xl">{data.level}</div>
        <div className="text-cosmos-200/70 text-sm">
          {data.xp} XP · próximo nível em {Math.max(0, data.nextLevelAt - data.xp)} XP
        </div>
        <div className="h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cosmos-400 to-aurora-400"
            style={{
              width: `${Math.min(100, (data.xp / Math.max(1, data.nextLevelAt)) * 100)}%`,
            }}
          />
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.badges.map((b) => (
          <Card
            key={b.code}
            className={b.earned ? "" : "opacity-40 grayscale"}
          >
            <div className="text-4xl">{b.icon}</div>
            <h3 className="font-display text-lg mt-2">{b.name}</h3>
            <p className="text-cosmos-200/70 text-sm">{b.description}</p>
            <div className="flex justify-between text-xs text-cosmos-300/60 mt-3">
              <span>+{b.xp} XP</span>
              {b.earned && b.earnedAt && (
                <span>{new Date(b.earnedAt).toLocaleDateString("pt-BR")}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
