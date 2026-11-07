"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { Producto } from "@/data/productos";
import { precio } from "@/lib/format";
import { calificacionDe } from "@/lib/resenas";
import { linkPedidoProducto } from "@/lib/pedidoWhatsApp";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";
import Estrellas from "./Estrellas";
import ImagenProducto from "./ImagenProducto";
import VistaRapidaModal from "./VistaRapidaModal";

/**
 * Tarjeta de producto: un frasco original sellado.
 *
 * Un solo botón y una sola decisión: consultar por WhatsApp. Todos los
 * perfumes se presentan igual: la disponibilidad nunca se muestra, se
 * confirma en el chat.
 */
export default function TarjetaProducto({
  producto,
  prioridad = false,
}: {
  producto: Producto;
  /** true en las primeras tarjetas: le dice a next/image que las cargue ya. */
  prioridad?: boolean;
}) {
  const calificacion = calificacionDe(producto);

  const [vistaRapidaAbierta, setVistaRapidaAbierta] = useState(false);

  return (
    <>
    {/* Sin `layout`: medir 24 tarjetas en cada render bloqueaba el hilo
        principal en celulares; el reacomodo lo anima el contenedor. */}
    <motion.article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-carbon transition-all duration-300 hover:-translate-y-1 hover:glow-oro ${
        producto.destacado
          ? "border border-champan/35"
          : "border border-borde hover:border-oro-vivo/40"
      }`}
    >
      {/* 📸 FOTO DEL PERFUME
          Archivo: /public/productos/<slug>.jpg — cuadrada 1000×1000, frasco
          sellado centrado. `sizes` evita que el celular baje la versión grande. */}
      <div className="relative aspect-square overflow-hidden bg-humo">
        <Link
          href={`/producto/${producto.slug}`}
          aria-label={`Ver ${producto.nombre} de ${producto.casa}`}
          className="absolute inset-0 block"
        >
          <ImagenProducto
            producto={producto}
            prioridad={prioridad}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge de autenticidad: verde verificado, el mismo en todo el sitio. */}
          <span className="absolute left-3 top-3 rounded-full bg-noche/80 px-3 py-1 text-micro text-vetiver backdrop-blur-sm">
            100% original sellado
          </span>

          {/* Badge de familia: Árabe o Diseñador. */}
          <span className="absolute bottom-3 left-3 rounded-full border border-marfil/25 bg-noche/70 px-3 py-1 text-micro text-marfil backdrop-blur-sm">
            {producto.categoria === "árabes" ? "Árabe" : "Diseñador"}
          </span>
        </Link>

        {/* Vista Rápida: hermano del Link, no anidado en el <a>. Centrado
            sobre la imagen al hacer hover, para no chocar con los badges
            de las esquinas. */}
        <button
          type="button"
          onClick={() => setVistaRapidaAbierta(true)}
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 scale-95 rounded-full border border-marfil/30 bg-noche/85 px-5 py-2.5 text-micro text-marfil opacity-0 backdrop-blur-sm transition-all duration-200 hover:border-champan hover:text-champan group-hover:scale-100 group-hover:opacity-100"
        >
          Vista rápida
        </button>
      </div>

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

        {calificacion && (
          <Estrellas {...calificacion} className="mt-1.5" />
        )}

        {/* Ficha técnica: lo primero que mira alguien que ya sabe qué busca. */}
        <p className="cifras mt-1 text-sm text-arena">
          {producto.concentracion} · {producto.volumen_ml} ml
        </p>

        {/* Descripción y pirámide solo con ficha verificada: sin ella, la
            descripción repetiría lo que ya dice la línea de arriba. */}
        {producto.notas && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-arena">
              {producto.descripcion}
            </p>

            <dl className="mt-4 space-y-1.5 text-micro">
              {(
                [
                  ["Salida", producto.notas.salida],
                  ["Corazón", producto.notas.corazon],
                  ["Fondo", producto.notas.fondo],
                ] as const
              ).map(([nivel, notas]) => (
                <div key={nivel} className="flex gap-2">
                  <dt className="w-14 shrink-0 text-arena">{nivel}</dt>
                  <dd className="text-arena">{notas.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <div className="mt-auto pt-6">
          <p className="cifras text-2xl text-champan">
            {precio(producto.precio_uyu)}
          </p>

          <BotonPedidoWhatsApp
            href={linkPedidoProducto(producto)}
            origen="tarjeta"
            slug={producto.slug}
            className="mt-4 w-full py-3 text-sm"
          >
            Consultar por WhatsApp
          </BotonPedidoWhatsApp>
        </div>
      </div>
    </motion.article>

    <VistaRapidaModal
      producto={producto}
      abierto={vistaRapidaAbierta}
      onCerrar={() => setVistaRapidaAbierta(false)}
    />
    </>
  );
}
