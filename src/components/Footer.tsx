"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { linkWhatsApp, navegacion, site } from "@/lib/site";

const GARANTIAS = [
  "Celofán de fábrica intacto",
  "Control de lote antes de publicar",
  "Devolución total si no es original",
];

const MEDIOS_PAGO = ["Visa", "Mastercard", "Mercado Pago", "OCA", "Abitab", "Redpagos"];
const AGENCIAS_ENVIO = ["DAC", "UES"];

const ENLACES_LEGALES = [
  { href: "/terminos-y-condiciones", etiqueta: "Términos y Condiciones" },
  { href: "/politica-de-envios", etiqueta: "Política de Envíos" },
  { href: "/contacto", etiqueta: "Contacto" },
] as const;

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

      {/* Fila principal: 4 columnas (logo, enlaces, redes, medios de pago). */}
      <div className="marco grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="max-w-[28ch]">
          <p className="font-display text-[1.4rem] text-marfil">
            TuFragancia<span className="italic text-champan">Ideal</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-arena">
            Perfumes originales sellados. {site.ciudad}, {site.pais}.
          </p>
        </div>

        <div>
          <p className="kicker">Enlaces útiles</p>
          <nav aria-label="Pie de página" className="mt-3 flex flex-col gap-2 text-sm">
            {navegacion.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-arena transition-colors hover:text-marfil"
              >
                {item.etiqueta}
              </a>
            ))}
            {ENLACES_LEGALES.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-arena transition-colors hover:text-marfil"
              >
                {item.etiqueta}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="kicker">Seguinos</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram: @${site.instagram}`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-borde text-arena transition-colors hover:border-champan hover:text-champan"
            >
              <IconoInstagram className="h-4.5 w-4.5" />
            </a>
            <a
              href={linkWhatsApp("Hola! Tengo una consulta.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribinos por WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-borde text-arena transition-colors hover:border-vetiver hover:text-vetiver"
            >
              <IconoWhatsApp className="h-4.5 w-4.5" />
            </a>
          </div>
          <p className="mt-3 text-sm text-arena">@{site.instagram}</p>
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
      </div>

      {/* Fila secundaria: garantías, agencias de envío y FAQ. */}
      <div className="marco grid gap-10 border-t border-borde py-12 md:grid-cols-3 md:gap-8">
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

        <div className="md:col-span-2">
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

function IconoInstagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconoWhatsApp({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.96-.93-.26-.1-.46-.15-.65.15-.2.29-.75.93-.92 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.48.1-.2.05-.37-.02-.51-.08-.15-.65-1.58-.9-2.16-.24-.58-.48-.5-.65-.5-.17 0-.37-.02-.56-.02-.2 0-.51.07-.78.37-.26.29-1.02 1-1.02 2.42 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.96 4.39.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34z" />
      <path d="M12.02 2.5c-5.26 0-9.53 4.27-9.53 9.53 0 1.68.44 3.32 1.28 4.76L2.5 21.5l4.85-1.27a9.5 9.5 0 0 0 4.67 1.24h.01c5.26 0 9.53-4.27 9.53-9.53s-4.27-9.44-9.54-9.44Zm0 17.32h-.01a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-2.95.78.79-2.88-.19-.3a7.79 7.79 0 0 1-1.2-4.14c0-4.32 3.51-7.83 7.84-7.83 2.1 0 4.06.82 5.54 2.3a7.78 7.78 0 0 1 2.29 5.54c0 4.32-3.52 7.79-7.84 7.79Z" />
    </svg>
  );
}
