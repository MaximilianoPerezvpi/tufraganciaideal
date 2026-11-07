import type { Metadata } from "next";
import Header from "@/components/Header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: `Términos y condiciones de uso y compra en ${site.nombre}.`,
  alternates: { canonical: "/terminos-y-condiciones" },
};

const SECCIONES = [
  {
    titulo: "1. Quiénes somos",
    texto: `${site.nombre} es una tienda online que vende frascos de perfume 100% originales y sellados de fábrica, con base en ${site.ciudad}, ${site.pais}. No somos distribuidores oficiales de las casas de perfumería que aparecen en el catálogo: compramos el producto ya envasado y sellado, y lo revendemos tal como llega.`,
  },
  {
    titulo: "2. Precios y disponibilidad",
    texto:
      "Todos los precios están expresados en pesos uruguayos (UYU) e incluyen IVA, y pueden variar sin previo aviso: el precio válido es el que te confirmamos por WhatsApp al cerrar el pedido. Que un perfume esté publicado en el catálogo no garantiza su disponibilidad inmediata: antes de cerrar cada pedido te confirmamos por WhatsApp la disponibilidad, el precio final y el tiempo de entrega.",
  },
  {
    titulo: "3. Compra y pago",
    texto:
      "Los pedidos se realizan por WhatsApp: el botón \"Consultar por WhatsApp\" de cada perfume envía su nombre y el precio publicado. La compra se confirma recién cuando te respondemos con la disponibilidad y el tiempo de entrega, y coordinamos la forma de pago: transferencia bancaria, efectivo cuando corresponda, o Mercado Pago mediante un link de pago que enviamos por WhatsApp. Esta web no procesa pagos ni guarda datos de tarjetas.",
  },
  {
    titulo: "4. Envíos",
    texto:
      "Envíos a todo el país por agencia (DAC u otra, según tu localidad), delivery en Montevideo o retiro coordinado. Los tiempos y costos de envío se detallan en la Política de Envíos. El costo se calcula según tu departamento y te lo confirmamos por WhatsApp antes de que pagues.",
  },
  {
    titulo: "5. Devoluciones y garantía",
    texto:
      "Comercializamos exclusivamente perfumes 100% originales. Tenés 7 días desde que recibís el pedido para devolver un frasco sin abrir. Si el producto no llega en condiciones, la devolución, incluido el envío, corre por nuestra cuenta.",
  },
  {
    titulo: "6. Marcas registradas",
    texto:
      "Los nombres, logos y marcas de perfumería mencionados en este sitio pertenecen a sus respectivos titulares. Se usan únicamente con fines descriptivos, para identificar el producto que vendemos, sin que eso implique afiliación, patrocinio o distribución oficial por parte de esas marcas.",
  },
  {
    titulo: "7. Limitación de responsabilidad",
    texto:
      "Hacemos lo posible por describir cada producto con precisión (notas, concentración, volumen). Pequeñas variaciones de lote entre lo que ves en fotos y el frasco físico no constituyen un defecto. No respondemos por reacciones alérgicas individuales a un perfume: ante la duda, probá primero en piel antes de aplicarlo en ropa.",
  },
  {
    titulo: "8. Legislación aplicable",
    texto: `Estos términos se rigen por las leyes de ${site.pais}. Cualquier disputa se resuelve ante los tribunales competentes de ${site.ciudad}.`,
  },
] as const;

export default function PaginaTerminos() {
  return (
    <>
      <Header />
      <main id="contenido" className="pt-[104px]">
        <div className="marco max-w-[68ch] py-14 md:py-20">
          <p className="kicker">Legal</p>
          <h1 className="mt-2 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
            Términos y Condiciones
          </h1>
          <p className="mt-4 text-sm text-arena">
            Última actualización: septiembre de 2026.
          </p>

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
