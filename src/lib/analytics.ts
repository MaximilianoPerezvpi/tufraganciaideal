import type { Producto } from "@/data/productos";

/**
 * ANALÍTICA — Google Analytics 4 + Meta Pixel
 *
 * Se activan solo si están las variables de entorno (Vercel → Settings →
 * Environment Variables, y redeploy):
 *   NEXT_PUBLIC_GA4_ID          G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID   número del Pixel (solo dígitos)
 * Sin ellas no se carga ningún script y estas funciones no hacen nada.
 *
 * Eventos:
 *   - Visitas y fuentes de tráfico: automáticos (page_view / PageView).
 *   - Vista de producto: GA4 `view_item` / Meta `ViewContent`.
 *   - Agregar al carrito de consulta: GA4 `add_to_cart` / Meta `AddToCart`
 *     (interés, no venta: el carrito solo arma un mensaje de WhatsApp).
 *   - Búsqueda (catálogo y buscador del header): GA4 `search` / Meta `Search`,
 *     con el término y cuántos resultados dio (0 = perfume que buscan y no está).
 *   - Consultas mayoristas y por perfumes no publicados: además, eventos
 *     propios `consulta_mayorista` / `consulta_fuera_de_catalogo`.
 *   - Clic en "Seguir el canal" de WhatsApp: evento propio `seguir_canal`
 *     (no cuenta como contacto: es suscribirse a las ofertas).
 *   - Clic en WhatsApp: GA4 `generate_lead` / Meta `Contact`. Es un CONTACTO
 *     (inicio de consulta), nunca una compra: la venta se cierra en el chat
 *     y la web no se entera.
 */

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

type Ventana = Window & { gtag?: Gtag; fbq?: Fbq; dataLayer?: unknown[] };

/**
 * Ejecuta `fn` cuando el script ya definió `window[nombre]`. Hace falta en
 * fichas abiertas directo (p. ej. desde Instagram): la vista de producto se
 * dispara al hidratar, antes de que corra el init de GA4/Pixel, y un evento
 * encolado antes del `config` de GA4 no se asocia a la propiedad.
 */
function cuandoExista(nombre: "gtag" | "fbq", fn: (f: Gtag) => void, intentos = 20) {
  const f = (window as Ventana)[nombre];
  if (f) return fn(f);
  if (intentos > 0) setTimeout(() => cuandoExista(nombre, fn, intentos - 1), 250);
}

function gtag(...args: unknown[]) {
  if (GA4_ID) cuandoExista("gtag", (f) => f(...args));
}

function fbq(...args: unknown[]) {
  if (META_PIXEL_ID) cuandoExista("fbq", (f) => f(...args));
}

function itemGa4(p: Producto) {
  return {
    item_id: p.slug,
    item_name: `${p.casa} ${p.nombre}`,
    item_brand: p.casa,
    item_category: p.categoria,
    item_variant: `${p.concentracion} ${p.volumen_ml} ml`,
    price: p.precio_uyu,
  };
}

export function trackVistaProducto(p: Producto) {
  gtag("event", "view_item", {
    currency: "UYU",
    value: p.precio_uyu,
    items: [itemGa4(p)],
  });
  fbq("track", "ViewContent", {
    content_ids: [p.slug],
    content_name: `${p.casa} ${p.nombre}`,
    content_type: "product",
    currency: "UYU",
    value: p.precio_uyu,
  });
}

// Consultas que conviene ver por separado en GA4/Meta sin configurar
// dimensiones personalizadas: además de `generate_lead`, llevan su evento.
const EVENTO_POR_ORIGEN: Record<string, string> = {
  mayoristas: "consulta_mayorista",
  "mayoristas-oferta": "consulta_mayorista",
  "catalogo-consulta": "consulta_fuera_de_catalogo",
  "catalogo-aviso": "consulta_fuera_de_catalogo",
  "envios-consulta": "consulta_fuera_de_catalogo",
};

/** Clic en cualquier link a wa.me. `origen` = dónde estaba el botón. */
export function trackContactoWhatsApp(origen: string, slug?: string) {
  const especifico = EVENTO_POR_ORIGEN[origen];
  if (especifico) {
    gtag("event", especifico, { origen });
    fbq("trackCustom", especifico, { origen });
  }
  gtag("event", "generate_lead", {
    method: "whatsapp",
    origen,
    ...(slug ? { item_id: slug } : {}),
  });
  fbq("track", "Contact", {
    content_category: origen,
    ...(slug ? { content_ids: [slug] } : {}),
  });
}

/** Clic en el link del canal de WhatsApp de novedades y ofertas. */
export function trackSeguirCanal(origen: string) {
  gtag("event", "seguir_canal", { origen });
  fbq("trackCustom", "seguir_canal", { origen });
}

export function trackAgregarCarrito(p: Producto, cantidad: number) {
  gtag("event", "add_to_cart", {
    currency: "UYU",
    value: p.precio_uyu * cantidad,
    items: [{ ...itemGa4(p), quantity: cantidad }],
  });
  fbq("track", "AddToCart", {
    content_ids: [p.slug],
    content_name: `${p.casa} ${p.nombre}`,
    content_type: "product",
    currency: "UYU",
    value: p.precio_uyu * cantidad,
  });
}

/** Búsqueda terminada (se llama con debounce, no por cada tecla). */
export function trackBusqueda(termino: string, resultados: number, origen: string) {
  gtag("event", "search", { search_term: termino, resultados, origen });
  fbq("track", "Search", { search_string: termino, content_category: origen });
}

/**
 * Llama a `trackBusqueda` cuando el usuario deja de escribir (1,2 s) y el
 * término tiene al menos 3 letras. Devuelve la función de limpieza para un
 * useEffect.
 */
export function programarBusqueda(
  termino: string,
  resultados: number,
  origen: string,
): (() => void) | undefined {
  const t = termino.trim();
  if (t.length < 3) return;
  const id = setTimeout(() => trackBusqueda(t, resultados, origen), 1200);
  return () => clearTimeout(id);
}

export function trackPageViewMeta() {
  fbq("track", "PageView");
}
