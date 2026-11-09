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

/** @param {{ name: string, qty: number, price: number }[]} lines */
const listaItems = (lines) =>
  lines.map((l) => `• ${l.qty} x ${l.name} (${formatPrice(l.price * l.qty)})`);

/**
 * Mensaje para enviar el comprobante de una transferencia por alias.
 * @param {{ id: string, customer_name: string, total: number, payer_name?: string | null, payer_cuit?: string | null, lineas: { name: string, qty: number, price: number }[] }} pedido
 * @param {{ alias: string, titular: string }} pago
 * @param {string} [referencia] código de identificación / nº de comprobante de la transferencia
 */
export function mensajeTransferencia(pedido, pago, referencia = '') {
  return [
    `¡Hola Aeterna! 🧼🕯️ Hice una transferencia por mi pedido #${pedido.id.slice(0, 8)}:`,
    '',
    ...listaItems(pedido.lineas),
    '',
    `Total: ${formatPrice(pedido.total)}`,
    `Alias: ${pago.alias} (${pago.titular})`,
    `Nombre: ${pedido.customer_name}`,
    '',
    'Datos de la transferencia:',
    `• Titular de la cuenta de origen: ${pedido.payer_name ?? '-'}`,
    `• CUIT/CUIL: ${pedido.payer_cuit ?? '-'}`,
    `• Código de identificación (ID COELSA / Nº de comprobante): ${referencia.trim() || '(te lo paso con el comprobante)'}`,
    '',
    'Te adjunto el comprobante. ¿Coordinamos la entrega en Escobar?',
    '¡Gracias!',
  ].join('\n');
}

/**
 * Mensaje para coordinar la entrega de un pedido ya pagado con Mercado Pago.
 * @param {{ id: string, customer_name: string, total: number, status: string, lineas: { name: string, qty: number, price: number }[] }} pedido
 */
export function mensajeCoordinacion(pedido) {
  return [
    `¡Hola Aeterna! 🧼🕯️ Hice el pedido #${pedido.id.slice(0, 8)} y pagué con Mercado Pago:`,
    '',
    ...listaItems(pedido.lineas),
    '',
    `Total: ${formatPrice(pedido.total)}`,
    `Nombre: ${pedido.customer_name}`,
    '',
    '¿Coordinamos la entrega (punto de encuentro o retiro en Escobar)?',
    '¡Gracias!',
  ].join('\n');
}
