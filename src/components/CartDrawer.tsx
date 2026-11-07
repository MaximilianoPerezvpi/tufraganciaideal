"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  MAX_UNIDADES,
  useCarrito,
  useCarritoListo,
  useLineas,
  useTotal,
} from "@/lib/cartStore";
import { precio } from "@/lib/format";
import { site } from "@/lib/site";
import { linkPedidoCarrito } from "@/lib/pedidoWhatsApp";
import ImagenProducto from "./ImagenProducto";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";

/**
 * Carrito lateral: junta varios perfumes para consultarlos en UN mensaje.
 *
 * La web no cobra: "Consultar por WhatsApp" abre el chat de la tienda con
 * el detalle del carrito ya escrito (ver `linkPedidoCarrito`). Nada acá
 * depende del inventario: el tope de unidades es fijo para todos.
 */
export default function CartDrawer() {
  const abierto = useCarrito((e) => e.abierto);
  const cerrar = useCarrito((e) => e.cerrarCarrito);
  const ajustar = useCarrito((e) => e.ajustarCantidad);
  const eliminar = useCarrito((e) => e.eliminar);

  const lineas = useLineas();
  const total = useTotal();
  const listo = useCarritoListo();

  const botonCerrar = useRef<HTMLButtonElement>(null);

  // Escape cierra, y el foco entra al panel al abrirse (accesibilidad).
  useEffect(() => {
    if (!abierto) return;
    botonCerrar.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <>
          <motion.div
            key="fondo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cerrar}
            className="fixed inset-0 z-[60] bg-noche/70 backdrop-blur-[2px]"
            aria-hidden
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Tu carrito"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-borde bg-carbon"
          >
            <header className="flex items-center justify-between border-b border-borde px-6 py-5">
              <h2 className="font-display text-[1.4rem] text-marfil">
                Tu carrito
              </h2>
              <button
                ref={botonCerrar}
                type="button"
                onClick={cerrar}
                aria-label="Cerrar carrito"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-borde text-arena transition-colors hover:border-arena hover:text-marfil"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto px-6">
              {!listo ? null : lineas.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-display text-[1.3rem] text-marfil">
                    Aún no has elegido ninguna fragancia
                  </p>
                  <p className="mt-2 max-w-[30ch] text-sm text-arena">
                    Elegí un perfume del catálogo y aparece acá.
                  </p>
                  <Link
                    href="/"
                    onClick={cerrar}
                    className="mt-6 rounded-full bg-champan px-6 py-3 text-sm font-medium text-noche transition-colors hover:bg-oro-claro"
                  >
                    Explorar Catálogo
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-borde">
                  <AnimatePresence>
                    {lineas.map((linea, i) => (
                      <motion.li
                        key={linea.producto.slug}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.25, delay: i * 0.06 },
                        }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 py-5"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-humo">
                          <ImagenProducto
                            producto={linea.producto}
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-micro text-arena">
                            {linea.producto.casa}
                          </p>
                          <h3 className="truncate font-display text-[1.1rem] text-marfil">
                            {linea.producto.nombre}
                          </h3>
                          <p className="cifras mt-0.5 text-micro text-arena">
                            {linea.producto.concentracion}{" "}
                            {linea.producto.volumen_ml} ml
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="flex items-center rounded-full border border-borde">
                              <button
                                type="button"
                                onClick={() =>
                                  ajustar(
                                    linea.producto.slug,
                                    linea.cantidad - 1,
                                  )
                                }
                                aria-label={`Quitar una unidad de ${linea.producto.nombre}`}
                                className="h-8 w-8 text-arena transition-colors hover:text-marfil"
                              >
                                −
                              </button>
                              <span className="cifras w-6 text-center text-sm text-marfil">
                                {linea.cantidad}
                              </span>
                              <button
                                type="button"
                                disabled={linea.cantidad >= MAX_UNIDADES}
                                onClick={() =>
                                  ajustar(
                                    linea.producto.slug,
                                    linea.cantidad + 1,
                                  )
                                }
                                aria-label={`Agregar una unidad de ${linea.producto.nombre}`}
                                className="h-8 w-8 text-arena transition-colors hover:text-marfil disabled:opacity-30 disabled:hover:text-arena"
                              >
                                +
                              </button>
                            </div>

                            <p className="cifras text-champan">
                              {precio(linea.subtotal)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => eliminar(linea.producto.slug)}
                            className="mt-2 text-micro text-arena underline-offset-4 transition-colors hover:text-marfil hover:underline"
                          >
                            Quitar
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Resumen y pedido */}
            {lineas.length > 0 && (
              <footer className="border-t border-borde px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-marfil">Total</span>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="cifras text-2xl text-champan"
                  >
                    {precio(total)}
                  </motion.span>
                </div>
                <p className="mt-1 text-micro text-arena">
                  Precios de referencia: pueden variar. El precio final y el
                  envío se confirman por WhatsApp.
                </p>

                <BotonPedidoWhatsApp
                  href={linkPedidoCarrito(lineas, total)}
                  origen="carrito"
                  className="mt-4 w-full py-4"
                >
                  Consultar por WhatsApp
                </BotonPedidoWhatsApp>

                <p className="mt-3 text-center text-micro text-arena">
                  Te llega un solo mensaje con todos tus perfumes. No se cobra
                  nada en la web: te confirmamos disponibilidad y tiempo de
                  entrega, y coordinamos el pago (transferencia, efectivo
                  cuando corresponda o link de Mercado Pago) y el envío a todo{" "}
                  {site.pais}.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
