/**
 * CATÁLOGO — Perfumes originales sellados
 *
 * Única fuente de datos del sitio. Para agregar un perfume copiás un objeto
 * y listo: no hay que tocar ningún componente.
 *
 * ⚠️ Este archivo también se usa EN EL SERVIDOR (/api/checkout) para recalcular
 * el precio de cada compra. Nunca se le cree el precio al navegador: lo que
 * está acá es lo que se cobra.
 *
 * 📸 IMÁGENES
 * Guardá cada foto en  /public/productos/<slug>.jpg
 * - Cuadrada, 1000×1000 px, el frasco centrado sobre fondo oscuro o neutro.
 * - Comprimila antes de subirla (squoosh.app, calidad ~75). Apuntá a <150 KB.
 * - El nombre del archivo tiene que coincidir exacto con el campo `slug`.
 *
 * 💵 PRECIOS
 * En pesos uruguayos, IVA incluido. Los de abajo son PLACEHOLDERS: reemplazalos
 * por tu lista real antes de publicar.
 */

/** Concentración del jugo: define duración y proyección. */
export type Concentracion = "EDT" | "EDP" | "Parfum" | "Elixir";

export type Categoria = "arabes" | "disenador" | "nicho";

/** Pirámide olfativa. Dos o tres notas por nivel alcanzan y sobran. */
export type Notas = {
  salida: string[];
  corazon: string[];
  fondo: string[];
};

export type Producto = {
  /** Identificador único. Es también el nombre del archivo de la foto. */
  slug: string;
  marca: string;
  nombre: string;
  concentracion: Concentracion;
  /** Contenido del frasco sellado: 50, 100, 200… */
  volumen_ml: number;
  /** Precio final del frasco, en pesos uruguayos. */
  precio_uyu: number;
  notas: Notas;
  /** Ruta pública de la foto. */
  imagen: string;
  /** Unidades reales disponibles. 0 = agotado (no se puede comprar). */
  stock: number;
  categoria: Categoria;
  genero: "masculino" | "femenino" | "unisex";
  /** Una línea honesta sobre cuándo usarlo. Nada de "elegancia atemporal". */
  descripcion: string;
  /** Se muestra primero y con el borde dorado. Máximo 2 o 3. */
  destacado?: boolean;
};

export const categorias: { id: Categoria | "todos"; etiqueta: string }[] = [
  { id: "todos", etiqueta: "Todos" },
  { id: "arabes", etiqueta: "Árabes" },
  { id: "disenador", etiqueta: "Diseñador" },
  { id: "nicho", etiqueta: "Nicho" },
];

