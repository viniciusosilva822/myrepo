import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>
  );
}

export function CardTitle({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-xl">{children}</h2>
      {hint && <span className="text-xs text-cosmos-300/60">{hint}</span>}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <div className="mb-8">
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <h1 className="font-display text-4xl">{title}</h1>
      {subtitle && <p className="text-cosmos-200/70 mt-2">{subtitle}</p>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="text-center py-10 text-cosmos-300/60 text-sm">
      {children}
    </div>
  );
}
