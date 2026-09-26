"use client";

import { motion, useReducedMotion } from "framer-motion";
import { linkWhatsApp } from "@/lib/site";

/**
 * Botón flotante de WhatsApp: siempre visible, abajo a la derecha. El anillo
 * pulsa despacio para llamar la atención sin ser invasivo — se apaga con
 * `prefers-reduced-motion`, como el resto del movimiento continuo del sitio.
 */
export default function BotonFlotanteWhatsApp() {
  const sinMovimiento = useReducedMotion();

  return (
    <a
      href={linkWhatsApp("Hola! Tengo una consulta sobre un perfume.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-vetiver text-noche shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)] transition-transform hover:scale-105"
    >
      {!sinMovimiento && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-vetiver"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 1.67c2.23 0 4.32.87 5.9 2.44a8.25 8.25 0 0 1 2.43 5.8c0 4.55-3.7 8.24-8.33 8.24a8.3 8.3 0 0 1-4.22-1.15l-.3-.18-3.13.82.84-3.05-.2-.32a8.2 8.2 0 0 1-1.27-4.4c0-4.55 3.7-8.2 8.28-8.2Zm-4.6 4.8c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.7 2.7 4.19 3.68 2.07.82 2.49.66 2.94.62.45-.04 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.24-.63.8-.78.97-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.36-.77-1.86-.2-.48-.4-.42-.56-.43Z" />
      </svg>
    </a>
  );
}
