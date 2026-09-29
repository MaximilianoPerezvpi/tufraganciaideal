/**
 * Testimonios de clientes.
 *
 * ⚠️ Contenido de ejemplo a propósito: no se inventan nombres ni reseñas de
 * clientes reales (sería publicidad engañosa). Reemplazá TESTIMONIOS_EJEMPLO
 * por citas reales — de WhatsApp, Instagram o Google Reviews — antes de
 * publicar. Mientras tanto, cada tarjeta dice explícitamente "Ejemplo".
 */

const TESTIMONIOS_EJEMPLO = [
  {
    texto:
      "Reemplazá este texto por una reseña real de un cliente (de WhatsApp, Instagram o Google).",
    nombre: "Nombre y apellido del cliente",
    ciudad: "Ciudad, departamento",
  },
  {
    texto:
      "Cada tarjeta necesita su propia cita real — no dupliques la misma reseña en varias.",
    nombre: "Nombre y apellido del cliente",
    ciudad: "Ciudad, departamento",
  },
  {
    texto:
      "Una vez que tengas 3 o más reseñas reales, borrá este comentario del código.",
    nombre: "Nombre y apellido del cliente",
    ciudad: "Ciudad, departamento",
  },
];

export default function Testimonios() {
  return (
    <section className="py-20 md:py-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-borde pb-6">
          <div>
            <p className="kicker">Lo que dicen</p>
            <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
              Testimonios
            </h2>
          </div>
          <span className="rounded-full border border-champan/40 px-3 py-1 text-micro text-champan">
            Contenido de ejemplo — reemplazar
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIOS_EJEMPLO.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-borde bg-carbon p-6"
            >
              <div className="flex gap-1 text-oro-vivo" aria-hidden>
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.9L5.8 21.2l1.6-7L2 9.5l7.1-.6L12 2Z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-arena">
                "{t.texto}"
              </p>
              <p className="mt-4 text-sm text-marfil">{t.nombre}</p>
              <p className="text-micro text-arena/70">{t.ciudad}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
