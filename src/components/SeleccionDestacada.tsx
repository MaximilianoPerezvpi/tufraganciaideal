import Link from "next/link";
import { productos } from "@/data/productos";
import TarjetaProducto from "./TarjetaProducto";

/**
 * Selección del home. Por dentro elige lo que hay en stock físico
 * (`entregaInmediata`) y los `destacado`, para que lo primero que se ve sea
 * lo que se puede vender ya. Por fuera es solo una selección: no dice
 * "en stock" ni promete entrega inmediata (decisión comercial).
 */
export default function SeleccionDestacada() {
  const seleccion = productos
    .filter((p) => p.stock > 0 && (p.entregaInmediata || p.destacado))
    .slice(0, 8);
  if (seleccion.length === 0) return null;

  return (
    <section id="seleccion" className="scroll-mt-24 py-20 md:py-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-borde pb-6">
          <div>
            <p className="kicker">Selección TuFragancia</p>
            <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
              Nuestra selección
            </h2>
            <p className="mt-2 max-w-[52ch] text-arena">
              Algunas de las fragancias de nuestro catálogo, árabes y de
              diseñador. Consultanos por cualquiera de ellas por WhatsApp.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="rounded-full border border-champan/50 px-5 py-2.5 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
          >
            Ver catálogo completo
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {seleccion.map((p, i) => (
            <TarjetaProducto key={p.slug} producto={p} prioridad={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
