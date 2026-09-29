import type { Categoria, FamiliaOlfativa, Genero } from "@/data/productos";

/**
 * Deep-link desde afuera (home, quiz): /catalogo?categoria=arabes&genero=...
 * &familia=... En URL evitamos tildes/espacios/barras, por eso son slugs
 * propios en vez de los valores exactos del tipo.
 *
 * Vive en un archivo SIN "use client" a propósito: si estuviera en
 * Catalogo.tsx (que sí lo es), un server component que lo importe recibe
 * el objeto vacío — los exports de datos de un módulo "use client" no
 * cruzan el límite server/cliente, solo el componente en sí. Lo usan
 * `src/app/catalogo/page.tsx` (server) y `Catalogo.tsx` (cliente) por
 * igual desde acá.
 */
export const CATEGORIA_DESDE_PARAM: Record<string, Categoria> = {
  arabes: "árabes",
  "árabes": "árabes",
  disenador: "diseñador",
  "diseñador": "diseñador",
};

export const GENERO_DESDE_PARAM: Record<string, Genero> = {
  masculino: "masculino",
  femenino: "femenino",
  unisex: "unisex",
};

export const FAMILIA_DESDE_PARAM: Record<string, FamiliaOlfativa> = {
  gourmand: "Gourmand / Dulce",
  amaderado: "Amaderado / Especiado",
  citrico: "Cítrico / Fresco",
  oriental: "Oriental / Oud",
  floral: "Floral / Frutal",
};
