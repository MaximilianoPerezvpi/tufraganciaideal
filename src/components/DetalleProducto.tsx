"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Producto } from "@/data/productos";
import { precio } from "@/lib/format";
import { calificacionDe } from "@/lib/resenas";
import { linkConsultaNotas, linkPedidoProducto } from "@/lib/pedidoWhatsApp";
import { trackVistaProducto } from "@/lib/analytics";
import {
  ocasionesDe,
  textoLongevidad,
  textoProyeccion,
} from "@/lib/perfume";
import TarjetaProducto from "./TarjetaProducto";
import ImagenProducto from "./ImagenProducto";
import BarraIntensidad from "./BarraIntensidad";
import Estrellas from "./Estrellas";
import ResenasProducto from "./ResenasProducto";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";
import BotonAgregarCarrito from "./BotonAgregarCarrito";

const CONFIANZA = [
  "100% Original Sellado",
  "Atención Personalizada",
  "Envío a todo Uruguay",
] as const;

/** Página de un perfume: imagen grande, ficha completa y consulta por WhatsApp. */
export default function DetalleProducto({
  producto,
  relacionados,
}: {
  producto: Producto;
  relacionados: Producto[];
}) {
  const calificacion = calificacionDe(producto);

  // Analítica: vista de producto (no hace nada si no hay GA4/Pixel configurado).
  useEffect(() => {
    trackVistaProducto(producto);
  }, [producto]);


  // Barra fija de consulta (solo mobile): aparece cuando el botón principal
  // sale de la pantalla al scrollear.
  const botonPrincipalRef = useRef<HTMLDivElement>(null);
  const [mostrarBarraFija, setMostrarBarraFija] = useState(false);

  useEffect(() => {
    const el = botonPrincipalRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entrada]) => setMostrarBarraFija(!entrada.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  return (
    <>
      <div className="marco pt-10">
        <Link
          href="/catalogo"
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
            className="object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-noche/80 px-3 py-1 text-micro text-vetiver backdrop-blur-sm">
            100% original sellado
          </span>
        </div>

        {/* Ficha */}
        <div className="flex flex-col">
          <p className="text-micro text-arena">{producto.casa}</p>
          <h1 className="mt-1 font-display text-[length:var(--text-titulo)] font-light leading-[1.05] text-marfil">
            {producto.nombre}
          </h1>

          {calificacion ? (
            <a href="#opiniones" className="mt-2.5 self-start">
              <Estrellas {...calificacion} />
            </a>
          ) : (
            <a
              href="#opiniones"
              className="mt-2.5 self-start text-micro text-arena underline-offset-4 transition-colors hover:text-champan hover:underline"
            >
              Sin reseñas todavía · Escribí la primera
            </a>
          )}

          <p className="cifras mt-2 text-sm text-arena">
            {producto.concentracion} · {producto.volumen_ml} ml
          </p>

          <p className="mt-5 max-w-[52ch] leading-relaxed text-arena">
            {producto.descripcion}
          </p>

          <p className="cifras mt-6 text-3xl text-champan">
            {precio(producto.precio_uyu)}
          </p>
          <p className="mt-1 text-micro text-arena">
            Precio en pesos uruguayos. Los precios pueden variar: te lo
            confirmamos por WhatsApp antes de cerrar el pedido.
          </p>

          {/* Mismo mensaje para todo el catálogo: la disponibilidad, el
              precio final y el plazo se confirman por WhatsApp. */}
          <p className="mt-4 max-w-[52ch] rounded-xl border border-borde bg-carbon px-4 py-3 text-sm leading-relaxed text-arena">
            <span className="text-marfil">¿Te interesa este perfume?</span>{" "}
            Escribinos por WhatsApp para confirmar disponibilidad, precio y
            tiempo de entrega. Te asesoramos personalmente para realizar tu
            pedido.
          </p>

          {/* Indicadores técnicos */}
          <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-borde bg-carbon p-4">
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
            <p className="col-span-2 text-micro text-arena">
              Estimado según la concentración ({producto.concentracion}); varía
              con la piel y el clima.
            </p>
          </div>

          {/* Consulta por WhatsApp: la única acción de compra. */}
          <div ref={botonPrincipalRef} className="mt-6">
            <BotonPedidoWhatsApp
              href={linkPedidoProducto(producto)}
              origen="ficha"
              slug={producto.slug}
              className="h-14 w-full px-8 text-base"
            >
              Consultar por WhatsApp
            </BotonPedidoWhatsApp>
            {/* Secundario: para consultar varios perfumes en un solo mensaje. */}
            <BotonAgregarCarrito slug={producto.slug} className="mt-3 h-12 w-full" />
          </div>

          {/* Ocasiones recomendadas: calculadas, no son dato del catálogo. */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-micro text-arena">Ideal para</span>
            {ocasionesDe(producto).map((ocasion) => (
              <span
                key={ocasion}
                className="rounded-full border border-borde px-3 py-1 text-micro text-marfil"
              >
                {ocasion}
              </span>
            ))}
          </div>

          {/* Insignias de confianza */}
          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-borde bg-borde sm:grid-cols-3">
            {CONFIANZA.map((texto) => (
              <div key={texto} className="bg-carbon px-4 py-4 text-center">
                <dd className="text-sm text-marfil">{texto}</dd>
              </div>
            ))}
          </dl>

          {/* Cómo se compra: la web no cobra, todo se cierra por WhatsApp. */}
          <div className="mt-6 rounded-xl border border-borde bg-carbon p-5 text-sm leading-relaxed text-arena">
            <h2 className="text-marfil">Cómo se compra</h2>
            <p className="mt-2">
              Nos escribís por WhatsApp, te confirmamos disponibilidad y
              coordinamos la entrega. Pagás por transferencia bancaria, en
              efectivo cuando corresponda o con un link de Mercado Pago que te
              enviamos por WhatsApp. Envíos a todo Uruguay.{" "}
              <Link href="/#envios" className="text-champan underline underline-offset-4 hover:text-oro-claro">
                Envíos y pagos
              </Link>
            </p>
          </div>

          {/* Notas olfativas: solo con ficha verificada. Sin ella no se
              inventan notas: se invita a consultar. */}
          {producto.notas ? (
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
                        <motion.li
                          key={nota}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="nota-shimmer cursor-default rounded-full border border-champan/30 px-2.5 py-1 text-micro text-champan hover:animate-[barrido-oro_0.9s_ease_forwards] hover:border-oro-vivo/60"
                        >
                          {nota}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-borde bg-carbon p-5">
              <h2 className="font-display text-[1.3rem] font-light text-marfil">
                ¿Cómo huele?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-arena">
                Estamos completando la ficha olfativa de este perfume.
                Escribinos y te contamos sus notas, duración y para qué
                ocasión conviene.
              </p>
              <a
                href={linkConsultaNotas(producto)}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-origen="ficha-notas"
                data-wa-slug={producto.slug}
                className="mt-4 inline-flex rounded-full border border-vetiver/60 px-5 py-2.5 text-sm text-vetiver transition-colors hover:bg-vetiver/10"
              >
                Consultar notas por WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      <ResenasProducto producto={producto} />

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="marco border-t border-borde py-16 md:py-20">
          <h2 className="font-display text-[length:var(--text-medio)] font-light text-marfil">
            También te podría gustar
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relacionados.map((p) => (
              <TarjetaProducto key={p.slug} producto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Barra fija de compra: solo mobile, solo cuando el botón principal
          ya no está a la vista. */}
      <AnimatePresence>
        {mostrarBarraFija && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-borde bg-carbon/95 px-4 py-3 backdrop-blur-md md:hidden"
          >
            <div className="min-w-0">
              <p className="truncate text-micro text-arena">{producto.nombre}</p>
              <p className="cifras text-lg text-champan">
                {precio(producto.precio_uyu)}
              </p>
            </div>
            <BotonPedidoWhatsApp
              href={linkPedidoProducto(producto)}
              origen="ficha-barra-movil"
              slug={producto.slug}
              className="shrink-0 px-5 py-3 text-sm"
            >
              Consultar por WhatsApp
            </BotonPedidoWhatsApp>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
