import type { Concentracion, FamiliaOlfativa, Producto } from "@/data/productos";

/** Texto legible para la barra de longevidad (1 a 5). */
export function textoLongevidad(valor: number): string {
  const textos: Record<number, string> = {
    1: "2-3 h",
    2: "4-6 h",
    3: "6-8 h",
    4: "8-10 h",
    5: "10+ h",
  };
  return textos[valor] ?? "";
}

/** Texto legible para la barra de proyección (1 a 5). */
export function textoProyeccion(valor: number): string {
  const textos: Record<number, string> = {
    1: "Íntima",
    2: "Moderada",
    3: "Buena estela",
    4: "Alta estela",
    5: "Muy alta",
  };
  return textos[valor] ?? "";
}

const OCASIONES_POR_CONCENTRACION: Record<Concentracion, string[]> = {
  EDT: ["Uso diario", "Verano"],
  EDP: ["Uso diario", "Citas"],
  Parfum: ["Noche", "Invierno"],
  Elixir: ["Noche", "Citas"],
};

const OCASIONES_POR_FAMILIA: Record<FamiliaOlfativa, string[]> = {
  "Gourmand / Dulce": ["Citas"],
  "Amaderado / Especiado": ["Oficina", "Invierno"],
  "Cítrico / Fresco": ["Uso diario", "Verano"],
  "Oriental / Oud": ["Noche", "Invierno"],
  "Floral / Frutal": ["Día", "Primavera"],
};

/**
 * Ocasiones recomendadas: no es un dato del catálogo, se calcula al vuelo a
 * partir de concentración + familia olfativa (sin agregar un campo nuevo a
 * `productos.ts` solo para esto).
 */
export function ocasionesDe(producto: Producto): string[] {
  const set = new Set([
    ...OCASIONES_POR_CONCENTRACION[producto.concentracion],
    ...OCASIONES_POR_FAMILIA[producto.familiaOlfativa],
  ]);
  return Array.from(set).slice(0, 4);
}

/** Hash chiquito y estable de un string, para derivar valores "al azar"
 * que no cambian entre reload ni entre servidor y cliente. */
function hashDeSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Prueba social simulada (no hay sistema de reseñas todavía): una
 * calificación entre 4.5 y 5.0 y una cantidad de reseñas entre 12 y 96,
 * derivadas del slug para que cada producto tenga siempre el mismo valor
 * en vez de un número mágico repetido en todo el catálogo.
 */
export function calificacionDe(producto: Producto): {
  estrellas: number;
  resenas: number;
} {
  const h = hashDeSlug(producto.slug);
  const estrellas = Math.round((4.5 + (h % 6) / 10) * 10) / 10; // 4.5–5.0
  const resenas = 12 + (h % 85); // 12–96
  return { estrellas, resenas };
}
