# TuFraganciaIdeal

E-commerce de perfumes originales sellados. Next.js 15 (App Router) +
Tailwind v4 + Framer Motion + Zustand. Los pedidos se hacen por WhatsApp
(sin pasarela de pago). Pensado para deployear en Vercel.

## Arrancar

```bash
npm install
npm run dev       # http://localhost:3000
npm run precios   # lista de precios actuales (consola + precios-actuales.csv)
```

## Variables de entorno

Todas opcionales (detalle en `.env.example`). Se cargan en Vercel →
**Settings → Environment Variables** y después redeploy.

| Variable | Qué es |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Dominio público. Sin definir: `https://tufraganciaideal-self.vercel.app`. |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 (`G-…`). Vacío = no se carga. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel. Vacío = no se carga. |

Datos pendientes de confirmar: ver **`REVISION-MANUAL.md`**.

## Deploy en Vercel

1. Subí esta carpeta a un repo de GitHub.
2. En Vercel: **Add New → Project → Import** el repo.
3. Cuando tengas el dominio, cambiá `url` en `src/lib/site.ts`.

## Lo primero que tenés que editar

| Qué | Dónde |
| --- | --- |
| Precios y stock | `scripts/gen-rows.mjs` → `node scripts/gen-productos.mjs` (genera `src/data/productos.ts`) |
| Notas, descripciones, género | `scripts/gen-productos.mjs` |
| Fotos de los perfumes | `public/productos/<slug>.jpg` |
| WhatsApp de consultas, Instagram, dominio | `src/lib/site.ts` |
| Formas de pago y envíos | `src/components/Envios.tsx` |
| Garantía y plazo de devolución | `src/components/Originales.tsx` |
| Imagen para compartir en redes | `public/og.jpg` (1200×630, hay un placeholder) |
| Favicon | `src/app/icon.svg` |
| Paleta y tipografías | `src/app/globals.css` (bloque `@theme`) |

Buscá `TODO` en el proyecto: marqué cada dato que es placeholder.

> Las tipografías se bajan de Google Fonts **en el build** y quedan
> self-hosted en el bundle (sin pedidos a Google en runtime). Necesitás
> internet al correr `npm run build`; en Vercel eso es automático.

## Cómo funciona la compra

```
Ficha / vista rápida / tarjeta → "Hacer Pedido por WhatsApp"
        → wa.me/59897443176 con el perfume y su precio ya escritos

Carrito (Zustand, guarda slug + cantidad) → "Hacer Pedido por WhatsApp"
        → wa.me/59897443176 con cada línea, subtotales y total en UYU
```

- Los mensajes se arman en `src/lib/pedidoWhatsApp.ts`; el número sale de
  `site.whatsapp` en `src/lib/site.ts`.
- El carrito guarda solo `slug` y `cantidad`: el precio del mensaje siempre
  sale de `productos.ts`, así que un cambio de precio se refleja al instante.
- La web **no cobra**: disponibilidad, forma de pago y envío se confirman
  en el chat. Medios de pago: transferencia, efectivo cuando corresponda o
  link de Mercado Pago enviado por WhatsApp (Mercado Pago no está integrado).

### Disponibilidad

`disponibilidad()` en `productos.ts`, a partir de `gen-rows.mjs`:

| Estado | Columna 7 (`entregaInmediata`) | Columna 8 (`stock`) |
| --- | --- | --- |
| **En stock** — en Uruguay, listo para entregar | `true` | `1` |
| **A pedido** — se confirma disponibilidad y plazo | `false` | `1` |
| **Sin stock** | — | `0` |

### Analítica

GA4 + Meta Pixel (`src/components/Analytics.tsx`, `src/lib/analytics.ts`):
visitas, `view_item`/`ViewContent` en cada ficha, y `generate_lead`/`Contact`
en cada clic a WhatsApp (con origen del botón y perfume). Un clic a
WhatsApp es un **contacto**, nunca una compra.

## Precios

Todos en pesos uruguayos (UYU), IVA incluido, como número entero
(`precio_uyu: 3200`). Para cambiarlos:

1. `npm run precios` → genera `precios-actuales.csv` (tiene una columna
   vacía `precio_nuevo_uyu` para anotar los nuevos).
2. Editá la 3ª columna de cada fila en `scripts/gen-rows.mjs`.
3. `node scripts/gen-productos.mjs` → regenera `src/data/productos.ts`.

