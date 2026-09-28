"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Modal genérico: overlay + panel centrado, Escape para cerrar, foco al
 * abrir, scroll del body bloqueado. Mismo patrón que ya usa `CartDrawer`
 * (que es un modal lateral); este es el centrado, para Vista Rápida y el
 * formulario de envío.
 */
export default function Modal({
  abierto,
  onCerrar,
  etiqueta,
  children,
  anchoMaximo = "max-w-lg",
}: {
  abierto: boolean;
  onCerrar: () => void;
  /** aria-label del diálogo, para lectores de pantalla. */
  etiqueta: string;
  children: React.ReactNode;
  /** Clase Tailwind de ancho máximo del panel (ej. "max-w-2xl"). */
  anchoMaximo?: string;
}) {
  const botonCerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    botonCerrar.current?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
    };
  }, [abierto, onCerrar]);

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
            onClick={onCerrar}
            className="fixed inset-0 z-[80] bg-noche/80 backdrop-blur-sm"
            aria-hidden
          />

          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={etiqueta}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-borde bg-carbon ${anchoMaximo}`}
            >
              <button
                ref={botonCerrar}
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-borde bg-carbon text-arena transition-colors hover:border-arena hover:text-marfil"
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
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
