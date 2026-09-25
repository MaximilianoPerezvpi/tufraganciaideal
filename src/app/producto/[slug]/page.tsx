import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import DetalleProducto from "@/components/DetalleProducto";
import { buscarProducto, productos, type Producto } from "@/data/productos";
import { productoJsonLd } from "@/lib/jsonld";

type Parametros = { params: Promise<{ slug: string }> };

/** Prerenderiza una página estática por cada perfume del catálogo. */
export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: Parametros): Promise<Metadata> {
  const { slug } = await params;
  const producto = buscarProducto(slug);
  if (!producto) return {};

  const titulo = `${producto.marca} ${producto.nombre} ${producto.concentracion} ${producto.volumen_ml} ml`;

  return {
    title: titulo,
    description: producto.descripcion,
    alternates: { canonical: `/producto/${producto.slug}` },
    openGraph: {
      type: "website",
      title: titulo,
      description: producto.descripcion,
      images: [
        { url: producto.imagen, width: 1000, height: 1000, alt: titulo },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: producto.descripcion,
      images: [producto.imagen],
    },
  };
}

/** Misma marca primero; si faltan para llegar a 4, completa con la misma categoría. */
function relacionadosDe(producto: Producto): Producto[] {
  const mismaMarca = productos.filter(
    (p) => p.slug !== producto.slug && p.marca === producto.marca,
  );
  const mismaCategoria = productos.filter(
    (p) =>
      p.slug !== producto.slug &&
      p.marca !== producto.marca &&
      p.categoria === producto.categoria,
  );
  return [...mismaMarca, ...mismaCategoria].slice(0, 4);
}

export default async function PaginaProducto({ params }: Parametros) {
  const { slug } = await params;
  const producto = buscarProducto(slug);
  if (!producto) notFound();

  const relacionados = relacionadosDe(producto);

  return (
    <>
      <Header />
      <main id="contenido" className="pt-[72px]">
        <DetalleProducto producto={producto} relacionados={relacionados} />
      </main>
      <Footer />

      <CartDrawer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productoJsonLd(producto)),
        }}
      />
    </>
  );
}
