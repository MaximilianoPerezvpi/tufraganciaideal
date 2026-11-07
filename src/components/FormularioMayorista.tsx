"use client";

import { useState } from "react";
import { linkWhatsApp } from "@/lib/site";
import { trackContactoWhatsApp } from "@/lib/analytics";

const CAMPO =
  "w-full rounded-xl border border-borde bg-noche px-4 py-3 text-sm text-marfil placeholder:text-arena/60 focus:border-champan focus:outline-none";

const TIPOS = [
  "Nuevo revendedor",
  "Revendedor establecido",
  "Comercio o tienda",
] as const;

// Rangos orientativos para ordenar la conversación: no son mínimos de compra.
const CANTIDADES = [
  "Menos de 10 unidades",
  "Entre 10 y 30 unidades",
  "Entre 30 y 100 unidades",
  "Más de 100 unidades",
] as const;

const LINEAS = ["Árabes", "Diseñador", "Ambos"] as const;

/**
 * Solicitud de cotización mayorista. No calcula ni promete nada: arma un
 * mensaje ordenado y lo abre en el WhatsApp de la tienda, donde cada pedido
 * se evalúa por separado.
 */
export default function FormularioMayorista() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [linea, setLinea] = useState("");
  const [adicional, setAdicional] = useState("");
  const [enviado, setEnviado] = useState(false);

  const valido = nombre.trim() !== "" && tipo && cantidad && linea;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!valido) return;
    const lineas = [
      "¡Hola! Quiero solicitar una cotización mayorista.",
      "",
      `• Nombre / emprendimiento: ${nombre.trim()}`,
      `• Tipo de comprador: ${tipo}`,
      `• Cantidad estimada: ${cantidad}`,
      `• Perfumes que busco: ${linea}`,
    ];
    if (adicional.trim()) lineas.push(`• Información adicional: ${adicional.trim()}`);
    trackContactoWhatsApp("mayoristas");
    window.open(linkWhatsApp(lineas.join("\n")), "_blank", "noopener,noreferrer");
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-champan/40 bg-carbon p-8 text-center">
        <p className="font-display text-2xl font-light text-marfil">
          ¡Gracias! Se abrió WhatsApp con tu solicitud
        </p>
        <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-arena">
          Enviá el mensaje y te respondemos personalmente con disponibilidad,
          cantidades y condiciones para tu caso.
        </p>
        <button
          type="button"
          onClick={() => setEnviado(false)}
          className="mt-5 text-micro text-champan underline underline-offset-4 hover:text-oro-claro"
        >
          ¿No se abrió? Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={enviar}
      className="rounded-2xl border border-borde bg-carbon p-6 sm:p-8"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm text-marfil">
          Nombre o nombre del emprendimiento
        </span>
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="organization"
          className={CAMPO}
        />
      </label>

      <Opciones
        legenda="Tipo de comprador"
        nombre="tipo"
        opciones={TIPOS}
        valor={tipo}
        alCambiar={setTipo}
      />

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm text-marfil">
          Cantidad estimada de unidades
        </span>
        <select
          required
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className={CAMPO}
        >
          <option value="" disabled>
            Elegí un rango
          </option>
          {CANTIDADES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <Opciones
        legenda="¿Qué perfumes buscás?"
        nombre="linea"
        opciones={LINEAS}
        valor={linea}
        alCambiar={setLinea}
      />

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm text-marfil">
          Información adicional <span className="text-arena">(opcional)</span>
        </span>
        <textarea
          rows={4}
          value={adicional}
          onChange={(e) => setAdicional(e.target.value)}
          placeholder="Marcas o perfumes que te interesan, ciudad, cómo vendés…"
          className={CAMPO}
        />
      </label>

      <button
        type="submit"
        disabled={!valido}
        className="mt-8 w-full rounded-full bg-champan py-4 text-sm font-semibold uppercase tracking-[0.12em] text-noche transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:bg-borde disabled:text-arena"
      >
        Solicitar cotización
      </button>
      <p className="mt-3 text-center text-micro text-arena">
        Se abre WhatsApp con tus datos ordenados. Cada solicitud se evalúa de
        forma personalizada.
      </p>
    </form>
  );
}

/** Grupo de opciones tipo "chip" (radio accesible). */
function Opciones({
  legenda,
  nombre,
  opciones,
  valor,
  alCambiar,
}: {
  legenda: string;
  nombre: string;
  opciones: readonly string[];
  valor: string;
  alCambiar: (v: string) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2 text-sm text-marfil">{legenda}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <label
            key={o}
            className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-champan/60 ${
              valor === o
                ? "border-champan bg-champan/10 text-champan"
                : "border-borde text-arena hover:border-arena hover:text-marfil"
            }`}
          >
            <input
              type="radio"
              name={nombre}
              value={o}
              checked={valor === o}
              onChange={() => alCambiar(o)}
              required
              className="sr-only"
            />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
