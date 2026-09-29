"use client";

import { useState } from "react";
import { productos } from "@/data/productos";
import { linkWhatsApp } from "@/lib/site";

const PUNTA_ESTRELLA =
  "M12 2.5l2.86 6.17 6.64.62-5.02 4.6 1.46 6.61L12 17.02l-5.94 3.48 1.46-6.61-5.02-4.6 6.64-.62L12 2.5z";

const ETIQUETAS = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

const PRODUCTOS_ORDENADOS = [...productos].sort((a, b) =>
  `${a.casa} ${a.nombre}`.localeCompare(`${b.casa} ${b.nombre}`, "es"),
);

const CAMPO =
  "w-full rounded-xl border border-borde bg-noche px-4 py-3 text-sm text-marfil placeholder:text-arena/60 focus:border-champan focus:outline-none";

/**
 * Formulario de reseña. No guarda nada en el sitio: arma el mensaje y lo abre
 * en el WhatsApp de la tienda, donde se revisa antes de publicarlo a mano en
 * `src/data/resenas.ts`.
 *
 * Con `slug` el perfume queda fijo (página de producto); sin él, la persona
 * lo elige de la lista (página /opinar).
 */
export default function FormularioResena({ slug }: { slug?: string }) {
  const [perfume, setPerfume] = useState(slug ?? "");
  const [estrellas, setEstrellas] = useState(0);
  const [hover, setHover] = useState(0);
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [texto, setTexto] = useState("");
  const [enviado, setEnviado] = useState(false);

  const producto = productos.find((p) => p.slug === perfume);
  const valido = estrellas > 0 && nombre.trim() !== "" && texto.trim().length >= 10;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;

    const lineas = [
      "⭐ Nueva reseña para la web",
      "",
      `Perfume: ${producto ? `${producto.casa} ${producto.nombre} (${producto.slug})` : "Opinión general de la tienda"}`,
      `Calificación: ${"★".repeat(estrellas)}${"☆".repeat(5 - estrellas)} (${estrellas}/5)`,
      `Nombre: ${nombre.trim()}`,
      ciudad.trim() ? `Ciudad: ${ciudad.trim()}` : null,
      "",
      texto.trim(),
    ].filter((l) => l !== null);

    window.open(linkWhatsApp(lineas.join("\n")), "_blank", "noopener,noreferrer");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-champan/40 bg-carbon p-6 text-center">
        <p className="font-display text-xl font-light text-marfil">
          ¡Gracias por tu opinión!
        </p>
        <p className="mx-auto mt-2 max-w-[44ch] text-sm leading-relaxed text-arena">
          Se abrió WhatsApp con tu reseña lista: solo tocá enviar. La revisamos
          y la publicamos en unos días.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-4 text-micro text-champan underline-offset-4 hover:underline"
        >
          ¿No se abrió? Volver a intentar
        </button>
      </div>
    );
  }

  const activa = hover || estrellas;

  return (
    <form onSubmit={enviar} className="space-y-4 rounded-2xl border border-borde bg-carbon p-6">
      {!slug && (
        <label className="block">
          <span className="text-micro text-arena">¿Qué perfume compraste?</span>
          <select
            value={perfume}
            onChange={(e) => setPerfume(e.target.value)}
            className={`${CAMPO} mt-1.5`}
          >
            <option value="">Opinión general de la tienda</option>
            {PRODUCTOS_ORDENADOS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.casa} — {p.nombre} {p.volumen_ml} ml
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset>
        <legend className="text-micro text-arena">Tu calificación</legend>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="flex" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setEstrellas(n)}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} de 5 estrellas`}
                aria-pressed={estrellas === n}
                className={`p-1 transition-colors ${n <= activa ? "text-champan" : "text-borde"}`}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
                  <path d={PUNTA_ESTRELLA} fill="currentColor" />
                </svg>
              </button>
            ))}
          </div>
          <span className="text-sm text-arena">{ETIQUETAS[activa]}</span>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-micro text-arena">Nombre (como querés que aparezca)</span>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={40}
            placeholder="Ej. Martina G."
            className={`${CAMPO} mt-1.5`}
          />
        </label>
        <label className="block">
          <span className="text-micro text-arena">Ciudad (opcional)</span>
          <input
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            maxLength={40}
            placeholder="Ej. Salto"
            className={`${CAMPO} mt-1.5`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-micro text-arena">Tu opinión</span>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          maxLength={600}
          placeholder="¿Cuánto te dura? ¿Te lo notan? ¿Cómo llegó el pedido?"
          className={`${CAMPO} mt-1.5 resize-y`}
        />
      </label>

      <button
        type="submit"
        disabled={!valido}
        className="h-12 w-full rounded-full bg-champan px-8 font-medium text-noche transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:bg-borde disabled:text-arena"
      >
        Enviar reseña por WhatsApp
      </button>
      <p className="text-center text-micro text-arena/70">
        Revisamos cada reseña antes de publicarla. Publicamos todas las
        opiniones reales, buenas o malas.
      </p>
    </form>
  );
}
