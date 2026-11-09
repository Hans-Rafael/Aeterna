import { pedidoConLineas } from '#lib/server/orders.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** El estado sale de la base, no de los parámetros de la URL. */
export async function load({ url }) {
  const id = url.searchParams.get('pedido');
  if (!id || !UUID.test(id)) return { pedido: null };
  try {
    return { pedido: await pedidoConLineas(id) };
  } catch (err) {
    console.error('[resultado] No se pudo leer el pedido:', err);
    return { pedido: null };
  }
}
