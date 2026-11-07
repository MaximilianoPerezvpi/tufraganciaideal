import Link from "next/link";
import { linkWhatsApp, site } from "@/lib/site";
import BotonPedidoWhatsApp from "./BotonPedidoWhatsApp";

/**
 * Cierre del home: para quien llegó al final sin decidirse. Una sola
 * acción, la que cierra ventas: hablar por WhatsApp.
 */
export default function CTAWhatsApp() {
  return (
    <section className="py-20 md:py-28">
      <div className="marco">
        <div className="rounded-2xl border border-vetiver/30 bg-vetiver/[0.06] px-6 py-14 text-center sm:px-12">
          <p className="kicker">Atención personalizada</p>
          <h2 className="mt-3 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            ¿Te ayudamos a elegir?
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-arena">
            Contanos para quién es, qué perfumes te gustan o para qué ocasión
            lo buscás, y te recomendamos opciones con precio y disponibilidad.
          </p>
          <BotonPedidoWhatsApp
            href={linkWhatsApp("Hola! Quiero que me ayuden a elegir un perfume.")}
            origen="home-cta-final"
            className="mx-auto mt-8 w-full max-w-sm px-8 py-4"
          >
            Escribinos por WhatsApp
          </BotonPedidoWhatsApp>
          <p className="mt-6 text-sm text-arena">
            ¿Querés revender perfumes?{" "}
            <Link href="/mayoristas" className="text-champan underline underline-offset-4 hover:text-oro-claro">
              Conocé nuestra propuesta mayorista
            </Link>{" "}
            · Seguinos en{" "}
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-champan underline underline-offset-4 hover:text-oro-claro"
            >
              @{site.instagram}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
