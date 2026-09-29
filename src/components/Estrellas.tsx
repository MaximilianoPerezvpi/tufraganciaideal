const PUNTA_ESTRELLA =
  "M12 2.5l2.86 6.17 6.64.62-5.02 4.6 1.46 6.61L12 17.02l-5.94 3.48 1.46-6.61-5.02-4.6 6.64-.62L12 2.5z";

function FilaEstrellas() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" aria-hidden>
          <path d={PUNTA_ESTRELLA} fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}

/**
 * 5 estrellas doradas con relleno proporcional (soporta decimales, ej. 4.7)
 * + texto opcional. El promedio sale de reseñas reales (`lib/resenas.ts`).
 */
export default function Estrellas({
  estrellas,
  resenas,
  className = "",
}: {
  estrellas: number;
  resenas?: number;
  className?: string;
}) {
  const porcentaje = Math.max(0, Math.min(100, (estrellas / 5) * 100));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative text-borde">
        <FilaEstrellas />
        <div
          className="absolute inset-0 overflow-hidden text-champan"
          style={{ width: `${porcentaje}%` }}
        >
          <FilaEstrellas />
        </div>
      </div>
      <span className="cifras text-micro text-arena">
        {estrellas.toFixed(1)}/5{resenas != null ? ` (${resenas} ${resenas === 1 ? "reseña" : "reseñas"})` : ""}
      </span>
    </div>
  );
}
