import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Catalogo from "@/components/Catalogo";
import {
  CATEGORIA_DESDE_PARAM,
  GENERO_DESDE_PARAM,
  FAMILIA_DESDE_PARAM,
} from "@/lib/catalogoFiltros";
import { site } from "@/lib/site";
import { catalogoJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Catálogo",
  description: site.descripcion,
  alternates: { canonical: "/catalogo" },
};

type SearchParams = Promise<{
  categoria?: string;
  genero?: string;
  familia?: string;
}>;

/**
 * Catálogo completo, como página propia (antes vivía en el home).
 * `<Catalogo/>` no se toca: es el mismo componente con sus filtros,
 * animaciones y Vista Rápida de siempre. Esta página solo lee los query
 * params del lado del servidor y le pasa el filtro inicial ya resuelto —
 * así el HTML sigue prerenderizado entero (ver el comentario en
 * `Catalogo.tsx` sobre por qué NO usa `useSearchParams`, y en
 * `src/lib/catalogoFiltros.ts` sobre por qué esos mapeos NO viven en
 * Catalogo.tsx pese a ser solo para esto).
 */
export default async function PaginaCatalogo({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        <div className="marco pt-10">
          <p className="kicker">Catálogo completo</p>
          <h1 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Catálogo Oficial de Fragancias
          </h1>
        </div>

        <Catalogo
          categoriaInicial={CATEGORIA_DESDE_PARAM[params.categoria ?? ""] ?? "todos"}
          generoInicial={GENERO_DESDE_PARAM[params.genero ?? ""] ?? "todos"}
          familiaInicial={FAMILIA_DESDE_PARAM[params.familia ?? ""] ?? "todas"}
        />
      </main>
      <Footer />

      <CartDrawer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogoJsonLd()) }}
      />
    </>
  );
}
