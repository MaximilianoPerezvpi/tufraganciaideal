"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-carbon transition-colors duration-300 ${
        producto.destacado
          ? "border border-champan/35"
          : "border border-borde hover:border-champan/30"
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
            onClick={() => agregar(producto.slug)}
            whileTap={disponible && !sinMasStock ? { scale: 0.97 } : undefined}
            className="mt-4 w-full rounded-full border border-champan/50 py-3 text-sm text-champan transition-colors hover:bg-champan hover:text-noche disabled:cursor-not-allowed disabled:border-borde disabled:text-arena disabled:hover:bg-transparent"
          >
            {!disponible
              ? "Sin stock"
              : sinMasStock
                ? `Ya tenés ${enCarrito} en el carrito`
                : "Agregar al carrito"}
          </motion.button>
        </div>
      </div>
    </article>
  );
}
