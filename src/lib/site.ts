/**
 * Configuración central del sitio.
 * ⚠️ REVISAR ANTES DE DEPLOYEAR: los valores marcados con TODO son placeholders.
 */
export const site = {
  nombre: "TuFraganciaIdeal",
  // TODO: poné el dominio final. Se usa para canonical, sitemap y Open Graph.
  url: "https://tufraganciaideal.uy",
  descripcion:
    "Perfumes originales sellados en Uruguay: frascos completos de nicho, diseñador y árabes. Comprá online con Mercado Pago y recibilo en todo el país.",

  // WhatsApp de consultas y pedidos (formato internacional, sin + ni espacios).
  whatsapp: "59897443176",
  instagram: "tufraganciaideal",
  instagramUrl: "https://instagram.com/tufraganciaideal",
  email: "hola@tufraganciaideal.uy", // TODO

  ciudad: "Montevideo",
  pais: "Uruguay",
} as const;

/** Link de WhatsApp con mensaje pre-cargado (mejora muchísimo la conversión). */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Navegación principal: una sola fuente de verdad para header y footer. */
export const navegacion = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/catalogo", etiqueta: "Catálogo" },
  { href: "/#originales", etiqueta: "Originales" },
  { href: "/#envios", etiqueta: "Envíos y pagos" },
] as const;
