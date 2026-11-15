/** Reglas comerciales de las ventas mayoristas (las pasó la tienda). */

/** Mínimo mayorista, en unidades. */
export const MINIMO = 6;
/** Caja estándar: los precios publicados valen para esta cantidad. */
export const CAJA = 12;

/**
 * Precio sugerido de venta al público para el revendedor: costo + al menos
 * $400, redondeado hacia arriba a un precio terminado en 90 (como los de la
 * tienda). Así la ganancia queda entre $400 y $499 por unidad.
 * Es solo una sugerencia: cada revendedor fija su precio.
 */
export function precioSugerido(costo: number): number {
  return Math.ceil((costo + 400 - 90) / 100) * 100 + 90;
}
