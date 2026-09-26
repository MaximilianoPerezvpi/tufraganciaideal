import Image from "next/image";
import type { Producto } from "@/data/productos";

/**
 * Foto de un producto — o, si todavía no la subiste, un placeholder de lujo
 * en vez del ícono de imagen rota. `producto.imagen` queda sin definir en
 * la carga masiva de perfumes sin foto propia: esto es lo que se ve ahí.
 *
 * Ocupa el contenedor con `fill`, igual que `next/image`: el padre necesita
 * `position: relative` (o `absolute`, como las tarjetas del catálogo).
 */
export default function ImagenProducto({
  producto,
  prioridad = false,
  sizes,
  className = "",
}: {
  producto: Producto;
  /** true en las primeras tarjetas: le dice a next/image que la cargue ya. */
  prioridad?: boolean;
  sizes: string;
  className?: string;
}) {
  if (!producto.imagen) {
    return <FallbackFrasco className={className} />;
  }

  return (
    <Image
      src={producto.imagen}
      alt={`${producto.nombre} de ${producto.casa}, ${producto.concentracion} ${producto.volumen_ml} ml`}
      fill
      sizes={sizes}
      priority={prioridad}
      className={className}
    />
  );
}

function FallbackFrasco({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-carbon via-noche to-carbon ${className}`}
    >
      <svg
        viewBox="0 0 120 200"
        aria-hidden
        className="h-2/3 max-h-36 w-auto opacity-50"
      >
        <rect
          x="46"
          y="8"
          width="28"
          height="22"
          rx="4"
          fill="none"
          stroke="var(--color-champan)"
          strokeWidth="2"
        />
        <rect
          x="50"
          y="30"
          width="20"
          height="14"
          fill="none"
          stroke="var(--color-champan)"
          strokeWidth="2"
        />
        <rect
          x="24"
          y="44"
          width="72"
          height="140"
          rx="12"
          fill="none"
          stroke="var(--color-champan)"
          strokeWidth="2"
        />
        <line
          x1="24"
          y1="92"
          x2="96"
          y2="92"
          stroke="var(--color-champan)"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="42"
          y1="120"
          x2="78"
          y2="120"
          stroke="var(--color-champan)"
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>
      <span className="text-micro text-arena/70">Foto próximamente</span>
    </div>
  );
}
