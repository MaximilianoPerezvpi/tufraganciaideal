import { writeFileSync } from "node:fs";
import { rows } from "./gen-rows.mjs";

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Fotos reales que ya existen en /public/productos y coinciden con un
// producto de esta carga (mismo perfume, precio actualizado a la lista).
const FOTOS = {
  "lattafa|fakhar women": "/productos/lattafa-fakhar-women.jpg",
  "lattafa|qaed al fursan": "/productos/lattafa-qaed-al-fursan.jpg",
  "armaf|club de nuit intense men": "/productos/armaf-club-de-nuit-intense-man.jpg",
};

// Composiciones reales para los perfumes de diseñador ampliamente
// documentados. El resto usa plantillas genéricas (ver TEMPLATES abajo).
const BESPOKE = {
  "dior|sauvage|EDT": {
    notas: { salida: ["Bergamota de Calabria", "Pimienta"], corazon: ["Lavanda", "Geranio"], fondo: ["Ambroxan", "Cedro", "Pachulí"] },
    descripcion: "El más vendido del mundo. No hace falta presentarlo.",
  },
  "dior|sauvage|EDP": {
    notas: { salida: ["Bergamota", "Manzana"], corazon: ["Geranio", "Lavanda"], fondo: ["Ambroxan", "Vainilla", "Haba tonka"] },
    descripcion: "La versión EDP del Sauvage: más dulce, más cuerpo.",
  },
  "dior|sauvage|Parfum": {
    notas: { salida: ["Mandarina", "Bergamota"], corazon: ["Ambroxan", "Sándalo"], fondo: ["Vainilla", "Haba tonka", "Pachulí"] },
    descripcion: "El Sauvage más denso y cálido, para las noches de frío.",
  },
  "chanel|bleu de chanel|EDP": {
    notas: { salida: ["Pomelo", "Limón", "Menta"], corazon: ["Jengibre", "Nuez moscada", "Jazmín"], fondo: ["Incienso", "Vetiver", "Cedro", "Sándalo"] },
    descripcion: "El favorito de oficina. Cítrico, amaderado, sin estridencias.",
  },
  "jean paul gaultier|le male le parfum|Parfum": {
    notas: { salida: ["Lavanda", "Cardamomo"], corazon: ["Vainilla", "Café"], fondo: ["Haba tonka", "Cuero", "Maderas"] },
    descripcion: "El Le Male de siempre, pero más dulce y más denso.",
  },
  "jean paul gaultier|le male elixir|Elixir": {
    notas: { salida: ["Lavanda", "Menta"], corazon: ["Vainilla", "Café"], fondo: ["Cacao", "Cuero", "Maderas"] },
    descripcion: "La versión más oscura del Le Male: cacao y cuero.",
  },
  "jean paul gaultier|scandal le parfum|Parfum|100": {
    notas: { salida: ["Mandarina sanguina", "Gardenia"], corazon: ["Miel", "Flor de naranjo"], fondo: ["Pachulí", "Caramelo"] },
    descripcion: "Miel y pachulí, más intenso que el Scandal original.",
  },
  "versace|eros|EDT": {
    notas: { salida: ["Menta", "Manzana verde", "Limón"], corazon: ["Salvia", "Geranio", "Canela"], fondo: ["Vainilla", "Haba tonka", "Ámbar", "Cedro"] },
    descripcion: "Fresco y dulce a la vez. Uno de los más pedidos de Versace.",
  },
  "versace|eros flame|EDP": {
    notas: { salida: ["Pimienta negra", "Mandarina", "Limón"], corazon: ["Salvia especiada", "Canela"], fondo: ["Vainilla", "Ámbar", "Cedro", "Musgo de roble"] },
    descripcion: "El Eros más intenso: especiado y con más fondo.",
  },
  "giorgio armani|acqua di giò profondo|EDP": {
    notas: { salida: ["Bergamota", "Toque marino"], corazon: ["Geranio", "Salvia"], fondo: ["Pachulí", "Musgo de roble", "Cedro"] },
    descripcion: "Marino y amaderado, más serio que el Acqua Di Giò clásico.",
  },
  "yves saint laurent|libre|EDP": {
    notas: { salida: ["Lavanda", "Mandarina"], corazon: ["Flor de azahar", "Jazmín"], fondo: ["Almizcle", "Cedro", "Vainilla"] },
    descripcion: "Lavanda y azahar, floral con carácter.",
  },
  "yves saint laurent|myslf|EDP": {
    notas: { salida: ["Pera", "Bergamota"], corazon: ["Haba tonka", "Jazmín", "Geranio"], fondo: ["Cedro", "Ámbar"] },
    descripcion: "Fresco y floral, un masculino distinto a lo de siempre.",
  },
  "yves saint laurent|myslf l'absolu|Parfum": {
    notas: { salida: ["Pera", "Especias"], corazon: ["Haba tonka", "Jazmín"], fondo: ["Cedro", "Ámbar"] },
    descripcion: "La versión más concentrada del MYSLF: dura todo el día.",
  },
  "ralph lauren|polo 67|EDP": {
    notas: { salida: ["Bergamota", "Nuez moscada"], corazon: ["Salvia", "Lavanda"], fondo: ["Cuero", "Vetiver", "Ámbar"] },
    descripcion: "El Polo de siempre, con más cuerpo y más fondo.",
  },
  "paco rabanne|black xs|EDT": {
    notas: { salida: ["Canela", "Menta"], corazon: ["Café", "Cuero"], fondo: ["Ámbar", "Haba tonka", "Pachulí"] },
    descripcion: "Café y cuero, directo y sin vueltas.",
  },
  "paco rabanne|1 million|EDT": {
    notas: { salida: ["Pomelo", "Menta", "Sangre de mandarina"], corazon: ["Canela", "Especias", "Rosa"], fondo: ["Cuero", "Ámbar", "Madera blanca"] },
    descripcion: "El lingote de oro. Especiado, dulce y con mucha estela.",
  },
  "paco rabanne|1 million elixir|Elixir": {
    notas: { salida: ["Sangre de mandarina", "Canela"], corazon: ["Especias", "Miel"], fondo: ["Cuero", "Ámbar", "Haba tonka"] },
    descripcion: "El 1 Million llevado al máximo: más miel, más cuero.",
  },
  "paco rabanne|invictus|EDT": {
    notas: { salida: ["Pomelo", "Toque marino"], corazon: ["Laurel", "Jazmín"], fondo: ["Ámbar gris", "Pachulí"] },
    descripcion: "Marino y deportivo, el que se usa todos los días.",
  },
  "carolina herrera|good girl|EDP": {
    notas: { salida: ["Almendra", "Café"], corazon: ["Jazmín", "Tuberosa"], fondo: ["Cacao", "Haba tonka", "Vainilla"] },
    descripcion: "Almendrado y elegante, el del frasco de taco que se reconoce solo.",
  },
  "carolina herrera|bad boy elixir|Elixir": {
    notas: { salida: ["Ron", "Nuez moscada"], corazon: ["Salvia", "Lavanda"], fondo: ["Cacao", "Haba tonka", "Vainilla"] },
    descripcion: "Ron y cacao, la versión más golosa del Bad Boy.",
  },
  "valentino|born in roma uomo|EDT": {
    notas: { salida: ["Bergamota", "Pimienta rosa"], corazon: ["Salvia", "Guayaco"], fondo: ["Cuero", "Ámbar", "Almizcle"] },
    descripcion: "Urbano y amaderado, con un fondo de cuero marcado.",
  },
  "lattafa|asad bourbon|EDP": {
    notas: { salida: ["Bourbon", "Canela"], corazon: ["Tabaco", "Cuero"], fondo: ["Vainilla", "Ámbar", "Almizcle"] },
    descripcion: "Tabaco y bourbon, denso desde el primer toque.",
  },
  "lattafa|khamrah|EDP": {
    notas: { salida: ["Canela", "Nuez moscada", "Frutas"], corazon: ["Dátil", "Especias"], fondo: ["Vainilla", "Ámbar", "Benjuí"] },
    descripcion: "Gourmand especiado, el que más se pide en el local.",
  },
  "lattafa|fakhar women|EDP": {
    notas: { salida: ["Frambuesa", "Bergamota"], corazon: ["Rosa", "Jazmín"], fondo: ["Pachulí", "Vainilla", "Almizcle"] },
    descripcion: "Frutal y limpio, ideal para oficina y para todos los días.",
  },
  "lattafa|maahir legacy|EDP": {
    notas: { salida: ["Bergamota", "Manzana"], corazon: ["Especias", "Lavanda"], fondo: ["Ámbar", "Cuero", "Almizcle"] },
    descripcion: "Especiado clásico, buena opción de entrada al nicho árabe.",
  },
  "lattafa|nebras|EDP": {
    notas: { salida: ["Frutos rojos", "Mandarina"], corazon: ["Flor de azahar", "Jazmín"], fondo: ["Vainilla", "Caramelo", "Almizcle"] },
    descripcion: "Floral y dulce, de proyección alta y buena duración.",
  },
  "lattafa|qaed al fursan|EDP": {
    notas: { salida: ["Manzana", "Canela"], corazon: ["Lavanda", "Nuez moscada"], fondo: ["Oud", "Pachulí", "Vainilla"] },
    descripcion: "Especiado y otoñal. Rinde muchísimo con dos toques.",
  },
  "lattafa|eclaire|EDP": {
    notas: { salida: ["Pera", "Bergamota"], corazon: ["Praliné", "Flor de naranjo"], fondo: ["Vainilla", "Caramelo", "Almizcle"] },
    descripcion: "Gourmand de pastelería, dulce sin empalagar.",
  },
  "armaf|club de nuit iconic|EDP": {
    notas: { salida: ["Piña", "Manzana"], corazon: ["Jazmín", "Rosa"], fondo: ["Ámbar gris", "Almizcle", "Pachulí"] },
    descripcion: "La versión EDP del Club de Nuit: más dulce y más fondo.",
  },
  "armaf|club de nuit intense men|EDT": {
    notas: { salida: ["Piña", "Limón", "Bergamota"], corazon: ["Abedul", "Jazmín", "Rosa"], fondo: ["Ámbar gris", "Vainilla", "Almizcle"] },
    descripcion: "El caballo de batalla: rinde de mañana, de noche y en verano.",
  },
  "armaf|odyssey homme|EDT": {
    notas: { salida: ["Bergamota", "Manzana"], corazon: ["Lavanda", "Geranio"], fondo: ["Ámbar", "Almizcle", "Cedro"] },
    descripcion: "Fresco y amaderado, buena opción para uso diario.",
  },
  "afnan|9pm|EDP": {
    notas: { salida: ["Manzana", "Canela"], corazon: ["Especias"], fondo: ["Vainilla", "Ámbar", "Almizcle"] },
    descripcion: "Dulce y nocturno, de los que más se preguntan qué es.",
  },
  "rasasi|hawas for him|EDP": {
    notas: { salida: ["Pomelo", "Menta"], corazon: ["Salvia", "Jengibre"], fondo: ["Ámbar", "Almizcle", "Pachulí"] },
    descripcion: "Fresco especiado, con buena proyección para el día.",
  },
  "maison alhambra|salvo elixir|Elixir": {
    notas: { salida: ["Pera", "Bergamota"], corazon: ["Salvia de ámbar"], fondo: ["Vainilla", "Almizcle", "Sándalo"] },
    descripcion: "Ambarado y envolvente, formato chico de gran rendimiento.",
  },
  "maison alhambra|jean lowe immortel|EDP": {
    notas: { salida: ["Piña", "Bergamota", "Grosella negra"], corazon: ["Abedul", "Jazmín", "Rosa"], fondo: ["Almizcle", "Roble", "Ámbar"] },
    descripcion: "Afrutado y amaderado, con muchísima proyección.",
  },
  "giorgio armani|stronger with you amber|EDP": {
    notas: { salida: ["Cardamomo", "Pimienta rosa"], corazon: ["Ámbar", "Salvia"], fondo: ["Vainilla", "Cachemira", "Haba tonka"] },
    descripcion: "La versión más densa y dulce del Stronger With You.",
  },
  "giorgio armani|stronger with you|EDT": {
    notas: { salida: ["Pomelo", "Cardamomo"], corazon: ["Salvia", "Pimienta rosa"], fondo: ["Vainilla", "Cuero", "Avellana"] },
    descripcion: "Especiado y cálido, para entretiempo y noche.",
  },
  "versace|eau fraiche|EDT": {
    notas: { salida: ["Bergamota", "Limón", "Romero"], corazon: ["Salvia", "Geranio"], fondo: ["Almizcle", "Cedro", "Ámbar"] },
    descripcion: "Acuático y directo. El clásico de verano que nunca falla.",
  },
};

