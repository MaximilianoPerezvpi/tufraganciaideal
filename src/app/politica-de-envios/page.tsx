import type { Metadata } from "next";
import Header from "@/components/Header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Envíos",
  description: `Cómo, cuánto tarda y cuánto cuesta enviar un pedido de ${site.nombre} a todo ${site.pais}.`,
  alternates: { canonical: "/politica-de-envios" },
};

const SECCIONES = [
  {
    titulo: "Agencias de envío",
    texto:
      "Enviamos a todo el país por agencia (DAC u otra, según tu localidad). En Montevideo también podés recibirlo por delivery o coordinar un retiro sin costo. Lo acordamos por WhatsApp al confirmar el pedido.",
  },
  {
    titulo: "Tiempos de entrega",
    texto:
      "El tiempo de entrega de cada perfume te lo confirmamos por WhatsApp antes de cerrar el pedido. Una vez despachado: en Montevideo, alrededor de 24 horas por delivery; en el interior, entre 24 y 72 horas hábiles, según la localidad y la agencia.",
  },
  {
    titulo: "Costo de envío",
    texto:
      "El costo depende de tu departamento y te lo confirmamos por WhatsApp junto con el pedido: siempre vas a saber cuánto pagás por el envío antes de pagar.",
  },
  {
    titulo: "Seguimiento del pedido",
    texto:
      "Apenas despachamos tu pedido te mandamos el número de seguimiento por WhatsApp, para que puedas rastrearlo directamente con la agencia.",
  },
  {
    titulo: "Devoluciones",
    texto:
      "Tenés 7 días desde que recibís el pedido para devolver un frasco sin abrir, corriendo el costo de envío de vuelta por tu cuenta. Si el producto no llega en condiciones o no es 100% original, la devolución (incluido el envío) corre por nuestra cuenta.",
  },
] as const;

export default function PaginaPoliticaEnvios() {
  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        <div className="marco max-w-[68ch] py-14 md:py-20">
          <p className="kicker">Envíos</p>
          <h1 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Política de Envíos
          </h1>

          <div className="mt-10 flex flex-col gap-8">
            {SECCIONES.map((s) => (
              <div key={s.titulo}>
                <h2 className="font-display text-[1.15rem] font-light text-marfil">
                  {s.titulo}
                </h2>
                <p className="mt-2 leading-relaxed text-arena">{s.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
