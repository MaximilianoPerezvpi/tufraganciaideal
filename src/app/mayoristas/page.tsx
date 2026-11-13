import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import FormularioMayorista from "@/components/FormularioMayorista";
import OfertasMayoristas from "@/components/OfertasMayoristas";
import { productos } from "@/data/productos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mayoristas — Revendé perfumes originales",
  description:
    "Comprá perfumes árabes y de diseñador originales para revender en Uruguay. Atención personalizada para revendedores, emprendedores y comercios. Solicitá tu cotización por WhatsApp.",
  alternates: { canonical: "/mayoristas" },
};

// Solo lo que la tienda ya ofrece hoy. Los precios mayoristas publicados
// están en OfertasMayoristas; el resto se cotiza por separado.
const BENEFICIOS = [
  {
    titulo: "Catálogo amplio",
    texto: `Más de ${Math.floor(productos.length / 10) * 10} fragancias árabes y de diseñador, y la posibilidad de consultar por otras que no están publicadas.`,
  },
  {
    titulo: "Perfumes originales",
    texto: "Trabajamos con perfumes originales y sellados, los mismos que vendemos al público.",
  },
  {
    titulo: "Atención personalizada",
    texto: "Una persona revisa tu solicitud y te responde según lo que buscás y cuánto querés comprar.",
  },
  {
    titulo: "Envíos a todo Uruguay",
    texto: "Coordinamos la entrega a tu ciudad, vendas por Instagram, en tu local o a tus conocidos.",
  },
] as const;

const PASOS = [
  "Completás el formulario con lo que buscás.",
  "Se abre WhatsApp con tu solicitud ordenada y nos la enviás.",
  "Te respondemos con disponibilidad, cantidades y condiciones para tu caso.",
] as const;

const PERFILES = [
  ["Querés empezar", "Armá tu propio negocio de perfumes con un primer pedido a tu medida."],
  ["Ya revendés", "Sumá fragancias árabes y de diseñador a tu catálogo actual."],
  ["Tenés un comercio", "Incorporá perfumería original a tu tienda física u online."],
] as const;

export default function PaginaMayoristas() {
  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        {/* Portada */}
        <section className="relative overflow-hidden border-b border-borde">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-oro-vivo/10 blur-[120px]"
          />
          <div className="marco relative py-16 md:py-24">
            <p className="kicker">Mayoristas</p>
            <h1 className="mt-3 max-w-[18ch] font-display text-[length:var(--text-hero)] font-light leading-[0.98] text-marfil">
              Convertite en revendedor de{" "}
              <span className="italic text-champan">TuFragancia Ideal</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-arena">
              ¿Querés comenzar tu propio negocio de perfumes o ampliar tu
              catálogo? En TuFragancia Ideal ofrecemos atención personalizada
              para compras mayoristas. Consultanos por disponibilidad,
              cantidades y precios especiales.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#ofertas"
                className="inline-flex rounded-full bg-champan px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-noche transition-transform duration-200 hover:scale-[1.02] hover:bg-oro-claro"
              >
                Ver ofertas por caja
              </a>
              <a
                href="#cotizacion"
                className="inline-flex rounded-full border border-champan/50 px-8 py-4 text-sm uppercase tracking-[0.12em] text-champan transition-colors hover:bg-champan hover:text-noche"
              >
                Solicitar cotización
              </a>
            </div>
          </div>
        </section>

        <OfertasMayoristas />

        {/* Para quién */}
        <section className="marco py-16 md:py-20">
          <div className="grid gap-4 md:grid-cols-3">
            {PERFILES.map(([titulo, texto]) => (
              <div key={titulo} className="rounded-2xl border border-borde bg-carbon p-6">
                <p className="font-display text-xl font-light text-marfil">{titulo}</p>
                <p className="mt-2 text-sm leading-relaxed text-arena">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Canal de WhatsApp: ofertas sin tener que pedir cotización */}
        <section className="marco pb-16 md:pb-20">
          <div className="flex flex-col gap-6 rounded-2xl border border-champan/30 bg-carbon p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-[56ch]">
              <p className="kicker">Canal de WhatsApp</p>
              <h2 className="mt-2 font-display text-2xl font-light text-marfil">
                Novedades y Ofertas de TuFragancia Ideal
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-arena">
                Seguí nuestro canal y enterate primero de ingresos, promociones
                y ofertas. Solo publicamos nosotros: nadie ve tu número ni
                quiénes más lo siguen.
              </p>
            </div>
            <a
              href={site.canalWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-origen="mayoristas-canal"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-champan px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-noche transition-transform duration-200 hover:scale-[1.02] hover:bg-oro-claro"
            >
              Seguir el canal
            </a>
          </div>
        </section>

        {/* Beneficios + formulario */}
        <section
          id="cotizacion"
          className="scroll-mt-28 border-t border-borde bg-carbon/40 py-16 md:py-24"
        >
          <div className="marco grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <p className="kicker">Por qué con nosotros</p>
              <h2 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
                Una oportunidad real de negocio
              </h2>
              <dl className="mt-8 space-y-6">
                {BENEFICIOS.map((b) => (
                  <div key={b.titulo} className="border-l-2 border-champan/40 pl-4">
                    <dt className="text-marfil">{b.titulo}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-arena">{b.texto}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-12 text-sm text-marfil">Cómo funciona</h3>
              <ol className="mt-4 space-y-3">
                {PASOS.map((paso, i) => (
                  <li key={paso} className="flex gap-3 text-sm text-arena">
                    <span className="cifras flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-champan/50 text-micro text-champan">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{paso}</span>
                  </li>
                ))}
              </ol>

              <p className="mt-10 max-w-[52ch] text-micro leading-relaxed text-arena">
                Además de las ofertas por caja publicadas, cotizamos otros
                perfumes y cantidades: cada solicitud se evalúa según los
                perfumes, las cantidades y la disponibilidad del momento.
              </p>
              <p className="mt-4 text-sm text-arena">
                Mirá novedades en Instagram:{" "}
                <a
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-champan underline underline-offset-4 hover:text-oro-claro"
                >
                  @{site.instagram}
                </a>{" "}
                · o recorré el{" "}
                <Link href="/catalogo" className="text-champan underline underline-offset-4 hover:text-oro-claro">
                  catálogo completo
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="sr-only">Solicitar cotización</h2>
              <FormularioMayorista />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
