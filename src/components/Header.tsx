"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { navegacion } from "@/lib/site";
import BotonCarrito from "./BotonCarrito";

/**
 * Header fijo, siempre con fondo oscuro y vidrio esmerilado (antes solo
 * arriba del todo era transparente y se ponía "vidrio" recién al scrollear;
 * ahora es legible desde el primer frame, sobre cualquier hero). El carrito
 * está siempre visible, también en mobile: es el botón que tiene que estar
 * a mano.
 */
export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Bloquea el scroll del body cuando el menú mobile está abierto.
  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Franja de anuncio: fija, siempre sólida (no se pone vidrio al scrollear). */}
      <div className="flex h-8 items-center justify-center bg-noche px-4 text-center">
        <p className="kicker text-[0.68rem]">
          ✨ Envíos a todo Uruguay en 24-48 hs · 100% Originales Sellados ·
          Hasta 12 cuotas vía Mercado Pago
        </p>
      </div>

      <div className="vidrio">
        <div className="marco flex h-[72px] items-center justify-between gap-4">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-[1.35rem] leading-none text-marfil">
              TuFragancia
            </span>
            <span className="font-display text-[1.35rem] italic leading-none text-champan">
              Ideal
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            {navegacion.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-arena transition-colors hover:text-marfil"
              >
                {item.etiqueta}
              </Link>
            ))}
            <BotonCarrito />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <BotonCarrito />
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-expanded={menuAbierto}
              aria-controls="menu-mobile"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]"
            >
              <motion.span
                animate={menuAbierto ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-6 bg-marfil"
              />
              <motion.span
                animate={menuAbierto ? { opacity: 0 } : { opacity: 1 }}
                className="block h-[1.5px] w-6 bg-marfil"
              />
              <motion.span
                animate={menuAbierto ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-6 bg-marfil"
              />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuAbierto && (
            <motion.nav
              id="menu-mobile"
              aria-label="Principal"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden md:hidden"
            >
              <div className="marco flex flex-col gap-1 pb-6">
                {navegacion.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuAbierto(false)}
                    className="border-b border-borde/60 py-4 text-lg text-marfil"
                  >
                    {item.etiqueta}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
