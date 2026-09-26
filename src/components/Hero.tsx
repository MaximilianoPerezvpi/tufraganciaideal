import Link from "next/link";
import Frasco from "./Frasco";

/**
 * Hero. Server component: el HTML del titular llega en el primer byte
 * (bueno para SEO y para el LCP); lo único que se hidrata es el frasco.
 */
export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-[104px]">
      {/* Resplandor cálido detrás del frasco, muy sutil. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-0 h-[600px] w-[600px] rounded-full bg-champan/10 blur-[120px]"
      />

      <div className="marco relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div className="max-w-[34ch]">
          <p className="kicker">Alta perfumería · Montevideo</p>
          <h1 className="mt-4 font-display text-[length:var(--text-hero)] font-light leading-[0.95] tracking-[-0.02em] text-marfil">
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

          {/* Garantías de confianza: las dos objeciones que frenan una
              compra de perfumería online. */}
          <ul className="mt-12 flex flex-col gap-3">
            {[
              "Garantía 100% Perfumes Sellados de Origen",
              "Envíos asegurados por DAC y UES a todo Uruguay",
            ].map((texto) => (
              <li key={texto} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-oro-vivo/40 text-oro-vivo"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-marfil">{texto}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Frasco />
        </div>
      </div>
    </section>
  );
}
