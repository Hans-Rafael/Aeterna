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
 * }} opts
 */
export async function crearPreferencia({ pedidoId, items, baseUrl, notificationUrl }) {
  const conRetorno = baseUrl.startsWith('https://');
  const retorno = `${baseUrl}/checkout/resultado?pedido=${pedidoId}`;

  const preferencia = await new Preference(cliente()).create(
    /** @type {any} */ ({
      body: {
        items: items.map((i) => ({ ...i, currency_id: 'ARS' })),
        external_reference: pedidoId,
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
