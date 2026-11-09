import { fail, redirect } from '@sveltejs/kit';
import { getPagoAlias, setPagoAlias } from '#lib/server/settings.js';

export async function load() {
  return { pago: await getPagoAlias() };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const alias = String(form.get('alias') ?? '').trim();
    const titular = String(form.get('titular') ?? '').trim();
    if (!alias || !titular) return fail(400, { error: 'Alias y titular son obligatorios.' });
    if (alias.length > 60 || titular.length > 80) {
      return fail(400, { error: 'Alias o titular demasiado largo.' });
    }
    await setPagoAlias({ alias, titular });
    redirect(303, '/admin/ajustes?guardado=1');
  },
};
