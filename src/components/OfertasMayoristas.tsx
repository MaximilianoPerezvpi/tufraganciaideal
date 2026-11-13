import { productos } from "@/data/productos";
import { linkWhatsApp } from "@/lib/site";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";

/**
 * OFERTAS MAYORISTAS PUBLICADAS (precios en UYU, pasados por la tienda).
 * Para cambiar un precio o sumar una oferta, editá OFERTAS: el total de la
 * caja se calcula solo (unitario x unidades).
 *
 * `referencia` = slugs del catálogo minorista: si existen, se muestra su
 * precio al público como referencia de margen (sale de productos.ts, así
 * queda sincronizado con la lista de precios).
 */

type Escala = { unidades: number; precioUnitario: number; etiqueta: string; caja: boolean };

type Oferta = {
  id: string;
  casa: string;
  nombre: string;
  modelos?: string[];
  nota?: string;
  escalas: Escala[];
  referencia?: string[];
};

const OFERTAS: Oferta[] = [
  {
    id: "hawas-ice",
    casa: "Rasasi",
    nombre: "Hawas Ice",
    escalas: [{ unidades: 12, precioUnitario: 2200, etiqueta: "Caja cerrada x 12", caja: true }],
    referencia: ["rasasi-hawas-ice"],
  },
  {
    id: "supremacy-collectors",
    casa: "Afnan",
    nombre: "Supremacy Collector's Edition",
    nota: "Escala flexible: también desde 3 unidades.",
    escalas: [
      { unidades: 12, precioUnitario: 2590, etiqueta: "Caja cerrada x 12", caja: true },
      { unidades: 3, precioUnitario: 2690, etiqueta: "Desde 3 unidades", caja: false },
    ],
  },
  {
    id: "odyssey",
    casa: "Armaf",
    nombre: "Odyssey",
    modelos: ["Mandarin Sky", "Aqua", "Mega", "Nexus"],
    nota: "Caja surtida: podés combinar los modelos, no hace falta que sean los 12 iguales.",
    escalas: [{ unidades: 12, precioUnitario: 1700, etiqueta: "Caja x 12 (surtida)", caja: true }],
    referencia: ["armaf-odyssey-mandarinsky", "armaf-odyssey-aqua", "armaf-odyssey-mega"],
  },
  {
    id: "interesse-man",
    casa: "Lattafa",
    nombre: "Interesse Man",
    escalas: [{ unidades: 12, precioUnitario: 1650, etiqueta: "Caja cerrada x 12", caja: true }],
  },
];

function monto(valor: number): string {
  return `$${new Intl.NumberFormat("es-UY", { maximumFractionDigits: 0 }).format(valor)}`;
}

/** Menor precio al público de las referencias que están en el catálogo. */
function precioPublico(o: Oferta): number | undefined {
  const precios = productos
    .filter((p) => o.referencia?.includes(p.slug))
    .map((p) => p.precio_uyu);
  return precios.length ? Math.min(...precios) : undefined;
}

function mensaje(o: Oferta, e: Escala): string {
  const nombre = `${o.casa} ${o.nombre}`;
  if (e.caja) {
    const surtido = o.modelos ? ` (surtida entre ${o.modelos.join(", ")})` : "";
    return `¡Hola! Me interesa la caja de ${e.unidades} unidades de ${nombre}${surtido} a ${monto(e.precioUnitario)} c/u (total ${monto(e.precioUnitario * e.unidades)}) que vi en la sección mayoristas. ¿Me confirman disponibilidad y cómo seguimos?`;
  }
  return `¡Hola! Me interesa comprar ${nombre} desde ${e.unidades} unidades a ${monto(e.precioUnitario)} c/u, como vi en la sección mayoristas. Quisiera llevar ___ unidades. ¿Me confirman disponibilidad?`;
}

export default function OfertasMayoristas() {
  return (
    <section id="ofertas" className="scroll-mt-28 border-b border-borde py-16 md:py-24">
      <div className="marco">
        <p className="kicker">Ofertas mayoristas</p>
        <h2 className="mt-2 max-w-[22ch] font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
          Precios por caja para revender con margen
        </h2>
        <p className="mt-4 max-w-[60ch] text-arena">
          Comprá por caja a precio mayorista y vendé al precio de tienda.
          Elegí la oferta, escribinos por WhatsApp con el mensaje ya armado y
          te confirmamos disponibilidad.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {OFERTAS.map((o) => {
            const publico = precioPublico(o);
            const mejor = Math.min(...o.escalas.map((e) => e.precioUnitario));
            return (
              <article
                key={o.id}
                className="flex flex-col rounded-2xl border border-borde bg-carbon p-6 transition-colors hover:border-champan/40 md:p-7"
              >
                <p className="text-micro uppercase tracking-[0.18em] text-champan">{o.casa}</p>
                <h3 className="mt-1 font-display text-2xl font-light text-marfil">{o.nombre}</h3>
                {o.modelos && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Modelos disponibles">
                    {o.modelos.map((m) => (
                      <li key={m} className="rounded-full border border-borde px-3 py-1 text-micro text-marfil">
                        {m}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 space-y-3">
                  {o.escalas.map((e) => (
                    <div
                      key={e.etiqueta}
                      className="flex items-end justify-between gap-4 rounded-xl border border-borde/70 bg-noche/40 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-marfil">{e.etiqueta}</p>
                        {e.caja && (
                          <p className="cifras mt-0.5 text-micro text-arena">
                            Total caja: {monto(e.precioUnitario * e.unidades)}
                          </p>
                        )}
                      </div>
                      <p className="cifras text-right">
                        <span className="font-display text-2xl text-champan">{monto(e.precioUnitario)}</span>
                        <span className="block text-micro text-arena">por unidad</span>
                      </p>
                    </div>
                  ))}
                </div>

                {o.nota && <p className="mt-4 text-sm leading-relaxed text-arena">{o.nota}</p>}
                {publico && (
                  <p className="mt-3 text-sm text-arena">
                    En nuestra tienda se vende a{" "}
                    <span className="cifras text-marfil">{monto(publico)}</span>: hasta{" "}
                    <span className="cifras text-vetiver">{monto(publico - mejor)}</span> de diferencia por unidad.
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-2 pt-6">
                  {o.escalas.map((e) => (
                    <BotonPedidoWhatsApp
                      key={e.etiqueta}
                      href={linkWhatsApp(mensaje(o, e))}
                      origen="mayoristas-oferta"
                      className="w-full px-6 py-3.5"
                    >
                      {e.caja ? "Pedir la caja por WhatsApp" : `Pedir desde ${e.unidades} unidades`}
                    </BotonPedidoWhatsApp>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 max-w-[70ch] text-micro leading-relaxed text-arena">
          Precios en pesos uruguayos, por unidad, sujetos a disponibilidad. Los
          precios pueden variar: te los confirmamos por WhatsApp antes de
          pagar. ¿Buscás otros perfumes o cantidades?{" "}
          <a href="#cotizacion" className="text-champan underline underline-offset-4 hover:text-oro-claro">
            Pedí una cotización
          </a>
          .
        </p>
      </div>
    </section>
  );
}
