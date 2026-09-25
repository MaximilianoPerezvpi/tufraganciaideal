import { linkWhatsApp, site } from "@/lib/site";

/**
 * Logística: pagos y envíos.
 * ⚠️ TODO: ajustá precios de envío, agencias y horarios a tu operativa real.
 */

const PAGOS = [
  {
    nombre: "Tarjeta de crédito",
    detalle: "OCA, Visa y Mastercard. Hasta 12 cuotas según el banco.",
  },
  {
    nombre: "Tarjeta de débito",
    detalle: "Débito uruguayo, el cobro se acredita al instante.",
  },
  {
    nombre: "Efectivo",
    detalle: "Abitab y Redpagos: te damos el cupón y pagás en la red.",
  },
];

const ENVIOS = [
  {
    nombre: "Montevideo",
    detalle: "Envío en el día por delivery, o retiro coordinado sin costo.",
    plazo: "24 h",
  },
  {
    nombre: "Interior del país",
    detalle: "DAC y Correo Uruguayo a la agencia que te quede más cómoda.",
    plazo: "24 a 72 h",
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
          <h2 className="font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Cómo pagás y cómo te llega
          </h2>
          <p className="mt-4 max-w-[48ch] text-arena">
            El pago lo procesa Mercado Pago, así que tus datos de tarjeta nunca
            pasan por esta web. Despachamos el mismo día que se acredita el pago
            y te mandamos el número de seguimiento por mail.
          </p>

          <h3 className="mt-10 text-sm text-marfil">Formas de pago con Mercado Pago</h3>
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
            {ENVIOS.map((e) => (
              <li
                key={e.nombre}
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
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-champan/30 bg-champan/[0.06] p-6">
            <p className="text-marfil">
              ¿No encontrás el perfume que buscás?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-arena">
              Traemos a pedido: decinos cuál querés y te confirmamos precio y
              plazo de llegada en el día.
            </p>
            <a
              href={linkWhatsApp("¡Hola! Estoy buscando un perfume puntual: ")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block rounded-full bg-champan px-6 py-3 text-sm font-medium text-noche transition-colors hover:bg-oro-claro"
            >
              Consultar un perfume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
