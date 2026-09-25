# TuFraganciaIdeal

E-commerce de perfumes originales sellados. Next.js 15 (App Router) +
Tailwind v4 + Framer Motion + Zustand, con checkout de Mercado Pago Uruguay.
Pensado para deployear en Vercel.

## Arrancar

```bash
npm install
cp .env.example .env.local   # y completá las credenciales
npm run dev                  # http://localhost:3000
```

## Variables de entorno

| Variable | Qué es |
| --- | --- |
| `MP_ACCESS_TOKEN` | Access Token de Mercado Pago. TEST mientras probás, producción al publicar. Nunca lo subas al repo. |
| `NEXT_PUBLIC_SITE_URL` | URL pública sin barra final. En local `http://localhost:3000`. |

Las sacás de <https://www.mercadopago.com.uy/developers/panel/app>. En Vercel se
cargan en **Settings → Environment Variables** (y después redeploy).

## Deploy en Vercel

1. Subí esta carpeta a un repo de GitHub.
2. En Vercel: **Add New → Project → Import** el repo.
3. Cargá las dos variables de entorno.
4. Cuando tengas el dominio, cambiá `url` en `src/lib/site.ts`.

## Lo primero que tenés que editar

| Qué | Dónde |
| --- | --- |
| Perfumes, precios, stock, notas | `src/data/productos.ts` |
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
Tarjeta → "Agregar al carrito"           (Zustand, guarda slug + cantidad)
        → CartDrawer                     (abre, muestra total en UYU)
        → "Finalizar compra"
        → POST /api/checkout             (el servidor RECALCULA precios y stock)
        → Preference de Mercado Pago
        → redirect al Checkout Pro
        → /compra/exito | /compra/pendiente | /compra/error
```

Dos decisiones que importan:

- **El navegador nunca manda precios.** El carrito guarda solo `slug` y
  `cantidad`; `/api/checkout` busca cada producto en `productos.ts` y arma la
  preferencia con el precio real. Editar el localStorage no sirve de nada.
- **`binary_mode: false`.** Abitab y Redpagos generan un pago *pendiente* que se
  acredita cuando la persona va a pagar. Con `binary_mode: true` Mercado Pago
  los rechazaría y perderías esas ventas.

### Lo que todavía falta para operar en serio

El checkout cobra bien, pero el sitio **no sabe** que cobró. Antes de vender de
verdad te faltan dos cosas:

1. **Webhook** en `/api/webhooks/mercadopago`: Mercado Pago avisa ahí cuándo se
   aprueba un pago. Es lo que te permite confirmar la venta sin mirar el panel.
   La `notification_url` ya está configurada apuntando a esa ruta.
2. **Stock real**: hoy vive en `productos.ts`, o sea que se descuenta a mano.
   Dos personas pueden comprar la última unidad al mismo tiempo. Con el webhook
   + una base (Vercel Postgres, Supabase) eso se resuelve.

Mientras tanto: revisá el panel de Mercado Pago después de cada venta y bajá el
`stock` en el archivo.

### Probar el pago sin plata real

Con el Access Token de TEST, creá un usuario de prueba comprador en el panel de
Mercado Pago y usá sus tarjetas de test. Las compras de prueba no se cobran.

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
│  ├─ api/checkout/route.ts   crea la preferencia de Mercado Pago
│  ├─ compra/exito|pendiente|error/   retorno del checkout
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
│  ├─ CartDrawer.tsx          carrito lateral + finalizar compra
│  ├─ Originales.tsx          garantía de autenticidad
│  ├─ Envios.tsx              pagos y envíos
│  ├─ EstadoCompra.tsx        pantallas de retorno de Mercado Pago
│  └─ Footer.tsx
├─ data/productos.ts          el catálogo entero
└─ lib/
   ├─ cartStore.ts            carrito (Zustand + localStorage)
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
