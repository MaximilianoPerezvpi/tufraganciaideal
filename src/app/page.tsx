import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SeleccionDestacada from "@/components/SeleccionDestacada";
import ExploraCategorias from "@/components/ExploraCategorias";
import AsesorOlfativo from "@/components/AsesorOlfativo";
import CTACatalogo from "@/components/CTACatalogo";
import LuxuryBanner from "@/components/LuxuryBanner";
import Originales from "@/components/Originales";
import Testimonios from "@/components/Testimonios";
import Envios from "@/components/Envios";
import CTAWhatsApp from "@/components/CTAWhatsApp";
import { catalogoJsonLd } from "@/lib/jsonld";

/**
 * Home. Cada sección es un componente independiente: para reordenar la página
 * alcanza con mover una línea acá.
 *
 * La grilla completa del catálogo (226 productos) vive en /catalogo, no acá:
 * este home solo da vistazos (selección, categorías, asesor) e invita a
 * seguir — ver CTACatalogo. Orden comercial: propuesta → selección →
 * categorías → asesor → catálogo → garantías → envíos y pagos → opiniones
 * → CTA a WhatsApp. Las preguntas frecuentes viven en el Footer (todas
 * las páginas).
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <SeleccionDestacada />
        <ExploraCategorias />
        <AsesorOlfativo />
        <CTACatalogo />
        <LuxuryBanner />
        <Originales />
        <Envios />
        <Testimonios />
        <CTAWhatsApp />
      </main>


      {/* Precios y stock legibles por Google, generados desde productos.ts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogoJsonLd()) }}
      />
    </>
  );
}
