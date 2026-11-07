import type { Metadata } from "next";
import PaginaCategoria from "@/components/PaginaCategoria";

export const metadata: Metadata = {
  title: "Perfumes árabes originales en Uruguay",
  description:
    "Perfumes árabes originales y sellados en Uruguay: Lattafa, Armaf, Afnan, Maison Alhambra, Rasasi y más. Consultá por WhatsApp y recibilo en Montevideo o todo el país.",
  alternates: { canonical: "/perfumes-arabes" },
};

export default function PerfumesArabes() {
  return (
    <PaginaCategoria
      categoria="árabes"
      titulo="Perfumes árabes"
      intro="Fragancias de casas árabes como Lattafa, Armaf, Afnan, Maison Alhambra y Rasasi: originales, en su caja y selladas. Elegí la que te interesa y consultanos por WhatsApp disponibilidad, precio y tiempo de entrega."
    />
  );
}
