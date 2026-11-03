import { fail, redirect } from '@sveltejs/kit';
import { getActiveProducts } from '#lib/server/catalog.js';
import { crearPreferencia } from '#lib/server/mercadopago.js';
import { crearPedido, guardarPreferencia } from '#lib/server/orders.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QTY = 99;

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, url }) => {
    const form = await request.formData();
    const datos = {
      nombre: String(form.get('nombre') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      telefono: String(form.get('telefono') ?? '').trim(),
      entrega: form.get('entrega') === 'envio' ? 'envio' : 'retiro',
      direccion: String(form.get('direccion') ?? '').trim() || null,
    };

    if (!datos.nombre || !EMAIL.test(datos.email) || !datos.telefono) {
      return fail(400, { error: 'Revisá nombre, email y teléfono.' });
    }
    if (datos.entrega === 'envio' && !datos.direccion) {
      return fail(400, { error: 'Para el envío necesitamos la dirección.' });
    }

    // El carrito llega como lista de { slug, qty }. El precio NUNCA viene del navegador.
    /** @type {{ slug: string, qty: number }[]} */
    let pedidoCarrito;
    try {
      pedidoCarrito = JSON.parse(String(form.get('carrito') ?? '[]'));
    } catch {
      return fail(400, { error: 'El carrito no es válido. Probá de nuevo.' });
    }
    if (
      !Array.isArray(pedidoCarrito) ||
      pedidoCarrito.length === 0 ||
      !pedidoCarrito.every(
        (i) =>
          typeof i.slug === 'string' && Number.isInteger(i.qty) && i.qty >= 1 && i.qty <= MAX_QTY
      )
    ) {
      return fail(400, { error: 'El carrito no es válido. Probá de nuevo.' });
    }

    const catalogo = /** @type {any[]} */ (await getActiveProducts());
    const lineas = [];
    for (const item of pedidoCarrito) {
      const product = catalogo.find((p) => p.slug === item.slug);
      // Productos de muestra no tienen id en la base: no se pueden cobrar.
      if (!product || !product.id) {
        return fail(400, {
          error: 'Algún producto del carrito ya no está disponible. Revisá el carrito.',
        });
      }
      lineas.push({ product, qty: item.qty });
    }

    const total = lineas.reduce((sum, l) => sum + l.product.price * l.qty, 0);

    const pedido = await crearPedido({ datos, total, lineas });

    // Mercado Pago necesita una URL pública para avisar del pago. En localhost no la usamos.
    const esLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const preferencia = await crearPreferencia({
      pedidoId: pedido.id,
      items: lineas.map((l) => ({
        title: `${l.product.name} (${l.product.fragrance})`,
        quantity: l.qty,
        unit_price: l.product.price,
      })),
      baseUrl: url.origin,
      notificationUrl: esLocal ? null : `${url.origin}/api/mercadopago/webhook`,
    });

    await guardarPreferencia(pedido.id, String(preferencia.id));
    redirect(303, String(preferencia.init_point), { external: true });
  },
};
