"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { productos } from "@/data/productos";
import { precio } from "@/lib/format";
import ImagenProducto from "./ImagenProducto";

const MAX_RESULTADOS = 6;

/**
 * Buscador en tiempo real por nombre o marca. Vive en el Header: en desktop
 * es un input siempre visible, en mobile es un ícono que despliega el input
 * (así no compite por espacio con el logo y el carrito).
 */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [abiertoMobile, setAbiertoMobile] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const resultados = useMemo(() => {
    if (q.length < 2) return [];
    return productos
      .filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) || p.casa.toLowerCase().includes(q),
      )
      .slice(0, MAX_RESULTADOS);
  }, [q]);

  const mostrarResultados = q.length >= 2;

  // Cierra al clickear afuera o con Escape.
  useEffect(() => {
    function alClickear(e: MouseEvent) {
      if (!contenedorRef.current?.contains(e.target as Node)) {
        setQuery("");
        setAbiertoMobile(false);
      }
    }
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setQuery("");
        setAbiertoMobile(false);
      }
    }
    document.addEventListener("mousedown", alClickear);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("mousedown", alClickear);
      document.removeEventListener("keydown", alTeclear);
    };
  }, []);

  function limpiar() {
    setQuery("");
    setAbiertoMobile(false);
  }

  return (
    <div ref={contenedorRef} className="relative">
      {/* Desktop: input siempre visible. */}
      <div className="hidden md:block">
        <CampoBusqueda
          value={query}
          onChange={setQuery}
          placeholder="Buscar perfume o marca..."
          className="w-56 lg:w-64"
        />
      </div>

      {/* Mobile: ícono que despliega el input. */}
      <div className="md:hidden">
        {abiertoMobile ? (
          <CampoBusqueda
            autoFocus
            value={query}
            onChange={setQuery}
            placeholder="Buscar..."
            className="w-[calc(100vw-6rem)] max-w-xs"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAbiertoMobile(true)}
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-arena transition-colors hover:text-marfil"
          >
            <IconoLupa className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {mostrarResultados && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-[min(92vw,22rem)] overflow-y-auto rounded-xl border border-borde bg-carbon shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
          {resultados.length === 0 ? (
            <p className="px-4 py-5 text-center text-sm text-arena">
              No encontramos nada para &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            <ul className="divide-y divide-borde">
              {resultados.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/producto/${p.slug}`}
                    onClick={limpiar}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-noche"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-humo">
                      <ImagenProducto
                        producto={p}
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-marfil">
                        {p.nombre}
                      </span>
                      <span className="block text-micro text-arena">
                        {p.casa}
                      </span>
                    </span>
                    <span className="cifras shrink-0 text-sm text-champan">
                      {precio(p.precio_uyu)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function CampoBusqueda({
  value,
  onChange,
  placeholder,
  className = "",
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      <IconoLupa className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-arena" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar perfume o marca"
        className="w-full rounded-full border border-borde bg-noche/60 py-2 pl-9 pr-3 text-sm text-marfil placeholder:text-arena/70 outline-none transition-colors focus:border-champan"
      />
    </div>
  );
}

function IconoLupa({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
