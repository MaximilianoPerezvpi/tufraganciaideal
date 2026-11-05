"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  GA4_ID,
  META_PIXEL_ID,
  trackContactoWhatsApp,
  trackPageViewMeta,
} from "@/lib/analytics";

/**
 * Carga GA4 y Meta Pixel (solo si sus variables de entorno existen; ver
 * src/lib/analytics.ts) y mide todos los clics a WhatsApp del sitio con un
 * único listener: cualquier <a href="https://wa.me/…"> cuenta, y si tiene
 * `data-wa-origen` / `data-wa-slug` se registra de dónde vino y qué perfume.
 * Así ningún botón nuevo queda sin medir por olvido.
 */
export default function Analytics() {
  const pathname = usePathname();
  const primeraCarga = useRef(true);

  // Meta no detecta solo los cambios de página del App Router (GA4 sí, con
  // la medición mejorada): el primer PageView sale del script de init.
  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    trackPageViewMeta();
  }, [pathname]);

  useEffect(() => {
    if (!GA4_ID && !META_PIXEL_ID) return;
    const alClic = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>(
        'a[href^="https://wa.me/"]',
      );
      if (!link) return;
      trackContactoWhatsApp(
        link.dataset.waOrigen ?? "otro",
        link.dataset.waSlug || undefined,
      );
    };
    document.addEventListener("click", alClic, { capture: true });
    return () => document.removeEventListener("click", alClic, { capture: true });
  }, []);

  return (
    <>
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(GA4_ID)});`}
          </Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(META_PIXEL_ID)});fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
