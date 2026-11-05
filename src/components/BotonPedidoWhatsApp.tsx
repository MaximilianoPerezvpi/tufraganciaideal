import type { ReactNode } from "react";

/**
 * Botón "Hacer Pedido por WhatsApp". Es un link (abre wa.me en otra
 * pestaña): el texto del pedido ya viene armado en `href`
 * (ver `src/lib/pedidoWhatsApp.ts`).
 *
 * `origen` y `slug` viajan como data-attributes: los lee el listener de
 * clics de `Analytics.tsx` para medir el contacto (nunca como una venta).
 */
export default function BotonPedidoWhatsApp({
  href,
  className = "",
  children = "Hacer Pedido por WhatsApp",
  origen,
  slug,
}: {
  href: string;
  className?: string;
  children?: ReactNode;
  /** Dónde está el botón: "tarjeta", "ficha", "carrito"… */
  origen: string;
  /** Perfume consultado, si el botón es de un producto. */
  slug?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-wa-origen={origen}
      data-wa-slug={slug}
      className={`flex items-center justify-center gap-2 rounded-full bg-vetiver font-medium text-noche transition-colors hover:bg-vetiver/85 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-current" aria-hidden>
        <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.2.05-.37-.02-.51-.08-.15-.65-1.58-.9-2.16-.24-.58-.48-.5-.65-.5-.17 0-.37-.02-.56-.02-.2 0-.51.07-.78.37-.26.29-1.02 1-1.02 2.42 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.96 4.39.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
        <path d="M12.02 2.5c-5.26 0-9.53 4.27-9.53 9.53 0 1.68.44 3.32 1.28 4.76L2.5 21.5l4.85-1.27a9.5 9.5 0 0 0 4.67 1.24h.01c5.26 0 9.53-4.27 9.53-9.53s-4.27-9.44-9.54-9.44Zm0 17.32h-.01a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.95.78.79-2.88-.19-.3a7.79 7.79 0 0 1-1.2-4.14c0-4.32 3.51-7.83 7.84-7.83 2.1 0 4.06.82 5.54 2.3a7.78 7.78 0 0 1 2.29 5.54c0 4.32-3.52 7.79-7.84 7.79Z" />
      </svg>
      {children}
    </a>
  );
}
