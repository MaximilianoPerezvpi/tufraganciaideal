import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StockInmediato from "@/components/StockInmediato";
import ExploraCategorias from "@/components/ExploraCategorias";
import AsesorOlfativo from "@/components/AsesorOlfativo";
import CTACatalogo from "@/components/CTACatalogo";
import Originales from "@/components/Originales";
import Testimonios from "@/components/Testimonios";
import Envios from "@/components/Envios";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BotonFlotanteWhatsApp from "@/components/BotonFlotanteWhatsApp";
import { catalogoJsonLd } from "@/lib/jsonld";

/**
 * Home. Cada sección es un componente independiente: para reordenar la página
 * alcanza con mover una línea acá.
 *
 * La grilla completa del catálogo (226 productos) vive en /catalogo, no acá:
 * este home solo da vistazos (stock inmediato, categorías, asesor) e invita
 * a seguir — ver CTACatalogo.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <StockInmediato />
        <ExploraCategorias />
        <AsesorOlfativo />
        <CTACatalogo />
        <Originales />
        <Testimonios />
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
