import {
  disponibilidad,
  ETIQUETA_DISPONIBILIDAD,
  type Producto,
} from "@/data/productos";

/**
 * Badge de disponibilidad, el mismo en tarjeta, ficha y vista rápida.
 * "En stock" va lleno (champán) para que salte a la vista; "A pedido" va
 * solo con borde, para que nunca se confunda con un frasco que ya tenemos.
 * "Sin stock" no lleva badge: lo marca la franja sobre la foto.
 */
export default function EtiquetaDisponibilidad({
  producto,
  className = "",
}: {
  producto: Producto;
  className?: string;
}) {
  const estado = disponibilidad(producto);
  if (estado === "agotado") return null;

  const estilo =
    estado === "stock"
      ? "bg-champan font-medium text-noche"
      : "border border-marfil/40 bg-noche/80 text-marfil backdrop-blur-sm";

  return (
    <span className={`rounded-full px-3 py-1 text-micro ${estilo} ${className}`}>
      {estado === "stock" ? "⚡ " : ""}
      {ETIQUETA_DISPONIBILIDAD[estado]}
    </span>
  );
}

/** Una línea que explica qué implica cada estado, para debajo del precio. */
export function detalleDisponibilidad(producto: Producto): string {
  switch (disponibilidad(producto)) {
    case "stock":
      return "En stock en Uruguay · envío a todo el país";
    case "pedido":
      return "A pedido · disponibilidad y plazo se confirman por WhatsApp";
    case "agotado":
      return "Sin stock por ahora · consultanos si vuelve a entrar";
  }
}
