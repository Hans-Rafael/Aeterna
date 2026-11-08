import { error, fail, redirect } from '@sveltejs/kit';
import {
  getProductById,
  publicImageUrl,
  updateProduct,
  uploadProductImage,
} from '#lib/server/admin-products.js';

const MAX_FOTO_BYTES = 5 * 1024 * 1024;
const MAX_EXTRAS = 6;
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const product = await getProductById(params.id);
  if (!product) error(404, 'Producto no encontrado');
  return {
    product,
    imageUrl: publicImageUrl(product.image_path),
    extras: (product.extra_images ?? []).map((/** @type {string} */ path) => ({
      path,
      url: publicImageUrl(path),
    })),
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, params }) => {
    const product = await getProductById(params.id);
    if (!product) error(404, 'Producto no encontrado');

    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim();
    const fragrance = String(form.get('fragrance') ?? '').trim();
    const description = String(form.get('description') ?? '').trim();
    const category = String(form.get('category') ?? '');
    const price = Number.parseInt(String(form.get('price') ?? ''), 10);
    const stock = Number.parseInt(String(form.get('stock') ?? '0'), 10);

    if (!name || !fragrance) return fail(400, { error: 'Nombre y fragancia son obligatorios.' });
    if (!['jabon', 'vela'].includes(category)) return fail(400, { error: 'Categoría inválida.' });
    if (!Number.isInteger(price) || price < 0) return fail(400, { error: 'Precio inválido.' });
    if (!Number.isInteger(stock) || stock < 0) return fail(400, { error: 'Stock inválido.' });

    /** @type {Record<string, unknown>} */
    const cambios = {
      name,
      fragrance,
      description,
      category,
      price,
      stock,
      featured: form.get('featured') === 'on',
      active: form.get('active') === 'on',
      delivery: form.get('delivery') === 'on',
    };

    const foto = form.get('foto');
    if (foto instanceof File && foto.size > 0) {
      if (!TIPOS_FOTO.includes(foto.type)) {
        return fail(400, { error: 'La foto debe ser JPG, PNG o WebP.' });
      }
      if (foto.size > MAX_FOTO_BYTES) {
        return fail(400, { error: 'La foto supera los 5 MB.' });
      }
      cambios.image_path = await uploadProductImage(foto, product.slug);
    }

    // Fotos de contexto: quitar las marcadas y sumar las nuevas.
    const quitar = new Set(form.getAll('quitar_extra').map(String));
    const extras = (product.extra_images ?? []).filter(
      (/** @type {string} */ path) => !quitar.has(path)
    );
    const nuevas = form.getAll('fotos_extra').filter((f) => f instanceof File && f.size > 0);
    for (const f of /** @type {File[]} */ (nuevas)) {
      if (!TIPOS_FOTO.includes(f.type)) {
        return fail(400, { error: 'Las fotos deben ser JPG, PNG o WebP.' });
      }
      if (f.size > MAX_FOTO_BYTES) {
        return fail(400, { error: `"${f.name}" supera los 5 MB.` });
      }
    }
    if (extras.length + nuevas.length > MAX_EXTRAS) {
      return fail(400, { error: `Máximo ${MAX_EXTRAS} fotos de contexto por producto.` });
    }
    for (const f of /** @type {File[]} */ (nuevas)) {
      extras.push(await uploadProductImage(f, product.slug));
    }

    // "Hacer principal": la foto elegida pasa a ser la principal y la principal anterior
    // ocupa su lugar entre las fotos de contexto.
    const principal = form
      .getAll('hacer_principal')
      .map(String)
      .find((path) => !cambios.image_path && extras.includes(path));
    if (principal) {
      const anterior = product.image_path;
      const resto = extras.filter((/** @type {string} */ path) => path !== principal);
      cambios.image_path = principal;
      cambios.extra_images = anterior ? [anterior, ...resto] : resto;
    } else {
      cambios.extra_images = extras;
    }

    await updateProduct(params.id, cambios);
    redirect(303, `/admin/producto/${params.id}?guardado=1`);
  },
};
