"use client";

import Link from "next/link";
import { hayStock, type Producto } from "@/data/productos";
import { useCarrito } from "@/lib/cartStore";
import { precio } from "@/lib/format";
import { textoLongevidad, textoProyeccion } from "@/lib/perfume";
import Modal from "./Modal";
import ImagenProducto from "./ImagenProducto";
import BarraIntensidad from "./BarraIntensidad";

/** Vista rápida: pirámide olfativa y métricas sin salir del catálogo. */
export default function VistaRapidaModal({
  producto,
  abierto,
  onCerrar,
}: {
  producto: Producto;
  abierto: boolean;
  onCerrar: () => void;
}) {
  const agregar = useCarrito((e) => e.agregar);
  const enCarrito = useCarrito(
    (e) => e.items.find((i) => i.slug === producto.slug)?.cantidad ?? 0,
  );
  const disponible = hayStock(producto);
  const sinMasStock = enCarrito >= producto.stock;

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      etiqueta={`Vista rápida de ${producto.nombre}`}
      anchoMaximo="max-w-2xl"
    >
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-humo sm:rounded-l-2xl sm:rounded-tr-none">
          <ImagenProducto
            producto={producto}
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-micro text-arena">{producto.casa}</p>
          <h2 className="mt-1 font-display text-[1.5rem] font-light leading-tight text-marfil">
            {producto.nombre}
          </h2>
          <p className="cifras mt-1 text-sm text-arena">
            {producto.concentracion} · {producto.volumen_ml} ml
          </p>

          <p className="cifras mt-4 text-2xl text-champan">
            {precio(producto.precio_uyu)}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <BarraIntensidad
              etiqueta="Duración"
              valor={producto.longevidad}
              detalle={textoLongevidad(producto.longevidad)}
            />
            <BarraIntensidad
              etiqueta="Estela"
              valor={producto.proyeccion}
              detalle={textoProyeccion(producto.proyeccion)}
            />
          </div>

          <dl className="mt-5 space-y-1.5 text-micro">
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

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              disabled={!disponible || sinMasStock}
              onClick={() => agregar(producto.slug)}
              className="w-full rounded-full bg-champan py-3 text-sm font-medium text-noche transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:bg-borde disabled:text-arena"
            >
              {!disponible
                ? "Sin stock"
                : sinMasStock
                  ? `Ya tenés ${enCarrito} en el carrito`
                  : "Agregar al carrito"}
            </button>
            <Link
              href={`/producto/${producto.slug}`}
              className="text-center text-sm text-arena underline-offset-4 transition-colors hover:text-marfil hover:underline"
            >
              Ver ficha completa
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
