import { productos, type Producto } from "@/data/productos";
import { site } from "@/lib/site";

/**
 * Datos estructurados del catálogo (schema.org/ItemList + Product).
 *
 * Es lo que le permite a Google mostrar precio y disponibilidad directo en el
 * resultado de búsqueda. Se genera solo a partir de `productos.ts`: si agregás
 * un perfume, acá aparece sin tocar nada.
 */

function oferta(p: Producto, url = `${site.url}/#catalogo`) {
  return {
    "@type": "Offer",
    priceCurrency: "UYU",
    price: p.precio_uyu,
    availability:
      p.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    url,
    areaServed: { "@type": "Country", name: "Uruguay" },
    seller: { "@type": "Organization", name: site.nombre },
  };
}

export function catalogoJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Perfumes originales en Uruguay — ${site.nombre}`,
    numberOfItems: productos.length,
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${p.marca} ${p.nombre} ${p.concentracion} ${p.volumen_ml} ml`,
        brand: { "@type": "Brand", name: p.marca },
        category: "Perfume",
        description: p.descripcion,
        image: `${site.url}${p.imagen}`,
        size: `${p.volumen_ml} ml`,
        offers: oferta(p),
      },
    })),
  };
}

/** Datos estructurados de un producto individual, para /producto/[slug]. */
export function productoJsonLd(p: Producto) {
  const url = `${site.url}/producto/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.marca} ${p.nombre} ${p.concentracion} ${p.volumen_ml} ml`,
    brand: { "@type": "Brand", name: p.marca },
    category: "Perfume",
    description: p.descripcion,
    image: `${site.url}${p.imagen}`,
    size: `${p.volumen_ml} ml`,
    url,
    offers: oferta(p, url),
  };
}
