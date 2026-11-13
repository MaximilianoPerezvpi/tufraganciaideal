"use client";

import { useState } from "react";
import { linkWhatsApp } from "@/lib/site";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";

/**
 * "Armá tu caja surtida": el revendedor elige cuántas unidades de cada
 * modelo quiere (dentro de UNA línea: las líneas no se mezclan) y la web
 * calcula unidades y total, y arma el mensaje de WhatsApp.
 *
 * Reglas comerciales (las pasó la tienda):
 *   - Mínimo mayorista: MINIMO unidades.
 *   - Los precios publicados valen para la caja estándar de CAJA unidades.
 *     Con menos (de MINIMO a CAJA - 1) el precio se confirma por WhatsApp.
 * Los datos de cada línea vienen de OfertasMayoristas (servidor), que suma
 * el precio de tienda cuando el perfume está en el catálogo.
 */

export const MINIMO = 6;
export const CAJA = 12;
const MAXIMO_POR_MODELO = 48;

export type ModeloSurtido = { nombre: string; precio: number; precioTienda?: number };
export type LineaSurtida = { id: string; titulo: string; casa: string; modelos: ModeloSurtido[] };

function monto(valor: number): string {
  return `$${new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(valor)}`;
}

function mensaje(linea: LineaSurtida, elegidos: [ModeloSurtido, number][], unidades: number, total: number) {
  const detalle = elegidos
    .map(([m, n]) => `- ${n}x ${linea.casa} ${m.nombre} (${monto(m.precio)} c/u)`)
    .join("\n");
  const aviso =
    unidades < CAJA
      ? `\n\nSon menos de ${CAJA} unidades: ¿me confirman el precio para esta cantidad?`
      : "";
  return `¡Hola! Quiero armar una caja surtida de ${linea.titulo} (sección mayoristas):\n${detalle}\n\nTotal: ${unidades} unidades · ${monto(total)}.${aviso} ¿Me confirman disponibilidad?`;
}

