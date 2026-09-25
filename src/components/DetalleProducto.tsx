"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { hayStock, type Producto } from "@/data/productos";
import { useCarrito } from "@/lib/cartStore";
import { precio } from "@/lib/format";
import TarjetaProducto from "./TarjetaProducto";
import ImagenProducto from "./ImagenProducto";

const CONFIANZA = [
  "100% Original Sellado",
  "Garantía de Autenticidad",
  "Envío a todo Uruguay",
] as const;

/** Página de un perfume: imagen grande, ficha completa y selector de cantidad. */
export default function DetalleProducto({
  producto,
  relacionados,
}: {
  producto: Producto;
  relacionados: Producto[];
}) {
  const agregar = useCarrito((e) => e.agregar);
  const enCarrito = useCarrito(
    (e) => e.items.find((i) => i.slug === producto.slug)?.cantidad ?? 0,
  );

  const disponible = hayStock(producto);
  const restante = Math.max(0, producto.stock - enCarrito);

  const [cantidad, setCantidad] = useState(1);

  // Si ya tenés casi todo el stock en el carrito, el selector no puede pedir
  // más de lo que queda: se recorta solo cuando `restante` cambia.
  useEffect(() => {
    setCantidad((c) => Math.min(Math.max(c, 1), Math.max(restante, 1)));
  }, [restante]);

  return (
    <>
      <div className="marco pt-10">
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 text-sm text-arena transition-colors hover:text-marfil"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver al catálogo
        </Link>
      </div>

      <section className="marco grid gap-10 py-8 md:py-14 lg:grid-cols-2 lg:gap-16">
        {/* Imagen principal */}
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-borde bg-humo">
          <ImagenProducto
            producto={producto}
            prioridad
            sizes="(max-width: 1024px) 92vw, 46vw"
            className={`object-cover ${disponible ? "" : "opacity-40 grayscale"}`}
          />
          <span className="absolute left-4 top-4 rounded-full bg-noche/80 px-3 py-1 text-micro text-vetiver backdrop-blur-sm">
            100% original sellado
          </span>
          {producto.entregaInmediata && (
            <span className="absolute right-4 top-4 rounded-full bg-champan px-3 py-1 text-micro font-medium text-noche">
              ⚡ Stock Inmediato
            </span>
          )}
          {!disponible && (
            <span className="absolute inset-x-0 bottom-0 bg-noche/85 py-2 text-center text-micro text-marfil">
              Sin stock por ahora
            </span>
          )}
        </div>

        {/* Ficha */}
        <div className="flex flex-col">
          <p className="text-micro text-arena">{producto.marca}</p>
          <h1 className="mt-1 font-display text-[length:var(--text-titulo)] font-light leading-[1.05] text-marfil">
            {producto.nombre}
          </h1>
          <p className="cifras mt-2 text-sm text-arena">
            {producto.concentracion} · {producto.volumen_ml} ml
          </p>

          <p className="mt-5 max-w-[52ch] leading-relaxed text-arena">
            {producto.descripcion}
          </p>

          <p className="cifras mt-6 text-3xl text-champan">
            {precio(producto.precio_uyu)}
          </p>

          {/* Selector de cantidad + agregar */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-borde">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                disabled={cantidad <= 1}
                aria-label="Restar una unidad"
                className="h-12 w-12 text-lg text-arena transition-colors hover:text-marfil disabled:opacity-30 disabled:hover:text-arena"
              >
                −
              </button>
              <span className="cifras w-8 text-center text-marfil">
                {cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(restante, c + 1))}
                disabled={cantidad >= restante}
                aria-label="Sumar una unidad"
                className="h-12 w-12 text-lg text-arena transition-colors hover:text-marfil disabled:opacity-30 disabled:hover:text-arena"
              >
                +
              </button>
            </div>

            <motion.button
              type="button"
              disabled={!disponible || restante <= 0}
              onClick={() => {
                agregar(producto.slug, cantidad);
                setCantidad(1);
              }}
              whileTap={disponible && restante > 0 ? { scale: 0.97 } : undefined}
              className="h-12 flex-1 min-w-[12rem] rounded-full bg-champan px-8 font-medium text-noche transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:bg-borde disabled:text-arena"
            >
              {!disponible
                ? "Sin stock"
                : restante <= 0
                  ? `Ya tenés ${enCarrito} en el carrito`
                  : "Añadir al carrito"}
            </motion.button>
          </div>

          {/* Insignias de confianza */}
          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-borde bg-borde sm:grid-cols-3">
            {CONFIANZA.map((texto) => (
              <div key={texto} className="bg-carbon px-4 py-4 text-center">
                <dd className="text-sm text-marfil">{texto}</dd>
              </div>
            ))}
          </dl>

          {/* Notas olfativas */}
          <div className="mt-10">
            <h2 className="font-display text-[1.3rem] font-light text-marfil">
              Pirámide olfativa
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(
                [
                  ["Notas de Salida", producto.notas.salida],
                  ["Notas de Corazón", producto.notas.corazon],
                  ["Notas de Fondo", producto.notas.fondo],
                ] as const
              ).map(([titulo, notas]) => (
                <div
                  key={titulo}
                  className="rounded-xl border border-borde bg-carbon p-4"
                >
                  <h3 className="text-micro text-arena">{titulo}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {notas.map((nota) => (
                      <li
                        key={nota}
                        className="rounded-full border border-champan/30 px-2.5 py-1 text-micro text-champan"
                      >
                        {nota}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="marco border-t border-borde py-16 md:py-20">
          <h2 className="font-display text-[length:var(--text-medio)] font-light text-marfil">
            Perfumes sugeridos
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((p) => (
              <TarjetaProducto key={p.slug} producto={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
