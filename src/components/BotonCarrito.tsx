"use client";

import { useCarrito, useCarritoListo, useUnidades } from "@/lib/cartStore";

/**
 * Botón del carrito con contador.
 *
 * El número se renderiza recién cuando el carrito terminó de leerse del
 * localStorage: si no, el servidor diría "0" y el navegador otra cosa, y React
 * tiraría un error de hidratación.
 */
export default function BotonCarrito({ className = "" }: { className?: string }) {
  const abrir = useCarrito((e) => e.abrirCarrito);
  const unidades = useUnidades();
  const listo = useCarritoListo();
  const mostrar = listo && unidades > 0;

  return (
    <button
      type="button"
      onClick={abrir}
      aria-label={
        mostrar ? `Abrir carrito (${unidades} productos)` : "Abrir carrito"
      }
      className={`relative flex h-10 items-center gap-2 rounded-full border border-champan/50 px-4 text-sm text-champan transition-colors hover:bg-champan hover:text-noche ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M4 5h2l2 11h10l2-8H7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="19.5" r="1.3" fill="currentColor" />
        <circle cx="17" cy="19.5" r="1.3" fill="currentColor" />
      </svg>
      <span>Carrito</span>
      {mostrar && (
        <span className="cifras absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-champan px-1 text-[0.7rem] font-medium text-noche">
          {unidades}
        </span>
      )}
    </button>
  );
}
