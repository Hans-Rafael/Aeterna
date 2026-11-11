import { createHmac, timingSafeEqual } from 'node:crypto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

function cliente() {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('Falta MP_ACCESS_TOKEN en el .env (o en Vercel)');
  return new MercadoPagoConfig({ accessToken });
}

/**
 * Crea la preferencia de Checkout Pro y devuelve su `init_point` (URL de pago).
 * Mercado Pago solo acepta URLs de retorno https, así que en localhost no las enviamos.
 * @param {{
 *   pedidoId: string,
 *   items: { title: string, quantity: number, unit_price: number }[],
 *   baseUrl: string,
 *   notificationUrl: string | null,
 *   payer: { name: string, email: string },
 * }} opts
 */
export async function crearPreferencia({ pedidoId, items, baseUrl, notificationUrl, payer }) {
  const conRetorno = baseUrl.startsWith('https://');
  const retorno = `${baseUrl}/checkout/resultado?pedido=${pedidoId}`;

  const preferencia = await new Preference(cliente()).create(
    /** @type {any} */ ({
      body: {
        items: items.map((i) => ({ ...i, currency_id: 'ARS' })),
        external_reference: pedidoId,
        payer: { name: payer.name, email: payer.email },
        ...(conRetorno
          ? {
              back_urls: { success: retorno, failure: retorno, pending: retorno },
              auto_return: 'approved',
            }
          : {}),
        ...(notificationUrl ? { notification_url: notificationUrl } : {}),
      },
    })
  );
  return preferencia;
}

/** Consulta un pago directo a Mercado Pago (no confiamos en el cuerpo del webhook). */
/** @param {string | number} id */
export async function obtenerPago(id) {
  return new Payment(cliente()).get({ id });
}

/**
 * Verifica la firma `x-signature` de un webhook de Mercado Pago.
 * Manifiesto firmado: `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` con HMAC SHA256.
 * @param {{ xSignature: string | null, xRequestId: string | null, dataId: string | null, secret: string }} opts
 */
export function firmaWebhookValida({ xSignature, xRequestId, dataId, secret }) {
  if (!xSignature) return false;
  const partes = Object.fromEntries(
    xSignature.split(',').map((p) => {
      const [k, ...v] = p.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const { ts, v1 } = partes;
  if (!ts || !v1) return false;

  // Mercado Pago pide el id en minúsculas cuando es alfanumérico.
  const id = dataId ? dataId.toLowerCase() : '';
  let manifiesto = '';
  if (id) manifiesto += `id:${id};`;
  if (xRequestId) manifiesto += `request-id:${xRequestId};`;
  manifiesto += `ts:${ts};`;

  const esperada = createHmac('sha256', secret).update(manifiesto).digest('hex');
  const a = Buffer.from(v1);
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}
