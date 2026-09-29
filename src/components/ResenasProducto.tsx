"use client";

import { useState } from "react";
import type { Producto } from "@/data/productos";
import { calificacionDe, resenasDe } from "@/lib/resenas";
import Estrellas from "./Estrellas";
import FormularioResena from "./FormularioResena";
import TarjetaResena from "./TarjetaResena";

/** Sección de opiniones en la página de un perfume. */
export default function ResenasProducto({ producto }: { producto: Producto }) {
  const lista = resenasDe(producto.slug);
  const calificacion = calificacionDe(producto);
  const [formularioAbierto, setFormularioAbierto] = useState(false);

  return (
    <section id="opiniones" className="marco scroll-mt-28 border-t border-borde py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[length:var(--text-medio)] font-light text-marfil">
            Opiniones
          </h2>
          {calificacion && (
            <Estrellas {...calificacion} className="mt-2" />
          )}
        </div>
        {lista.length > 0 && !formularioAbierto && (
          <button
            type="button"
            onClick={() => setFormularioAbierto(true)}
            className="rounded-full border border-borde px-6 py-3 text-sm text-marfil transition-colors hover:border-champan hover:text-champan"
          >
            Dejar mi opinión
          </button>
        )}
      </div>

      {lista.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((r, i) => (
            <TarjetaResena key={`${r.fecha}-${i}`} resena={r} />
          ))}
        </div>
      ) : (
        !formularioAbierto && (
          <div className="mt-8 rounded-2xl border border-dashed border-borde px-6 py-10 text-center">
            <p className="font-display text-xl font-light text-marfil">
              Sé el primero en opinar sobre {producto.nombre}
            </p>
            <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-arena">
              ¿Ya lo tenés? Contale a otros cuánto te dura y qué te parece.
              Tu opinión ayuda a elegir mejor.
            </p>
            <button
              type="button"
              onClick={() => setFormularioAbierto(true)}
              className="mt-6 rounded-full bg-champan px-8 py-3 font-medium text-noche transition-colors hover:bg-oro-claro"
            >
              Escribir una reseña
            </button>
          </div>
        )
      )}

      {formularioAbierto && (
        <div className="mx-auto mt-8 max-w-2xl">
          <FormularioResena slug={producto.slug} />
        </div>
      )}
    </section>
  );
}
