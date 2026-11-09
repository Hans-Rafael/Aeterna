import { fail } from '@sveltejs/kit';
import {
  cancelarPedido,
  listarPedidos,
  marcarEntregado,
  marcarPagado,
} from '#lib/server/orders.js';

export async function load() {
  return { pedidos: await listarPedidos() };
}

/** @param {FormData} form */
const idDe = (form) => String(form.get('id') ?? '');

/** @type {import('./$types').Actions} */
export const actions = {
  pagado: async ({ request }) => {
    const id = idDe(await request.formData());
    if (!id) return fail(400);
    await marcarPagado(id);
  },
  entregado: async ({ request }) => {
    const id = idDe(await request.formData());
    if (!id) return fail(400);
    await marcarEntregado(id);
  },
  cancelar: async ({ request }) => {
    const id = idDe(await request.formData());
    if (!id) return fail(400);
    await cancelarPedido(id);
  },
};
