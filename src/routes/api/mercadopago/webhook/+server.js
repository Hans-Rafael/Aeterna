import { json } from '@sveltejs/kit';
import { obtenerPago } from '#lib/server/mercadopago.js';
import { aplicarPago } from '#lib/server/orders.js';

/**
 * Webhook de Mercado Pago. Mercado Pago lo llama cuando cambia el estado de un pago.
 * No confiamos en el contenido del aviso: consultamos el pago directo a la API.
 */
export async function POST({ request, url }) {
  /** @type {any} */
  let body = {};
  try {
    body = await request.json();
  } catch {
    // aviso sin cuerpo JSON: se toma el id de la URL más abajo
  }

  const tipo = body.type ?? url.searchParams.get('type') ?? url.searchParams.get('topic');
  const id = body?.data?.id ?? url.searchParams.get('data.id') ?? url.searchParams.get('id');
  if (tipo !== 'payment' || !id) return json({ ok: true, ignorado: true });

  // Si la consulta falla, respondemos 500 para que Mercado Pago reintente.
  const pago = await obtenerPago(id);
  if (!pago.external_reference) return json({ ok: true, sinPedido: true });

  const resultado = await aplicarPago(pago.external_reference, /** @type {any} */ (pago));
  if (resultado === 'monto-distinto') {
    console.error(`[mp] Pago ${pago.id} con monto distinto al pedido ${pago.external_reference}`);
  }
  return json({ ok: true, resultado });
}
