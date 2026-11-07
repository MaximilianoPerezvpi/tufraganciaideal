# Revisión manual pendiente

Datos que la web necesita y que no se pueden verificar desde el código.
Nada de esto se completó inventando: cada punto espera tu confirmación.

## 1. Stock físico (prioridad alta, uso interno)

La web ya no muestra stock, pero el dato se usa por dentro para ordenar el
catálogo y armar la "Selección" del home. Hoy hay **8 perfumes marcados**
(`true` en la 7ª columna de
`scripts/gen-rows.mjs`). Me comentaste que tenés unos 10:

Versace Eau Fraiche · Lattafa Asad Bourbon · Lattafa Khamrah · Armani
Stronger With You Amber · Armani Stronger With You · Ralph Lauren Polo 67 ·
YSL MYSLF L'Absolu · Paco Rabanne Black XS

→ Corregí la lista en `gen-rows.mjs` (columna 7 = en stock, columna 8 =
`1` se puede pedir / `0` sin stock) y corré `node scripts/gen-productos.mjs`.

Sin stock (`0`) hoy: Club de Nuit Untold, Bharara King, King Double Bleu,
King Double Bleu Cofre, Al Haramain Amber Oud Gold Edition, Rasasi Hawas
Ice, Rasasi Hawas Fire, French Avenue Liquid Brun, Valentino Born in Roma
Uomo Intense. Aparecen al final del catálogo, con la misma presentación que
el resto. ¿Siguen sin poder conseguirse, o pasan a "por encargo" (`1`)?

## 2. Fichas olfativas sin verificar (188 de 226)

Tenían notas, familia y descripción asignadas al azar por plantilla. Se
quitaron: la web muestra "¿Cómo huele? Consultanos" y esos perfumes no
entran en el filtro por familia ni en el asesor. La lista completa está en
`precios-actuales.csv`, columna `ficha_verificada = no` (`npm run precios`).

→ Para completar una: agregala al objeto `BESPOKE` de
`scripts/gen-productos.mjs` (notas, descripción, familia) con datos de la
marca, y regenerá. Conviene empezar por los más vendidos.

## 3. Nombres a confirmar (posibles errores de tipeo)

El nombre genera la URL y el nombre del archivo de la foto, así que no se
cambió ninguno. Si los corregís en `gen-rows.mjs`, renombrá también la foto
en `public/productos/` con el slug nuevo.

| Como figura | Probablemente es |
| --- | --- |
| Lattafa Khamwah Dukhan | Khamrah Dukhan |
| French Avenue Gosht Espectre | Spectre Ghost |
| Maison Alhambra Pink Eclipe | Pink Eclipse |
| Maison Alhambra Versencia Jubilant Essen | Versencia Essence / Jubilant (confirmar) |
| Issey Miyake Dolar Violet | L'Eau d'Issey Solar Violet |
| Armaf Odyssey Eau da Montagne | Eau de Montagne (confirmar) |
| Azzaro Wanted (Parfum, 100 ml) | confirmar concentración (Wanted existe en EDT y EDP) |

## 4. Fotos

- `issey-miyake-women.webp` muestra el **L'Eau d'Issey Pour Homme Solar
  Lavender** (masculino) junto a otro frasco: no corresponde al producto.
- Sin foto: Lattafa His Confession, Valentino Donna Born in Roma Extradose.
- Revisá que el resto sea el frasco correcto: en una muestra de 6, 5
  estaban bien.

## 5. Información comercial a confirmar

- **Agencias de envío**: el sitio nombra combinaciones distintas — DAC y
  UES (políticas, términos, footer) y DAC y Correo Uruguayo (sección
  Envíos, preguntas frecuentes). ¿Cuáles usás?
- **Plazos de envío** (24 h Montevideo / 24–72 h interior) y **costo**.
- **Plazo de devolución**: 7 días con el frasco sin abrir (`Originales.tsx`,
  FAQ, políticas). Es el mínimo legal para ventas a distancia (Ley 17.250).
- **Proceso de autenticidad** (`Originales.tsx`, FAQ): dice "compramos a
  distribuidores autorizados" y "revisamos lote y serie". Dejalo solo si
  es lo que hacés.
- **Email**: `hola@tufraganciaideal.uy` no existe (el dominio no está
  registrado), así que se ocultó. Cargá uno real en `src/lib/site.ts`.
- **Destacados**: ningún perfume tiene `destacado: true`. Si querés
  destacar 2 o 3, se agrega en `BESPOKE`/generador.
- **Vercel**: podés borrar `NEXT_PUBLIC_SITE_URL` y `MP_ACCESS_TOKEN`; el
  sitio ya no las lee. El dominio propio, cuando exista, va en
  `NEXT_PUBLIC_DOMINIO`.

## 6. Analítica

Cargá en Vercel (ver `.env.example`) y redeploy:

- `NEXT_PUBLIC_GA4_ID` (G-XXXXXXXXXX)
- `NEXT_PUBLIC_META_PIXEL_ID`

Con analítica activa conviene sumar un aviso de cookies (Ley 18.331).
