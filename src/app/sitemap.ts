import type { MetadataRoute } from "next";
import { productos } from "@/data/productos";
import { site } from "@/lib/site";

// Mismo dominio que todo el sitio (`site.url`, ver src/lib/site.ts).
export const BASE_URL = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();

  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: hoy, changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE_URL}/catalogo`,
      lastModified: hoy,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/terminos-y-condiciones`,
      lastModified: hoy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/politica-de-envios`,
      lastModified: hoy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: hoy,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const deProductos: MetadataRoute.Sitemap = productos.map((p) => ({
    url: `${BASE_URL}/producto/${p.slug}`,
    lastModified: hoy,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...estaticas, ...deProductos];
}
