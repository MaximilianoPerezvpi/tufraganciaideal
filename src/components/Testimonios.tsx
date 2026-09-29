import Link from "next/link";
import { resenas } from "@/data/resenas";
import { resenasRecientes } from "@/lib/resenas";
import TarjetaResena from "./TarjetaResena";

const GARANTIAS = [
  {
    titulo: "Originales sellados",
    texto: "Cada frasco llega con su celofán de fábrica, sin abrir.",
  },
  {
    titulo: "Pago protegido",
    texto: "Pagás con Mercado Pago: si algo sale mal, tu dinero está cubierto.",
  },
  {
    titulo: "Atención por WhatsApp",
    texto: "Una persona real te responde antes, durante y después de la compra.",
  },
] as const;

/**
 * Opiniones de clientes en el home. Sale solo de `src/data/resenas.ts`:
 * mientras no haya reseñas reales, muestra las garantías de la tienda y una
 * invitación a opinar en vez de tarjetas vacías o de ejemplo.
 */
export default function Testimonios() {
  const recientes = resenasRecientes(3);
  const hayResenas = recientes.length > 0;

  return (
    <section className="py-20 md:py-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-borde pb-6">
          <div>
            <p className="kicker">Lo que dicen</p>
            <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
              {hayResenas ? "Opiniones de clientes" : "Comprá con tranquilidad"}
            </h2>
          </div>
          <Link
            href="/opinar"
            className="rounded-full border border-borde px-5 py-2.5 text-sm text-marfil transition-colors hover:border-champan hover:text-champan"
          >
            {hayResenas ? `Dejá tu opinión · ${resenas.length} ${resenas.length === 1 ? "reseña" : "reseñas"}` : "¿Ya compraste? Dejá tu opinión"}
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {hayResenas
            ? recientes.map((r, i) => (
                <TarjetaResena key={`${r.fecha}-${i}`} resena={r} mostrarPerfume />
              ))
            : GARANTIAS.map((g) => (
                <div key={g.titulo} className="rounded-2xl border border-borde bg-carbon p-6">
                  <p className="font-display text-xl font-light text-marfil">{g.titulo}</p>
                  <p className="mt-2 text-sm leading-relaxed text-arena">{g.texto}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
