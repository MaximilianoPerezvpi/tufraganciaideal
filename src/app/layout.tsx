import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo } from "next/font/google";
import { site } from "@/lib/site";
import BotonFlotanteWhatsApp from "@/components/BotonFlotanteWhatsApp";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import "./globals.css";

/* Fraunces para títulos: serif de contraste alto con "wonk" activado — da el
   aire editorial de revista de perfumería sin caer en el Playfair de siempre. */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

/* Archivo para interfaz y cuerpo: grotesca neutra, con buenos números. */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

// Título y descripción para compartir (WhatsApp, redes): literales acá,
// a propósito, sin pasar por `site.descripcion` — ese texto lo usan otras
// páginas (JSON-LD, /catalogo) y no lo tocamos con este cambio puntual.
const TITULO_COMPARTIR =
  "TuFragancia Ideal | Perfumes Árabes y de Diseñador en Uruguay";
const DESCRIPCION_COMPARTIR =
  "Comprá perfumes originales en Uruguay: árabes y de diseñador, sellados. Consultá por WhatsApp y recibilo en Montevideo o en todo el país.";

export const metadata: Metadata = {
  // Un solo dominio para todo (canonical, OG, sitemap, JSON-LD): `site.url`.
  metadataBase: new URL(site.url),
  title: {
    default: TITULO_COMPARTIR,
    template: "%s | TuFragancia Ideal",
  },
  description: DESCRIPCION_COMPARTIR,
  keywords: [
    "comprar perfumes originales Uruguay",
    "perfumes árabes Uruguay",
    "perfumes de diseñador Uruguay",
    "perfumería online Uruguay",
    "perfumes originales Montevideo",
    "TuFragancia Ideal",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: site.url,
    siteName: site.nombre,
    title: TITULO_COMPARTIR,
    description: DESCRIPCION_COMPARTIR,
    images: [{ url: "/hero-bg.png", width: 1024, height: 1536, alt: site.nombre }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_COMPARTIR,
    description: DESCRIPCION_COMPARTIR,
    images: ["/hero-bg.png"],
  },
  robots: { index: true, follow: true },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#14100C",
  colorScheme: "dark",
};

/* Datos estructurados: le dicen a Google que esto es una tienda real con
   ubicación y horarios. Es lo que habilita los resultados enriquecidos. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: site.nombre,
  description: site.descripcion,
  url: site.url,
  image: `${site.url}/og.jpg`,
  sameAs: [site.instagramUrl],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.ciudad,
    addressCountry: "UY",
  },
  areaServed: { "@type": "Country", name: "Uruguay" },
  priceRange: "$$",
  currenciesAccepted: "UYU",
  paymentAccepted: "Transferencia bancaria, Efectivo, Mercado Pago (link de pago)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-UY" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        {children}

        {/* Montados una sola vez acá (antes se repetían en cada página). */}
        <Footer />
        <BotonFlotanteWhatsApp />
        <Analytics />


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
