import Image from "next/image";
import { productos } from "@/data/productos";
import { linkWhatsApp } from "@/lib/site";
import ArmadorCajaSurtida, { CAJA, MINIMO, type LineaSurtida } from "./ArmadorCajaSurtida";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";

/**
 * OFERTAS MAYORISTAS PUBLICADAS (precios en UYU, pasados por la tienda).
 * Para cambiar un precio o sumar una oferta, editá OFERTAS: el total de la
 * caja se calcula solo (unitario x unidades).
 *
 * `referencia` = slugs del catálogo minorista: si existen, se muestra su
 * precio al público como referencia de margen (sale de productos.ts, así
 * queda sincronizado con la lista de precios).
 *
 * Cajas surtidas: LINEAS_SURTIDAS (una caja por línea, no se mezclan).
 *
 * Fotos: public/mayoristas/. `imagen.encuadre` = "cover" para fotos de
 * ambiente (llenan el recuadro) o "contain" para fotos con fondo blanco.
 * Algunas fueron generadas con IA: por eso el aviso AVISO_IA de la sección.
 */

type Imagen = { src: string; alt: string; encuadre: "cover" | "contain" };

type Escala = { unidades: number; precioUnitario: number; etiqueta: string; caja: boolean };

type Oferta = {
  id: string;
  casa: string;
  nombre: string;
  modelos?: string[];
  nota?: string;
  escalas: Escala[];
  referencia?: string[];
  imagen?: Imagen;
};

const OFERTAS: Oferta[] = [
  {
    id: "hawas-ice",
    casa: "Rasasi",
    nombre: "Hawas Ice",
    escalas: [{ unidades: 12, precioUnitario: 2200, etiqueta: "Caja cerrada x 12", caja: true }],
    referencia: ["rasasi-hawas-ice"],
    imagen: { src: "/mayoristas/rasasi-hawas-ice-caja.webp", alt: "Caja de 12 Rasasi Hawas Ice", encuadre: "cover" },
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
    imagen: { src: "/mayoristas/afnan-supremacy-collectors-caja.webp", alt: "Caja de Afnan Supremacy Collector's Edition", encuadre: "cover" },
  },
  {
    id: "odyssey",
    casa: "Armaf",
    nombre: "Odyssey",
    modelos: ["Mandarin Sky", "Aqua", "Mega", "Nexus"],
    nota: "Caja surtida: podés combinar los modelos, no hace falta que sean los 12 iguales. También podés armarla arriba, modelo por modelo.",
    escalas: [{ unidades: 12, precioUnitario: 1700, etiqueta: "Caja x 12 (surtida)", caja: true }],
    referencia: ["armaf-odyssey-mandarinsky", "armaf-odyssey-aqua", "armaf-odyssey-mega"],
    imagen: { src: "/mayoristas/armaf-odyssey-lineup.webp", alt: "Armaf Odyssey Mandarin Sky, Aqua, Mega y Nexus juntos", encuadre: "cover" },
  },
  {
    id: "club-de-nuit-intense-man",
    casa: "Armaf",
    nombre: "Club de Nuit Intense Man",
    escalas: [{ unidades: 12, precioUnitario: 1650, etiqueta: "Caja cerrada x 12", caja: true }],
    referencia: ["armaf-club-de-nuit-intense-men"],
    imagen: { src: "/mayoristas/armaf-club-de-nuit-intense-man.webp", alt: "Armaf Club de Nuit Intense Man con su caja", encuadre: "contain" },
  },
];

type ModeloBase = { nombre: string; precio: number; referencia?: string; imagen?: string };

