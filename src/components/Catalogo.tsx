"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  categorias,
  disponibilidad,
  familiasOlfativas,
  generos,
  productos,
  type Categoria,
  type Concentracion,
  type FamiliaOlfativa,
  type Genero,
} from "@/data/productos";
import { linkPerfumeFueraDeCatalogo } from "@/lib/pedidoWhatsApp";
import { normalizar } from "@/lib/format";
import { programarBusqueda } from "@/lib/analytics";
import TarjetaProducto from "./TarjetaProducto";

// Orden por defecto (INTERNO, nunca se muestra): primero lo que hay en
// stock físico, así se vende antes; después lo que se consigue por encargo.
// La web no revela esta distinción: todas las tarjetas son iguales.
const PESO_DISPONIBILIDAD = { stock: 0, pedido: 1, agotado: 2 } as const;

// Tarjetas por tanda: 226 tarjetas animadas de una vez pesan en un celular.
const TANDA = 24;

/**
 * Invitación a cotizar por WhatsApp: perfume puntual que no está en catálogo.
 * Con `termino` arma el mensaje citando la búsqueda; sin él, es la invitación
 * genérica fija al final de la grilla.
 */
function BannerConsultaWhatsApp({ termino }: { termino?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-oro-vivo/25 bg-carbon px-6 py-12 text-center sm:px-12">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-oro-vivo/15 blur-[100px]"
      />
      <p className="kicker relative">Fuera de catálogo</p>
      <h3 className="relative mt-3 font-display text-[1.6rem] font-light leading-tight text-marfil sm:text-[2rem]">
        ¿No encontraste el perfume que buscabas?
      </h3>
      <p className="relative mx-auto mt-3 max-w-[46ch] text-arena">
        Contamos con una variedad de fragancias mucho más amplia. Escribinos
        por WhatsApp y haremos lo posible por conseguir el perfume que estás
        buscando.
      </p>
      <a
        href={linkPerfumeFueraDeCatalogo(termino)}
        target="_blank"
        rel="noopener noreferrer"
        data-wa-origen="catalogo-consulta"
        className="relative mt-8 inline-flex items-center gap-2.5 rounded-full bg-champan px-8 py-4 font-medium text-noche transition-all duration-200 hover:-translate-y-0.5 hover:bg-oro-claro hover:shadow-[0_10px_30px_-10px_var(--color-oro-vivo)]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 1.67c2.23 0 4.32.87 5.9 2.44a8.25 8.25 0 0 1 2.43 5.8c0 4.55-3.7 8.24-8.33 8.24a8.3 8.3 0 0 1-4.22-1.15l-.3-.18-3.13.82.84-3.05-.2-.32a8.2 8.2 0 0 1-1.27-4.4c0-4.55 3.7-8.2 8.28-8.2Zm-4.6 4.8c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.7 2.7 4.19 3.68 2.07.82 2.49.66 2.94.62.45-.04 1.46-.6 1.66-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.24-.63.8-.78.97-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.36-.77-1.86-.2-.48-.4-.42-.56-.43Z" />
        </svg>
        Consultar por WhatsApp
      </a>
      <p className="relative mt-4 text-micro text-arena">
        Disponibilidad, precio y plazo sujetos a confirmación.
      </p>
    </div>
  );
}

type Orden = "destacados" | "menor-precio" | "mayor-precio";

const CONCENTRACIONES: Concentracion[] = ["EDT", "EDP", "Parfum", "Elixir"];

const ORDENES: { id: Orden; etiqueta: string }[] = [
  { id: "destacados", etiqueta: "Destacados" },
  { id: "menor-precio", etiqueta: "Menor precio" },
  { id: "mayor-precio", etiqueta: "Mayor precio" },
];

/** Marcas presentes en el catálogo, sin repetir y en orden alfabético. */
const MARCAS = Array.from(new Set(productos.map((p) => p.casa))).sort((a, b) =>
  a.localeCompare(b, "es"),
);

/** Clase compartida por los tres controles del toolbar (selects e input). */
const CONTROL =
  "h-11 rounded-full border border-borde bg-carbon px-4 text-sm text-marfil outline-none transition-colors focus-visible:border-champan hover:border-arena";

type CatalogoProps = {
  /** Estado inicial de cada filtro. Los pasa `src/app/catalogo/page.tsx`
   * (server component) leyendo `searchParams`, en vez de que este
   * componente llame a `useSearchParams()` él mismo: ese hook obliga a
   * Next.js a descartar el HTML estático de TODO lo que envuelve y
   * renderizarlo solo del lado del cliente (visto en build: el `<Suspense>`
   * alrededor caía en BAILOUT_TO_CLIENT_SIDE_RENDERING — la grilla entera
   * desaparecía del HTML servido, aunque en el navegador se viera bien).
   * Recibir el valor ya resuelto como prop evita el problema sin tocar
   * nada de la lógica de filtros/animaciones de acá abajo. */
  categoriaInicial?: Categoria | "todos";
  generoInicial?: Genero | "todos";
  familiaInicial?: FamiliaOlfativa | "todas";
};

