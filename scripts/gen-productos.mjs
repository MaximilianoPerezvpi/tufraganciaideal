import { writeFileSync, readdirSync } from "node:fs";
import { rows } from "./gen-rows.mjs";

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Fotos ────────────────────────────────────────────────────────────
// La fuente de verdad es la carpeta /public/productos: se escanea acá y se
// matchea contra el slug de cada producto. Nunca se hardcodea la lista de
// archivos: si mañana agregás/sacás una foto, esto se actualiza solo la
// próxima vez que corras este generador.
const DIR_PRODUCTOS = new URL("../public/productos/", import.meta.url);
const EXTENSIONES_FOTO = [".webp", ".jpg", ".jpeg", ".png"];

let ARCHIVOS_FOTO = [];
try {
  ARCHIVOS_FOTO = readdirSync(DIR_PRODUCTOS).filter((f) =>
    EXTENSIONES_FOTO.some((ext) => f.toLowerCase().endsWith(ext)),
  );
} catch {
  console.warn("⚠️  No pude leer public/productos/: todos los productos usan el fallback visual.");
}

/**
 * Busca la foto de un producto por su slug:
 * 1) Coincidencia exacta `<slug>.<ext>` (más confiable, cubre casi todo).
 * 2) Si no hay exacta, el archivo que EMPIEZA con el slug (variantes con
 *    sufijo, ej. slug "valentino-donna-born-in-roma-intense" y archivo
 *    "valentino-donna-born-in-roma-intense-100ml-edp.webp") — pero SOLO si
 *    ese archivo no es, a su vez, la foto exacta de OTRO producto del
 *    catálogo (ej. no dejar que "la-vie-est-belle" en general se quede con
 *    la foto que en realidad es de "la-vie-est-belle-50ml-edp"; dos
 *    productos distintos con el mismo nombre base y solo una talla con
 *    foto).
 * Sin coincidencia → undefined: `imagen` queda sin definir y el fallback
 * visual (ImagenProducto.tsx) se hace cargo, en vez de mandar una ruta rota.
 */
function buscarFoto(slug, todosLosSlugs) {
  for (const ext of EXTENSIONES_FOTO) {
    if (ARCHIVOS_FOTO.includes(`${slug}${ext}`)) return `/productos/${slug}${ext}`;
  }
  const perteneceAOtroSlug = (archivo) => {
    const base = archivo.replace(/\.[^.]+$/, "");
    return base !== slug && todosLosSlugs.has(base);
  };
  const candidatos = ARCHIVOS_FOTO.filter(
    (f) => f.startsWith(slug) && !perteneceAOtroSlug(f),
  ).sort();
  return candidatos.length > 0 ? `/productos/${candidatos[0]}` : undefined;
}

// Excepciones puntuales: el nombre del archivo no coincide con el slug
// actual del producto (ej. quedó de una carga anterior con otra grafía) y
// el escaneo automático no lo puede resolver solo. Vacío por ahora: la
// limpieza de 2026-09-28 sacó todas las fotos que no eran del producto real
// (ver el comentario de IMÁGENES más abajo).
const FOTOS_EXCEPCION = {};

