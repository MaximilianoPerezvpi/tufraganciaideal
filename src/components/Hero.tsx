import Link from "next/link";
import Frasco from "./Frasco";

/**
 * Hero. Server component: el HTML del titular llega en el primer byte
 * (bueno para SEO y para el LCP); lo único que se hidrata es el frasco.
 */
export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-[72px]">
      {/* Resplandor cálido detrás del frasco, muy sutil. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-0 h-[600px] w-[600px] rounded-full bg-champan/10 blur-[120px]"
      />

      <div className="marco relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="max-w-[34ch]">
          <h1 className="font-display text-[length:var(--text-hero)] font-light leading-[0.95] tracking-[-0.02em] text-marfil">
            Perfumes originales, sellados, al precio de Uruguay.
          </h1>

          <p className="mt-7 max-w-[46ch] text-[1.05rem] leading-relaxed text-arena">
            Frascos completos de casas de nicho, diseñador y árabes. Comprás en
            la web, pagás con Mercado Pago y te llega a tu casa con el celofán
            de fábrica puesto.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#catalogo"
              className="rounded-full bg-champan px-8 py-4 text-center font-medium text-noche transition-transform duration-200 hover:scale-[1.02] hover:bg-oro-claro active:scale-[0.99]"
            >
              Ver perfumes en stock
            </Link>
            <Link
              href="#originales"
              className="rounded-full border border-borde px-8 py-4 text-center text-marfil transition-colors hover:border-champan hover:text-champan"
            >
              Cómo garantizamos que es original
            </Link>
          </div>

          {/* Las tres objeciones que frenan una compra de perfumería online. */}
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl border border-borde bg-borde text-center">
            {[
              { d: "Frascos", t: "Sellados de fábrica" },
              { d: "Pago", t: "Tarjeta o efectivo" },
              { d: "Envíos", t: "A todo Uruguay" },
            ].map((item) => (
              <div key={item.d} className="bg-carbon px-3 py-4">
                <dt className="text-micro text-arena">{item.d}</dt>
                <dd className="mt-1 text-sm text-marfil">{item.t}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Frasco />
        </div>
      </div>
    </section>
  );
}
