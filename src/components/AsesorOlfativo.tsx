"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  productos,
  type FamiliaOlfativa,
  type Genero,
} from "@/data/productos";
import TarjetaProducto from "./TarjetaProducto";

const OPCIONES_GENERO: { id: Genero; etiqueta: string }[] = [
  { id: "masculino", etiqueta: "Masculino" },
  { id: "femenino", etiqueta: "Femenino" },
  { id: "unisex", etiqueta: "Unisex" },
];

const OPCIONES_FAMILIA: { id: FamiliaOlfativa; etiqueta: string; slug: string; detalle: string }[] = [
  { id: "Gourmand / Dulce", etiqueta: "Gourmand / Dulce", slug: "gourmand", detalle: "Vainilla, caramelo, praliné" },
  { id: "Amaderado / Especiado", etiqueta: "Amaderado / Especiado", slug: "amaderado", detalle: "Cedro, cuero, especias" },
  { id: "Cítrico / Fresco", etiqueta: "Cítrico / Fresco", slug: "citrico", detalle: "Bergamota, menta, marino" },
  { id: "Oriental / Oud", etiqueta: "Oriental / Oud", slug: "oriental", detalle: "Oud, ámbar, incienso" },
  { id: "Floral / Frutal", etiqueta: "Floral / Frutal", slug: "floral", detalle: "Jazmín, rosa, frutos rojos" },
];

/** Quiz de 2 pasos: género + familia olfativa → 4 recomendaciones. */
export default function AsesorOlfativo() {
  const [genero, setGenero] = useState<Genero | null>(null);
  const [familia, setFamilia] = useState<FamiliaOlfativa | null>(null);

  const paso = familia ? 3 : genero ? 2 : 1;

  const recomendados = useMemo(() => {
    if (!genero || !familia) return [];
    return productos
      .filter(
        (p) =>
          (p.genero === genero || p.genero === "unisex") &&
          p.familiaOlfativa === familia,
      )
      .sort((a, b) => Number(b.destacado ?? false) - Number(a.destacado ?? false))
      .slice(0, 4);
  }, [genero, familia]);

  function reiniciar() {
    setGenero(null);
    setFamilia(null);
  }

  const familiaInfo = OPCIONES_FAMILIA.find((f) => f.id === familia);

  return (
    <section id="asesor" className="scroll-mt-24 border-y border-borde bg-carbon py-20 md:py-28">
      <div className="marco">
        <div className="max-w-[52ch]">
          <p className="kicker">Asesor olfativo</p>
          <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            ¿No sabés cuál elegir?
          </h2>
          <p className="mt-4 text-arena">
            Dos preguntas y te mostramos las fragancias del catálogo que más
            se ajustan a lo que buscás.
          </p>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            {paso === 1 && (
              <motion.div
                key="paso1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-sm text-marfil">1. ¿Para quién es?</h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {OPCIONES_GENERO.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setGenero(o.id)}
                      className="rounded-xl border border-borde bg-noche px-6 py-5 text-center text-marfil transition-colors hover:border-champan hover:text-champan"
                    >
                      {o.etiqueta}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {paso === 2 && (
              <motion.div
                key="paso2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={reiniciar}
                    aria-label="Volver"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-borde text-arena transition-colors hover:text-marfil"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
                      <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <h3 className="text-sm text-marfil">2. ¿Qué estilo buscás?</h3>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {OPCIONES_FAMILIA.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setFamilia(o.id)}
                      className="rounded-xl border border-borde bg-noche px-4 py-5 text-center transition-colors hover:border-champan"
                    >
                      <span className="block text-sm text-marfil">{o.etiqueta}</span>
                      <span className="mt-1 block text-micro text-arena">{o.detalle}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {paso === 3 && (
              <motion.div
                key="paso3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-arena">
                    Para vos: <span className="text-marfil">{OPCIONES_GENERO.find((g) => g.id === genero)?.etiqueta}</span>
                    {" · "}
                    <span className="text-marfil">{familiaInfo?.etiqueta}</span>
                  </p>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="text-sm text-arena underline-offset-4 transition-colors hover:text-marfil hover:underline"
                  >
                    Volver a intentar
                  </button>
                </div>

                {recomendados.length > 0 ? (
                  <>
                    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      {recomendados.map((p) => (
                        <TarjetaProducto key={p.slug} producto={p} />
                      ))}
                    </div>
                    <a
                      href={`/catalogo?genero=${genero}&familia=${familiaInfo?.slug}`}
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-champan/50 px-6 py-3 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
                    >
                      Ver más resultados en el catálogo
                    </a>
                  </>
                ) : (
                  <p className="mt-6 text-arena">
                    Por ahora no tenemos ninguno con esta combinación exacta —
                    probá otra familia o mirá el catálogo completo.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
