import type { MetadataRoute } from "next";
import { BASE_URL } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Mismo dominio que sitemap.ts: el sitemap tiene que resolver en el
    // mismo origen que este robots.txt para que los rastreadores lo tomen.
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
