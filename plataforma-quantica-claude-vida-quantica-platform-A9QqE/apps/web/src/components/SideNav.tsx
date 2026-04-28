"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV = [
  { group: "Hoje", items: [
    { href: "/dashboard", label: "Início", icon: "✨" },
    { href: "/check-in", label: "Check-in diário", icon: "🌅" },
    { href: "/diario", label: "Diário", icon: "📓" },
    { href: "/carta-do-dia", label: "Carta do dia", icon: "🔮" },
  ]},
  { group: "Práticas", items: [
    { href: "/meditacoes", label: "Meditações", icon: "🧘" },
    { href: "/respiracao", label: "Respiração", icon: "🌬️" },
    { href: "/habitos", label: "Hábitos", icon: "🌱" },
  ]},
  { group: "Autoconhecimento", items: [
    { href: "/roda-da-vida", label: "Roda da Vida", icon: "☸️" },
    { href: "/numerologia", label: "Numerologia", icon: "🔢" },
    { href: "/chakras", label: "Chakras", icon: "🌈" },
    { href: "/eneagrama", label: "Eneagrama", icon: "🔺" },
  ]},
  { group: "Conteúdo", items: [
    { href: "/biblioteca", label: "Biblioteca", icon: "📚" },
    { href: "/lives", label: "Lives & Encontros", icon: "🎙️" },
    { href: "/comunidade", label: "Comunidade", icon: "👥" },
    { href: "/conquistas", label: "Conquistas", icon: "🏅" },
  ]},
];

export function SideNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen overflow-y-auto px-4 py-6 border-r border-white/5">
      <Link href="/dashboard" className="block px-3 mb-8">
        <div className="font-display text-2xl">Vida Quântica</div>
        <div className="text-cosmos-300/60 text-xs uppercase tracking-widest">
          Área do aluno
        </div>
      </Link>
      <nav className="space-y-6">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="px-3 text-[11px] uppercase tracking-widest text-cosmos-300/50 mb-2">
              {g.group}
            </div>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = pathname === it.href;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        active
                          ? "bg-cosmos-700/40 text-white"
                          : "text-cosmos-100/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span>{it.icon}</span>
                      <span>{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {isAdmin && (
          <div>
            <div className="px-3 text-[11px] uppercase tracking-widest text-aurora-300/70 mb-2">
              Admin
            </div>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                    pathname.startsWith("/admin")
                      ? "bg-aurora-500/20 text-white"
                      : "text-aurora-200/80 hover:bg-white/5",
                  )}
                >
                  ⚙️ Painel admin
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
}