export const productos: Producto[] = [
  {
    slug: "lattafa-yara",
    marca: "Lattafa",
    nombre: "Yara",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2490,
    notas: {
      salida: ["Orquídea", "Mandarina"],
      corazon: ["Heliotropo", "Jazmín"],
      fondo: ["Vainilla", "Almizcle", "Sándalo"],
    },
    imagen: "/productos/lattafa-yara.jpg",
    stock: 8,
    categoria: "arabes",
    genero: "femenino",
    descripcion: "Dulce y cremoso, con una estela que no pasa desapercibida.",
    destacado: true,
  },
  {
    slug: "armaf-club-de-nuit-intense-man",
    marca: "Armaf",
    nombre: "Club de Nuit Intense Man",
    concentracion: "EDT",
    volumen_ml: 105,
    precio_uyu: 3290,
    notas: {
      salida: ["Piña", "Limón", "Bergamota"],
      corazon: ["Abedul", "Jazmín", "Rosa"],
      fondo: ["Ámbar gris", "Vainilla", "Almizcle"],
    },
    imagen: "/productos/armaf-club-de-nuit-intense-man.jpg",
    stock: 6,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "El caballo de batalla: rinde de mañana, de noche y en verano.",
    destacado: true,
  },
  {
    slug: "lattafa-fakhar-women",
    marca: "Lattafa",
    nombre: "Fakhar Women",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2390,
    notas: {
      salida: ["Frambuesa", "Bergamota"],
      corazon: ["Rosa", "Jazmín"],
      fondo: ["Pachulí", "Vainilla", "Almizcle"],
    },
    imagen: "/productos/lattafa-fakhar-women.jpg",
    stock: 5,
    categoria: "arabes",
    genero: "femenino",
    descripcion: "Frutal y limpio, ideal para oficina y para todos los días.",
  },
  {
    slug: "lattafa-qaed-al-fursan",
    marca: "Lattafa",
    nombre: "Qaed Al Fursan",
    concentracion: "EDP",
    volumen_ml: 90,
    precio_uyu: 2790,
    notas: {
      salida: ["Manzana", "Canela"],
      corazon: ["Lavanda", "Nuez moscada"],
      fondo: ["Oud", "Pachulí", "Vainilla"],
    },
    imagen: "/productos/lattafa-qaed-al-fursan.jpg",
    stock: 3,
    categoria: "arabes",
    genero: "unisex",
    descripcion: "Especiado y otoñal. Rinde muchísimo con dos toques.",
  },
  {
    slug: "prada-luna-rossa-black",
    marca: "Prada",
    nombre: "Luna Rossa Black",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 9900,
    notas: {
      salida: ["Bergamota", "Ángelica"],
      corazon: ["Lavanda", "Cumarina"],
      fondo: ["Pachulí", "Almizcle", "Ámbar"],
    },
    imagen: "/productos/prada-luna-rossa-black.jpg",
    stock: 2,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Jabonoso y prolijo. El que siempre preguntan qué es.",
    destacado: true,
  },
  {
    slug: "ralph-lauren-polo-blue",
    marca: "Ralph Lauren",
    nombre: "Polo Blue",
    concentracion: "EDT",
    volumen_ml: 125,
    precio_uyu: 6490,
    notas: {
      salida: ["Melón", "Mandarina", "Pepino"],
      corazon: ["Albahaca", "Salvia", "Geranio"],
      fondo: ["Musgo de roble", "Pachulí", "Almizcle"],
    },
    imagen: "/productos/ralph-lauren-polo-blue.jpg",
    stock: 4,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Fresco de verano, seguro para cualquier situación.",
  },
  {
    slug: "xerjoff-naxos",
    marca: "Xerjoff",
    nombre: "Naxos",
    concentracion: "Parfum",
    volumen_ml: 100,
    precio_uyu: 29900,
    notas: {
      salida: ["Bergamota", "Lavanda"],
      corazon: ["Miel", "Canela", "Jazmín"],
      fondo: ["Tabaco", "Haba tonka", "Vainilla"],
    },
    imagen: "/productos/xerjoff-naxos.jpg",
    stock: 1,
    categoria: "nicho",
    genero: "unisex",
    descripcion: "Miel y tabaco. Nicho italiano de los que se reconocen solos.",
  },
  {
    slug: "xerjoff-erba-pura",
    marca: "Xerjoff",
    nombre: "Erba Pura",
    concentracion: "Parfum",
    volumen_ml: 100,
    precio_uyu: 27900,
    notas: {
      salida: ["Naranja", "Limón", "Frutos rojos"],
      corazon: ["Frutas blancas", "Jazmín"],
      fondo: ["Vainilla", "Ámbar blanco", "Almizcle"],
    },
    imagen: "/productos/xerjoff-erba-pura.jpg",
    stock: 0,
    categoria: "nicho",
    genero: "unisex",
    descripcion: "Frutal luminoso, de los que dejan rastro en el ascensor.",
  },
];

/** Busca por slug. Lo usa el checkout para recalcular precios en el servidor. */
export function buscarProducto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

/** true si queda al menos una unidad. */
export function hayStock(p: Producto): boolean {
  return p.stock > 0;
}
