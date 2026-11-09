import { error, fail, redirect } from '@sveltejs/kit';
import { formas, parseBeneficios } from '#lib/products.js';
import {
  aplicarFotosExtra,
  getProductById,
  publicImageUrl,
  updateProduct,
  uploadProductImage,
} from '#lib/server/admin-products.js';

const MAX_FOTO_BYTES = 5 * 1024 * 1024;
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
    // Un beneficio por línea; se guardan sin líneas vacías.
    const benefits = parseBeneficios(String(form.get('benefits') ?? '')).join('\n');
    const ingredients = String(form.get('ingredients') ?? '').trim();
    const category = String(form.get('category') ?? '');
    const shape = String(form.get('shape') ?? '');
    const price = Number.parseInt(String(form.get('price') ?? ''), 10);
    const stock = Number.parseInt(String(form.get('stock') ?? '0'), 10);

    if (!name || !fragrance) return fail(400, { error: 'Nombre y fragancia son obligatorios.' });
    if (!['jabon', 'vela'].includes(category)) return fail(400, { error: 'Categoría inválida.' });
    const formasValidas = /** @type {string[]} */ (
      formas[/** @type {keyof typeof formas} */ (category)]
    );
    if (shape && !formasValidas.includes(shape)) {
      return fail(400, { error: 'Esa forma no existe para la categoría elegida.' });
    }
    if (!Number.isInteger(price) || price < 0) return fail(400, { error: 'Precio inválido.' });
    if (!Number.isInteger(stock) || stock < 0) return fail(400, { error: 'Stock inválido.' });

    /** @type {Record<string, unknown>} */
    const cambios = {
      name,
      fragrance,
      shape: shape || null,
      description,
      benefits,
      ingredients,
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

    const errorFotos = await aplicarFotosExtra(form, product, cambios);
    if (errorFotos) return fail(400, { error: errorFotos });

    await updateProduct(params.id, cambios);
    redirect(303, `/admin/producto/${params.id}?guardado=1`);
  },
};
