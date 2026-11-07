import { formatPrice } from './format.js';

/**
 * Número de WhatsApp de Aeterna, con código de país y sin "+" ni espacios (ej. 5491123456789).
 */
export const WHATSAPP_NUMERO = '5491124016548';

/**
 * @param {string} [mensaje]
 * @returns {string}
 */
export function whatsappUrl(mensaje = '') {
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : '';
  return `https://wa.me/${WHATSAPP_NUMERO}${texto}`;
}

/**
 * Arma el mensaje del pedido para coordinar pago y entrega.
 * @param {{ name: string, qty: number, price: number }[]} lines
 * @param {number} total
 */
export function mensajePedido(lines, total) {
  const items = lines.map((l) => `• ${l.qty} x ${l.name} (${formatPrice(l.price * l.qty)})`);
  return [
    '¡Hola Aeterna! 🧼🕯️ Quiero hacer este pedido:',
    '',
    ...items,
    '',
    `Total: ${formatPrice(total)}`,
    '',
    '• Nombre:',
    '• Forma de pago: (Mercado Pago / Alias)',
    '• Entrega: (Punto de encuentro en Escobar / Retiro a coordinar)',
    '',
    '¡Gracias!',
  ].join('\n');
}
