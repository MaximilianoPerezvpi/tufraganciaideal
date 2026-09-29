import type { Resena } from "@/data/resenas";
import { buscarProducto } from "@/data/productos";
import { fechaResena } from "@/lib/resenas";
import Estrellas from "./Estrellas";

/** Una reseña real. `mostrarPerfume` en el home, donde se mezclan productos. */
export default function TarjetaResena({
  resena,
  mostrarPerfume = false,
}: {
  resena: Resena;
  mostrarPerfume?: boolean;
}) {
  const producto = resena.slug ? buscarProducto(resena.slug) : undefined;

  return (
    <article className="flex flex-col rounded-2xl border border-borde bg-carbon p-6">
      <Estrellas estrellas={resena.estrellas} />
      {mostrarPerfume && producto && (
        <p className="mt-3 text-micro text-champan">
          {producto.casa} {producto.nombre}
        </p>
      )}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-arena">
        &ldquo;{resena.texto}&rdquo;
      </p>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-marfil">
          {resena.nombre}
          {resena.ciudad && <span className="text-arena/70"> · {resena.ciudad}</span>}
        </p>
        <p className="text-micro text-arena/70">{fechaResena(resena.fecha)}</p>
      </div>
      {resena.compraVerificada && (
        <p className="mt-2 text-micro text-vetiver">✓ Compra verificada</p>
      )}
    </article>
  );
}
