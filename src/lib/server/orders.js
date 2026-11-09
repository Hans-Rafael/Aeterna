import { adminClient } from '#lib/server/supabaseAdmin.js';

/** Error cuando algún producto no tiene stock suficiente. */
export class SinStockError extends Error {}

/**
 * Crea el pedido con sus líneas y reserva el stock.
 * Si no hay stock suficiente, borra el pedido y lanza SinStockError.
 * Los precios vienen del catálogo del servidor.
 * @param {{
 *   datos: {
 *     nombre: string, email: string, telefono: string, entrega: string,
 *     envio: { codigoPostal: string, provincia: string, localidad: string, calle: string,
 *              numero: string, pisoDepto: string | null, notas: string | null } | null,
 *   },
 *   costoEnvio: number,
 *   metodoPago?: 'mercadopago' | 'alias',
 *   pagador?: { nombre: string, cuit: string } | null,
 *   lineas: { product: { id: string, price: number }, qty: number }[],
 *   reservas: { product_id: string, qty: number }[],
 * }} opts
 */
export async function crearPedido({
  datos,
  costoEnvio,
  lineas,
  reservas,
  metodoPago = 'mercadopago',
  pagador = null,
}) {
  const db = adminClient();
  const productos = lineas.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const envio = datos.envio;

  const { data: pedido, error } = await db
    .from('orders')
    .insert({
      status: 'pendiente',
      payment_method: metodoPago,
      ...(pagador ? { payer_name: pagador.nombre, payer_cuit: pagador.cuit } : {}),
      total: productos + costoEnvio,
      shipping_cost: costoEnvio,
      customer_name: datos.nombre,
      customer_email: datos.email || null,
      customer_phone: datos.telefono,
      delivery_type: datos.entrega,
      address: envio
        ? `${envio.calle} ${envio.numero}, ${envio.localidad}, ${envio.provincia}`
        : null,
      postal_code: envio?.codigoPostal ?? null,
      province: envio?.provincia ?? null,
      city: envio?.localidad ?? null,
      street: envio?.calle ?? null,
      street_number: envio?.numero ?? null,
      floor_apartment: envio?.pisoDepto ?? null,
      notes: envio?.notas ?? null,
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
  if (errorItems) {
    await db.from('orders').delete().eq('id', pedido.id);
    throw errorItems;
  }

  const { error: errorStock } = await db.rpc('reservar_stock', {
    p_items: reservas,
  });
  if (errorStock) {
    // El pedido no se creó de verdad: lo borramos junto con sus líneas.
    await db.from('orders').delete().eq('id', pedido.id);
    if (String(errorStock.message).includes('sin_stock')) throw new SinStockError();
    throw errorStock;
  }

  return pedido;
}

/**
 * Vence pedidos pendientes viejos para liberar su stock.
 * @param {number} minutos
 */
export async function vencerPedidosViejos(minutos) {
  const { error } = await adminClient().rpc('vencer_pedidos', { p_minutos: minutos });
  if (error) console.error('[pedidos] No se pudieron vencer pedidos:', error.message);
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
    .select('id, status, total, payment_method, customer_name')
    .eq('id', pedidoId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Pedido con sus líneas (nombre y cantidad), para armar mensajes de WhatsApp.
 * @param {string} pedidoId
 */
export async function pedidoConLineas(pedidoId) {
  const pedido = await estadoPedido(pedidoId);
  if (!pedido) return null;
  const { data: extra } = await adminClient()
    .from('orders')
    .select('payer_name, payer_cuit')
    .eq('id', pedidoId)
    .maybeSingle();
  const { data, error } = await adminClient()
    .from('order_items')
    .select('quantity, unit_price, products(name)')
    .eq('order_id', pedidoId);
  if (error) throw error;
  const lineas = (data ?? []).map((/** @type {any} */ l) => ({
    name: l.products?.name ?? 'Producto',
    qty: l.quantity,
    price: l.unit_price,
  }));
  return {
    ...pedido,
    payer_name: extra?.payer_name ?? null,
    payer_cuit: extra?.payer_cuit ?? null,
    lineas,
  };
}

/** Pedidos más recientes para el admin. */
export async function listarPedidos() {
  const { data, error } = await adminClient()
    .from('orders')
    .select(
      'id, status, total, payment_method, customer_name, customer_phone, payer_name, payer_cuit, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data;
}

/**
 * Marca como pagado un pedido pendiente o vencido (pago por alias confirmado a mano).
 * @param {string} pedidoId
 */
export async function marcarPagado(pedidoId) {
  const pedido = await estadoPedido(pedidoId);
  if (!pedido) return;
  if (pedido.status === 'pendiente' || pedido.status === 'vencido') {
    await actualizar(pedidoId, { status: 'pagado' }, pedido.status);
  }
}

/** @param {string} pedidoId */
export async function marcarEntregado(pedidoId) {
  await actualizar(pedidoId, { status: 'entregado' }, 'pagado');
}

/**
 * Cancela un pedido pendiente y devuelve su stock.
 * @param {string} pedidoId
 */
export async function cancelarPedido(pedidoId) {
  const { error } = await adminClient().rpc('liberar_pedido', {
    p_order_id: pedidoId,
    p_nuevo_estado: 'rechazado',
  });
  if (error) throw error;
}

/**
 * Actualiza el estado según el pago de Mercado Pago.
 * Solo marca como pagado si el monto coincide con el total del pedido.
 * Si el pedido ya había vencido y el pago igual se aprobó, se marca pagado y se avisa en el log.
 * @param {string} pedidoId
 * @param {{ id: string | number, status: string, transaction_amount: number }} pago
 */
export async function aplicarPago(pedidoId, pago) {
  const pedido = await estadoPedido(pedidoId);
  if (!pedido) return 'no-encontrado';

  if (pago.status === 'approved') {
    if (Number(pago.transaction_amount) !== Number(pedido.total)) return 'monto-distinto';
    if (pedido.status === 'vencido') {
      console.warn(
        `[mp] Pago ${pago.id} aprobado para un pedido vencido ${pedidoId}: revisar stock`
      );
    }
    if (pedido.status === 'pendiente' || pedido.status === 'vencido') {
      await actualizar(
        pedido.id,
        { status: 'pagado', mp_payment_id: String(pago.id) },
        pedido.status
      );
    }
    return 'pagado';
  }
  if (pago.status === 'rejected' || pago.status === 'cancelled') {
    if (pedido.status === 'pendiente') {
      const { error } = await adminClient().rpc('liberar_pedido', {
        p_order_id: pedido.id,
        p_nuevo_estado: 'rechazado',
      });
      if (error) throw error;
      await actualizar(pedido.id, { mp_payment_id: String(pago.id) }, 'rechazado');
    }
    return 'rechazado';
  }
  return 'sin-cambios';
}

/**
 * Solo cambia el pedido si todavía está en `desdeEstado`, para no pisar pagos ya confirmados.
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
