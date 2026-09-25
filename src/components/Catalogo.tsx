"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categorias, productos, type Categoria } from "@/data/productos";
import TarjetaProducto from "./TarjetaProducto";

/** Grilla del catálogo con filtro por familia. */
export default function Catalogo() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");

  const visibles = useMemo(() => {
    const base =
      filtro === "todos"
        ? productos
        : productos.filter((p) => p.categoria === filtro);
    // Los destacados van primero, pero sin romper el orden del archivo de datos.
    return [...base].sort(
      (a, b) => Number(b.destacado ?? false) - Number(a.destacado ?? false),
    );
  }, [filtro]);

  return (
    <section id="catalogo" className="scroll-mt-24 py-20 md:py-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-borde pb-6">
          <div>
            <h2 className="font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
              Perfumes en stock
            </h2>
            <p className="mt-2 max-w-[52ch] text-arena">
              Frascos cerrados, con celofán de fábrica y caja original. Lo que
              ves acá es stock real: si está publicado, lo tenemos.
            </p>
          </div>

          <div role="group" aria-label="Filtrar por familia" className="flex flex-wrap gap-2">
            {categorias.map((c) => {
              const activo = c.id === filtro;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFiltro(c.id)}
                  aria-pressed={activo}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    activo
                      ? "border-champan bg-champan/10 text-champan"
                      : "border-borde text-arena hover:border-arena hover:text-marfil"
                  }`}
                >
                  {c.etiqueta}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visibles.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <TarjetaProducto producto={p} prioridad={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {visibles.length === 0 && (
          <p className="mt-16 text-center text-arena">
            Todavía no hay perfumes en esta familia. Probá con otra o escribinos
            y lo conseguimos a pedido.
          </p>
        )}
      </div>
    </section>
  );
}
