import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardTitle, PageHeader } from "@/components/ui";

interface DashboardData {
  user: { name: string };
  gamification: { xp: number; level: number; nextLevelAt: number };
  today: {
    checkin: any;
    card: { cardName: string; meaning: string } | null;
    mantra: { text: string; author?: string | null } | null;
  };
  stats: {
    checkinsThisWeek: number;
    journalEntries: number;
    meditationMinutes: number;
    meditationSessions: number;
  };
  upcomingLive: { id: string; title: string; scheduledAt: string } | null;
}

export default async function Dashboard() {
  const d = await api<DashboardData>("/dashboard");

  return (
    <div>
      <PageHeader
        title={`Bem-vindo, ${d.user.name.split(" ")[0]}.`}
        subtitle="Sua jornada continua hoje. Comece pelo que ressoa."
        icon="✨"
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-cosmos-800/40 to-cosmos-900/40">
          <CardTitle hint="Frase do dia">Mantra</CardTitle>
          <p className="font-display text-2xl leading-snug">
            “{d.today.mantra?.text ?? "Sou luz."}”
          </p>
        </Card>
        <Card>
          <CardTitle>Sua evolução</CardTitle>
          <div className="text-cosmos-300/70 text-xs uppercase tracking-widest">
            Nível
          </div>
          <div className="font-display text-5xl">{d.gamification.level}</div>
          <div className="text-xs text-cosmos-200/60 mt-2">
            {d.gamification.xp} XP / próximo: {d.gamification.nextLevelAt}
          </div>
          <div className="h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cosmos-400 to-aurora-400"
              style={{
                width: `${Math.min(
                  100,
                  (d.gamification.xp / Math.max(1, d.gamification.nextLevelAt)) * 100,
                )}%`,
              }}
            />
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="text-xs text-cosmos-300/70 uppercase">Check-in hoje</div>
          {d.today.checkin ? (
            <>
              <div className="font-display text-3xl mt-1">
                {d.today.checkin.frequency}/10
              </div>
              <div className="text-sm text-cosmos-200/70 capitalize">
                {d.today.checkin.mood}
              </div>
            </>
          ) : (
            <Link href="/check-in" className="block mt-2 text-cosmos-300 hover:underline">
              Fazer agora →
            </Link>
          )}
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70 uppercase">Meditação</div>
          <div className="font-display text-3xl mt-1">
            {d.stats.meditationMinutes}min
          </div>
          <div className="text-sm text-cosmos-200/70">
            {d.stats.meditationSessions} sessões totais
          </div>
        </Card>
        <Card>
          <div className="text-xs text-cosmos-300/70 uppercase">Diário</div>
          <div className="font-display text-3xl mt-1">{d.stats.journalEntries}</div>
          <div className="text-sm text-cosmos-200/70">reflexões registradas</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardTitle hint="Atualizada todo dia">Carta do dia</CardTitle>
          {d.today.card ? (
            <>
              <div className="font-display text-3xl mb-2">
                {d.today.card.cardName}
              </div>
              <p className="text-cosmos-200/80 text-sm">{d.today.card.meaning}</p>
            </>
          ) : (
            <Link
              href="/carta-do-dia"
              className="text-cosmos-300 hover:underline block mt-2"
            >
              Sortear a carta de hoje →
            </Link>
          )}
        </Card>
        <Card>
          <CardTitle>Próximo encontro</CardTitle>
          {d.upcomingLive ? (
            <>
              <div className="font-display text-xl">{d.upcomingLive.title}</div>
              <div className="text-cosmos-200/70 text-sm mt-2">
                {new Date(d.upcomingLive.scheduledAt).toLocaleString("pt-BR")}
              </div>
              <Link href="/lives" className="btn-ghost text-xs inline-block mt-4">
                Ver detalhes
              </Link>
            </>
          ) : (
            <p className="text-sm text-cosmos-300/60">
              Nenhum encontro agendado por enquanto.
            </p>
          )}
        </Card>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {[
          { href: "/meditacoes", label: "Meditar agora", icon: "🧘" },
          { href: "/respiracao", label: "Respirar", icon: "🌬️" },
          { href: "/diario", label: "Escrever", icon: "📓" },
          { href: "/roda-da-vida", label: "Roda da Vida", icon: "☸️" },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="glass rounded-xl p-4 text-center hover:bg-white/5 transition"
          >
            <div className="text-2xl mb-1">{q.icon}</div>
            <div className="text-sm">{q.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
