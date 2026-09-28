/** Barra de 5 segmentos para longevidad/proyección (1 a 5). */
export default function BarraIntensidad({
  etiqueta,
  valor,
  detalle,
}: {
  etiqueta: string;
  valor: number;
  /** Texto chico a la derecha, ej. "8-10 h" o "Alta estela". */
  detalle?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-micro text-arena">{etiqueta}</span>
        {detalle && <span className="text-micro text-arena/70">{detalle}</span>}
      </div>
      <div className="mt-1.5 flex gap-1" role="img" aria-label={`${etiqueta}: ${valor} de 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            aria-hidden
            className={`h-1.5 flex-1 rounded-full ${n <= valor ? "bg-champan" : "bg-borde"}`}
          />
        ))}
      </div>
    </div>
  );
}
