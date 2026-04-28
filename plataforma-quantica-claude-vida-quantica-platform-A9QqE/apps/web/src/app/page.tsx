import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-8 py-6 flex justify-between items-center">
        <div className="font-display text-2xl tracking-wide">Vida Quântica</div>
        <Link href="/login" className="btn-ghost text-sm">
          Entrar
        </Link>
      </header>

      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <p className="uppercase tracking-[0.4em] text-cosmos-300 text-xs mb-4">
            Área exclusiva do aluno
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
            Sua jornada de transformação
            <br />
            <span className="bg-gradient-to-r from-cosmos-400 to-aurora-300 bg-clip-text text-transparent">
              continua aqui.
            </span>
          </h1>
          <p className="text-cosmos-100/80 text-lg max-w-xl mx-auto mb-10">
            Esta plataforma é um <strong>bônus exclusivo</strong> para quem adquiriu o curso
            Vida Quântica. Aqui você encontra ferramentas práticas para elevar sua
            frequência todos os dias.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login" className="btn-primary">
              Acessar minha conta
            </Link>
            <Link
              href="https://hotmart.com"
              target="_blank"
              className="btn-ghost"
            >
              Ainda não comprei o curso
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-8 py-6 text-center text-cosmos-300/60 text-sm">
        © {new Date().getFullYear()} Vida Quântica · Plataforma exclusiva para alunos
      </footer>
    </main>
  );
}
