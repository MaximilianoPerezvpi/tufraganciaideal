import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo } from "next/font/google";
import { Toaster } from "sonner";
import { site } from "@/lib/site";
import BotonFlotanteWhatsApp from "@/components/BotonFlotanteWhatsApp";
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
  "Descubre nuestra selección de perfumes 100% originales. Envíos a todo el país.";

export const metadata: Metadata = {
  // ⚠️ Apunta al dominio de Vercel, no a `site.url` (tufraganciaideal.uy):
  // así pedido explícitamente, para que las previsualizaciones de WhatsApp
  // funcionen ya mismo contra lo que está realmente publicado. El resto de
  // las URLs absolutas del sitio (JSON-LD, sitemap, canonical de /catalogo,
  // vuelta de Mercado Pago) siguen usando `site.url` — cuando el dominio
  // .uy esté realmente en línea, conviene unificar todo a ese.
  metadataBase: new URL("https://tufraganciaideal-self.vercel.app"),
  title: {
    default: TITULO_COMPARTIR,
    template: "%s | TuFraganciaIdeal",
  },
  description: DESCRIPCION_COMPARTIR,
  keywords: [
    "perfumes originales Uruguay",
    "comprar perfumes online Uruguay",
    "TuFraganciaIdeal",
    "perfumería importada Montevideo",
    "perfumes árabes Uruguay",
    "perfumes de nicho Uruguay",
    "perfumes 100 ml sellados",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: site.url,
    siteName: site.nombre,
    title: TITULO_COMPARTIR,
    description: DESCRIPCION_COMPARTIR,
    // 📸 Subí una imagen 1200×630 a /public/og.jpg (frasco + logo sobre fondo oscuro).
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.nombre }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO_COMPARTIR,
    description: DESCRIPCION_COMPARTIR,
    images: ["/og.jpg"],
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
  paymentAccepted: "Mercado Pago, Tarjetas de crédito y débito, Abitab, Redpagos",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-UY" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        {children}

        {/* Montado una sola vez acá (antes se repetía en cada página). */}
        <BotonFlotanteWhatsApp />

        {/* Toasts de confirmación (agregar al carrito, etc.), con la paleta del sitio. */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-carbon)",
              color: "var(--color-marfil)",
              border: "1px solid var(--color-borde)",
            },
            descriptionClassName: "!text-arena",
          }}
          icons={{ success: "✓" }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
