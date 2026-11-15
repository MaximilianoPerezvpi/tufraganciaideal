/** Reglas comerciales de las ventas mayoristas (las pasó la tienda). */

/** Mínimo mayorista, en unidades. */
export const MINIMO = 6;
/** Caja estándar: los precios publicados valen para esta cantidad. */
export const CAJA = 12;

/**
 * Precio sugerido de venta al público para el revendedor: costo + al menos
 * $400, redondeado hacia arriba a un precio terminado en 90 (como los de la
 * tienda), o sea $400 a $499 de ganancia por unidad.
 *
 * Piso: si el perfume está en el catálogo, el sugerido nunca queda por
 * debajo del precio de la tienda (`precioTienda`); en ese caso se iguala.
 * Es solo una sugerencia: cada revendedor fija su precio.
 */
export function precioSugerido(costo: number, precioTienda?: number): number {
  const base = Math.ceil((costo + 400 - 90) / 100) * 100 + 90;
  return Math.max(base, precioTienda ?? 0);
}
