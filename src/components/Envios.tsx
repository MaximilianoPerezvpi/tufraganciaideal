"use client";

import { motion } from "framer-motion";
import { linkPerfumeFueraDeCatalogo } from "@/lib/pedidoWhatsApp";

/**
 * Logística: pagos y envíos.
 * ⚠️ TODO: ajustá precios de envío, agencias y horarios a tu operativa real.
 *
 * La web no cobra: todos los pagos se coordinan por WhatsApp una vez
 * confirmado el pedido. Mercado Pago NO está integrado en el sitio: es un
 * link de pago que se manda por WhatsApp.
 */

const PASOS_COMPRA = [
  "Elegís tu perfume en el catálogo.",
  "Nos escribís por WhatsApp con el botón del perfume (o sumás varios al carrito y los consultás en un solo mensaje).",
  "Te confirmamos disponibilidad, precio y tiempo de entrega.",
  "Coordinamos la entrega o el envío.",
  "Te enviamos el medio de pago que elijas.",
];

const PAGOS = [
  {
    nombre: "Transferencia bancaria",
    detalle: "Te pasamos los datos de la cuenta por WhatsApp al confirmar el pedido.",
  },
  {
    nombre: "Efectivo",
    detalle: "Cuando corresponda, según la forma de entrega que coordinemos.",
  },
  {
    nombre: "Mercado Pago",
    detalle: "Te enviamos un link de pago por WhatsApp una vez confirmado el pedido.",
  },
];

const ENVIOS = [
  {
    nombre: "Montevideo",
    detalle: "Delivery, o retiro coordinado sin costo.",
    plazo: "~24 h",
  },
  {
    nombre: "Interior del país",
    detalle: "Por agencia (DAC u otra, según tu localidad).",
    plazo: "24 a 72 h hábiles",
  },
  {
    nombre: "Retiro sin costo",
    detalle: "Coordinamos un punto de encuentro en Montevideo.",
    plazo: "Gratis",
  },
];

export default function Envios() {
  return (
    <section id="envios" className="scroll-mt-24 py-20 md:py-28">
      <div className="marco grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="kicker">Envíos y pagos</p>
          <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Cómo pagás y cómo te llega
          </h2>
          <p className="mt-4 max-w-[48ch] text-arena">
            Todas las compras se cierran por WhatsApp, con una persona: la web
            no cobra ni te pide datos de tarjeta.
          </p>

          <h3 className="mt-10 text-sm text-marfil">Cómo comprar</h3>
          <ol className="mt-4 space-y-3">
            {PASOS_COMPRA.map((paso, i) => (
              <li key={paso} className="flex gap-3 text-sm text-arena">
                <span className="cifras flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-champan/50 text-micro text-champan">
                  {i + 1}
                </span>
                <span className="pt-0.5">{paso}</span>
              </li>
            ))}
          </ol>

          <h3 className="mt-10 text-sm text-marfil">Formas de pago</h3>
          <dl className="mt-4 divide-y divide-borde border-y border-borde">
            {PAGOS.map((p) => (
              <div key={p.nombre} className="flex flex-wrap gap-x-6 gap-y-1 py-4">
                <dt className="min-w-[10rem] text-marfil">{p.nombre}</dt>
                <dd className="text-sm text-arena">{p.detalle}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <ul className="grid gap-4">
            {ENVIOS.map((e, i) => (
              <motion.li
                key={e.nombre}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="rounded-2xl border border-borde bg-carbon p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[1.25rem] text-marfil">
                    {e.nombre}
                  </h3>
                  <span className="cifras shrink-0 text-sm text-champan">
                    {e.plazo}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-arena">
                  {e.detalle}
                </p>
              </motion.li>
            ))}
          </ul>
          <p className="mt-4 text-micro text-arena">
            Plazos de envío una vez despachado el pedido. El tiempo de entrega
            de cada perfume te lo confirmamos por WhatsApp antes de cerrar la
            compra.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-8 rounded-2xl border border-champan/30 bg-champan/[0.06] p-6">
            <p className="text-marfil">
              ¿No encontraste el perfume que buscabas?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-arena">
              Contamos con una variedad de fragancias mucho más amplia.
              Escribinos y haremos lo posible por conseguirlo.
            </p>
            <a
              href={linkPerfumeFueraDeCatalogo()}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-origen="envios-consulta"
              className="mt-5 inline-block rounded-full bg-champan px-6 py-3 text-sm font-medium text-noche transition-colors hover:bg-oro-claro"
            >
              Consultar por WhatsApp
            </a>
            <p className="mt-3 text-micro text-arena">
              Disponibilidad, precio y plazo sujetos a confirmación.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
