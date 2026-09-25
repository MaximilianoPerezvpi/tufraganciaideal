import type { Metadata } from "next";
import EstadoCompra from "@/components/EstadoCompra";

// Páginas de retorno de Mercado Pago: no tienen que indexarse.
export const metadata: Metadata = {
  title: "Compra confirmada",
  robots: { index: false, follow: false },
};

export default function Pagina() {
  return <EstadoCompra estado="exito" />;
}
