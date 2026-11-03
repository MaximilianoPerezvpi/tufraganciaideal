import type { Producto } from "@/data/productos";
import { linkWhatsApp } from "@/lib/site";

/**
 * PEDIDOS POR WHATSAPP
 *
 * La web no cobra: cada pedido sale como un mensaje pre-armado al WhatsApp
 * de la tienda (`site.whatsapp`), y el pago y el envío se coordinan ahí.
 * Los precios salen de `productos.ts`, así que el mensaje siempre muestra
 * el precio vigente del catálogo.
 */

/** 3200 -> "3.200" (separador de miles uruguayo, sin decimales). */
function monto(valor: number): string {
  return new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(valor);
}

/** "Lattafa Khamrah" — la casa ayuda a identificar el frasco sin ambigüedad. */
function nombreCompleto(p: Producto): string {
  return `${p.casa} ${p.nombre}`;
}

/** Compra directa desde la ficha o la vista rápida de un perfume. */
export function linkPedidoProducto(p: Producto): string {
  return linkWhatsApp(
    `Hola! Quiero hacer el pedido del perfume: ${nombreCompleto(p)} - $${monto(p.precio_uyu)} UYU. ¿Tienen stock disponible?`,
  );
}

/** Pedido con todo lo que hay en el carrito. */
export function linkPedidoCarrito(
  lineas: { producto: Producto; cantidad: number; subtotal: number }[],
  total: number,
): string {
  const detalle = lineas
    .map((l) => {
      const cantidad = l.cantidad > 1 ? `${l.cantidad}x ` : "";
      return `- ${cantidad}${nombreCompleto(l.producto)} ($${monto(l.subtotal)})`;
    })
    .join("\n");
  return linkWhatsApp(
    `Hola! Quiero realizar el siguiente pedido:\n${detalle}\n\nTotal: $${monto(total)} UYU. ¿Cómo coordinamos el envío?`,
  );
}
