"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCarrito } from "@/lib/cartStore";

type Estado = "exito" | "pendiente" | "error";

const TEXTOS: Record<Estado, { titulo: string; cuerpo: string }> = {
  exito: {
    titulo: "Listo, recibimos tu pago",
    cuerpo:
      "Te mandamos el detalle de la compra por mail. Despachamos el pedido en las próximas 24 horas hábiles y te pasamos el número de seguimiento.",
  },
  pendiente: {
    titulo: "Falta que pagues el cupón",
    cuerpo:
      "Generamos tu pago en efectivo. Tenés que acercarte a Abitab o Redpagos con el cupón que te mandó Mercado Pago. Apenas se acredita, preparamos el envío y guardamos tu stock.",
  },
  error: {
    titulo: "El pago no se completó",
    cuerpo:
      "No se hizo ningún cobro. Puede ser un rechazo del banco o un dato mal ingresado: tu carrito quedó igual, podés intentar de nuevo o pagar con otro medio.",
  },
};

/**
 * Pantalla de retorno de Mercado Pago.
 * En caso de éxito vacía el carrito: si no, la persona vuelve al sitio y ve
 * los productos que ya pagó todavía adentro.
 */
export default function EstadoCompra({ estado }: { estado: Estado }) {
  const vaciar = useCarrito((e) => e.vaciar);
  const [pagoId, setPagoId] = useState<string | null>(null);

  useEffect(() => {
    // Mercado Pago vuelve con ?payment_id=...&status=...&external_reference=...
    const params = new URLSearchParams(window.location.search);
    setPagoId(params.get("payment_id"));
    if (estado === "exito") vaciar();
  }, [estado, vaciar]);

  const { titulo, cuerpo } = TEXTOS[estado];

  return (
    <main className="marco flex min-h-screen max-w-2xl flex-col justify-center py-24">
      <p className="text-micro text-arena">{estado === "error" ? "Pago rechazado" : "Compra"}</p>
      <h1 className="mt-3 font-display text-[length:var(--text-titulo)] font-light leading-tight text-marfil">
        {titulo}
      </h1>
      <p className="mt-5 max-w-[52ch] leading-relaxed text-arena">{cuerpo}</p>

      {pagoId && (
        <p className="cifras mt-6 rounded-xl border border-borde bg-carbon px-5 py-4 text-sm text-arena">
          Número de pago: <span className="text-marfil">{pagoId}</span>
          <span className="mt-1 block text-micro">
            Guardalo: es lo que te pedimos si escribís por una consulta.
          </span>
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#catalogo"
          className="rounded-full bg-champan px-8 py-4 text-center font-medium text-noche transition-colors hover:bg-oro-claro"
        >
          {estado === "error" ? "Volver al carrito" : "Seguir mirando perfumes"}
        </Link>
        <Link
          href="/#envios"
          className="rounded-full border border-borde px-8 py-4 text-center text-marfil transition-colors hover:border-champan hover:text-champan"
        >
          Ver plazos de envío
        </Link>
      </div>
    </main>
  );
}
