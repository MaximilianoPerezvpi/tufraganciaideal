/** Formatea pesos uruguayos: 1450 -> "$ 1.450". */
export function precio(monto: number): string {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(monto);
}
