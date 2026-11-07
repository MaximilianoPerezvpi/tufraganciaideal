/**
 * Configuración central del sitio.
 * ⚠️ REVISAR ANTES DE DEPLOYEAR: los valores marcados con TODO son placeholders.
 */
export const site = {
  nombre: "TuFragancia Ideal",
  // Dominio público: canonical, sitemap, Open Graph y datos estructurados
  // salen de acá. Hoy es el de Vercel (tufraganciaideal.uy no está
  // registrado). Con dominio propio: cargá NEXT_PUBLIC_DOMINIO en Vercel
  // (sin barra final) y redeploy, sin tocar código.
  // ⚠️ NO usar NEXT_PUBLIC_SITE_URL: en Vercel quedó cargada de la época de
  // Mercado Pago apuntando a un dominio que da 404.
  url: (
    process.env.NEXT_PUBLIC_DOMINIO || "https://tufraganciaideal-self.vercel.app"
  ).replace(/\/$/, ""),
  descripcion:
    "Perfumes árabes y de diseñador originales en Uruguay. Consultá por WhatsApp, te asesoramos personalmente y te lo enviamos a todo el país.",

  // WhatsApp de consultas y pedidos (formato internacional, sin + ni espacios).
  whatsapp: "59897443176",
  instagram: "tufraganciaidealuy",
  instagramUrl: "https://www.instagram.com/tufraganciaidealuy/",
  // Vacío = no se muestra. TODO: cargá un email real (el de
  // @tufraganciaideal.uy no existe: el dominio no está registrado).
  email: "",

  ciudad: "Montevideo",
  pais: "Uruguay",
} as const;

/** Link de WhatsApp con mensaje pre-cargado (mejora muchísimo la conversión). */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Navegación principal: una sola fuente de verdad para header y footer. */
// "Inicio" no va: el logo ya lleva al home, y así entra "Mayoristas".
export const navegacion = [
  { href: "/catalogo", etiqueta: "Catálogo" },
  { href: "/mayoristas", etiqueta: "Mayoristas" },
  { href: "/#originales", etiqueta: "Originales" },
  { href: "/#envios", etiqueta: "Envíos y pagos" },
] as const;
