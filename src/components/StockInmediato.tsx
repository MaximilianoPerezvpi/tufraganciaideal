import { productos } from "@/data/productos";
import TarjetaProducto from "./TarjetaProducto";

/** Los 8 productos con stock físico en el local: se entregan en el momento. */
export default function StockInmediato() {
  const disponibles = productos.filter((p) => p.entregaInmediata);
  if (disponibles.length === 0) return null;

  return (
    <section id="stock-inmediato" className="scroll-mt-24 py-20 md:py-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-borde pb-6">
          <div>
            <p className="kicker">Entrega inmediata</p>
            <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
              ⚡ Stock físico, ya
            </h2>
            <p className="mt-2 max-w-[52ch] text-arena">
              Estos frascos están en el local: los retirás hoy o te los
              despachamos en el día, sin esperar importación.
            </p>
          </div>
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
