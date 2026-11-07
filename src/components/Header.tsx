"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { linkWhatsApp, navegacion } from "@/lib/site";
import BotonCarrito from "./BotonCarrito";
import SearchBar from "./SearchBar";

/**
 * Header fijo, siempre con fondo oscuro y vidrio esmerilado (antes solo
 * arriba del todo era transparente y se ponía "vidrio" recién al scrollear;
 * ahora es legible desde el primer frame, sobre cualquier hero). En
 * escritorio cierra con WhatsApp y el carrito de consulta; en mobile queda
 * el carrito (WhatsApp lo cubre el botón flotante).
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
        {/* En celular, versión corta: la larga ocupaba 3 líneas y se cortaba. */}
        <p className="kicker truncate text-[0.68rem]">
          ✨ Envíos a todo Uruguay
          <span className="hidden sm:inline">
            {" "}· 100% Originales Sellados · Pedidos por WhatsApp
          </span>
        </p>
      </div>

      <div className="vidrio">
        <div className="marco flex h-[72px] items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-baseline gap-1.5 sm:gap-2">
            <span className="font-display text-[1.2rem] leading-none text-marfil sm:text-[1.35rem]">
              TuFragancia
            </span>
            <span className="font-display text-[1.2rem] italic leading-none text-champan sm:text-[1.35rem]">
              Ideal
            </span>
          </Link>

          <SearchBar />

          {/* Menú completo solo desde xl: entre 768 y 1280 px no entraba
              (WhatsApp y Carrito quedaban fuera de pantalla). */}
          <nav aria-label="Principal" className="hidden items-center gap-6 whitespace-nowrap xl:flex">
            {navegacion.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-arena transition-colors hover:text-marfil"
              >
                {item.etiqueta}
              </Link>
            ))}
            <a
              href={linkWhatsApp("¡Hola! Tengo una consulta sobre un perfume.")}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-origen="header"
              className="flex h-11 items-center rounded-full border border-vetiver/60 px-5 text-sm text-vetiver transition-colors hover:bg-vetiver hover:text-noche"
            >
              WhatsApp
            </a>
            <BotonCarrito />
          </nav>

          <div className="flex shrink-0 items-center gap-1 xl:hidden">
            <BotonCarrito />
            <button
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
              aria-expanded={menuAbierto}
              aria-controls="menu-mobile"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
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
              className="overflow-hidden xl:hidden"
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
