import Link from "next/link";
import Header from "@/components/Header";

export default function NoEncontrado() {
  return (
    <>
      <Header />
      <main className="marco flex min-h-screen max-w-2xl flex-col items-center justify-center py-24 text-center">
        <p className="kicker">Error 404</p>
        <h1 className="mt-4 font-display text-[length:var(--text-hero)] font-light leading-[0.95] text-marfil">
          Esta fragancia
          <br />
          <span className="italic text-champan">se ha evaporado</span>
        </h1>
        <p className="mt-6 max-w-[42ch] leading-relaxed text-arena">
          No pudimos encontrar la página que buscás. Puede que el link esté
          roto o que el perfume ya no esté en catálogo.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-champan px-8 py-4 text-center font-medium text-noche transition-colors hover:bg-oro-claro"
          >
            Volver al inicio
          </Link>
          <Link
            href="/catalogo"
            className="rounded-full border border-borde px-8 py-4 text-center text-marfil transition-colors hover:border-champan hover:text-champan"
          >
            Ver el catálogo
          </Link>
        </div>
      </main>
    </>
  );
}
