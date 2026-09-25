"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useCarrito,
  useCarritoListo,
  useLineas,
  useTotal,
} from "@/lib/cartStore";
import { precio } from "@/lib/format";
import { site } from "@/lib/site";
import ImagenProducto from "./ImagenProducto";

/**
 * Carrito lateral.
 *
 * "Ir a pagar" no cobra acá: manda los items a /api/checkout, el
 * servidor arma la preferencia de Mercado Pago con los precios reales y
 * devuelve la URL del Checkout Pro. Recién ahí redirigimos.
 */
export default function CartDrawer() {
  const abierto = useCarrito((e) => e.abierto);
  const cerrar = useCarrito((e) => e.cerrarCarrito);
  const ajustar = useCarrito((e) => e.ajustarCantidad);
  const eliminar = useCarrito((e) => e.eliminar);

  const lineas = useLineas();
  const total = useTotal();
  const listo = useCarritoListo();

  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  async function finalizarCompra() {
    setPagando(true);
    setError(null);
    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Solo slug y cantidad: el precio lo pone el servidor.
          items: lineas.map((l) => ({
            slug: l.producto.slug,
            cantidad: l.cantidad,
          })),
        }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.url) {
        throw new Error(datos.error ?? "No pudimos iniciar el pago.");
      }
      // Redirección al Checkout Pro de Mercado Pago.
      window.location.href = datos.url;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No pudimos iniciar el pago. Probá de nuevo en un momento.",
      );
      setPagando(false);
    }
  }

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
                  <p className="text-marfil">Todavía no agregaste nada.</p>
                  <p className="mt-2 max-w-[30ch] text-sm text-arena">
                    Elegí un perfume del catálogo y aparece acá.
                  </p>
                  <button
                    type="button"
                    onClick={cerrar}
                    className="mt-6 rounded-full border border-champan/50 px-6 py-3 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
                  >
                    Ver el catálogo
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-borde">
                  <AnimatePresence initial={false}>
                    {lineas.map((linea) => (
                      <motion.li
                        key={linea.producto.slug}
                        layout
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
                            {linea.producto.marca}
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
                                disabled={
                                  linea.cantidad >= linea.producto.stock
                                }
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

                          {linea.cantidad >= linea.producto.stock && (
                            <p className="mt-2 text-micro text-arena">
                              Es todo el stock que tenemos de este.
                            </p>
                          )}

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

            {/* Resumen y pago */}
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
                  El costo de envío se calcula en el siguiente paso, según tu
                  departamento.
                </p>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-lg border border-champan/40 bg-champan/10 px-4 py-3 text-sm text-marfil"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={finalizarCompra}
                  disabled={pagando}
                  className="mt-4 w-full rounded-full bg-champan py-4 font-medium text-noche transition-colors hover:bg-oro-claro disabled:cursor-wait disabled:opacity-70"
                >
                  {pagando ? "Abriendo Mercado Pago…" : "Ir a pagar"}
                </button>

                <p className="mt-3 text-center text-micro text-arena">
                  Pagás con Mercado Pago: tarjetas OCA, Visa y Mastercard, o en
                  efectivo por Abitab y Redpagos. Envíos a todo {site.pais}.
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
