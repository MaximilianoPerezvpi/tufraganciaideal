"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { hayStock, type Producto } from "@/data/productos";
import { useCarrito } from "@/lib/cartStore";
import { precio } from "@/lib/format";
import ImagenProducto from "./ImagenProducto";

/**
 * Tarjeta de producto: un frasco original sellado.
 *
 * Un solo botón y una sola decisión: agregar al carrito. Los badges responden
 * las dos objeciones que frenan una compra online de perfumería en Uruguay
 * ("¿será original?" y "¿me llega a mi departamento?").
 */
export default function TarjetaProducto({
  producto,
  prioridad = false,
}: {
  producto: Producto;
  /** true en las primeras tarjetas: le dice a next/image que las cargue ya. */
  prioridad?: boolean;
}) {
  const agregar = useCarrito((e) => e.agregar);
  const enCarrito = useCarrito(
    (e) => e.items.find((i) => i.slug === producto.slug)?.cantidad ?? 0,
  );

  const disponible = hayStock(producto);
  const sinMasStock = enCarrito >= producto.stock;

  // "¡Agregado!" en el botón por un instante, antes de que aparezca el
  // toast: la confirmación se ve en el mismo lugar donde hiciste clic.
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    if (!agregado) return;
    const t = setTimeout(() => setAgregado(false), 1200);
    return () => clearTimeout(t);
  }, [agregado]);

  function manejarAgregar() {
    agregar(producto.slug);
    setAgregado(true);
  }

  return (
    <motion.article
      layout
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-carbon transition-[box-shadow,border-color] duration-300 hover:glow-oro ${
        producto.destacado
          ? "border border-champan/35"
          : "border border-borde hover:border-oro-vivo/40"
      }`}
    >
      {/* 📸 FOTO DEL PERFUME
          Archivo: /public/productos/<slug>.jpg — cuadrada 1000×1000, frasco
          sellado centrado. `sizes` evita que el celular baje la versión grande. */}
      <Link
        href={`/producto/${producto.slug}`}
        aria-label={`Ver ${producto.nombre} de ${producto.casa}`}
        className="relative block aspect-square overflow-hidden bg-humo"
      >
        <ImagenProducto
          producto={producto}
          prioridad={prioridad}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 300px"
          className={`object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
            disponible ? "" : "opacity-40 grayscale"
          }`}
        />

        {/* Badge de autenticidad: verde verificado, el mismo en todo el sitio. */}
        <span className="absolute left-3 top-3 rounded-full bg-noche/80 px-3 py-1 text-micro text-vetiver backdrop-blur-sm">
          100% original sellado
        </span>

        {producto.entregaInmediata && (
          <span className="absolute right-3 top-3 rounded-full bg-champan px-3 py-1 text-micro font-medium text-noche">
            ⚡ Stock Inmediato
          </span>
        )}

        {/* Badge de familia: Árabe o Diseñador. */}
        <span className="absolute bottom-3 left-3 rounded-full border border-marfil/25 bg-noche/70 px-3 py-1 text-micro text-marfil backdrop-blur-sm">
          {producto.categoria === "árabes" ? "Árabe" : "Diseñador"}
        </span>

        {!disponible && (
          <span className="absolute inset-x-0 bottom-0 bg-noche/85 py-2 text-center text-micro text-marfil">
            Sin stock por ahora
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-micro text-arena">{producto.casa}</p>
        <h3 className="mt-1 font-display text-[1.3rem] leading-tight text-marfil">
          <Link
            href={`/producto/${producto.slug}`}
            className="transition-colors hover:text-champan"
          >
            {producto.nombre}
          </Link>
        </h3>

        {/* Ficha técnica: lo primero que mira alguien que ya sabe qué busca. */}
        <p className="cifras mt-1 text-sm text-arena">
          {producto.concentracion} · {producto.volumen_ml} ml
        </p>

        <p className="mt-3 text-sm leading-relaxed text-arena">
          {producto.descripcion}
        </p>

        {/* Pirámide olfativa */}
        <dl className="mt-4 space-y-1.5 text-micro">
          {(
            [
              ["Salida", producto.notas.salida],
              ["Corazón", producto.notas.corazon],
              ["Fondo", producto.notas.fondo],
            ] as const
          ).map(([nivel, notas]) => (
            <div key={nivel} className="flex gap-2">
              <dt className="w-14 shrink-0 text-arena/70">{nivel}</dt>
              <dd className="text-arena">{notas.join(", ")}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-6">
          <div className="flex items-baseline justify-between gap-3">
            <p className="cifras text-2xl text-champan">
              {precio(producto.precio_uyu)}
            </p>
            <span className="text-micro text-arena">Envío a todo Uruguay</span>
          </div>

          <motion.button
            type="button"
            disabled={!disponible || sinMasStock}
            onClick={manejarAgregar}
            whileTap={disponible && !sinMasStock ? { scale: 0.95 } : undefined}
            className={`mt-4 w-full overflow-hidden rounded-full border py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_var(--color-oro-vivo)] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-borde disabled:text-arena disabled:shadow-none disabled:hover:bg-transparent ${
              agregado
                ? "border-vetiver bg-vetiver text-noche"
                : "border-champan/50 text-champan hover:bg-champan hover:text-noche"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {agregado ? (
                <motion.span
                  key="ok"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path
                      d="M5 13l4 4L19 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  ¡Agregado!
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {!disponible
                    ? "Sin stock"
                    : sinMasStock
                      ? `Ya tenés ${enCarrito} en el carrito`
                      : "Agregar al carrito"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