export default function ArmadorCajaSurtida({ lineas }: { lineas: LineaSurtida[] }) {
  const [lineaId, setLineaId] = useState(lineas[0]?.id);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});

  const linea = lineas.find((l) => l.id === lineaId) ?? lineas[0];
  if (!linea) return null;

  const clave = (m: ModeloSurtido) => `${linea.id}:${m.nombre}`;
  const elegidos = linea.modelos
    .map((m) => [m, cantidades[clave(m)] ?? 0] as [ModeloSurtido, number])
    .filter(([, n]) => n > 0);
  const unidades = elegidos.reduce((s, [, n]) => s + n, 0);
  const total = elegidos.reduce((s, [m, n]) => s + m.precio * n, 0);

  // Suma sobre el estado anterior: clics rápidos no se pierden.
  const ajustar = (m: ModeloSurtido, delta: number) =>
    setCantidades((c) => {
      const k = clave(m);
      return { ...c, [k]: Math.max(0, Math.min(MAXIMO_POR_MODELO, (c[k] ?? 0) + delta)) };
    });

  // Completa hasta la caja de 12 repartiendo de a una unidad entre modelos.
  const completarCaja = () => {
    const faltan = CAJA - (unidades % CAJA || CAJA);
    if (faltan <= 0) return;
    const nuevas = { ...cantidades };
    for (let i = 0; i < faltan; i++) {
      const m = linea.modelos[i % linea.modelos.length];
      nuevas[clave(m)] = (nuevas[clave(m)] ?? 0) + 1;
    }
    setCantidades(nuevas);
  };

  let estado: { texto: string; tono: string };
  if (unidades === 0) {
    estado = { texto: `Elegí los modelos. Mínimo mayorista: ${MINIMO} unidades.`, tono: "text-arena" };
  } else if (unidades < MINIMO) {
    estado = { texto: `Te faltan ${MINIMO - unidades} para el mínimo de ${MINIMO} unidades.`, tono: "text-arena" };
  } else if (unidades < CAJA) {
    estado = {
      texto: `Llevás ${unidades} unidades. Los precios publicados son para la caja de ${CAJA}: con menos, te confirmamos el precio por WhatsApp.`,
      tono: "text-champan",
    };
  } else {
    estado = { texto: `Caja de ${unidades} unidades: aplican los precios publicados.`, tono: "text-vetiver" };
  }

  return (
    <div className="rounded-2xl border border-champan/30 bg-carbon p-5 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker">Cajas surtidas</p>
          <h3 className="mt-2 font-display text-2xl font-light text-marfil md:text-3xl">
            Armá tu caja surtida
          </h3>
          <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-arena">
            Combiná modelos de una misma línea y mirá el total al instante.
            Cada línea se arma por separado.
          </p>
        </div>
        <div role="tablist" aria-label="Línea" className="flex flex-wrap gap-2">
          {lineas.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={l.id === linea.id}
              onClick={() => setLineaId(l.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                l.id === linea.id
                  ? "border-champan bg-champan text-noche"
                  : "border-borde text-arena hover:border-champan/60 hover:text-marfil"
              }`}
            >
              {l.titulo}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 divide-y divide-borde/70 rounded-xl border border-borde/70 bg-noche/40">
        {linea.modelos.map((m) => {
          const n = cantidades[clave(m)] ?? 0;
          return (
            <li key={m.nombre} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm text-marfil">
                  <span className="text-arena">{linea.casa}</span> {m.nombre}
                </p>
                <p className="cifras mt-0.5 text-micro text-arena">
                  <span className="text-champan">{monto(m.precio)}</span> c/u
                  {m.precioTienda && m.precioTienda > m.precio && (
                    <> · en tienda {monto(m.precioTienda)}</>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center rounded-full border border-borde">
                <button
                  type="button"
                  onClick={() => ajustar(m, -1)}
                  disabled={n === 0}
                  aria-label={`Quitar una unidad de ${m.nombre}`}
                  className="h-9 w-9 text-arena transition-colors hover:text-marfil disabled:opacity-30 disabled:hover:text-arena"
                >
                  −
                </button>
                <span className="cifras w-7 text-center text-sm text-marfil" aria-live="polite">
                  {n}
                </span>
                <button
                  type="button"
                  onClick={() => ajustar(m, 1)}
                  disabled={n >= MAXIMO_POR_MODELO}
                  aria-label={`Agregar una unidad de ${m.nombre}`}
                  className="h-9 w-9 text-arena transition-colors hover:text-marfil disabled:opacity-30 disabled:hover:text-arena"
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="cifras text-marfil">
            <span className="font-display text-3xl text-champan">{monto(total)}</span>{" "}
            <span className="text-sm text-arena">· {unidades} {unidades === 1 ? "unidad" : "unidades"}</span>
          </p>
          <p className={`mt-1 max-w-[52ch] text-sm leading-relaxed ${estado.tono}`} aria-live="polite">
            {estado.texto}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-micro">
            {unidades % CAJA !== 0 && (
              <button type="button" onClick={completarCaja} className="text-champan underline underline-offset-4 hover:text-oro-claro">
                Completar caja de {CAJA}
              </button>
            )}
            {unidades > 0 && (
              <button
                type="button"
                onClick={() => setCantidades((c) => Object.fromEntries(Object.entries(c).filter(([k]) => !k.startsWith(`${linea.id}:`))))}
                className="text-arena underline underline-offset-4 hover:text-marfil"
              >
                Vaciar
              </button>
            )}
          </div>
        </div>

        {unidades >= MINIMO ? (
          <BotonPedidoWhatsApp
            href={linkWhatsApp(mensaje(linea, elegidos, unidades, total))}
            origen="mayoristas-caja"
            className="w-full shrink-0 px-7 py-4 md:w-auto"
          >
            Pedir esta caja por WhatsApp
          </BotonPedidoWhatsApp>
        ) : (
          <span className="flex w-full shrink-0 cursor-not-allowed items-center justify-center rounded-full border border-borde px-7 py-4 text-sm text-arena md:w-auto">
            Mínimo {MINIMO} unidades
          </span>
        )}
      </div>
    </div>
  );
}
