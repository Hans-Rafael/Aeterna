import { pedidoConLineas } from '#lib/server/orders.js';
import { getPagoAlias } from '#lib/server/settings.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function load({ url }) {
  const id = url.searchParams.get('pedido');
  if (!id || !UUID.test(id)) return { pedido: null, pago: null };
  try {
    const pedido = await pedidoConLineas(id);
    if (!pedido || pedido.payment_method !== 'alias') return { pedido: null, pago: null };
    return { pedido, pago: await getPagoAlias() };
  } catch (err) {
    console.error('[alias] No se pudo leer el pedido:', err);
    return { pedido: null, pago: null };
  }
}