const LINEAS_SURTIDAS: (Omit<LineaSurtida, "modelos"> & { modelos: ModeloBase[] })[] = [
  {
    id: "afnan-turathi",
    titulo: "Afnan y Turathi",
    casa: "Afnan",
    modelos: [
      { nombre: "9PM", precio: 2250, referencia: "afnan-9pm", imagen: "/mayoristas/afnan-9pm.webp" },
      { nombre: "9PM Night Out", precio: 2800, imagen: "/mayoristas/afnan-9pm-night-out.webp" },
      { nombre: "9AM Dive", precio: 2350, imagen: "/mayoristas/afnan-9am-dive.webp" },
      { nombre: "9PM Rebel", precio: 2500, imagen: "/mayoristas/afnan-9pm-rebel.webp" },
      { nombre: "9PM Pour Femme", precio: 2500, imagen: "/mayoristas/afnan-9pm-pour-femme.webp" },
      { nombre: "Turathi Blue", precio: 2450, imagen: "/mayoristas/afnan-turathi-blue.webp" },
      { nombre: "Turathi Electric", precio: 2450, imagen: "/mayoristas/afnan-turathi-electric.webp" },
    ],
  },
  {
    id: "odyssey",
    titulo: "Armaf Odyssey",
    casa: "Armaf",
    imagen: {
      src: "/mayoristas/armaf-odyssey-lineup.webp",
      alt: "Armaf Odyssey Mandarin Sky, Aqua, Mega y Nexus juntos",
    },
    modelos: [
      { nombre: "Odyssey Mandarin Sky", precio: 1700, referencia: "armaf-odyssey-mandarinsky" },
      { nombre: "Odyssey Aqua", precio: 1700, referencia: "armaf-odyssey-aqua" },
      { nombre: "Odyssey Mega", precio: 1700, referencia: "armaf-odyssey-mega" },
      { nombre: "Odyssey Nexus", precio: 1700 },
    ],
  },
];

/** Suma el precio de tienda (si el perfume está en el catálogo). */
function lineasConReferencia(): LineaSurtida[] {
  return LINEAS_SURTIDAS.map((l) => ({
    ...l,
    modelos: l.modelos.map(({ referencia, ...m }) => ({
      ...m,
      precioTienda: productos.find((p) => p.slug === referencia)?.precio_uyu,
    })),
  }));
}

const AVISO_IA =
  "Algunas de las imágenes de esta sección fueron generadas con inteligencia artificial (IA), por lo que pueden presentar pequeños detalles o variaciones menores respecto al producto físico real.";

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
        <p className="mt-4 max-w-[64ch] rounded-xl border border-champan/30 bg-champan/[0.06] px-4 py-3 text-sm leading-relaxed text-marfil">
          <strong className="font-semibold text-champan">No todos los productos requieren {CAJA} unidades.</strong>{" "}
          El mínimo mayorista es de {MINIMO} unidades: si querés otra cantidad o
          formato,{" "}
          <a
            href={linkWhatsApp(`¡Hola! Quiero consultar por una compra mayorista con otra cantidad o formato (mínimo ${MINIMO} unidades).`)}
            target="_blank"
            rel="noopener noreferrer"
            data-wa-origen="mayoristas-oferta"
            className="text-champan underline underline-offset-4 hover:text-oro-claro"
          >
            consultanos por WhatsApp
          </a>
          .
        </p>

        <p className="mt-3 flex max-w-[64ch] gap-2 text-micro leading-relaxed text-arena">
          <span aria-hidden className="text-champan">✦</span>
          <span>{AVISO_IA}</span>
        </p>

        <div className="mt-10">
          <ArmadorCajaSurtida lineas={lineasConReferencia()} />
        </div>

        <h3 className="mt-14 font-display text-2xl font-light text-marfil">Cajas cerradas</h3>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {OFERTAS.map((o) => {
            const publico = precioPublico(o);
            const mejor = Math.min(...o.escalas.map((e) => e.precioUnitario));
            return (
              <article
                key={o.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-borde bg-carbon p-6 transition-colors hover:border-champan/40 md:p-7"
              >
                {o.imagen && (
                  <div
                    className={`relative -mx-6 -mt-6 mb-6 aspect-[16/9] md:-mx-7 md:-mt-7 ${
                      o.imagen.encuadre === "contain" ? "bg-white" : "bg-humo"
                    }`}
                  >
                    <Image
                      src={o.imagen.src}
                      alt={o.imagen.alt}
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
                      className={o.imagen.encuadre === "contain" ? "object-contain p-3" : "object-cover"}
                    />
                  </div>
                )}
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