No edites `productos.ts` a mano: se pisa en la próxima corrida del generador.

## Fotos de producto

- Cuadradas, 1000×1000 px, el frasco **sellado** centrado sobre fondo oscuro o
  neutro. Mostrá la caja si podés: refuerza que es original.
- El nombre del archivo tiene que ser **exactamente** el `slug` del producto.
- Comprimilas en [squoosh.app](https://squoosh.app) antes de subirlas (~150 KB).
  `next/image` después las sirve en AVIF/WebP y en el tamaño justo para cada
  pantalla.

## Agregar un perfume

Copiá un objeto en `src/data/productos.ts`, cambiá los datos y poné la foto en
`public/productos/`. No hay que tocar ningún componente.

```ts
{
  slug: "creed-aventus",            // = nombre del archivo de la foto
  marca: "Creed",
  nombre: "Aventus",
  concentracion: "EDP",             // EDT | EDP | Parfum | Elixir
  volumen_ml: 100,
  precio_uyu: 38900,
  notas: {
    salida: ["Piña", "Bergamota"],
    corazon: ["Abedul", "Pachulí"],
    fondo: ["Almizcle", "Vainilla", "Roble"],
  },
  imagen: "/productos/creed-aventus.jpg",
  stock: 2,                         // 0 = agotado, no se puede comprar
  categoria: "nicho",               // arabes | disenador | nicho
  genero: "masculino",
  descripcion: "Una línea honesta de cuándo usarlo.",
  destacado: false,
}
```

## Estructura

```
src/
├─ app/
│  ├─ layout.tsx              tipografías, metadatos SEO, datos estructurados
│  ├─ page.tsx                arma la home con las secciones
│  ├─ globals.css             sistema de diseño (colores, tipos, utilidades)
│  ├─ sitemap.ts              /sitemap.xml automático
│  ├─ robots.ts               /robots.txt automático
│  └─ icon.svg                favicon
├─ components/
│  ├─ Header.tsx              nav fija, vidrio al scrollear, botón de carrito
│  ├─ Hero.tsx                titular + CTA
│  ├─ Frasco.tsx              el frasco animado del hero (SVG, ~3 KB)
│  ├─ Catalogo.tsx            grilla + filtro por familia
│  ├─ TarjetaProducto.tsx     ficha del frasco + agregar al carrito
│  ├─ BotonCarrito.tsx        botón con contador de unidades
│  ├─ CartDrawer.tsx          carrito lateral + pedido por WhatsApp
│  ├─ BotonPedidoWhatsApp.tsx botón "Hacer Pedido por WhatsApp"
│  ├─ Originales.tsx          garantía de autenticidad
│  ├─ Envios.tsx              pagos y envíos
│  └─ Footer.tsx
├─ data/productos.ts          el catálogo entero
└─ lib/
   ├─ cartStore.ts            carrito (Zustand + localStorage)
   ├─ pedidoWhatsApp.ts       mensajes de pedido para WhatsApp
   ├─ site.ts                 config: dominio, contacto, navegación
   ├─ format.ts               formato de pesos uruguayos
   └─ jsonld.ts               datos estructurados del catálogo para Google
```

## SEO

- Metadatos apuntados a *perfumes originales Uruguay*, *comprar perfumes online
  Uruguay* y *TuFraganciaIdeal*.
- `schema.org/Store` en `layout.tsx` + `ItemList` / `Product` con precio y
  disponibilidad generados desde `productos.ts`: Google puede mostrar el precio
  en el resultado de búsqueda.
- HTML semántico: un solo `<h1>`, secciones con `<section>`, productos en
  `<article>`, pirámide olfativa en `<dl>`.
- Todo el catálogo se renderiza en el servidor: Google lo ve sin ejecutar JS.

## Decisiones de diseño

- **Negros cálidos, no grises.** El fondo (`#14100C`) tiene tinte marrón: es el
  color del jugo en sombra, no un gris de dashboard.
- **El champán es del producto.** El dorado se reserva para precios, CTA y
  destacados. El verde vetiver aparece **solo** en la garantía de autenticidad
  y en el badge de las tarjetas, para que el ojo aprenda que verde = original
  verificado.
- **Una sola animación automática:** el frasco del hero al cargar. Todo lo demás
  se mueve cuando vos hacés algo (filtrar, agregar al carrito, abrir el panel).
  Si el sistema tiene "reducir movimiento" activado, nada se mueve.
