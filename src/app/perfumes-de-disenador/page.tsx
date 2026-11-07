import type { Metadata } from "next";
import PaginaCategoria from "@/components/PaginaCategoria";

export const metadata: Metadata = {
  title: "Perfumes de diseñador originales en Uruguay",
  description:
    "Perfumes de diseñador originales y sellados en Uruguay: Dior, Chanel, Versace, Carolina Herrera, Paco Rabanne y más. Consultá por WhatsApp y recibilo en Montevideo o todo el país.",
  alternates: { canonical: "/perfumes-de-disenador" },
};

export default function PerfumesDeDisenador() {
  return (
    <PaginaCategoria
      categoria="diseñador"
      titulo="Perfumes de diseñador"
      intro="Fragancias de casas como Dior, Chanel, Versace, Carolina Herrera, Paco Rabanne y Jean Paul Gaultier: originales, en su caja y selladas. Elegí la que te interesa y consultanos por WhatsApp disponibilidad, precio y tiempo de entrega."
    />
  );
}
