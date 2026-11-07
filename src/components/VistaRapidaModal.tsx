"use client";

import Link from "next/link";
import type { Producto } from "@/data/productos";
import { precio } from "@/lib/format";
import { textoLongevidad, textoProyeccion } from "@/lib/perfume";
import { linkConsultaNotas, linkPedidoProducto } from "@/lib/pedidoWhatsApp";
import Modal from "./Modal";
import ImagenProducto from "./ImagenProducto";
import BarraIntensidad from "./BarraIntensidad";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";

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

          {producto.notas ? (
            <dl className="mt-5 space-y-1.5 text-micro">
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
          ) : (
            <a
              href={linkConsultaNotas(producto)}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-origen="vista-rapida-notas"
              data-wa-slug={producto.slug}
              className="mt-5 block text-micro text-arena underline-offset-4 hover:text-marfil hover:underline"
            >
              ¿Cómo huele? Consultanos por WhatsApp
            </a>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <BotonPedidoWhatsApp
              href={linkPedidoProducto(producto)}
              origen="vista-rapida"
              slug={producto.slug}
              className="w-full py-3 text-sm"
            >
              Consultar por WhatsApp
            </BotonPedidoWhatsApp>
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
