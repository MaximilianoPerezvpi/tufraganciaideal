"use client";

import { useState } from "react";
import Modal from "./Modal";
import { precio } from "@/lib/format";

const DEPARTAMENTOS = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno", "Flores",
  "Florida", "Lavalleja", "Maldonado", "Montevideo", "Paysandú", "Río Negro",
  "Rivera", "Rocha", "Salto", "San José", "Soriano", "Tacuarembó",
  "Treinta y Tres",
] as const;

const PREFERENCIAS_ENVIO = ["DAC", "UES", "Retiro local", "Encomienda"] as const;

type ItemCheckout = { slug: string; cantidad: number };

/**
 * Datos de envío antes de ir a Mercado Pago.
 *
 * Viajan como `metadata` de la preferencia de pago (ver /api/checkout):
 * Mercado Pago los guarda de su lado (los ves en su dashboard/API), esta
 * web no tiene today un panel de pedidos que los liste.
 */
export default function CheckoutModal({
  abierto,
  onCerrar,
  items,
  total,
}: {
  abierto: boolean;
  onCerrar: () => void;
  items: ItemCheckout[];
  total: number;
}) {
  const [pagando, setPagando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPagando(true);
    setError(null);

    const datosForm = new FormData(e.currentTarget);
    const envio = {
      nombre: String(datosForm.get("nombre") ?? "").trim(),
      telefono: String(datosForm.get("telefono") ?? "").trim(),
      departamento: String(datosForm.get("departamento") ?? ""),
      preferenciaEnvio: String(datosForm.get("preferenciaEnvio") ?? ""),
      direccion: String(datosForm.get("direccion") ?? "").trim(),
    };

    try {
      const respuesta = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, envio }),
      });

      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.url) {
        throw new Error(datos.error ?? "No pudimos iniciar el pago.");
      }
      window.location.href = datos.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos iniciar el pago. Probá de nuevo en un momento.",
      );
      setPagando(false);
    }
  }

  const CAMPO =
    "w-full rounded-xl border border-borde bg-noche px-4 py-3 text-sm text-marfil outline-none transition-colors focus-visible:border-champan";

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} etiqueta="Datos de envío" anchoMaximo="max-w-lg">
      <form onSubmit={alEnviar} className="p-6 sm:p-8">
        <p className="kicker">Antes de pagar</p>
        <h2 className="mt-2 font-display text-[1.6rem] font-light text-marfil">
          ¿A dónde te lo enviamos?
        </h2>
        <p className="mt-2 text-sm text-arena">
          Con estos datos coordinamos el envío apenas se acredite el pago.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-micro text-arena">Nombre completo</span>
            <input name="nombre" type="text" required autoComplete="name" className={CAMPO} />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-micro text-arena">Teléfono / WhatsApp</span>
            <input
              name="telefono"
              type="tel"
              required
              autoComplete="tel"
              placeholder="09X XXX XXX"
              className={CAMPO}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-micro text-arena">Departamento</span>
            <select name="departamento" required defaultValue="" className={CAMPO}>
              <option value="" disabled>
                Elegí tu departamento
              </option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-micro text-arena">Preferencia de envío</span>
            <select name="preferenciaEnvio" required defaultValue="" className={CAMPO}>
              <option value="" disabled>
                Elegí cómo preferís recibirlo
              </option>
              {PREFERENCIAS_ENVIO.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-micro text-arena">
              Dirección o agencia de destino
            </span>
            <input
              name="direccion"
              type="text"
              required
              placeholder="Calle y número, o el local de DAC/UES más cómodo"
              className={CAMPO}
            />
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-champan/40 bg-champan/10 px-4 py-3 text-sm text-marfil"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex items-baseline justify-between border-t border-borde pt-4">
          <span className="text-sm text-arena">Total a pagar</span>
          <span className="cifras text-xl text-champan">{precio(total)}</span>
        </div>

        <button
          type="submit"
          disabled={pagando}
          className="mt-4 w-full rounded-full bg-champan py-4 font-medium text-noche transition-colors hover:bg-oro-claro disabled:cursor-wait disabled:opacity-70"
        >
          {pagando ? "Abriendo Mercado Pago…" : "Confirmar e ir a pagar"}
        </button>
      </form>
    </Modal>
  );
}
