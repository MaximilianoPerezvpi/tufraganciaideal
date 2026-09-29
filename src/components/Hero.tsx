"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Headset, MessageCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { linkWhatsApp } from "@/lib/site";

/**
 * Hero. Entrada escalonada con Framer Motion: badge, título, subtítulo,
 * botones y puntos de confianza aparecen uno tras otro, no todos de golpe.
 */
const contenedor: Variants = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  oculto: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const PUNTOS_DE_CONFIANZA = [
  { Icono: ShieldCheck, texto: "100% Originales Sellados" },
  { Icono: Truck, texto: "Envíos a todo Uruguay" },
  { Icono: Headset, texto: "Atención Personalizada" },
] as const;

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[88vh] items-center overflow-hidden pt-[104px]"
    >
      {/* Fondo (imagen propia, generada, sin fotos de terceros) + degradé
          oscuro encima para que el texto siempre tenga contraste. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
      </div>

      <motion.div
        initial="oculto"
        animate="visible"
        variants={contenedor}
        className="marco relative py-16 md:py-20"
      >
        <div className="max-w-[36ch]">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-white/5 px-4 py-2 text-sm text-champan backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Perfumería Árabe &amp; Diseñador en Uruguay
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[length:var(--text-hero)] font-light leading-[0.95] tracking-[-0.02em] text-marfil"
          >
            <span className="bg-gradient-to-r from-champan via-oro-claro to-[#D4AF37] bg-clip-text text-transparent">
              Elegancia que deja huella
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-[46ch] text-[1.05rem] leading-relaxed text-arena"
          >
            Fragancias 100% originales con fijación extrema y estela
            inolvidable. Recibí tu perfume sellado de origen en cualquier
            punto del país.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/catalogo"
              className="rounded-full bg-[#D4AF37] px-8 py-4 text-center font-semibold text-black transition-transform duration-200 hover:scale-[1.02] hover:bg-oro-claro active:scale-[0.99]"
            >
              Explorar Catálogo
            </Link>
            <a
              href={linkWhatsApp("Hola! Quiero asesoría para elegir un perfume")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 text-center text-marfil backdrop-blur-md transition-colors hover:border-champan hover:text-champan"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Asesoría por WhatsApp
            </a>
          </motion.div>

          {/* Puntos de confianza: las objeciones que frenan una compra de
              perfumería online, resueltas de un vistazo. */}
          <motion.ul
            variants={item}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-4"
          >
            {PUNTOS_DE_CONFIANZA.map(({ Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2.5">
                <Icono className="h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden />
                <span className="text-sm text-marfil">{texto}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
