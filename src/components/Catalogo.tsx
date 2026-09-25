"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  categorias,
  productos,
  type Categoria,
  type Concentracion,
} from "@/data/productos";
import TarjetaProducto from "./TarjetaProducto";

type Orden = "destacados" | "menor-precio" | "mayor-precio";

const CONCENTRACIONES: Concentracion[] = ["EDT", "EDP", "Parfum", "Elixir"];

const ORDENES: { id: Orden; etiqueta: string }[] = [
  { id: "destacados", etiqueta: "Destacados" },
  { id: "menor-precio", etiqueta: "Menor precio" },
  { id: "mayor-precio", etiqueta: "Mayor precio" },
];

/** Marcas presentes en el catálogo, sin repetir y en orden alfabético. */
const MARCAS = Array.from(new Set(productos.map((p) => p.marca))).sort((a, b) =>
  a.localeCompare(b, "es"),
);

/** Clase compartida por los tres controles del toolbar (selects e input). */
const CONTROL =
  "h-11 rounded-full border border-borde bg-carbon px-4 text-sm text-marfil outline-none transition-colors focus-visible:border-champan hover:border-arena";

/** Grilla del catálogo: búsqueda, filtros por familia/marca/concentración y orden. */
export default function Catalogo() {
  const [filtro, setFiltro] = useState<Categoria | "todos">("todos");
  const [marca, setMarca] = useState<string>("todas");
  const [concentracion, setConcentracion] = useState<Concentracion | "todas">(
    "todas",
  );
  const [orden, setOrden] = useState<Orden>("destacados");
  const [busqueda, setBusqueda] = useState("");
  const [soloEntregaInmediata, setSoloEntregaInmediata] = useState(false);

  const hayFiltrosActivos =
    filtro !== "todos" ||
    marca !== "todas" ||
    concentracion !== "todas" ||
    busqueda.trim() !== "" ||
    soloEntregaInmediata;

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    const filtrados = productos.filter((p) => {
      if (filtro !== "todos" && p.categoria !== filtro) return false;
      if (marca !== "todas" && p.marca !== marca) return false;
      if (concentracion !== "todas" && p.concentracion !== concentracion)
        return false;
      if (soloEntregaInmediata && !p.entregaInmediata) return false;
      if (texto) {
        const enTexto = `${p.marca} ${p.nombre}`.toLowerCase();
        if (!enTexto.includes(texto)) return false;
      }
      return true;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "menor-precio") return a.precio_uyu - b.precio_uyu;
      if (orden === "mayor-precio") return b.precio_uyu - a.precio_uyu;
      // "Destacados": van primero, sin romper el orden del archivo de datos.
      return Number(b.destacado ?? false) - Number(a.destacado ?? false);
    });
  }, [filtro, marca, concentracion, orden, busqueda, soloEntregaInmediata]);

  function limpiarFiltros() {
    setFiltro("todos");
    setMarca("todas");
    setConcentracion("todas");
    setOrden("destacados");
    setBusqueda("");
    setSoloEntregaInmediata(false);
  }

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

          <div
            role="group"
            aria-label="Filtrar por familia"
            className="flex flex-wrap gap-2"
          >
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

            {/* Filtro rápido: solo lo que hay para entregar ya, sin esperar pedido. */}
            <button
              type="button"
              onClick={() => setSoloEntregaInmediata((v) => !v)}
              aria-pressed={soloEntregaInmediata}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                soloEntregaInmediata
                  ? "border-champan bg-champan text-noche"
                  : "border-champan/50 text-champan hover:bg-champan/10"
              }`}
            >
              ⚡ Entrega Inmediata
            </button>
          </div>
        </div>

        {/* Buscador y filtros finos: texto libre, marca, concentración, orden. */}
        <div className="mt-6 flex flex-wrap gap-3">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Buscar por nombre o marca</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-arena"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o marca…"
              className={`${CONTROL} w-full pl-11`}
            />
          </label>

          <label className="relative">
            <span className="sr-only">Filtrar por marca</span>
            <select
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className={`${CONTROL} appearance-none pr-9`}
            >
              <option value="todas">Todas las marcas</option>
              {MARCAS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-arena"
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </label>

          <label className="relative">
            <span className="sr-only">Filtrar por concentración</span>
            <select
              value={concentracion}
              onChange={(e) =>
                setConcentracion(e.target.value as Concentracion | "todas")
              }
              className={`${CONTROL} appearance-none pr-9`}
            >
              <option value="todas">Toda concentración</option>
              {CONCENTRACIONES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-arena"
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </label>

          <label className="relative">
            <span className="sr-only">Ordenar por</span>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              className={`${CONTROL} appearance-none pr-9`}
            >
              {ORDENES.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.etiqueta}
                </option>
              ))}
            </select>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-arena"
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </label>
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
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-10 w-10 text-arena/60"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-marfil">
              No encontramos perfumes con ese criterio.
            </p>
            {hayFiltrosActivos && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="rounded-full border border-champan/50 px-6 py-2.5 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
              >
                Quitar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