// Plantillas genéricas por familia olfativa, para el resto del catálogo
// (perfumes sin ficha propia documentada). Ciclan por índice: "placeholders
// elegantes" tal como pidió el cliente, no ficha oficial de la marca.
const T_ARABES = [
  { notas: { salida: ["Bergamota", "Especias"], corazon: ["Ámbar", "Azafrán"], fondo: ["Oud", "Almizcle", "Sándalo"] }, descripcion: "Oriental especiado, de esos que dejan estela." },
  { notas: { salida: ["Frutos rojos", "Bergamota"], corazon: ["Flor de azahar", "Praliné"], fondo: ["Vainilla", "Caramelo", "Almizcle"] }, descripcion: "Gourmand dulce, fácil de reconocer en la fila del súper." },
  { notas: { salida: ["Piña", "Manzana"], corazon: ["Jazmín", "Rosa"], fondo: ["Ámbar gris", "Pachulí", "Almizcle"] }, descripcion: "Afrutado con fondo amaderado, buen rendimiento por toque." },
  { notas: { salida: ["Pomelo", "Menta"], corazon: ["Salvia", "Jengibre"], fondo: ["Ámbar", "Almizcle", "Cedro"] }, descripcion: "Fresco especiado, cómodo para el uso diario." },
  { notas: { salida: ["Café", "Canela"], corazon: ["Dátil", "Especias"], fondo: ["Vainilla", "Ámbar", "Benjuí"] }, descripcion: "Gourmand cálido, ideal para el frío." },
  { notas: { salida: ["Mandarina", "Cardamomo"], corazon: ["Rosa", "Azafrán"], fondo: ["Oud", "Cuero", "Almizcle"] }, descripcion: "Oud clásico, denso y con mucha proyección." },
];

