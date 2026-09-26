import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { buscarProducto, imagenUrl } from "@/data/productos";
import { site } from "@/lib/site";

/**
 * CHECKOUT — Mercado Pago Uruguay (Checkout Pro)
 *
 * Recibe una lista de { slug, cantidad }, arma la preferencia de pago y
 * devuelve la URL a la que hay que redirigir al comprador.
 *
 * Regla de oro: el navegador NO manda precios. Acá se recalcula todo contra
 * `productos.ts`. Si alguien edita el localStorage para pagar $1, se le cobra
 * el precio real igual.
 *
 * ⚙️ Variables de entorno (Vercel → Settings → Environment Variables):
 *   MP_ACCESS_TOKEN       Access Token de producción de tu cuenta de Mercado Pago
 *   NEXT_PUBLIC_SITE_URL  https://tudominio.uy  (sin barra final)
 *
 * Mientras probás, usá las credenciales de TEST y un usuario de prueba.
 */

// Necesita Node, no Edge: el SDK de Mercado Pago usa módulos de Node.
export const runtime = "nodejs";

type ItemEntrante = { slug: unknown; cantidad: unknown };

const MAX_UNIDADES_POR_PRODUCTO = 10;

export async function POST(request: Request) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    console.error("Falta MP_ACCESS_TOKEN en las variables de entorno.");
    return NextResponse.json(
      { error: "El pago no está configurado todavía. Escribinos y te ayudamos." },
      { status: 500 },
    );
  }

  // ── 1. Validar lo que llegó ────────────────────────────────────────────
  let cuerpo: { items?: ItemEntrante[] };
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const entrantes = Array.isArray(cuerpo.items) ? cuerpo.items : [];
  if (entrantes.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  // ── 2. Recalcular precios y stock contra el catálogo real ──────────────
  const items = [];
  for (const entrante of entrantes) {
    if (typeof entrante?.slug !== "string") {
      return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
    }

    const producto = buscarProducto(entrante.slug);
    if (!producto) {
      return NextResponse.json(
        { error: "Uno de los productos ya no está disponible." },
        { status: 400 },
      );
    }

    const cantidad = Math.floor(Number(entrante.cantidad));
    if (!Number.isFinite(cantidad) || cantidad < 1) {
      return NextResponse.json({ error: "Cantidad inválida." }, { status: 400 });
    }
    if (cantidad > Math.min(producto.stock, MAX_UNIDADES_POR_PRODUCTO)) {
      const unidades =
        producto.stock === 1 ? "1 unidad" : `${producto.stock} unidades`;
      return NextResponse.json(
        { error: `Nos queda${producto.stock === 1 ? "" : "n"} ${unidades} de ${producto.nombre}.` },
        { status: 409 },
      );
    }

    items.push({
      id: producto.slug,
      title: `${producto.casa} ${producto.nombre}`,
      description: `${producto.concentracion} ${producto.volumen_ml} ml · Original sellado`,
      picture_url: `${site.url}${imagenUrl(producto)}`,
      category_id: "fragrances",
      quantity: cantidad,
      unit_price: producto.precio_uyu,
      currency_id: "UYU",
    });
  }

  // ── 3. Crear la preferencia ────────────────────────────────────────────
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? site.url).replace(/\/$/, "");
  const cliente = new MercadoPagoConfig({ accessToken: token });

  // Mercado Pago rechaza la preferencia si `auto_return` o `notification_url`
  // apuntan a una URL que no puede alcanzar desde internet. En local eso haría
  // fallar TODO el checkout, así que ahí los omitimos: el pago funciona igual,
  // solo que el retorno al sitio queda manual.
  const urlPublica = !/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|\/|$)/i.test(
    base,
  );

  try {
    const preferencia = await new Preference(cliente).create({
      body: {
        items,

        back_urls: {
          success: `${base}/compra/exito`,
          failure: `${base}/compra/error`,
          pending: `${base}/compra/pendiente`,
        },
        // Vuelve solo al sitio cuando el pago se aprueba.
        // (En localhost se omite: Mercado Pago no acepta URLs que no sean públicas.)
        ...(urlPublica ? { auto_return: "approved" as const } : {}),

        // false a propósito: Abitab y Redpagos generan un pago PENDIENTE que se
        // acredita cuando la persona va a pagar. Con binary_mode en true, Mercado
        // Pago los rechazaría y perderías esas ventas.
        binary_mode: false,

        payment_methods: {
          // Sin exclusiones quedan habilitadas las tarjetas locales (OCA, Visa,
          // Mastercard) y las redes de cobranza en efectivo (Abitab, Redpagos).
          excluded_payment_types: [],
          excluded_payment_methods: [],
          installments: 12,
        },

        // Aparece así en el resumen de la tarjeta del comprador.
        statement_descriptor: "TUFRAGANCIAIDEAL",

        // Tu número de orden interno. Cambialo por el ID real cuando tengas
        // base de datos: es lo que te permite cruzar pago ↔ pedido.
        external_reference: `TFI-${Date.now()}`,

        // 🔔 Webhook: Mercado Pago avisa acá cuándo se aprueba un pago.
        // Creá /api/webhooks/mercadopago cuando quieras descontar stock y
        // registrar la venta automáticamente. En local no se manda: MP no puede
        // alcanzar tu máquina y rechazaría la preferencia entera.
        ...(urlPublica
          ? { notification_url: `${base}/api/webhooks/mercadopago` }
          : {}),

        // La preferencia caduca en 24 h para no dejar links de pago viejos vivos.
        expires: true,
        expiration_date_to: new Date(Date.now() + 86_400_000).toISOString(),
      },
    });

    const url = preferencia.init_point ?? preferencia.sandbox_init_point;
    if (!url) throw new Error("Mercado Pago no devolvió el link de pago.");

    return NextResponse.json({ url, preferenciaId: preferencia.id });
  } catch (error) {
    console.error("Error creando la preferencia de Mercado Pago:", error);
    return NextResponse.json(
      { error: "No pudimos iniciar el pago. Probá de nuevo en unos minutos." },
      { status: 502 },
    );
  }
}
