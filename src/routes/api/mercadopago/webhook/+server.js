import { json } from '@sveltejs/kit';
import { firmaWebhookValida, obtenerPago } from '#lib/server/mercadopago.js';
import { aplicarPago } from '#lib/server/orders.js';

/**
 * Webhook de Mercado Pago. Mercado Pago lo llama cuando cambia el estado de un pago.
 * No confiamos en el contenido del aviso: consultamos el pago directo a la API.
 */
export async function POST({ request, url }) {
  // Firma: se exige si hay MP_WEBHOOK_SECRET (Mercado Pago > Tus integraciones > Webhooks).
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (secret) {
    const valida = firmaWebhookValida({
      xSignature: request.headers.get('x-signature'),
      xRequestId: request.headers.get('x-request-id'),
      dataId: url.searchParams.get('data.id'),
      secret,
    });
    if (!valida) return json({ ok: false, error: 'firma-invalida' }, { status: 401 });
  } else {
    console.warn('[mp] MP_WEBHOOK_SECRET sin configurar: webhook sin verificar firma');
  }

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
