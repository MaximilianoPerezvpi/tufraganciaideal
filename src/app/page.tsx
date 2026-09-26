import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catalogo from "@/components/Catalogo";
import Originales from "@/components/Originales";
import Envios from "@/components/Envios";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BotonFlotanteWhatsApp from "@/components/BotonFlotanteWhatsApp";
import { catalogoJsonLd } from "@/lib/jsonld";

/**
 * Home. Cada sección es un componente independiente: para reordenar la página
 * alcanza con mover una línea acá.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Catalogo />
        <Originales />
        <Envios />
      </main>
      <Footer />

      {/* Viven fuera de <main>: se montan una sola vez. */}
      <CartDrawer />
      <BotonFlotanteWhatsApp />

      {/* Precios y stock legibles por Google, generados desde productos.ts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogoJsonLd()) }}
      />
    </>
  );
}