// Composiciones reales para los perfumes de diseñador ampliamente
// documentados. El resto usa plantillas genéricas (ver TEMPLATES abajo).
// `familia` es la familia olfativa dominante de esa composición real;
// `genero` el posicionamiento de mercado real de ese perfume.
const BESPOKE = {
  "dior|sauvage|EDT": {
    notas: { salida: ["Bergamota de Calabria", "Pimienta"], corazon: ["Lavanda", "Geranio"], fondo: ["Ambroxan", "Cedro", "Pachulí"] },
    descripcion: "Fresco y especiado, con fondo de ambroxan. Un clásico masculino para todos los días.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "dior|sauvage|EDP": {
    notas: { salida: ["Bergamota", "Manzana"], corazon: ["Geranio", "Lavanda"], fondo: ["Ambroxan", "Vainilla", "Haba tonka"] },
    descripcion: "La versión EDP del Sauvage: más dulce, más cuerpo.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "dior|sauvage|Parfum": {
    notas: { salida: ["Mandarina", "Bergamota"], corazon: ["Ambroxan", "Sándalo"], fondo: ["Vainilla", "Haba tonka", "Pachulí"] },
    descripcion: "El Sauvage más denso y cálido, para las noches de frío.",
    familia: "Oriental / Oud", genero: "masculino",
  },
  "chanel|bleu de chanel|EDP": {
    notas: { salida: ["Pomelo", "Limón", "Menta"], corazon: ["Jengibre", "Nuez moscada", "Jazmín"], fondo: ["Incienso", "Vetiver", "Cedro", "Sándalo"] },
    descripcion: "El favorito de oficina. Cítrico, amaderado, sin estridencias.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
  "jean paul gaultier|le male le parfum|Parfum": {
    notas: { salida: ["Lavanda", "Cardamomo"], corazon: ["Vainilla", "Café"], fondo: ["Haba tonka", "Cuero", "Maderas"] },
    descripcion: "El Le Male de siempre, pero más dulce y más denso.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "jean paul gaultier|le male elixir|Elixir": {
    notas: { salida: ["Lavanda", "Menta"], corazon: ["Vainilla", "Café"], fondo: ["Cacao", "Cuero", "Maderas"] },
    descripcion: "La versión más oscura del Le Male: cacao y cuero.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "jean paul gaultier|scandal le parfum|Parfum|100": {
    notas: { salida: ["Mandarina sanguina", "Gardenia"], corazon: ["Miel", "Flor de naranjo"], fondo: ["Pachulí", "Caramelo"] },
    descripcion: "Miel y pachulí, más intenso que el Scandal original.",
    familia: "Gourmand / Dulce", genero: "femenino",
  },
  "versace|eros|EDT": {
    notas: { salida: ["Menta", "Manzana verde", "Limón"], corazon: ["Salvia", "Geranio", "Canela"], fondo: ["Vainilla", "Haba tonka", "Ámbar", "Cedro"] },
    descripcion: "Fresco y dulce a la vez: menta, manzana verde y vainilla.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "versace|eros flame|EDP": {
    notas: { salida: ["Pimienta negra", "Mandarina", "Limón"], corazon: ["Salvia especiada", "Canela"], fondo: ["Vainilla", "Ámbar", "Cedro", "Musgo de roble"] },
    descripcion: "El Eros más intenso: especiado y con más fondo.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "giorgio armani|acqua di giò profondo|EDP": {
    notas: { salida: ["Bergamota", "Toque marino"], corazon: ["Geranio", "Salvia"], fondo: ["Pachulí", "Musgo de roble", "Cedro"] },
    descripcion: "Marino y amaderado, más serio que el Acqua Di Giò clásico.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
  "yves saint laurent|libre|EDP": {
    notas: { salida: ["Lavanda", "Mandarina"], corazon: ["Flor de azahar", "Jazmín"], fondo: ["Almizcle", "Cedro", "Vainilla"] },
    descripcion: "Lavanda y azahar, floral con carácter.",
    familia: "Floral / Frutal", genero: "femenino",
  },
  "yves saint laurent|myslf|EDP": {
    notas: { salida: ["Pera", "Bergamota"], corazon: ["Haba tonka", "Jazmín", "Geranio"], fondo: ["Cedro", "Ámbar"] },
    descripcion: "Fresco y floral, un masculino distinto a lo de siempre.",
    familia: "Floral / Frutal", genero: "masculino",
  },
  "yves saint laurent|myslf l'absolu|Parfum": {
    notas: { salida: ["Pera", "Especias"], corazon: ["Haba tonka", "Jazmín"], fondo: ["Cedro", "Ámbar"] },
    descripcion: "La versión más concentrada del MYSLF: dura todo el día.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "ralph lauren|polo 67|EDP": {
    notas: { salida: ["Bergamota", "Nuez moscada"], corazon: ["Salvia", "Lavanda"], fondo: ["Cuero", "Vetiver", "Ámbar"] },
    descripcion: "El Polo de siempre, con más cuerpo y más fondo.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "paco rabanne|black xs|EDT": {
    notas: { salida: ["Canela", "Menta"], corazon: ["Café", "Cuero"], fondo: ["Ámbar", "Haba tonka", "Pachulí"] },
    descripcion: "Café y cuero, directo y sin vueltas.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "paco rabanne|1 million|EDT": {
    notas: { salida: ["Pomelo", "Menta", "Sangre de mandarina"], corazon: ["Canela", "Especias", "Rosa"], fondo: ["Cuero", "Ámbar", "Madera blanca"] },
    descripcion: "El lingote de oro. Especiado, dulce y con mucha estela.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "paco rabanne|1 million elixir|Elixir": {
    notas: { salida: ["Sangre de mandarina", "Canela"], corazon: ["Especias", "Miel"], fondo: ["Cuero", "Ámbar", "Haba tonka"] },
    descripcion: "El 1 Million llevado al máximo: más miel, más cuero.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "paco rabanne|invictus|EDT": {
    notas: { salida: ["Pomelo", "Toque marino"], corazon: ["Laurel", "Jazmín"], fondo: ["Ámbar gris", "Pachulí"] },
    descripcion: "Marino y deportivo, el que se usa todos los días.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
  "carolina herrera|good girl|EDP": {
    notas: { salida: ["Almendra", "Café"], corazon: ["Jazmín", "Tuberosa"], fondo: ["Cacao", "Haba tonka", "Vainilla"] },
    descripcion: "Almendrado y elegante, el del frasco de taco que se reconoce solo.",
    familia: "Gourmand / Dulce", genero: "femenino",
  },
  "carolina herrera|bad boy elixir|Elixir": {
    notas: { salida: ["Ron", "Nuez moscada"], corazon: ["Salvia", "Lavanda"], fondo: ["Cacao", "Haba tonka", "Vainilla"] },
    descripcion: "Ron y cacao, la versión más golosa del Bad Boy.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "valentino|born in roma uomo|EDT": {
    notas: { salida: ["Bergamota", "Pimienta rosa"], corazon: ["Salvia", "Guayaco"], fondo: ["Cuero", "Ámbar", "Almizcle"] },
    descripcion: "Urbano y amaderado, con un fondo de cuero marcado.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "lattafa|asad bourbon|EDP": {
    notas: { salida: ["Bourbon", "Canela"], corazon: ["Tabaco", "Cuero"], fondo: ["Vainilla", "Ámbar", "Almizcle"] },
    descripcion: "Tabaco y bourbon, denso desde el primer toque.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "lattafa|khamrah|EDP": {
    notas: { salida: ["Canela", "Nuez moscada", "Frutas"], corazon: ["Dátil", "Especias"], fondo: ["Vainilla", "Ámbar", "Benjuí"] },
    descripcion: "Gourmand especiado: canela, dátil y vainilla, ideal para el frío.",
    familia: "Gourmand / Dulce", genero: "unisex",
  },
  "lattafa|fakhar women|EDP": {
    notas: { salida: ["Frambuesa", "Bergamota"], corazon: ["Rosa", "Jazmín"], fondo: ["Pachulí", "Vainilla", "Almizcle"] },
    descripcion: "Frutal y limpio, ideal para oficina y para todos los días.",
    familia: "Floral / Frutal", genero: "femenino",
  },
  "lattafa|maahir legacy|EDP": {
    notas: { salida: ["Bergamota", "Manzana"], corazon: ["Especias", "Lavanda"], fondo: ["Ámbar", "Cuero", "Almizcle"] },
    descripcion: "Especiado clásico, buena opción de entrada al nicho árabe.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "lattafa|nebras|EDP": {
    notas: { salida: ["Frutos rojos", "Mandarina"], corazon: ["Flor de azahar", "Jazmín"], fondo: ["Vainilla", "Caramelo", "Almizcle"] },
    descripcion: "Floral y dulce, de proyección alta y buena duración.",
    familia: "Floral / Frutal", genero: "femenino",
  },
  "lattafa|qaed al fursan|EDP": {
    notas: { salida: ["Manzana", "Canela"], corazon: ["Lavanda", "Nuez moscada"], fondo: ["Oud", "Pachulí", "Vainilla"] },
    descripcion: "Especiado y otoñal. Rinde muchísimo con dos toques.",
    familia: "Oriental / Oud", genero: "masculino",
  },
  "lattafa|eclaire|EDP": {
    notas: { salida: ["Pera", "Bergamota"], corazon: ["Praliné", "Flor de naranjo"], fondo: ["Vainilla", "Caramelo", "Almizcle"] },
    descripcion: "Gourmand de pastelería, dulce sin empalagar.",
    familia: "Gourmand / Dulce", genero: "femenino",
  },
  "armaf|club de nuit iconic|EDP": {
    notas: { salida: ["Piña", "Manzana"], corazon: ["Jazmín", "Rosa"], fondo: ["Ámbar gris", "Almizcle", "Pachulí"] },
    descripcion: "La versión EDP del Club de Nuit: más dulce y más fondo.",
    familia: "Floral / Frutal", genero: "masculino",
  },
  "armaf|club de nuit intense men|EDT": {
    notas: { salida: ["Piña", "Limón", "Bergamota"], corazon: ["Abedul", "Jazmín", "Rosa"], fondo: ["Ámbar gris", "Vainilla", "Almizcle"] },
    descripcion: "El caballo de batalla: rinde de mañana, de noche y en verano.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
  "armaf|odyssey homme|EDT": {
    notas: { salida: ["Bergamota", "Manzana"], corazon: ["Lavanda", "Geranio"], fondo: ["Ámbar", "Almizcle", "Cedro"] },
    descripcion: "Fresco y amaderado, buena opción para uso diario.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
  "afnan|9pm|EDP": {
    notas: { salida: ["Manzana", "Canela"], corazon: ["Especias"], fondo: ["Vainilla", "Ámbar", "Almizcle"] },
    descripcion: "Dulce y nocturno, de los que más se preguntan qué es.",
    familia: "Gourmand / Dulce", genero: "masculino",
  },
  "rasasi|hawas for him|EDP": {
    notas: { salida: ["Pomelo", "Menta"], corazon: ["Salvia", "Jengibre"], fondo: ["Ámbar", "Almizcle", "Pachulí"] },
    descripcion: "Fresco especiado, con buena proyección para el día.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
  "maison alhambra|salvo elixir|Elixir": {
    notas: { salida: ["Pera", "Bergamota"], corazon: ["Salvia de ámbar"], fondo: ["Vainilla", "Almizcle", "Sándalo"] },
    descripcion: "Ambarado y envolvente, formato chico de gran rendimiento.",
    familia: "Oriental / Oud", genero: "masculino",
  },
  "maison alhambra|jean lowe immortel|EDP": {
    notas: { salida: ["Piña", "Bergamota", "Grosella negra"], corazon: ["Abedul", "Jazmín", "Rosa"], fondo: ["Almizcle", "Roble", "Ámbar"] },
    descripcion: "Afrutado y amaderado, con muchísima proyección.",
    familia: "Floral / Frutal", genero: "unisex",
  },
  "giorgio armani|stronger with you amber|EDP": {
    notas: { salida: ["Cardamomo", "Pimienta rosa"], corazon: ["Ámbar", "Salvia"], fondo: ["Vainilla", "Cachemira", "Haba tonka"] },
    descripcion: "La versión más densa y dulce del Stronger With You.",
    familia: "Oriental / Oud", genero: "masculino",
  },
  "giorgio armani|stronger with you|EDT": {
    notas: { salida: ["Pomelo", "Cardamomo"], corazon: ["Salvia", "Pimienta rosa"], fondo: ["Vainilla", "Cuero", "Avellana"] },
    descripcion: "Especiado y cálido, para entretiempo y noche.",
    familia: "Amaderado / Especiado", genero: "masculino",
  },
  "versace|eau fraiche|EDT": {
    notas: { salida: ["Bergamota", "Limón", "Romero"], corazon: ["Salvia", "Geranio"], fondo: ["Almizcle", "Cedro", "Ámbar"] },
    descripcion: "Acuático y directo. El clásico de verano que nunca falla.",
    familia: "Cítrico / Fresco", genero: "masculino",
  },
};

// Sin ficha verificada (no está en BESPOKE): NO se inventan notas ni familia.
// `notas` y `familiaOlfativa` quedan sin definir — la web muestra "consultanos
// cómo huele" y el producto no entra en el filtro por familia ni en el asesor
// — y la descripción se arma solo con datos reales de la fila.
const CONCENTRACION_LARGA = {
  EDT: "Eau de Toilette",
  EDP: "Eau de Parfum",
  Parfum: "Parfum",
  Elixir: "Elixir",
};

function descripcionNeutra({ casa, categoria, concentracion, volumen_ml }) {
  const tipo = categoria === "árabes" ? "Perfume árabe" : "Perfume de diseñador";
  return `${tipo} de ${casa}: ${CONCENTRACION_LARGA[concentracion]} de ${volumen_ml} ml, original y sellado.`;
}

// ── Género ───────────────────────────────────────────────────────────
// 1) palabra explícita en el nombre (máxima confianza)
// 2) línea de producto reconocible (mejor esfuerzo, ver diseño acordado)
// 3) BESPOKE.genero (perfumes de diseñador documentados)
// 4) "unisex" — default seguro: nunca se inventa un género sin base.
const RE_FEMENINO = /\b(women|woman|femme|female|her|lady|girl|donna)\b/;
const RE_MASCULINO = /\b(men|man|homme|male|uomo|his|him)\b/;

const GENERO_LINEA = [
  ["yara", "femenino"],
  ["khamrah", "unisex"],
  ["khamwah", "unisex"],
  ["asad", "masculino"],
  ["fakhar gold", "femenino"],
  ["confidential", "masculino"],
  ["maahir", "masculino"],
  ["musamam", "masculino"],
  ["qaed al fursan", "masculino"],
  ["sakeena", "femenino"],
  ["emaan", "femenino"],
  ["nebras", "femenino"],
  ["bade'e al oud", "unisex"],
  ["victoria", "femenino"],
  ["eclaire", "femenino"],
  ["atlas", "masculino"],
  ["teriaq", "unisex"],
  ["petra", "unisex"],
  ["ajayeb", "femenino"],
  ["mayar", "femenino"],
  ["blue oud", "unisex"],
  ["jasoor", "masculino"],
  ["give me gourmand", "femenino"],
  ["ajwad", "masculino"],
  ["vintage radio", "masculino"],
  ["afeef", "masculino"],
  ["hayaati", "femenino"],
  ["club de nuit maleka", "femenino"],
  ["club de nuit", "masculino"],
  ["odyssey", "masculino"],
  ["yum yum", "unisex"],
  ["9pm", "masculino"],
  ["9am", "masculino"],
  ["king femme", "femenino"],
  ["king", "masculino"],
  ["amber oud gold edition", "unisex"],
  ["aqua dubai", "masculino"],
  ["hawas pink", "femenino"],
  ["hawas", "masculino"],
  ["vulcan", "masculino"],
  ["liquid brun", "masculino"],
  ["azzure", "unisex"],
  ["cocoa morado", "femenino"],
  ["gosht espectre", "unisex"],
  ["aether extrait", "unisex"],
  ["irida extrait", "unisex"],
  ["pink eclipe", "femenino"],
  ["jean lowe", "unisex"],
  ["kingsman", "masculino"],
  ["la rouge baroque", "unisex"],
  ["lovely", "femenino"],
  ["philos pura", "unisex"],
  ["salvo", "masculino"],
  ["signatures n2", "unisex"],
  ["versencia jubilant essen", "unisex"],
  ["victoria flower", "femenino"],
  ["victorioso", "masculino"],
  ["sceptre amazonite", "unisex"],
  ["scandal", "femenino"],
  ["dolar violet", "femenino"],
  ["petale nectar", "femenino"],
  ["pivoine", "femenino"],
  ["born in roma uomo", "masculino"],
  ["donna born in roma", "femenino"],
  ["green stravaganza", "unisex"],
  ["voce viva", "femenino"],
  ["eros", "masculino"],
  ["cristal emerald", "femenino"],
  ["acqua di giò", "masculino"],
  ["acqua di gioia", "femenino"],
  ["my way", "femenino"],
  ["si passione", "femenino"],
  ["good girl", "femenino"],
  ["ch la bomba", "femenino"],
  ["ch 212 nyc", "femenino"],
  ["bottled", "masculino"],
  ["invictus", "masculino"],
  ["lady million royal", "femenino"],
  ["phantom", "masculino"],
  ["toy boy", "masculino"],
  ["paradoxe intense", "femenino"],
  ["devotion", "femenino"],
  ["the one", "unisex"],
  ["la vie est belle", "femenino"],
  ["miracle", "femenino"],
  ["trésor", "femenino"],
  ["idôle", "femenino"],
  ["allure homme", "masculino"],
  ["wanted", "masculino"],
  ["polo blue", "masculino"],
  ["polo red", "masculino"],
  ["euphoria", "femenino"],
  ["1 million", "masculino"],
];

function inferirGenero(casa, nombre, generoFicha) {
  // La ficha curada (BESPOKE) es la señal más confiable cuando existe.
  if (generoFicha) return generoFicha;
  const texto = `${casa} ${nombre}`.toLowerCase();
  if (RE_FEMENINO.test(texto)) return "femenino";
  if (RE_MASCULINO.test(texto)) return "masculino";
  for (const [patron, genero] of GENERO_LINEA) {
    if (texto.includes(patron)) return genero;
  }
  return "unisex";
}

// ── Longevidad / proyección ─────────────────────────────────────────
// Correlato estándar del mercado: a mayor concentración de aceite
// perfumado, más dura y más proyecta. No es medición de laboratorio.
const METRICAS_POR_CONCENTRACION = {
  EDT: { longevidad: 3, proyeccion: 3 },
  EDP: { longevidad: 4, proyeccion: 4 },
  Parfum: { longevidad: 5, proyeccion: 4 },
  Elixir: { longevidad: 5, proyeccion: 5 },
};

function limpiarNombre(nombre) {
  return nombre.replace(/\s+/g, " ").trim();
}

/**
 * Slug de una fila. Se calcula en una pasada previa y aparte porque
 * `buscarFoto` necesita conocer el conjunto COMPLETO de slugs del catálogo
 * antes de poder asignar ninguna foto (ver comentario en `buscarFoto`).
 */
function calcularSlug(row, usedSlugs) {
  const [casa, nombreRaw, , volOverride, concentracion] = row;
  const nombre = limpiarNombre(nombreRaw);
  const volumen_ml = volOverride ?? 100;

  const baseSlug = slugify(`${casa} ${nombre} ${volumen_ml}ml ${concentracion}`);
  let slug = slugify(`${casa} ${nombre}`);
  if (usedSlugs.has(slug)) slug = baseSlug;
  let n = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${n}`;
    n++;
  }
  usedSlugs.add(slug);
  return slug;
}

function buildProducto(row, slug, todosLosSlugs) {
  const [casa, nombreRaw, precio_uyu, volOverride, concentracion, categoria, entregaInmediata, stock] = row;
  const nombre = limpiarNombre(nombreRaw);
  const volumen_ml = volOverride ?? 100;

  const fotoKey = `${casa.toLowerCase()}|${nombre.toLowerCase()}`;
  const imagen = FOTOS_EXCEPCION[fotoKey] ?? buscarFoto(slug, todosLosSlugs);

  const bespokeKeys = [
    `${casa.toLowerCase()}|${nombre.toLowerCase()}|${concentracion}|${volumen_ml}`,
    `${casa.toLowerCase()}|${nombre.toLowerCase()}|${concentracion}`,
    `${casa.toLowerCase()}|${nombre.toLowerCase()}`,
  ];
  let ficha = null;
  for (const k of bespokeKeys) {
    if (BESPOKE[k]) { ficha = BESPOKE[k]; break; }
  }
  const genero = inferirGenero(casa, nombre, ficha?.genero);
  const metricas = METRICAS_POR_CONCENTRACION[concentracion];

  return {
    slug,
    nombre,
    casa,
    categoria,
    precio_uyu,
    volumen_ml,
    concentracion,
    notas: ficha?.notas,
    imagen,
    stock,
    descripcion:
      ficha?.descripcion ??
      descripcionNeutra({ casa, categoria, concentracion, volumen_ml }),
    entregaInmediata: entregaInmediata || undefined,
    genero,
    familiaOlfativa: ficha?.familia,
    longevidad: metricas.longevidad,
    proyeccion: metricas.proyeccion,
  };
}

const usedSlugs = new Set();
const slugsPorFila = rows.map((row) => calcularSlug(row, usedSlugs));
const todosLosSlugs = new Set(slugsPorFila);
const productos = rows.map((row, i) =>
  buildProducto(row, slugsPorFila[i], todosLosSlugs),
);

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
  if (p.notas) lines.push(`    notas: ${tsNotas(p.notas)},`);
  if (p.imagen) lines.push(`    imagen: ${tsString(p.imagen)},`);
  lines.push(`    stock: ${p.stock},`);
  lines.push(`    descripcion: ${tsString(p.descripcion)},`);
  if (p.entregaInmediata) lines.push(`    entregaInmediata: true,`);
  lines.push(`    genero: ${tsString(p.genero)},`);
  if (p.familiaOlfativa) lines.push(`    familiaOlfativa: ${tsString(p.familiaOlfativa)},`);
  lines.push(`    longevidad: ${p.longevidad},`);
  lines.push(`    proyeccion: ${p.proyeccion},`);
  lines.push(`  },`);
  return lines.join("\n");
}

const header = `/**
 * CATÁLOGO — Perfumes originales sellados
 *
 * Única fuente de datos del sitio. Para agregar un perfume copiás un objeto
 * y listo: no hay que tocar ningún componente.
 *
 * Lo que está acá es el precio que ve el cliente y el que viaja en el mensaje
 * de "Hacer Pedido por WhatsApp" (ver src/lib/pedidoWhatsApp.ts).
 *
 * 📸 IMÁGENES
 * Este archivo se genera con \`node scripts/gen-productos.mjs\`, que ESCANEA
 * /public/productos y le asigna a cada producto el archivo cuyo nombre
 * coincide (exacto o por prefijo) con su \`slug\`. Nunca edites \`imagen\` acá
 * a mano: se pisa en la próxima corrida. Para agregar una foto:
 * - Guardala en /public/productos/<slug>.webp (o .jpg/.jpeg/.png).
 * - Cuadrada, 1000×1000 px, el frasco centrado sobre fondo oscuro o neutro.
 * - Comprimila antes de subirla (squoosh.app, calidad ~75). Apuntá a <150 KB.
 * - Corré el generador de nuevo para que quede linkeada.
 * - Sin foto todavía: \`imagen\` queda sin definir y el fallback visual (ver
 *   \`src/components/ImagenProducto.tsx\`) se hace cargo, en vez de mandar
 *   una ruta rota.
 *
 * ⚠️ 2026-09-28: se vació /public/productos por completo. Un lote de fotos
 * "descargadas automáticamente" resultó ser, en su totalidad, imágenes sin
 * relación (stock de relojes, mapas, memes) o gráficos placeholder
 * autogenerados con el texto "foto placeholder — reemplazar" quemado en la
 * imagen — incluidos los que se venían tratando como reales desde el
 * origen del proyecto. Verificalo vos mismo antes de confiar en una foto
 * de este directorio: abrila y mirala, no asumas por el nombre del archivo.
 * Excepción confirmada a mano: valentino-born-in-roma-uomo.webp (foto real,
 * verificada).
 *
 * 💵 PRECIOS — moneda única: PESOS URUGUAYOS (UYU)
 * \`precio_uyu\` es el precio final en UYU, IVA incluido, número entero sin
 * puntos ni símbolo (3200, no "$ 3.200"). Carga oficial 2026-09 (solo precio
 * por menor — el archivo no guarda precio mayorista).
 * Para ver la lista completa de precios actuales: \`npm run precios\` (la
 * imprime en consola y la guarda en precios-actuales.csv).
 * Para CAMBIAR un precio: editá la 3ª columna de scripts/gen-rows.mjs y
 * corré \`node scripts/gen-productos.mjs\`. No lo edites acá: se pisa.
 *
 * 📦 STOCK
 * \`stock\` es binario en esta carga: 1 = se puede pedir, 0 = sin stock. No
 * indica cantidad de unidades. La disponibilidad que ve el cliente sale de
 * \`disponibilidad()\` (al final del archivo):
 *   - "stock"   → \`entregaInmediata\`: frasco físico en Uruguay, listo para entregar.
 *   - "pedido"  → se consigue a pedido; disponibilidad y plazo se confirman
 *                 por WhatsApp antes de aceptar el pedido.
 *   - "agotado" → \`stock: 0\`.
 *
 * 🧭 NOTAS, FAMILIA Y DESCRIPCIÓN
 * Solo los perfumes con ficha verificada (BESPOKE en scripts/gen-productos.mjs)
 * tienen \`notas\`, \`familiaOlfativa\` y descripción propia. El resto NO
 * tiene notas ni familia (la web muestra "consultanos cómo huele") y su
 * descripción se arma solo con datos reales: tipo, casa, concentración y ml.
 * Para completar una ficha, agregala a BESPOKE con datos verificados y
 * regenerá. Hasta 2026-11 se usaban plantillas rotativas que no
 * correspondían al perfume real: se eliminaron.
 *
 * 🚻 GÉNERO / 📊 LONGEVIDAD Y PROYECCIÓN
 * \`genero\` sale de: 1) palabra explícita en el nombre, 2) reconocimiento de
 * línea de producto (mejor esfuerzo), 3) "unisex" si no hay señal — nunca se
 * inventa sin base. \`longevidad\`/\`proyeccion\` (1-5) se derivan de la
 * concentración (EDT=3, EDP=4, Parfum=5/4, Elixir=5) siguiendo la
 * correlación estándar del mercado — no son medición de laboratorio.
 */

/** Concentración del jugo: define duración y proyección. */
export type Concentracion = "EDT" | "EDP" | "Parfum" | "Elixir";

export type Categoria = "árabes" | "diseñador";

export type Genero = "masculino" | "femenino" | "unisex";

export type FamiliaOlfativa =
  | "Gourmand / Dulce"
  | "Amaderado / Especiado"
  | "Cítrico / Fresco"
  | "Oriental / Oud"
  | "Floral / Frutal";

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
  /** Pirámide verificada. Sin definir = sin ficha verificada todavía. */
  notas?: Notas;
  /** Ruta pública de la foto. Sin definir = fallback visual (ver ImagenProducto). */
  imagen?: string;
  /** 1 = disponible, 0 = sin stock (no se puede comprar). */
  stock: number;
  /** Una línea honesta sobre cuándo usarlo. Nada de "elegancia atemporal". */
  descripcion: string;
  /** Frasco físico en Uruguay, listo para entregar ("En stock"). */
  entregaInmediata?: boolean;
  /** Se muestra primero y con el borde dorado. Máximo 2 o 3. */
  destacado?: boolean;
  genero: Genero;
  /** Familia de la ficha verificada. Sin definir = no entra en filtros por familia. */
  familiaOlfativa?: FamiliaOlfativa;
  /** 1 a 5. 4 ≈ 8-10 h. */
  longevidad: number;
  /** 1 a 5. 4 ≈ estela alta. */
  proyeccion: number;
};

export const categorias: { id: Categoria | "todos"; etiqueta: string }[] = [
  { id: "todos", etiqueta: "Todos" },
  { id: "árabes", etiqueta: "Árabes" },
  { id: "diseñador", etiqueta: "Diseñador" },
];

export const generos: { id: Genero | "todos"; etiqueta: string }[] = [
  { id: "todos", etiqueta: "Todos" },
  { id: "masculino", etiqueta: "Masculino" },
  { id: "femenino", etiqueta: "Femenino" },
  { id: "unisex", etiqueta: "Unisex" },
];

export const familiasOlfativas: { id: FamiliaOlfativa | "todas"; etiqueta: string }[] = [
  { id: "todas", etiqueta: "Todas las familias" },
  { id: "Gourmand / Dulce", etiqueta: "Gourmand / Dulce" },
  { id: "Amaderado / Especiado", etiqueta: "Amaderado / Especiado" },
  { id: "Cítrico / Fresco", etiqueta: "Cítrico / Fresco" },
  { id: "Oriental / Oud", etiqueta: "Oriental / Oud" },
  { id: "Floral / Frutal", etiqueta: "Floral / Frutal" },
];

export const productos: Producto[] = [
`;

const footer = `
/** Busca por slug (páginas de producto, carrito). */
export function buscarProducto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

/**
 * URL de la foto para lugares que necesitan un string plano (metadata,
 * JSON-LD): si el producto todavía no tiene
 * foto propia, cae al OG del sitio en vez de mandar una ruta rota.
 *
 * Para renderizar en pantalla usá \`<ImagenProducto>\` en vez de esto: ahí sí
 * se ve el fallback de frasco, que queda mejor que el banner del sitio
 * estirado en un cuadrado.
 */
export function imagenUrl(p: Producto): string {
  return p.imagen ?? "/og.jpg";
}

/** true si se puede pedir (en stock o a pedido). */
export function hayStock(p: Producto): boolean {
  return p.stock > 0;
}

/**
 * Cómo lo puede conseguir el cliente:
 * - "stock":   frasco físico en Uruguay, listo para entregar.
 * - "pedido":  se consigue a pedido; disponibilidad y plazo se confirman
 *              por WhatsApp antes de aceptar el pedido.
 * - "agotado": sin stock por ahora.
 */
export type Disponibilidad = "stock" | "pedido" | "agotado";

export function disponibilidad(p: Producto): Disponibilidad {
  if (p.stock <= 0) return "agotado";
  return p.entregaInmediata ? "stock" : "pedido";
}

export const ETIQUETA_DISPONIBILIDAD: Record<Disponibilidad, string> = {
  stock: "En stock",
  pedido: "A pedido",
  agotado: "Sin stock por ahora",
};
`;

const body = productos.map(tsProducto).join("\n");
const out = header + body + "\n];\n" + footer;

writeFileSync(new URL("../src/data/productos.ts", import.meta.url), out, "utf8");
console.log(`Escritos ${productos.length} productos.`);
console.log(`Con foto real: ${productos.filter((p) => p.imagen).length}`);
console.log(`entregaInmediata: ${productos.filter((p) => p.entregaInmediata).length}`);
console.log(`stock 0: ${productos.filter((p) => p.stock === 0).length}`);
console.log(
  `Género — masculino: ${productos.filter((p) => p.genero === "masculino").length}, femenino: ${productos.filter((p) => p.genero === "femenino").length}, unisex: ${productos.filter((p) => p.genero === "unisex").length}`,
);
