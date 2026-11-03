// Lista los precios actuales del catálogo (todos en pesos uruguayos, UYU).
//
//   npm run precios
//
// Imprime la tabla en consola y la guarda en precios-actuales.csv (se abre
// con Excel / Google Sheets). Sirve para revisar y pasar los precios nuevos;
// el cambio en sí se hace en la 3ª columna de scripts/gen-rows.mjs y después
// `node scripts/gen-productos.mjs`.
//
// Requiere Node 22.18+ (importa el .ts directo, sin compilar).
import { writeFileSync } from "node:fs";
import { productos } from "../src/data/productos.ts";

const invalidos = productos.filter(
  (p) => !Number.isInteger(p.precio_uyu) || p.precio_uyu <= 0,
);

console.table(
  productos.map((p) => ({
    casa: p.casa,
    nombre: p.nombre,
    presentacion: `${p.concentracion} ${p.volumen_ml} ml`,
    precio_uyu: p.precio_uyu,
    stock: p.stock > 0 ? "sí" : "NO",
  })),
);

const csv = [
  "slug;casa;nombre;concentracion;volumen_ml;precio_uyu;stock;precio_nuevo_uyu",
  ...productos.map((p) =>
    [p.slug, p.casa, p.nombre, p.concentracion, p.volumen_ml, p.precio_uyu, p.stock, ""]
      .map((v) => (String(v).includes(";") ? `"${v}"` : v))
      .join(";"),
  ),
].join("\r\n");

// BOM para que Excel respete las tildes.
writeFileSync(new URL("../precios-actuales.csv", import.meta.url), "﻿" + csv, "utf8");

console.log(`\n${productos.length} productos · moneda: UYU · guardado en precios-actuales.csv`);
if (invalidos.length > 0) {
  console.error(`⚠️  Precios inválidos: ${invalidos.map((p) => p.slug).join(", ")}`);
  process.exitCode = 1;
}
