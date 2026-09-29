import Link from "next/link";
import { productos } from "@/data/productos";

const CATEGORIAS = [
  {
    href: "/catalogo?categoria=arabes",
    etiqueta: "Perfumes Árabes",
    detalle: "Oud, gourmand y oriental: Lattafa, Armaf, Rasasi y más.",
    filtro: "árabes" as const,
  },
  {
    href: "/catalogo?categoria=disenador",
    etiqueta: "Perfumería de Diseñador",
    detalle: "Las casas de siempre: Dior, Versace, YSL, Chanel y más.",
    filtro: "diseñador" as const,
  },
];

/** Dos puertas de entrada al catálogo completo, por familia comercial. */
export default function ExploraCategorias() {
  return (
    <section className="py-20 md:py-28">
      <div className="marco">
        <p className="kicker">Explorá por categoría</p>
        <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
          Dos mundos, un mismo catálogo
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CATEGORIAS.map((c) => {
            const cantidad = productos.filter((p) => p.categoria === c.filtro).length;
            return (
              <Link
                key={c.href}
                href={c.href}
                className="group relative overflow-hidden rounded-2xl border border-borde bg-carbon p-8 transition-colors duration-300 hover:border-oro-vivo/40 sm:p-10"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-[-10%] top-[-20%] h-[220px] w-[220px] rounded-full bg-oro-vivo/10 blur-[80px] transition-opacity duration-300 group-hover:opacity-100"
                />
                <p className="cifras text-micro text-arena">
                  {cantidad}+ fragancias
                </p>
                <h3 className="relative mt-2 font-display text-[1.6rem] font-light text-marfil">
                  {c.etiqueta}
                </h3>
                <p className="relative mt-2 max-w-[38ch] text-sm text-arena">
                  {c.detalle}
                </p>
                <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm text-champan">
                  Ver catálogo
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
