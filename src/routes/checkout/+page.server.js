import { fail, redirect } from '@sveltejs/kit';
import { COSTO_ENVIO, MINUTOS_RESERVA, PROVINCIAS } from '#lib/envio.js';
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
    const entrega = form.get('entrega') === 'envio' ? 'envio' : 'retiro';

    const datos = {
      nombre: texto(form.get('nombre')),
      email: texto(form.get('email')),
      telefono: texto(form.get('telefono')),
      entrega,
      /** @type {null | { codigoPostal: string, provincia: string, localidad: string, calle: string, numero: string, pisoDepto: string | null, notas: string | null }} */
      envio: null,
    };

    if (!datos.nombre || !EMAIL.test(datos.email) || !datos.telefono) {
      return fail(400, { error: 'Revisá nombre, email y teléfono.', ...datos, envio: undefined });
    }

    if (entrega === 'envio') {
      const envio = {
        codigoPostal: texto(form.get('codigoPostal')),
        provincia: texto(form.get('provincia')),
        localidad: texto(form.get('localidad')),
        calle: texto(form.get('calle')),
        numero: texto(form.get('numero')),
        pisoDepto: texto(form.get('pisoDepto')) || null,
        notas: texto(form.get('notas')) || null,
      };
      const faltan = !envio.codigoPostal || !envio.localidad || !envio.calle || !envio.numero;
      if (faltan) {
        return fail(400, {
          error: 'Para el envío completá código postal, localidad, calle y número.',
          ...datos,
        });
      }
      if (!PROVINCIAS.includes(envio.provincia)) {
        return fail(400, { error: 'Elegí una provincia válida.', ...datos });
      }
      datos.envio = envio;
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

    // Si el cliente pidió envío, todos los productos del carrito tienen que admitirlo.
    if (entrega === 'envio' && lineas.some((l) => l.product.delivery === false)) {
      return fail(400, {
        error:
          'Alguno de los productos de tu carrito solo se puede retirar en persona. Elegí retiro o quitalo del carrito.',
        ...datos,
      });
    }

    // Envío: se cobra salvo que todos los productos del carrito lo tengan incluido.
    const costoEnvio =
      entrega === 'envio' && !lineas.every((l) => l.product.envioIncluido) ? COSTO_ENVIO : 0;

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
      pedido = await crearPedido({ datos, costoEnvio, lineas, reservas });
    } catch (err) {
      if (err instanceof SinStockError) {
        return fail(409, {
          error: 'Alguno de los productos ya no tiene stock suficiente. Revisá el carrito.',
          ...datos,
        });
      }
      throw err;
    }

    // Mercado Pago necesita una URL pública para avisar del pago. En localhost no la usamos.
    const esLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const items = lineas.map((l) => ({
      title: `${l.product.name} (${l.product.fragrance})`,
      quantity: l.qty,
      unit_price: l.product.price,
    }));
    if (costoEnvio > 0) {
      items.push({ title: 'Envío a domicilio', quantity: 1, unit_price: costoEnvio });
    }

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
