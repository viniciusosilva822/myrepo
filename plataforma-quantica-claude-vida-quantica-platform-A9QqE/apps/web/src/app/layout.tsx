import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vida Quântica — Área do Aluno",
  description:
    "Plataforma exclusiva de práticas e ferramentas para alunos do curso Vida Quântica.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