const T_DISENADOR = [
  { notas: { salida: ["Bergamota", "Pimienta rosa"], corazon: ["Salvia", "Cardamomo"], fondo: ["Cedro", "Ámbar", "Haba tonka"] }, descripcion: "Amaderado especiado, versátil para toda ocasión." },
  { notas: { salida: ["Pomelo", "Limón", "Toque marino"], corazon: ["Geranio", "Lavanda"], fondo: ["Almizcle", "Cedro", "Ámbar"] }, descripcion: "Fresco y limpio, el clásico de uso diario." },
  { notas: { salida: ["Mandarina", "Frutos rojos"], corazon: ["Jazmín", "Rosa"], fondo: ["Vainilla", "Almizcle", "Sándalo"] }, descripcion: "Floral elegante, para el día y para la noche." },
  { notas: { salida: ["Pera", "Especias"], corazon: ["Haba tonka", "Jazmín"], fondo: ["Cedro", "Ámbar", "Vainilla"] }, descripcion: "Cálido y envolvente, con buena duración." },
  { notas: { salida: ["Bergamota", "Ángelica"], corazon: ["Lavanda", "Cumarina"], fondo: ["Pachulí", "Almizcle", "Ámbar"] }, descripcion: "Jabonoso y prolijo, de los que siempre preguntan qué es." },
];

