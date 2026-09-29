const GARANTIAS = [
  {
    icono: "🚚",
    titulo: "Envíos a todo Uruguay",
    texto: "Vía DAC y Mirtrans, con seguimiento hasta tu puerta.",
  },
  {
    icono: "🔒",
    titulo: "Pago 100% Seguro",
    texto: "Mercado Pago o transferencia bancaria, hasta 12 cuotas.",
  },
  {
    icono: "✅",
    titulo: "Garantía de Originalidad",
    texto: "100% frascos sellados de origen, nunca decants.",
  },
] as const;

/** Tres razones para confiar, justo debajo del Hero: donde se resuelven las
 * objeciones antes de que la persona siga scrolleando. */
export default function TrustBadges() {
  return (
    <section className="border-b border-borde/60 bg-carbon/40 py-10">
      <div className="marco grid gap-8 sm:grid-cols-3">
        {GARANTIAS.map((g) => (
          <div key={g.titulo} className="flex items-start gap-4">
            <span
              aria-hidden
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-oro-vivo/30 bg-noche text-xl"
            >
              {g.icono}
            </span>
            <div>
              <p className="font-medium text-marfil">{g.titulo}</p>
              <p className="mt-1 text-sm text-arena">{g.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
