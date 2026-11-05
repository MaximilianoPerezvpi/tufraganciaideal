import Link from "next/link";
import { disponibilidad, productos } from "@/data/productos";
import TarjetaProducto from "./TarjetaProducto";

/** Perfumes con stock físico en Uruguay (`entregaInmediata` en el catálogo). */
export default function StockInmediato() {
  const disponibles = productos.filter((p) => disponibilidad(p) === "stock");
  if (disponibles.length === 0) return null;

  return (
    <section id="stock-inmediato" className="scroll-mt-24 py-20 md:py-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-borde pb-6">
          <div>
            <p className="kicker">En stock</p>
            <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
              ⚡ Disponibles ahora
            </h2>
            <p className="mt-2 max-w-[52ch] text-arena">
              Estos frascos ya están en Uruguay: los preparamos apenas
              confirmás el pedido por WhatsApp, sin esperar importación.
            </p>
          </div>
          <Link
            href="/catalogo?stock=1"
            className="rounded-full border border-champan/50 px-5 py-2.5 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
          >
            Ver todo lo que está en stock
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {disponibles.map((p, i) => (
            <TarjetaProducto key={p.slug} producto={p} prioridad={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
