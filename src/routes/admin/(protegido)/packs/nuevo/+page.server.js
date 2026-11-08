import { fail, redirect } from '@sveltejs/kit';
import { guardarPack, listComponentesPosibles } from '#lib/server/admin-products.js';
import { leerPackForm } from '#lib/server/pack-form.js';

export async function load() {
  return { candidatos: await listComponentesPosibles() };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const resultado = await leerPackForm(form, { requireFoto: false, slug: null });
    if (resultado.error) return fail(400, { error: resultado.error });

    await guardarPack({ id: null, fields: resultado.fields, componentes: resultado.componentes });
    redirect(303, '/admin?pack=creado');
  },
};
