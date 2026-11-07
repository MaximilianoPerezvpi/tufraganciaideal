import Link from "next/link";
import Header from "@/components/Header";
import Catalogo from "@/components/Catalogo";
import { productos, type Categoria } from "@/data/productos";

/**
 * Landing de categoría (/perfumes-arabes, /perfumes-de-disenador): título y
 * texto propios para Google + el mismo <Catalogo/> ya filtrado. No duplica
 * contenido: cada una lista solo su categoría y tiene su propio canonical.
 */
export default function PaginaCategoria({
  categoria,
  titulo,
  intro,
}: {
  categoria: Categoria;
  titulo: string;
  intro: string;
}) {
  const cantidad = productos.filter((p) => p.categoria === categoria).length;
  const marcas = new Set(
    productos.filter((p) => p.categoria === categoria).map((p) => p.casa),
  ).size;

  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        <div className="marco pt-10">
          <nav aria-label="Ubicación" className="text-micro text-arena">
            <Link href="/" className="hover:text-marfil">Inicio</Link>
            {" / "}
            <Link href="/catalogo" className="hover:text-marfil">Catálogo</Link>
            {" / "}
            <span className="text-marfil">{titulo}</span>
          </nav>
          <h1 className="mt-4 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            {titulo} en Uruguay
          </h1>
          <p className="mt-4 max-w-[60ch] leading-relaxed text-arena">{intro}</p>
          <p className="cifras mt-3 text-micro text-arena">
            {cantidad} fragancias · {marcas} marcas
          </p>
        </div>

        <Catalogo categoriaInicial={categoria} />
      </main>
    </>
  );
}
