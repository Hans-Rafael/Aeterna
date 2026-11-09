import { fail, redirect } from '@sveltejs/kit';
import { normalizarCuit } from '#lib/cuit.js';
import { MINUTOS_RESERVA } from '#lib/envio.js';
import { getActiveProducts } from '#lib/server/catalog.js';
import { crearPreferencia } from '#lib/server/mercadopago.js';
import {
  SinStockError,
  crearPedido,
  guardarPreferencia,
  vencerPedidosViejos,
} from '#lib/server/orders.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_QTY = 99;

/** @param {FormDataEntryValue | null} valor */
const texto = (valor) => String(valor ?? '').trim();

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, url }) => {
    const form = await request.formData();

    // Solo hay retiro / punto de encuentro en Escobar (se coordina por WhatsApp). No hay envíos.
    const datos = {
      nombre: texto(form.get('nombre')),
      email: texto(form.get('email')),
      telefono: texto(form.get('telefono')),
      entrega: 'retiro',
      envio: null,
    };

    const metodoPago = texto(form.get('metodo_pago')) === 'alias' ? 'alias' : 'mercadopago';

    // Transferencia: necesitamos saber quién transfiere para cruzarlo con el banco.
    /** @type {{ nombre: string, cuit: string } | null} */
    let pagador = null;
    if (metodoPago === 'alias') {
      const nombrePagador = texto(form.get('pagador_nombre'));
      const cuit = normalizarCuit(texto(form.get('pagador_cuit')));
      const recuerdo = {
        metodo_pago: 'alias',
        pagador_nombre: nombrePagador,
        pagador_cuit: texto(form.get('pagador_cuit')),
      };
      if (!nombrePagador || !cuit) {
        return fail(400, {
          error:
            'Para pagar por alias indicá el nombre completo y un CUIT/CUIL válido de quien transfiere.',
          ...datos,
          ...recuerdo,
        });
      }
      pagador = { nombre: nombrePagador, cuit };
    }

    if (!datos.nombre || !EMAIL.test(datos.email) || !datos.telefono) {
      return fail(400, { error: 'Revisá nombre, email y teléfono.', ...datos });
    }

    // El carrito llega como lista de { slug, qty }. El precio NUNCA viene del navegador.
    /** @type {{ slug: string, qty: number }[]} */
    let pedidoCarrito;
    try {
      pedidoCarrito = JSON.parse(texto(form.get('carrito')) || '[]');
    } catch {
      return fail(400, { error: 'El carrito no es válido. Probá de nuevo.', ...datos });
    }
    if (
      !Array.isArray(pedidoCarrito) ||
      pedidoCarrito.length === 0 ||
      !pedidoCarrito.every(
        (i) =>
          typeof i.slug === 'string' && Number.isInteger(i.qty) && i.qty >= 1 && i.qty <= MAX_QTY
      )
    ) {
      return fail(400, { error: 'El carrito no es válido. Probá de nuevo.', ...datos });
    }

    const catalogo = /** @type {any[]} */ (await getActiveProducts());
    const lineas = [];
    for (const item of pedidoCarrito) {
      const product = catalogo.find((p) => p.slug === item.slug);
      // Productos de muestra no tienen id en la base: no se pueden cobrar.
      if (!product || !product.id) {
        return fail(400, {
          error: 'Algún producto del carrito ya no está disponible. Revisá el carrito.',
          ...datos,
        });
      }
      lineas.push({ product, qty: item.qty });
    }

    // Stock a descontar: un pack descuenta las unidades de sus componentes.
    /** @type {{ product_id: string, qty: number }[]} */
    const reservas = [];
    for (const l of lineas) {
      if (l.product.isPack) {
        for (const c of l.product.componentes ?? []) {
          reservas.push({ product_id: c.product_id, qty: c.quantity * l.qty });
        }
      } else {
        reservas.push({ product_id: l.product.id, qty: l.qty });
      }
    }

    // Liberamos el stock de pedidos viejos que nunca se pagaron.
    await vencerPedidosViejos(MINUTOS_RESERVA);

    let pedido;
    try {
      pedido = await crearPedido({ datos, costoEnvio: 0, lineas, reservas, metodoPago, pagador });
    } catch (err) {
      if (err instanceof SinStockError) {
        return fail(409, {
          error: 'Alguno de los productos ya no tiene stock suficiente. Revisá el carrito.',
          ...datos,
        });
      }
      throw err;
    }

    if (metodoPago === 'alias') redirect(303, `/checkout/alias?pedido=${pedido.id}`);

    // Mercado Pago necesita una URL pública para avisar del pago. En localhost no la usamos.
    const esLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const items = lineas.map((l) => ({
      title: `${l.product.name} (${l.product.fragrance})`,
      quantity: l.qty,
      unit_price: l.product.price,
    }));

    const preferencia = await crearPreferencia({
      pedidoId: pedido.id,
      items,
      baseUrl: url.origin,
      notificationUrl: esLocal ? null : `${url.origin}/api/mercadopago/webhook`,
      payer: { name: datos.nombre, email: datos.email },
    });

    await guardarPreferencia(pedido.id, String(preferencia.id));
    redirect(303, String(preferencia.init_point), { external: true });
  },
};
