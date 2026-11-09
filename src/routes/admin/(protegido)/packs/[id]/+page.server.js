import { error, fail, redirect } from '@sveltejs/kit';
import {
  aplicarFotosExtra,
  getPackComponentes,
  getProductById,
  guardarPack,
  listComponentesPosibles,
  publicImageUrl,
} from '#lib/server/admin-products.js';
import { leerPackForm } from '#lib/server/pack-form.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const pack = await getProductById(params.id);
  if (!pack || !pack.is_pack) error(404, 'Pack no encontrado');
  return {
    pack,
    componentes: await getPackComponentes(params.id),
    candidatos: await listComponentesPosibles(),
    imageUrl: publicImageUrl(pack.image_path),
    extras: (pack.extra_images ?? []).map((/** @type {string} */ path) => ({
      path,
      url: publicImageUrl(path),
    })),
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, params }) => {
    const pack = await getProductById(params.id);
    if (!pack || !pack.is_pack) error(404, 'Pack no encontrado');

    const form = await request.formData();
    const resultado = await leerPackForm(form, { requireFoto: false, slug: pack.slug });
    if (resultado.error) return fail(400, { error: resultado.error });

    const errorFotos = await aplicarFotosExtra(form, pack, resultado.fields);
    if (errorFotos) return fail(400, { error: errorFotos });

    await guardarPack({
      id: params.id,
      fields: resultado.fields,
      componentes: resultado.componentes,
    });
    redirect(303, `/admin/packs/${params.id}?guardado=1`);
  },
};
