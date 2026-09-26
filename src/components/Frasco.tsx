"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * El frasco del hero.
 *
 * La entrada (fade + slide) la controla el `motion.div` padre en Hero.tsx,
 * como parte del stagger del resto del hero. Acá solo viven dos movimientos
 * propios: el brillo del celofán al aparecer, y un flote infinito y muy
 * sutil una vez que ya está en pantalla — el único movimiento continuo del
 * sitio, así que se apaga entero con `prefers-reduced-motion`.
 *
 * Es SVG puro: pesa ~3 KB, escala perfecto en cualquier pantalla y no bloquea
 * el LCP como lo haría una foto de 400 KB.
 */
export default function Frasco() {
  const sinMovimiento = useReducedMotion();
  const flote = sinMovimiento
    ? {}
    : {
        animate: { y: [0, -8, 0] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <motion.svg
      viewBox="0 0 240 420"
      role="img"
      aria-label="Frasco de perfume original sellado"
      className="h-full max-h-[70vh] w-full"
      {...flote}
    >
      <defs>
        {/* Volumen del vidrio: claro en el borde izquierdo, oscuro al fondo. */}
        <linearGradient id="vidrio" x1="0" x2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* El jugo: champán arriba, ámbar denso abajo. */}
        <linearGradient id="jugo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-oro-claro)" />
          <stop offset="100%" stopColor="#b07f35" />
        </linearGradient>

        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0%" stopColor="#8a6f3f" />
          <stop offset="30%" stopColor="var(--color-oro-claro)" />
          <stop offset="65%" stopColor="var(--color-champan)" />
          <stop offset="100%" stopColor="#6d552e" />
        </linearGradient>

        {/* Brillo del celofán: la franja que cruza el frasco sellado. */}
        <linearGradient id="celofan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sombra en la base */}
      <ellipse cx="120" cy="372" rx="92" ry="15" fill="var(--color-champan)" opacity="0.1" />

      {/* Tapa */}
      <rect x="92" y="18" width="56" height="52" rx="6" fill="url(#metal)" />
      <rect x="86" y="70" width="68" height="12" rx="3" fill="#6d552e" />

      {/* Cuello */}
      <rect x="100" y="82" width="40" height="24" fill="url(#vidrio)" stroke="var(--color-borde)" strokeWidth="1.5" />

      {/* Cuerpo del frasco: ancho, de frasco entero, no de muestra */}
      <rect x="54" y="106" width="132" height="252" rx="16" fill="url(#vidrio)" stroke="var(--color-borde)" strokeWidth="1.5" />

      {/* Jugo: el frasco viene lleno, sellado de fábrica */}
      <rect x="62" y="132" width="116" height="218" rx="10" fill="url(#jugo)" opacity="0.92" />

      {/* Etiqueta */}
      <rect x="82" y="212" width="76" height="58" rx="4" fill="var(--color-noche)" opacity="0.55" />
      <line x1="96" y1="232" x2="144" y2="232" stroke="var(--color-oro-claro)" strokeWidth="2" opacity="0.8" />
      <line x1="104" y1="246" x2="136" y2="246" stroke="var(--color-oro-claro)" strokeWidth="1.5" opacity="0.5" />

      {/* Reflejo vertical del vidrio */}
      <rect x="68" y="126" width="9" height="220" rx="4.5" fill="#fff" opacity="0.13" />

      {/* Celofán: la prueba visual de que está sellado */}
      <motion.rect
        x="54"
        y="106"
        width="132"
        height="252"
        rx="16"
        fill="url(#celofan)"
        initial={sinMovimiento ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.5 }}
      />
    </motion.svg>
  );
}
