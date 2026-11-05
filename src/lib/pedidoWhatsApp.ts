import { disponibilidad, type Producto } from "@/data/productos";
import { linkWhatsApp } from "@/lib/site";

/**
 * PEDIDOS POR WHATSAPP
 *
 * La web no cobra: cada pedido sale como un mensaje pre-armado al WhatsApp
 * de la tienda (`site.whatsapp`). Ahí se confirma disponibilidad, se
 * coordina la entrega y se envía el medio de pago (transferencia, efectivo
 * cuando corresponda, o link de Mercado Pago). Los precios salen de
 * `productos.ts`, así que el mensaje siempre muestra el precio vigente.
 */

/** 3200 -> "3.200" (separador de miles uruguayo, sin decimales). */
function monto(valor: number): string {
  return new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(valor);
}

/** "Lattafa Khamrah" — la casa ayuda a identificar el frasco sin ambigüedad. */
export function nombreCompleto(p: Producto): string {
  return `${p.casa} ${p.nombre}`;
}

/**
 * Compra directa desde la tarjeta, la ficha o la vista rápida. El texto
 * cambia según la disponibilidad: a un perfume a pedido no se le pregunta
 * "¿tienen stock?" como si estuviera en la vidriera.
 */
export function linkPedidoProducto(p: Producto): string {
  const perfume = `${nombreCompleto(p)} - $${monto(p.precio_uyu)} UYU`;
  switch (disponibilidad(p)) {
    case "stock":
      return linkWhatsApp(
        `Hola! Quiero hacer el pedido del perfume: ${perfume}. ¿Tienen stock disponible?`,
      );
    case "pedido":
      return linkWhatsApp(
        `Hola! Me interesa el perfume ${perfume}, que vi a pedido en TuFragancia Ideal. ¿Me confirmás disponibilidad, plazo y medios de pago?`,
      );
    case "agotado":
      return linkWhatsApp(
        `Hola! Vi que el perfume ${nombreCompleto(p)} está sin stock en TuFragancia Ideal. ¿Saben si vuelve a entrar?`,
      );
  }
}

/** Para perfumes sin ficha olfativa verificada: "¿cómo huele?". */
export function linkConsultaNotas(p: Producto): string {
  return linkWhatsApp(
    `Hola! ¿Me contás cómo huele el ${nombreCompleto(p)} (notas, duración, para qué ocasión)?`,
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
      const aPedido = disponibilidad(l.producto) === "pedido" ? " (a pedido)" : "";
      return `- ${cantidad}${nombreCompleto(l.producto)} ($${monto(l.subtotal)})${aPedido}`;
    })
    .join("\n");
  return linkWhatsApp(
    `Hola! Quiero realizar el siguiente pedido:\n${detalle}\n\nTotal: $${monto(total)} UYU. ¿Cómo coordinamos el envío?`,
  );
}
