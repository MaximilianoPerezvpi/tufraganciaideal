import type { Metadata } from "next";
import Header from "@/components/Header";
import FormularioResena from "@/components/FormularioResena";
import { buscarProducto } from "@/data/productos";

// Página para clientes que ya compraron (se llega por link de WhatsApp o
// desde la confirmación de compra): no aporta nada en Google.
export const metadata: Metadata = {
  title: "Dejá tu opinión",
  robots: { index: false, follow: false },
};

/** /opinar?p=<slug> deja el perfume elegido; sin `p`, se elige de la lista. */
export default async function PaginaOpinar({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const producto = p ? buscarProducto(p) : undefined;

  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        <div className="marco max-w-2xl py-14 md:py-20">
          <p className="kicker">Tu opinión</p>
          <h1 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            {producto ? `¿Qué te pareció ${producto.nombre}?` : "¿Cómo te fue con tu compra?"}
          </h1>
          <p className="mt-4 max-w-[52ch] leading-relaxed text-arena">
            Te lleva un minuto y le sirve muchísimo a quien está dudando qué
            perfume elegir. Contanos con sinceridad: publicamos todas las
            opiniones reales.
          </p>
          <div className="mt-8">
            <FormularioResena key={producto?.slug} slug={producto?.slug} />
          </div>
        </div>
      </main>
    </>
  );
}
