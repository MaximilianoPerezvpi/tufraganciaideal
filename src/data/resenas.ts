/**
 * RESEÑAS — solo opiniones reales de clientes.
 *
 * Cómo llegan: el formulario del sitio (página de cada perfume y /opinar)
 * arma un mensaje y lo abre en el WhatsApp de la tienda. Nada se publica
 * solo: vos leés la reseña, y si corresponde la copiás acá.
 *
 * Para publicar una:
 * - Copiá un objeto, completá con lo que mandó el cliente tal cual (podés
 *   corregir tildes, no el contenido) y hacé commit.
 * - `slug`: el perfume que compró (el mismo de la URL /producto/<slug>).
 *   Sin slug = opinión general de la tienda (sale solo en el home).
 * - `compraVerificada`: true solo si chequeaste que esa persona te compró.
 * - Publicá también las de 3 estrellas o menos: sacar las malas es tan
 *   engañoso como inventar buenas.
 *
 * ⚠️ Nunca agregues reseñas inventadas, de amigos que no compraron o
 * escritas por vos. Es publicidad engañosa (Ley 17.250) y Google penaliza
 * los datos estructurados de reseñas falsas.
 *
 * 💬 Mensaje para pedir la reseña por WhatsApp (unos días después de la
 * entrega), reemplazando <slug>:
 *
 *   ¡Hola! ¿Cómo te fue con el perfume? Si tenés un minuto, nos ayuda
 *   muchísimo que dejes tu opinión acá: https://tufraganciaideal.uy/opinar?p=<slug>
 */

export type Resena = {
  /** Perfume reseñado. Sin definir = opinión general de la tienda. */
  slug?: string;
  /** Como lo quiera mostrar el cliente: "Martina G.", "Diego". */
  nombre: string;
  ciudad?: string;
  /** 1 a 5, entero. */
  estrellas: 1 | 2 | 3 | 4 | 5;
  texto: string;
  /** Fecha en que la dejó, formato AAAA-MM-DD. */
  fecha: string;
  compraVerificada?: boolean;
};

export const resenas: Resena[] = [
  // {
  //   slug: "valentino-born-in-roma-uomo",
  //   nombre: "Nombre I.",
  //   ciudad: "Montevideo",
  //   estrellas: 5,
  //   texto: "Lo que escribió el cliente.",
  //   fecha: "2026-10-01",
  //   compraVerificada: true,
  // },
];
