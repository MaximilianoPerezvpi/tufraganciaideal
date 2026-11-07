/** Formatea pesos uruguayos: 1450 -> "$ 1.450". */
export function precio(monto: number): string {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(monto);
}

/** "Lancôme" y "lancome" encuentran lo mismo: sin mayúsculas ni tildes. */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
