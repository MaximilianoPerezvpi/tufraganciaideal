"use client";

import { useEffect, useState } from "react";
import { useCarrito } from "@/lib/cartStore";

/**
 * "Agregar al carrito": acción SECUNDARIA (solo borde). La principal de cada
 * perfume sigue siendo "Consultar por WhatsApp". El carrito sirve para
 * consultar varios perfumes en un solo mensaje; no depende del inventario.
 */
export default function BotonAgregarCarrito({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const agregar = useCarrito((e) => e.agregar);
  const [agregado, setAgregado] = useState(false);

  // "¡Agregado!" por un instante en el mismo lugar del clic.
  useEffect(() => {
    if (!agregado) return;
    const t = setTimeout(() => setAgregado(false), 1400);
    return () => clearTimeout(t);
  }, [agregado]);

  return (
    <button
      type="button"
      onClick={() => {
        agregar(slug);
        setAgregado(true);
      }}
      className={`flex items-center justify-center gap-2 rounded-full border text-sm transition-colors ${
        agregado
          ? "border-champan bg-champan/15 text-champan"
          : "border-champan/50 text-champan hover:bg-champan hover:text-noche"
      } ${className}`}
    >
      {agregado ? (
        <>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ¡Agregado!
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M4 5h2l2 11h10l2-8H7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="19.5" r="1.3" fill="currentColor" />
            <circle cx="17" cy="19.5" r="1.3" fill="currentColor" />
          </svg>
          Agregar al carrito
        </>
      )}
    </button>
  );
}
