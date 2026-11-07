import type { Producto } from "@/data/productos";
import { linkWhatsApp } from "@/lib/site";

/**
 * MENSAJES DE WHATSAPP
 *
 * La web no vende: cada consulta sale como un mensaje pre-armado al
 * WhatsApp de la tienda (`site.whatsapp`). Ahí se confirma disponibilidad,
 * precio y tiempo de entrega, y se envía el medio de pago.
 *
 * Todos los perfumes usan el MISMO mensaje: la web nunca revela qué hay en
 * stock físico y qué se consigue por encargo (decisión comercial). Eso se
 * resuelve en el chat, sin prometer nada antes.
 */

/** 3200 -> "3.200" (separador de miles uruguayo, sin decimales). */
function monto(valor: number): string {
  return new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(valor);
}

/** "Lattafa Khamrah EDP 100 ml": casa, nombre y presentación exactos. */
export function nombreCompleto(p: Producto): string {
  return `${p.casa} ${p.nombre} ${p.concentracion} ${p.volumen_ml} ml`;
}

/** Consulta / pedido de un perfume (tarjeta, ficha, vista rápida). */
export function linkPedidoProducto(p: Producto): string {
  return linkWhatsApp(
    `¡Hola! Me interesa el ${nombreCompleto(p)} ($${monto(p.precio_uyu)}) que vi en la web. ¿Me podrían confirmar disponibilidad y tiempo de entrega?`,
  );
}

/** Para perfumes sin ficha olfativa verificada: "¿cómo huele?". */
export function linkConsultaNotas(p: Producto): string {
  return linkWhatsApp(
    `¡Hola! ¿Me cuentan cómo huele el ${nombreCompleto(p)}? (notas, duración y para qué ocasión conviene)`,
  );
}

/** Perfume que no está publicado en el catálogo. */
export function linkPerfumeFueraDeCatalogo(termino?: string): string {
  return linkWhatsApp(
    termino
      ? `¡Hola! Estoy buscando el perfume "${termino}" y no lo encontré en su catálogo. ¿Podrían ayudarme a conseguirlo?`
      : "¡Hola! Estoy buscando un perfume que no encontré en su catálogo. ¿Podrían ayudarme a conseguirlo?",
  );
}

/** Consulta por todo lo que hay en el carrito, en un solo mensaje. */
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
    `¡Hola! Quiero consultar por estos perfumes que vi en la web:\n${detalle}\n\nTotal: $${monto(total)} UYU. ¿Me podrían confirmar disponibilidad y tiempo de entrega?`,
  );
}
