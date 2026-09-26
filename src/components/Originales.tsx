"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Propuesta de valor: por qué comprar acá y no en cualquier lado.
 *
 * Es un proceso real de tres pasos (de dónde viene el frasco hasta que llega
 * a tu casa), por eso acá sí van numerados. El verde vetiver se usa SOLO en
 * esta sección y en el badge de las tarjetas: el ojo aprende que
 * "verde = original verificado".
 */

const PASOS = [
  {
    titulo: "Importación directa",
    texto:
      "Compramos a distribuidores autorizados. Cada frasco llega con su celofán de fábrica, código de lote y caja intacta.",
  },
  {
    titulo: "Control antes de publicarlo",
    texto:
      "Revisamos lote, serie y terminación del frasco contra la referencia de la casa. Si algo no cierra, no se vende.",
  },
  {
    titulo: "Te llega sellado",
    texto:
      "Lo recibís sin abrir, como salió de fábrica. Si al abrirlo no es lo que decimos, te devolvemos la plata.",
  },
];

export default function Originales() {
  return (
    <section
      id="originales"
      className="scroll-mt-24 border-y border-borde bg-carbon py-20 md:py-28"
    >
      <div className="marco">
        <div className="max-w-[52ch]">
          <p className="kicker">Garantía</p>
          <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Sellado, con lote y con garantía.
          </h2>
          <p className="mt-4 text-arena">
            En perfumería el problema no es el precio, es saber qué estás
            comprando. Todo lo que está en el catálogo es frasco original
            cerrado: ni réplicas, ni testers, ni frascos abiertos.
          </p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-borde bg-borde md:grid-cols-3">
          {PASOS.map((paso, i) => (
            <motion.li
              key={paso.titulo}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
              className="bg-carbon p-6"
            >
              <span aria-hidden className="cifras block text-sm text-vetiver">
                {i + 1}
              </span>
              <span aria-hidden className="mt-3 block h-px w-8 bg-vetiver/40" />
              <h3 className="mt-4 font-display text-[1.2rem] leading-snug text-marfil">
                {paso.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-arena">
                {paso.texto}
              </p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col items-start gap-5 rounded-2xl border border-vetiver/30 bg-vetiver/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[52ch] text-marfil">
            {/* TODO: ajustá el plazo de devolución al que realmente vayas a sostener. */}
            Tenés <span className="cifras text-vetiver">7 días</span> para
            devolver el frasco sin abrir si te arrepentiste, y devolución total
            si alguna vez recibís algo que no sea original.
          </p>
          <Link
            href="#catalogo"
            className="shrink-0 rounded-full border border-vetiver px-6 py-3 text-sm text-vetiver transition-colors hover:bg-vetiver hover:text-noche"
          >
            Ver perfumes en stock
          </Link>
        </div>
      </div>
    </section>
  );
}
