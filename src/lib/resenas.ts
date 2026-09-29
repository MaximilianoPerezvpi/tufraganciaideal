import type { Producto } from "@/data/productos";
import { resenas, type Resena } from "@/data/resenas";

/** Reseñas de un perfume, las más nuevas primero. */
export function resenasDe(slug: string): Resena[] {
  return resenas
    .filter((r) => r.slug === slug)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/**
 * Promedio real a partir de `resenas.ts`. Sin reseñas devuelve null: no se
 * muestran estrellas antes de tener opiniones de verdad.
 */
export function calificacionDe(
  producto: Producto,
): { estrellas: number; resenas: number } | null {
  const lista = resenasDe(producto.slug);
  if (lista.length === 0) return null;
  const suma = lista.reduce((total, r) => total + r.estrellas, 0);
  return {
    estrellas: Math.round((suma / lista.length) * 10) / 10,
    resenas: lista.length,
  };
}

/** Las más recientes de toda la tienda, para el home. */
export function resenasRecientes(cantidad: number): Resena[] {
  return [...resenas]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, cantidad);
}

/** "2026-10-01" → "octubre de 2026", sin depender de la zona horaria. */
export function fechaResena(fecha: string): string {
  const [anio, mes] = fecha.split("-").map(Number);
  const nombre = new Date(Date.UTC(anio, mes - 1, 15)).toLocaleDateString(
    "es-UY",
    { month: "long", timeZone: "UTC" },
  );
  return `${nombre} de ${anio}`;
}
