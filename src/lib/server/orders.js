import { adminClient } from '#lib/server/supabaseAdmin.js';

/**
 * Crea el pedido con sus líneas. Los precios vienen del catálogo del servidor.
 * @param {{
 *   datos: { nombre: string, email: string, telefono: string, entrega: string, direccion: string | null },
 *   total: number,
 *   lineas: { product: { id: string, price: number }, qty: number }[],
 * }} opts
 */
export async function crearPedido({ datos, total, lineas }) {
  const db = adminClient();
  const { data: pedido, error } = await db
    .from('orders')
    .insert({
      status: 'pendiente',
      total,
      customer_name: datos.nombre,
      customer_email: datos.email,
      customer_phone: datos.telefono,
      delivery_type: datos.entrega,
      address: datos.direccion,
    })
    .select('id')
    .single();
  if (error) throw error;

  const { error: errorItems } = await db.from('order_items').insert(
    lineas.map((l) => ({
      order_id: pedido.id,
      product_id: l.product.id,
      quantity: l.qty,
      unit_price: l.product.price,
    }))
  );
  if (errorItems) throw errorItems;

  return pedido;
}

/** @param {string} pedidoId @param {string} preferenciaId */
export async function guardarPreferencia(pedidoId, preferenciaId) {
  const { error } = await adminClient()
    .from('orders')
    .update({ mp_preference_id: preferenciaId })
    .eq('id', pedidoId);
  if (error) throw error;
}

/** @param {string} pedidoId */
export async function estadoPedido(pedidoId) {
  const { data, error } = await adminClient()
    .from('orders')
    .select('id, status, total')
    .eq('id', pedidoId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Actualiza el estado según el pago de Mercado Pago.
 * Solo marca como pagado si el monto coincide con el total del pedido.
 * @param {string} pedidoId
 * @param {{ id: string | number, status: string, transaction_amount: number }} pago
 */
export async function aplicarPago(pedidoId, pago) {
  const pedido = await estadoPedido(pedidoId);
  if (!pedido) return 'no-encontrado';

  if (pago.status === 'approved') {
    if (Number(pago.transaction_amount) !== Number(pedido.total)) return 'monto-distinto';
    await actualizar(pedido.id, { status: 'pagado', mp_payment_id: String(pago.id) }, 'pendiente');
    return 'pagado';
  }
  if (pago.status === 'rejected' || pago.status === 'cancelled') {
    await actualizar(
      pedido.id,
      { status: 'rechazado', mp_payment_id: String(pago.id) },
      'pendiente'
    );
    return 'rechazado';
  }
  return 'sin-cambios';
}

/** Solo cambia el pedido si todavía está en `desdeEstado`, para no pisar pagos ya confirmados. */
/**
 * @param {string} pedidoId
 * @param {Record<string, unknown>} cambios
 * @param {string} desdeEstado
 */
async function actualizar(pedidoId, cambios, desdeEstado) {
  const { error } = await adminClient()
    .from('orders')
    .update(cambios)
    .eq('id', pedidoId)
    .eq('status', desdeEstado);
  if (error) throw error;
}