/** Grilla del catálogo: búsqueda, filtros por familia/marca/concentración y orden. */
export default function Catalogo({
  categoriaInicial = "todos",
  generoInicial = "todos",
  familiaInicial = "todas",
}: CatalogoProps = {}) {
  const [filtro, setFiltro] = useState<Categoria | "todos">(categoriaInicial);
  const [marca, setMarca] = useState<string>("todas");
  const [concentracion, setConcentracion] = useState<Concentracion | "todas">(
    "todas",
  );
  const [orden, setOrden] = useState<Orden>("destacados");
  const [busqueda, setBusqueda] = useState("");
  const [genero, setGenero] = useState<Genero | "todos">(generoInicial);
  const [familia, setFamilia] = useState<FamiliaOlfativa | "todas">(familiaInicial);

  const hayFiltrosActivos =
    filtro !== "todos" ||
    marca !== "todas" ||
    concentracion !== "todas" ||
    busqueda.trim() !== "" ||
    genero !== "todos" ||
    familia !== "todas";

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());

    const filtrados = productos.filter((p) => {
      if (filtro !== "todos" && p.categoria !== filtro) return false;
      if (marca !== "todas" && p.casa !== marca) return false;
      if (concentracion !== "todas" && p.concentracion !== concentracion)
        return false;
      if (genero !== "todos" && p.genero !== genero) return false;
      if (familia !== "todas" && p.familiaOlfativa !== familia) return false;
      if (texto) {
        const enTexto = normalizar(`${p.casa} ${p.nombre}`);
        if (!enTexto.includes(texto)) return false;
      }
      return true;
    });

    return [...filtrados].sort((a, b) => {
      if (orden === "menor-precio") return a.precio_uyu - b.precio_uyu;
      if (orden === "mayor-precio") return b.precio_uyu - a.precio_uyu;
      // "Destacados": orden interno (ver PESO_DISPONIBILIDAD) y destacados,
      // sin romper el orden del archivo de datos.
      return (
        PESO_DISPONIBILIDAD[disponibilidad(a)] -
          PESO_DISPONIBILIDAD[disponibilidad(b)] ||
        Number(b.destacado ?? false) - Number(a.destacado ?? false)
      );
    });
  }, [
    filtro,
    marca,
    concentracion,
    orden,
    busqueda,
    genero,
    familia,
  ]);

  // Analítica: qué buscan (y si no encuentran nada, qué perfume falta).
  useEffect(
    () => programarBusqueda(busqueda, visibles.length, "catalogo"),
    [busqueda, visibles.length],
  );

  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const filtrosFinosActivos = [
    marca !== "todas",
    concentracion !== "todas",
    orden !== "destacados",
    genero !== "todos",
    familia !== "todas",
  ].filter(Boolean).length;

  // Cada cambio de filtro u orden vuelve a la primera tanda.
  const [limite, setLimite] = useState(TANDA);
  useEffect(() => {
    setLimite(TANDA);
  }, [visibles]);

  function limpiarFiltros() {
    setFiltro("todos");
    setMarca("todas");
    setConcentracion("todas");
    setOrden("destacados");
    setBusqueda("");
    setGenero("todos");
    setFamilia("todas");
  }

  return (
    <section id="catalogo" className="scroll-mt-24 pb-20 pt-6 md:pb-28">
      <div className="marco">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-borde pb-6">
          <div>
            {/* El título (h1) lo pone la página /catalogo. */}
            <p className="max-w-[52ch] text-arena">
              Perfumes árabes y de diseñador 100% originales. Consultá por
              WhatsApp la disponibilidad, el precio y el tiempo de entrega de
              cualquier fragancia: te asesoramos personalmente. Los precios
              pueden variar.
            </p>
            {/* Aviso arriba: el banner completo de "¿No encontraste…?" queda
                al final de la grilla, muy lejos en un celular. */}
            <p className="mt-3 max-w-[52ch] text-sm text-arena">
              ¿No está el perfume que buscás?{" "}
              <a
                href={linkPerfumeFueraDeCatalogo()}
                target="_blank"
                rel="noopener noreferrer"
                data-wa-origen="catalogo-aviso"
                className="text-vetiver underline underline-offset-4 hover:text-marfil"
              >
                Consultanos por WhatsApp
              </a>{" "}
              y hacemos lo posible por conseguirlo.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filtrar por familia"
            className="flex flex-wrap gap-2"
          >
            {categorias.map((c) => {
              const activo = c.id === filtro;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFiltro(c.id)}
                  aria-pressed={activo}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    activo
                      ? "border-champan bg-champan/10 text-champan"
                      : "border-borde text-arena hover:border-arena hover:text-marfil"
                  }`}
                >
                  {c.etiqueta}
                </button>
              );
            })}

          </div>
        </div>

        {/* Buscador siempre a mano; en mobile, el resto de los filtros va
            plegado detrás de "Filtros" para que los perfumes se vean primero. */}
        <div className="mt-6 flex gap-3">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Buscar por nombre o marca</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-arena"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o marca…"
              className={`${CONTROL} w-full pl-11`}
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltrosAbiertos((v) => !v)}
            aria-expanded={filtrosAbiertos}
            aria-controls="filtros-catalogo"
            className={`${CONTROL} shrink-0 md:hidden`}
          >
            Filtros{filtrosFinosActivos > 0 ? ` (${filtrosFinosActivos})` : ""}
          </button>
        </div>

        <div
          id="filtros-catalogo"
          className={`${filtrosAbiertos ? "block" : "hidden"} md:block`}
        >
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="relative">
              <span className="sr-only">Filtrar por marca</span>
              <select
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className={`${CONTROL} appearance-none pr-9`}
              >
                <option value="todas">Todas las marcas</option>
                {MARCAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-arena"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>

            <label className="relative">
              <span className="sr-only">Filtrar por concentración</span>
              <select
                value={concentracion}
                onChange={(e) =>
                  setConcentracion(e.target.value as Concentracion | "todas")
                }
                className={`${CONTROL} appearance-none pr-9`}
              >
                <option value="todas">Toda concentración</option>
                {CONCENTRACIONES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-arena"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>

            <label className="relative">
              <span className="sr-only">Ordenar por</span>
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value as Orden)}
                className={`${CONTROL} appearance-none pr-9`}
              >
                {ORDENES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.etiqueta}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-arena"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          </div>

          {/* Filtros sensoriales: género y familia olfativa, en chips. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div role="group" aria-label="Filtrar por género" className="flex flex-wrap gap-2">
              {generos.map((g) => {
                const activo = g.id === genero;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGenero(g.id)}
                    aria-pressed={activo}
                    className={`rounded-full border px-3.5 py-1.5 text-micro transition-colors ${
                      activo
                        ? "border-champan bg-champan/10 text-champan"
                        : "border-borde text-arena hover:border-arena hover:text-marfil"
                    }`}
                  >
                    {g.etiqueta}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Filtrar por familia olfativa"
              className="flex flex-wrap gap-2"
            >
              {familiasOlfativas.map((f) => {
                const activo = f.id === familia;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFamilia(f.id)}
                    aria-pressed={activo}
                    className={`rounded-full border px-3.5 py-1.5 text-micro transition-colors ${
                      activo
                        ? "border-oro-vivo bg-oro-vivo/10 text-oro-vivo"
                        : "border-borde text-arena hover:border-arena hover:text-marfil"
                    }`}
                  >
                    {f.etiqueta}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <h2 className="sr-only">Perfumes</h2>
        {/* `initial={false}`: la primera tanda llega visible desde el HTML
            (antes arrancaba en opacity 0 y la foto principal esperaba al JS).
            Sin `layout`: medir cada tarjeta bloqueaba el hilo en celulares;
            al filtrar, las tarjetas solo aparecen y desaparecen. */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibles.slice(0, limite).map((p, i) => (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <TarjetaProducto producto={p} prioridad={i < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visibles.length > limite && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setLimite((l) => l + TANDA)}
              className="rounded-full border border-champan/50 px-8 py-3 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
            >
              Ver más perfumes ({visibles.length - limite} restantes)
            </button>
          </div>
        )}

        {familia !== "todas" && (
          <p className="mt-6 text-center text-micro text-arena">
            El filtro por familia incluye solo los perfumes con ficha olfativa
            verificada. ¿Buscás algo puntual? Consultanos por WhatsApp.
          </p>
        )}

        {visibles.length === 0 ? (
          <div className="mt-16">
            <p className="text-center text-marfil">
              No encontramos perfumes con ese criterio.
            </p>
            <div className="mx-auto mt-8 max-w-2xl">
              <BannerConsultaWhatsApp termino={busqueda.trim() || undefined} />
            </div>
            {hayFiltrosActivos && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="rounded-full border border-champan/50 px-6 py-2.5 text-sm text-champan transition-colors hover:bg-champan hover:text-noche"
                >
                  Quitar filtros
                </button>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mt-20 max-w-2xl"
          >
            <BannerConsultaWhatsApp />
          </motion.div>
        )}
      </div>
    </section>
  );
}
