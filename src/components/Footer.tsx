"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { linkWhatsApp, navegacion, site } from "@/lib/site";

const GARANTIAS = [
  "Celofán de fábrica intacto",
  "Control de lote antes de publicar",
  "Devolución total si no es original",
];

const MEDIOS_PAGO = ["Visa", "Mastercard", "OCA", "Abitab", "Redpagos"];
const AGENCIAS_ENVIO = ["DAC", "UES"];

const FAQ = [
  {
    pregunta: "¿Cómo sé que el perfume es original?",
    respuesta:
      "Cada frasco llega con celofán de fábrica y código de lote. Revisamos la referencia contra la casa antes de publicarlo: si algo no cierra, no se vende. Si al abrirlo no es lo que decimos, te devolvemos la plata.",
  },
  {
    pregunta: "¿Puedo devolver un frasco si me arrepentí?",
    respuesta:
      "Sí, tenés 7 días para devolverlo sin abrir. Y devolución total, sin condiciones, si alguna vez recibís algo que no sea original.",
  },
  {
    pregunta: "¿Cuánto tarda en llegar?",
    respuesta:
      "En Montevideo, 24 h por delivery o retiro coordinado. En el interior, entre 24 y 72 h por DAC o Correo Uruguayo, a la agencia que te quede más cómoda.",
  },
  {
    pregunta: "¿Qué medios de pago aceptan?",
    respuesta:
      "Todo a través de Mercado Pago: tarjetas OCA, Visa y Mastercard (hasta 12 cuotas), o en efectivo por Abitab y Redpagos. Tus datos de tarjeta nunca pasan por esta web.",
  },
];

function AcordeonFAQ() {
  const [abierta, setAbierta] = useState<number | null>(null);

  return (
    <div className="divide-y divide-borde border-y border-borde">
      {FAQ.map((item, i) => {
        const expandida = abierta === i;
        return (
          <div key={item.pregunta}>
            <button
              type="button"
              onClick={() => setAbierta(expandida ? null : i)}
              aria-expanded={expandida}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-sm text-marfil">{item.pregunta}</span>
              <motion.span
                aria-hidden
                animate={{ rotate: expandida ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-borde text-arena"
              >
                +
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: expandida ? "auto" : 0, opacity: expandida ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <p className="pb-4 pr-8 text-sm leading-relaxed text-arena">
                {item.respuesta}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-borde bg-carbon">
      <div aria-hidden className="filo-oro h-px w-full" />

      <div className="marco grid gap-12 py-16 md:grid-cols-[1.1fr_1fr_1fr] md:gap-8">
        <div className="max-w-[34ch]">
          <p className="font-display text-[1.4rem] text-marfil">
            TuFragancia<span className="italic text-champan">Ideal</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-arena">
            Perfumes originales sellados. {site.ciudad}, {site.pais}.
          </p>

          <a
            href={linkWhatsApp("Hola! Tengo una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-vetiver/40 px-4 py-2 text-sm text-vetiver transition-colors hover:bg-vetiver hover:text-noche"
          >
            Escribinos por WhatsApp
          </a>

          <nav aria-label="Pie de página" className="mt-8 flex flex-col gap-2 text-sm">
            {navegacion.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-arena transition-colors hover:text-marfil"
              >
                {item.etiqueta}
              </a>
            ))}
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-arena transition-colors hover:text-marfil"
            >
              @{site.instagram}
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <p className="kicker">Garantías de autenticidad</p>
            <ul className="mt-3 flex flex-col gap-2">
              {GARANTIAS.map((texto) => (
                <li key={texto} className="flex items-start gap-2 text-sm text-arena">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-vetiver" />
                  {texto}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="kicker">Medios de pago</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {MEDIOS_PAGO.map((medio) => (
                <span
                  key={medio}
                  className="rounded-full border border-borde px-3 py-1 text-micro text-marfil"
                >
                  {medio}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="kicker">Agencias de envío</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AGENCIAS_ENVIO.map((agencia) => (
                <span
                  key={agencia}
                  className="rounded-full border border-borde px-3 py-1 text-micro text-marfil"
                >
                  {agencia}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="kicker">Preguntas frecuentes</p>
          <div className="mt-3">
            <AcordeonFAQ />
          </div>
        </div>
      </div>

      <div className="marco border-t border-borde py-6">
        <p className="text-micro text-arena/70">
          © {new Date().getFullYear()} {site.nombre}. Vendemos frascos
          originales sellados; no somos distribuidores oficiales de las marcas
          mencionadas. Precios en pesos uruguayos, IVA incluido.
        </p>
      </div>
    </footer>
  );
}
