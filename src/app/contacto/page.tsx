import type { Metadata } from "next";
import Header from "@/components/Header";
import { linkWhatsApp, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: `Escribinos a ${site.nombre} por WhatsApp, email o Instagram.`,
  alternates: { canonical: "/contacto" },
};

const CANALES = [
  {
    titulo: "WhatsApp",
    texto: "La vía más rápida: te respondemos en el día.",
    href: linkWhatsApp("Hola! Tengo una consulta."),
    etiqueta: "Escribinos por WhatsApp",
    externo: true,
  },
  {
    titulo: "Email",
    texto: "Para consultas más largas o seguimiento de un pedido.",
    href: `mailto:${site.email}`,
    etiqueta: site.email,
    externo: false,
  },
  {
    titulo: "Instagram",
    texto: "Novedades, lanzamientos y stock disponible.",
    href: site.instagramUrl,
    etiqueta: `@${site.instagram}`,
    externo: true,
  },
] as const;

export default function PaginaContacto() {
  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        <div className="marco max-w-[68ch] py-14 md:py-20">
          <p className="kicker">Contacto</p>
          <h1 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            ¿En qué te podemos ayudar?
          </h1>
          <p className="mt-4 leading-relaxed text-arena">
            Estamos en {site.ciudad}, {site.pais}. Elegí el canal que más te
            acomode.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {CANALES.map((c) => (
              <a
                key={c.titulo}
                href={c.href}
                target={c.externo ? "_blank" : undefined}
                rel={c.externo ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between gap-4 rounded-xl border border-borde bg-carbon px-6 py-5 transition-colors hover:border-champan"
              >
                <div>
                  <p className="font-display text-[1.1rem] text-marfil">
                    {c.titulo}
                  </p>
                  <p className="mt-1 text-sm text-arena">{c.texto}</p>
                </div>
                <span className="shrink-0 text-sm text-champan">
                  {c.etiqueta}
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
