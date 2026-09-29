import Link from "next/link";
import { productos } from "@/data/productos";

/** Invitación al catálogo completo, para quien llegó hasta acá sin decidirse. */
export default function CTACatalogo() {
  const total = productos.length;

  return (
    <section className="py-20 md:py-28">
      <div className="marco">
        <div className="relative overflow-hidden rounded-2xl border border-oro-vivo/25 bg-carbon px-6 py-16 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-oro-vivo/15 blur-[110px]"
          />
          <p className="kicker relative">Catálogo completo</p>
          <h2 className="relative mt-3 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Todo el catálogo, en un solo lugar
          </h2>
          <p className="relative mx-auto mt-4 max-w-[46ch] text-arena">
            Árabes, diseñador, entrega inmediata o importación directa:
            filtrá por género, familia olfativa, marca y precio.
          </p>
          <Link
            href="/catalogo"
            className="relative mt-8 inline-flex items-center gap-2.5 rounded-full bg-champan px-8 py-4 font-medium text-noche transition-all duration-200 hover:-translate-y-0.5 hover:bg-oro-claro hover:shadow-[0_10px_30px_-10px_var(--color-oro-vivo)]"
          >
            Ver Catálogo Completo ({total}+ Fragancias)
          </Link>
        </div>
      </div>
    </section>
  );
}