function limpiarNombre(nombre) {
  return nombre.replace(/\s+/g, " ").trim();
}

function buildProducto(row, index, usedSlugs) {
  const [casa, nombreRaw, precio_uyu, volOverride, concentracion, categoria, entregaInmediata, stock] = row;
  const nombre = limpiarNombre(nombreRaw);
  const volumen_ml = volOverride ?? 100;

  let baseSlug = slugify(`${casa} ${nombre} ${volumen_ml}ml ${concentracion}`);
  let slug = slugify(`${casa} ${nombre}`);
  if (usedSlugs.has(slug)) slug = baseSlug;
  let n = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${n}`;
    n++;
  }
  usedSlugs.add(slug);

  const fotoKey = `${casa.toLowerCase()}|${nombre.toLowerCase()}`;
  const imagen = FOTOS[fotoKey];

  const bespokeKeys = [
    `${casa.toLowerCase()}|${nombre.toLowerCase()}|${concentracion}|${volumen_ml}`,
    `${casa.toLowerCase()}|${nombre.toLowerCase()}|${concentracion}`,
    `${casa.toLowerCase()}|${nombre.toLowerCase()}`,
  ];
  let ficha = null;
  for (const k of bespokeKeys) {
    if (BESPOKE[k]) { ficha = BESPOKE[k]; break; }
  }
  if (!ficha) {
    const pool = categoria === "árabes" ? T_ARABES : T_DISENADOR;
    ficha = pool[index % pool.length];
  }

  return {
    slug,
    nombre,
    casa,
    categoria,
    precio_uyu,
    volumen_ml,
    concentracion,
    notas: ficha.notas,
    imagen,
    stock,
    descripcion: ficha.descripcion,
    entregaInmediata: entregaInmediata || undefined,
  };
}

const usedSlugs = new Set();
const productos = rows.map((row, i) => buildProducto(row, i, usedSlugs));

function tsString(s) {
  return JSON.stringify(s);
}

function tsNotas(n) {
  const arr = (a) => `[${a.map(tsString).join(", ")}]`;
  return `{ salida: ${arr(n.salida)}, corazon: ${arr(n.corazon)}, fondo: ${arr(n.fondo)} }`;
}

function tsProducto(p) {
  const lines = [];
  lines.push(`  {`);
  lines.push(`    slug: ${tsString(p.slug)},`);
  lines.push(`    nombre: ${tsString(p.nombre)},`);
  lines.push(`    casa: ${tsString(p.casa)},`);
  lines.push(`    categoria: ${tsString(p.categoria)},`);
  lines.push(`    concentracion: ${tsString(p.concentracion)},`);
  lines.push(`    volumen_ml: ${p.volumen_ml},`);
  lines.push(`    precio_uyu: ${p.precio_uyu},`);
  lines.push(`    notas: ${tsNotas(p.notas)},`);
  if (p.imagen) lines.push(`    imagen: ${tsString(p.imagen)},`);
  lines.push(`    stock: ${p.stock},`);
  lines.push(`    descripcion: ${tsString(p.descripcion)},`);
  if (p.entregaInmediata) lines.push(`    entregaInmediata: true,`);
  lines.push(`  },`);
  return lines.join("\n");
}

const header = `/**
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
 * - El nombre del archivo tiene que coincidir exacto con el campo \`slug\`.
 * - Si todavía no tenés la foto, dejá \`imagen\` sin definir: la tarjeta y la
 *   página de producto muestran solas un fallback prolijo (ver
 *   \`src/components/ImagenProducto.tsx\`) en vez de un ícono roto.
 *
 * 💵 PRECIOS
 * En pesos uruguayos, IVA incluido. Carga oficial 2026-09 (solo precio por
 * menor — el archivo no guarda precio mayorista).
 *
 * 📦 STOCK
 * \`stock\` es binario en esta carga: 1 = disponible, 0 = sin stock. No indica
 * cantidad de unidades.
 *
 * 🧭 NOTAS Y DESCRIPCIÓN
 * Para los ítems sin ficha propia documentada, \`notas\` y \`descripcion\` son
 * placeholders elegantes por familia olfativa (no ficha oficial de la
 * marca) — el cliente autorizó explícitamente este criterio para la carga
 * masiva. Los perfumes de diseñador ampliamente conocidos (Sauvage, Bleu de
 * Chanel, Le Male, Eros, etc.) sí tienen su composición real.
 */

/** Concentración del jugo: define duración y proyección. */
export type Concentracion = "EDT" | "EDP" | "Parfum" | "Elixir";

export type Categoria = "árabes" | "diseñador";

/** Pirámide olfativa. Dos o tres notas por nivel alcanzan y sobran. */
export type Notas = {
  salida: string[];
  corazon: string[];
  fondo: string[];
};

export type Producto = {
  /** Identificador único. Es también el nombre del archivo de la foto. */
  slug: string;
  nombre: string;
  /** Marca o casa (ej. Lattafa, Armaf, Versace, Dior). */
  casa: string;
  categoria: Categoria;
  /** Precio final del frasco, en pesos uruguayos. */
  precio_uyu: number;
  /** Precio al por mayor. Dato interno de referencia: nunca se muestra en la web. */
  precio_mayor?: number;
  /** Contenido del frasco sellado: 50, 100, 200… */
  volumen_ml: number;
  concentracion: Concentracion;
  notas: Notas;
  /** Ruta pública de la foto. Sin definir = fallback visual (ver ImagenProducto). */
  imagen?: string;
  /** 1 = disponible, 0 = sin stock (no se puede comprar). */
  stock: number;
  /** Una línea honesta sobre cuándo usarlo. Nada de "elegancia atemporal". */
  descripcion: string;
  /** Stock físico ya en el local: se puede entregar en el momento. */
  entregaInmediata?: boolean;
  /** Se muestra primero y con el borde dorado. Máximo 2 o 3. */
  destacado?: boolean;
  genero?: "masculino" | "femenino" | "unisex";
};

export const categorias: { id: Categoria | "todos"; etiqueta: string }[] = [
  { id: "todos", etiqueta: "Todos" },
  { id: "árabes", etiqueta: "Árabes" },
  { id: "diseñador", etiqueta: "Diseñador" },
];

export const productos: Producto[] = [
`;

const footer = `
/** Busca por slug. Lo usa el checkout para recalcular precios en el servidor. */
export function buscarProducto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

/**
 * URL de la foto para lugares que necesitan un string plano (metadata,
 * JSON-LD, \`picture_url\` de Mercado Pago): si el producto todavía no tiene
 * foto propia, cae al OG del sitio en vez de mandar una ruta rota.
 *
 * Para renderizar en pantalla usá \`<ImagenProducto>\` en vez de esto: ahí sí
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
`;

const body = productos.map(tsProducto).join("\n");
const out = header + body + "\n];\n" + footer;

writeFileSync(new URL("../src/data/productos.ts", import.meta.url), out, "utf8");
console.log(`Escritos ${productos.length} productos.`);
console.log(`Con foto real: ${productos.filter((p) => p.imagen).length}`);
console.log(`entregaInmediata: ${productos.filter((p) => p.entregaInmediata).length}`);
console.log(`stock 0: ${productos.filter((p) => p.stock === 0).length}`);
