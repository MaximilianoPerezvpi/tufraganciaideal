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
 * - Si todavía no tenés la foto, dejá `imagen` sin definir: la tarjeta y la
 *   página de producto muestran solas un fallback prolijo (ver
 *   `src/components/ImagenProducto.tsx`) en vez de un ícono roto.
 *
 * 💵 PRECIOS
 * En pesos uruguayos, IVA incluido. Los de abajo son PLACEHOLDERS: reemplazalos
 * por tu lista real antes de publicar.
 *
 * 📦 STOCK
 * Los números de `stock` de la carga masiva de línea nueva TAMBIÉN son
 * placeholders (no vinieron unidades reales en la lista): ajustalos a lo que
 * tengas de verdad antes de vender.
 *
 * 🧭 GÉNERO / NOTAS
 * Para los perfumes cargados en la ampliación masiva, `genero` y `notas` son
 * de mejor esfuerzo (composición típica publicada por el mercado, no ficha
 * oficial de la marca): hoy `genero` no se usa en ningún filtro ni se
 * muestra en pantalla, así que no hay riesgo de mostrar un dato incorrecto
 * al comprador — pero convendría revisarlos igual.
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
  /** Ruta pública de la foto. Sin definir = fallback visual (ver ImagenProducto). */
  imagen?: string;
  /** Unidades reales disponibles. 0 = agotado (no se puede comprar). */
  stock: number;
  categoria: Categoria;
  genero: "masculino" | "femenino" | "unisex";
  /** Una línea honesta sobre cuándo usarlo. Nada de "elegancia atemporal". */
  descripcion: string;
  /** Se muestra primero y con el borde dorado. Máximo 2 o 3. */
  destacado?: boolean;
  /** Stock físico ya en el local: se puede entregar en el momento. */
  entregaInmediata?: boolean;
  /** Precio al por mayor. Dato interno de referencia: nunca se muestra en la web. */
  precioMayor?: number;
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
    // Precio y volumen actualizados a la lista mayorista 2026-09; conserva
    // slug y foto para no romper el link de producto ya publicado.
    slug: "armaf-club-de-nuit-intense-man",
    marca: "Armaf",
    nombre: "Club de Nuit Intense Man",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 2830,
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

  // ────────────────────────────────────────────────────────────────────
  // CARGA MASIVA 2026-09 — sin foto propia todavía: usan el fallback visual.
  // ────────────────────────────────────────────────────────────────────

  // ── Entrega inmediata (stock físico en el local) ──────────────────────
  {
    slug: "versace-eau-fraiche-edt",
    marca: "Versace",
    nombre: "Eau Fraiche",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 4890,
    notas: {
      salida: ["Bergamota", "Limón", "Romero"],
      corazon: ["Salvia", "Geranio"],
      fondo: ["Almizcle", "Cedro", "Ámbar"],
    },
    stock: 8,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Acuático y directo. El clásico de verano que nunca falla.",
    entregaInmediata: true,
  },
  {
    slug: "lattafa-asad-bourbon",
    marca: "Lattafa",
    nombre: "Asad Bourbon",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2590,
    notas: {
      salida: ["Bourbon", "Canela"],
      corazon: ["Tabaco", "Cuero"],
      fondo: ["Vainilla", "Ámbar", "Almizcle"],
    },
    stock: 8,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Tabaco y bourbon, denso desde el primer toque.",
    entregaInmediata: true,
  },
  {
    slug: "lattafa-khamrah",
    marca: "Lattafa",
    nombre: "Khamrah",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2390,
    notas: {
      salida: ["Canela", "Nuez moscada", "Frutas"],
      corazon: ["Dátil", "Especias"],
      fondo: ["Vainilla", "Ámbar", "Benjuí"],
    },
    stock: 8,
    categoria: "arabes",
    genero: "unisex",
    descripcion: "Gourmand especiado, el que más se pide en el local.",
    entregaInmediata: true,
  },
  {
    slug: "armani-stronger-with-you-amber",
    marca: "Giorgio Armani",
    nombre: "Stronger With You Amber",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 4990,
    notas: {
      salida: ["Cardamomo", "Pimienta rosa"],
      corazon: ["Ámbar", "Salvia"],
      fondo: ["Vainilla", "Cachemira", "Haba tonka"],
    },
    stock: 8,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "La versión más densa y dulce del Stronger With You.",
    entregaInmediata: true,
  },
  {
    slug: "armani-stronger-with-you-edt",
    marca: "Giorgio Armani",
    nombre: "Stronger With You",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 4190,
    notas: {
      salida: ["Pomelo", "Cardamomo"],
      corazon: ["Salvia", "Pimienta rosa"],
      fondo: ["Vainilla", "Cuero", "Avellana"],
    },
    stock: 8,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Especiado y cálido, para entretiempo y noche.",
    entregaInmediata: true,
  },
  {
    slug: "ralph-lauren-polo-67-edp",
    marca: "Ralph Lauren",
    nombre: "Polo 67",
    concentracion: "EDP",
    volumen_ml: 125,
    precio_uyu: 5190,
    notas: {
      salida: ["Bergamota", "Nuez moscada"],
      corazon: ["Salvia", "Lavanda"],
      fondo: ["Cuero", "Vetiver", "Ámbar"],
    },
    stock: 8,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El Polo de siempre, con más cuerpo y más fondo.",
    entregaInmediata: true,
  },
  {
    slug: "ysl-myslf-labsolu",
    marca: "Yves Saint Laurent",
    nombre: "MYSLF L'Absolu",
    concentracion: "Parfum",
    volumen_ml: 60,
    precio_uyu: 5790,
    notas: {
      salida: ["Pera", "Especias"],
      corazon: ["Haba tonka", "Jazmín"],
      fondo: ["Cedro", "Ámbar"],
    },
    stock: 8,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "La versión más concentrada del MYSLF: dura todo el día.",
    entregaInmediata: true,
  },
  {
    slug: "paco-rabanne-black-xs",
    marca: "Paco Rabanne",
    nombre: "Black XS",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 3490,
    notas: {
      salida: ["Canela", "Menta"],
      corazon: ["Café", "Cuero"],
      fondo: ["Ámbar", "Haba tonka", "Pachulí"],
    },
    stock: 8,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Café y cuero, directo y sin vueltas.",
    entregaInmediata: true,
  },

  // ── Catálogo general: árabes ────────────────────────────────────────
  {
    slug: "lattafa-yara-tous",
    marca: "Lattafa",
    nombre: "Yara Tous",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2490,
    notas: {
      salida: ["Piña", "Pera"],
      corazon: ["Orquídea", "Jazmín"],
      fondo: ["Vainilla", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "femenino",
    descripcion: "Frutal y dulce, hermana de la Yara original.",
  },
  {
    slug: "lattafa-yara-rosa",
    marca: "Lattafa",
    nombre: "Yara Rosa",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2490,
    notas: {
      salida: ["Frambuesa", "Mandarina"],
      corazon: ["Rosa", "Peonía"],
      fondo: ["Vainilla", "Almizcle", "Sándalo"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "femenino",
    descripcion: "Floral rosado, más suave que la Yara clásica.",
  },
  {
    slug: "lattafa-khamrah-qahwa",
    marca: "Lattafa",
    nombre: "Khamrah Qahwa",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2720,
    notas: {
      salida: ["Café", "Canela"],
      corazon: ["Dátil", "Especias"],
      fondo: ["Vainilla", "Ámbar", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "unisex",
    descripcion: "La Khamrah con café: aún más gourmand.",
  },
  {
    slug: "lattafa-asad-negro",
    marca: "Lattafa",
    nombre: "Asad Negro",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2560,
    notas: {
      salida: ["Bergamota", "Pimienta negra"],
      corazon: ["Cuero", "Especias"],
      fondo: ["Oud", "Ámbar", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Cuero y oud, para quien ya se cansó del Asad Bourbon.",
  },
  {
    slug: "lattafa-fakhar-black",
    marca: "Lattafa",
    nombre: "Fakhar Black",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2690,
    notas: {
      salida: ["Frutos rojos", "Bergamota"],
      corazon: ["Rosa", "Azafrán"],
      fondo: ["Oud", "Pachulí", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "unisex",
    descripcion: "La versión oud de Fakhar: más oscura y especiada.",
  },
  {
    slug: "lattafa-maahir-legacy",
    marca: "Lattafa",
    nombre: "Maahir Legacy",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2700,
    notas: {
      salida: ["Bergamota", "Manzana"],
      corazon: ["Especias", "Lavanda"],
      fondo: ["Ámbar", "Cuero", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Especiado clásico, buena opción de entrada al nicho árabe.",
  },
  {
    slug: "lattafa-nebras",
    marca: "Lattafa",
    nombre: "Nebras",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2990,
    notas: {
      salida: ["Frutos rojos", "Mandarina"],
      corazon: ["Flor de azahar", "Jazmín"],
      fondo: ["Vainilla", "Caramelo", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "femenino",
    descripcion: "Floral y dulce, de proyección alta y buena duración.",
  },
  {
    slug: "lattafa-eclaire",
    marca: "Lattafa",
    nombre: "Eclaire",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2690,
    notas: {
      salida: ["Pera", "Bergamota"],
      corazon: ["Praliné", "Flor de naranjo"],
      fondo: ["Vainilla", "Caramelo", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "femenino",
    descripcion: "Gourmand de pastelería, dulce sin empalagar.",
  },
  {
    slug: "armaf-club-de-nuit-iconic",
    marca: "Armaf",
    nombre: "Club de Nuit Iconic",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 3290,
    notas: {
      salida: ["Piña", "Manzana"],
      corazon: ["Jazmín", "Rosa"],
      fondo: ["Ámbar gris", "Almizcle", "Pachulí"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "La versión EDP del Club de Nuit: más dulce y más fondo.",
  },
  {
    slug: "armaf-odyssey-homme",
    marca: "Armaf",
    nombre: "Odyssey Homme",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 2890,
    notas: {
      salida: ["Bergamota", "Manzana"],
      corazon: ["Lavanda", "Geranio"],
      fondo: ["Ámbar", "Almizcle", "Cedro"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Fresco y amaderado, buena opción para uso diario.",
  },
  {
    slug: "afnan-9pm",
    marca: "Afnan",
    nombre: "9PM",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2890,
    notas: {
      salida: ["Manzana", "Canela"],
      corazon: ["Especias"],
      fondo: ["Vainilla", "Ámbar", "Almizcle"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Dulce y nocturno, de los que más se preguntan qué es.",
  },
  {
    slug: "hawas-for-him",
    marca: "Rasasi",
    nombre: "Hawas for Him",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2890,
    notas: {
      salida: ["Pomelo", "Menta"],
      corazon: ["Salvia", "Jengibre"],
      fondo: ["Ámbar", "Almizcle", "Pachulí"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Fresco especiado, con buena proyección para el día.",
  },
  {
    slug: "alhambra-salvo-elixir",
    marca: "Maison Alhambra",
    nombre: "Salvo Elixir",
    concentracion: "Elixir",
    volumen_ml: 60,
    precio_uyu: 2200,
    notas: {
      salida: ["Pera", "Bergamota"],
      corazon: ["Salvia de ámbar"],
      fondo: ["Vainilla", "Almizcle", "Sándalo"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "masculino",
    descripcion: "Ambarado y envolvente, formato chico de gran rendimiento.",
  },
  {
    slug: "alhambra-jean-lowe-immortel",
    marca: "Maison Alhambra",
    nombre: "Jean Lowe Immortel",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 2790,
    notas: {
      salida: ["Piña", "Bergamota", "Grosella negra"],
      corazon: ["Abedul", "Jazmín", "Rosa"],
      fondo: ["Almizcle", "Roble", "Ámbar"],
    },
    stock: 3,
    categoria: "arabes",
    genero: "unisex",
    descripcion: "Afrutado y amaderado, con muchísima proyección.",
  },

  // ── Catálogo general: diseñador ─────────────────────────────────────
  {
    slug: "jpg-le-male-le-parfum",
    marca: "Jean Paul Gaultier",
    nombre: "Le Male Le Parfum",
    concentracion: "Parfum",
    volumen_ml: 100,
    precio_uyu: 5750,
    notas: {
      salida: ["Lavanda", "Cardamomo"],
      corazon: ["Vainilla", "Café"],
      fondo: ["Haba tonka", "Cuero", "Maderas"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El Le Male de siempre, pero más dulce y más denso.",
  },
  {
    slug: "jpg-le-male-elixir",
    marca: "Jean Paul Gaultier",
    nombre: "Le Male Elixir",
    concentracion: "Elixir",
    volumen_ml: 100,
    precio_uyu: 6175,
    notas: {
      salida: ["Lavanda", "Menta"],
      corazon: ["Vainilla", "Café"],
      fondo: ["Cacao", "Cuero", "Maderas"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "La versión más oscura del Le Male: cacao y cuero.",
  },
  {
    slug: "jpg-scandal-le-parfum",
    marca: "Jean Paul Gaultier",
    nombre: "Scandal Le Parfum",
    concentracion: "Parfum",
    volumen_ml: 100,
    precio_uyu: 5860,
    notas: {
      salida: ["Mandarina sanguina", "Gardenia"],
      corazon: ["Miel", "Flor de naranjo"],
      fondo: ["Pachulí", "Caramelo"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "femenino",
    descripcion: "Miel y pachulí, más intenso que el Scandal original.",
  },
  {
    slug: "valentino-born-in-roma-uomo",
    marca: "Valentino",
    nombre: "Born in Roma Uomo",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 6090,
    notas: {
      salida: ["Bergamota", "Pimienta rosa"],
      corazon: ["Salvia", "Guayaco"],
      fondo: ["Cuero", "Ámbar", "Almizcle"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Urbano y amaderado, con un fondo de cuero marcado.",
  },
  {
    slug: "versace-eros-edt",
    marca: "Versace",
    nombre: "Eros",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 4985,
    notas: {
      salida: ["Menta", "Manzana verde", "Limón"],
      corazon: ["Salvia", "Geranio", "Canela"],
      fondo: ["Vainilla", "Haba tonka", "Ámbar", "Cedro"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Fresco y dulce a la vez. Uno de los más pedidos de Versace.",
  },
  {
    slug: "versace-eros-flame",
    marca: "Versace",
    nombre: "Eros Flame",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 5575,
    notas: {
      salida: ["Pimienta negra", "Mandarina", "Limón"],
      corazon: ["Salvia especiada", "Canela"],
      fondo: ["Vainilla", "Ámbar", "Cedro", "Musgo de roble"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El Eros más intenso: especiado y con más fondo.",
  },
  {
    slug: "acqua-di-gio-profondo-edp",
    marca: "Giorgio Armani",
    nombre: "Acqua Di Giò Profondo",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 6290,
    notas: {
      salida: ["Bergamota", "Toque marino"],
      corazon: ["Geranio", "Salvia"],
      fondo: ["Pachulí", "Musgo de roble", "Cedro"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Marino y amaderado, más serio que el Acqua Di Giò clásico.",
  },
  {
    slug: "dior-sauvage-edt",
    marca: "Dior",
    nombre: "Sauvage",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 5650,
    notas: {
      salida: ["Bergamota de Calabria", "Pimienta"],
      corazon: ["Lavanda", "Geranio"],
      fondo: ["Ambroxan", "Cedro", "Pachulí"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El más vendido del mundo. No hace falta presentarlo.",
  },
  {
    slug: "dior-sauvage-edp",
    marca: "Dior",
    nombre: "Sauvage",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 6380,
    notas: {
      salida: ["Bergamota", "Manzana"],
      corazon: ["Geranio", "Lavanda"],
      fondo: ["Ambroxan", "Vainilla", "Haba tonka"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "La versión EDP del Sauvage: más dulce, más cuerpo.",
  },
  {
    slug: "ch-good-girl",
    marca: "Carolina Herrera",
    nombre: "Good Girl",
    concentracion: "EDP",
    volumen_ml: 80,
    precio_uyu: 6190,
    notas: {
      salida: ["Almendra", "Café"],
      corazon: ["Jazmín", "Tuberosa"],
      fondo: ["Cacao", "Haba tonka", "Vainilla"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "femenino",
    descripcion: "Almendrado y elegante, del frasco de taco que se reconoce solo.",
  },
  {
    slug: "ch-bad-boy-elixir",
    marca: "Carolina Herrera",
    nombre: "Bad Boy Elixir",
    concentracion: "Elixir",
    volumen_ml: 100,
    precio_uyu: 5930,
    notas: {
      salida: ["Ron", "Nuez moscada"],
      corazon: ["Salvia", "Lavanda"],
      fondo: ["Cacao", "Haba tonka", "Vainilla"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Ron y cacao, la versión más golosa del Bad Boy.",
  },
  {
    slug: "paco-rabanne-1-million-edt",
    marca: "Paco Rabanne",
    nombre: "1 Million",
    concentracion: "EDT",
    volumen_ml: 100,
    precio_uyu: 5250,
    notas: {
      salida: ["Pomelo", "Menta", "Sangre de mandarina"],
      corazon: ["Canela", "Especias", "Rosa"],
      fondo: ["Cuero", "Ámbar", "Madera blanca"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El lingote de oro. Especiado, dulce y con mucha estela.",
  },
  {
    slug: "paco-rabanne-1-million-elixir",
    marca: "Paco Rabanne",
    nombre: "1 Million Elixir",
    concentracion: "Elixir",
    volumen_ml: 100,
    precio_uyu: 5390,
    notas: {
      salida: ["Sangre de mandarina", "Canela"],
      corazon: ["Especias", "Miel"],
      fondo: ["Cuero", "Ámbar", "Haba tonka"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El 1 Million llevado al máximo: más miel, más cuero.",
  },
  {
    slug: "ysl-libre-edp",
    marca: "Yves Saint Laurent",
    nombre: "Libre",
    concentracion: "EDP",
    volumen_ml: 90,
    precio_uyu: 6780,
    notas: {
      salida: ["Lavanda", "Mandarina"],
      corazon: ["Flor de azahar", "Jazmín"],
      fondo: ["Almizcle", "Cedro", "Vainilla"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "femenino",
    descripcion: "Lavanda y azahar, floral con carácter.",
  },
  {
    slug: "ysl-myslf-edp",
    marca: "Yves Saint Laurent",
    nombre: "MYSLF",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 6320,
    notas: {
      salida: ["Pera", "Bergamota"],
      corazon: ["Haba tonka", "Jazmín", "Geranio"],
      fondo: ["Cedro", "Ámbar"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "Fresco y floral, un masculino distinto a lo de siempre.",
  },
  {
    slug: "chanel-bleu-de-chanel",
    marca: "Chanel",
    nombre: "Bleu de Chanel",
    concentracion: "EDP",
    volumen_ml: 100,
    precio_uyu: 8320,
    notas: {
      salida: ["Pomelo", "Limón", "Menta"],
      corazon: ["Jengibre", "Nuez moscada", "Jazmín"],
      fondo: ["Incienso", "Vetiver", "Cedro", "Sándalo"],
    },
    stock: 3,
    categoria: "disenador",
    genero: "masculino",
    descripcion: "El favorito de oficina. Cítrico, amaderado, sin estridencias.",
  },
];

/** Busca por slug. Lo usa el checkout para recalcular precios en el servidor. */
export function buscarProducto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

/**
 * URL de la foto para lugares que necesitan un string plano (metadata,
 * JSON-LD, `picture_url` de Mercado Pago): si el producto todavía no tiene
 * foto propia, cae al OG del sitio en vez de mandar una ruta rota.
 *
 * Para renderizar en pantalla usá `<ImagenProducto>` en vez de esto: ahí sí
 * se ve el fallback de frasco, que queda mejor que el banner del sitio
 * estirado en un cuadrado.
 */
export function imagenUrl(p: Producto): string {
  return p.imagen ?? "/og.jpg";
}

/** true si queda al menos una unidad. */
export function hayStock(p: Producto): boolean {
  return p.stock > 0;
}
