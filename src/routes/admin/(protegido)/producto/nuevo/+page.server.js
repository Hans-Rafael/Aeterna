import { fail, redirect } from '@sveltejs/kit';
import { formas, parseBeneficios } from '#lib/products.js';
import { createProduct, slugProducto, uploadProductImage } from '#lib/server/admin-products.js';

const MAX_FOTO_BYTES = 5 * 1024 * 1024;
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
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

    if (!name || !fragrance) return fail(400, { error: 'Nombre y aroma son obligatorios.' });
    if (!['jabon', 'vela'].includes(category)) return fail(400, { error: 'Categoría inválida.' });
    const formasValidas = /** @type {string[]} */ (
      formas[/** @type {keyof typeof formas} */ (category)]
    );
    if (shape && !formasValidas.includes(shape)) {
      return fail(400, { error: 'Esa forma no existe para la categoría elegida.' });
    }
    if (!Number.isInteger(price) || price < 0) return fail(400, { error: 'Precio inválido.' });
    if (!Number.isInteger(stock) || stock < 0) return fail(400, { error: 'Stock inválido.' });

    // La foto es opcional: sin foto el sitio muestra la imagen por defecto.
    const foto = form.get('foto');
    const hayFoto = foto instanceof File && foto.size > 0;
    if (hayFoto && !TIPOS_FOTO.includes(foto.type)) {
      return fail(400, { error: 'La foto debe ser JPG, PNG o WebP.' });
    }
    if (hayFoto && foto.size > MAX_FOTO_BYTES) {
      return fail(400, { error: 'La foto supera los 5 MB.' });
    }

    const slug = slugProducto(name);
    const id = await createProduct({
      slug,
      name,
      fragrance,
      description,
      benefits,
      ingredients,
      category,
      shape: shape || null,
      price,
      stock,
      // Texto vacío = sin foto (la columna no admite null en el esquema original).
      image_path: hayFoto ? await uploadProductImage(foto, slug) : '',
      featured: form.get('featured') === 'on',
      active: form.get('active') === 'on',
      delivery: true,
    });

    // Vamos a la edición para poder sumar fotos de contexto.
    redirect(303, `/admin/producto/${id}?guardado=1`);
  },
};
