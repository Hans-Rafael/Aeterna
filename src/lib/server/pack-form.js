import { uploadProductImage } from '#lib/server/admin-products.js';

const MAX_FOTO_BYTES = 5 * 1024 * 1024;
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Lee y valida el formulario de un pack.
 * @param {FormData} form
 * @param {{ requireFoto: boolean, slug: string | null }} opts
 * @returns {Promise<{ error: string | null, fields?: any, componentes?: any }>}
 */
export async function leerPackForm(form, { requireFoto, slug }) {
  const name = String(form.get('name') ?? '').trim();
  const description = String(form.get('description') ?? '').trim();
  const price = Number.parseInt(String(form.get('price') ?? ''), 10);

  if (!name) return { error: 'El pack necesita un nombre.' };
  if (!Number.isInteger(price) || price < 0) return { error: 'Precio inválido.' };

  const ids = form.getAll('componente').map(String);
  const cantidades = form.getAll('cantidad').map((v) => Number.parseInt(String(v), 10));
  /** @type {{ product_id: string, quantity: number }[]} */
  const componentes = [];
  for (let i = 0; i < ids.length; i++) {
    if (!ids[i]) continue; // fila vacía
    componentes.push({ product_id: ids[i], quantity: cantidades[i] });
  }

  if (componentes.length < 2) return { error: 'Un pack necesita al menos 2 productos distintos.' };
  if (new Set(componentes.map((c) => c.product_id)).size !== componentes.length) {
    return { error: 'No repitas el mismo producto en el pack: sumá la cantidad en una sola fila.' };
  }
  if (componentes.some((c) => !Number.isInteger(c.quantity) || c.quantity < 1 || c.quantity > 99)) {
    return { error: 'Cada cantidad tiene que ser un número entre 1 y 99.' };
  }

  const foto = form.get('foto');
  const hayFoto = foto instanceof File && foto.size > 0;
  if (requireFoto && !hayFoto) return { error: 'Subí una foto para el pack.' };
  if (hayFoto && !TIPOS_FOTO.includes(foto.type)) {
    return { error: 'La foto debe ser JPG, PNG o WebP.' };
  }
  if (hayFoto && foto.size > MAX_FOTO_BYTES) return { error: 'La foto supera los 5 MB.' };

  /** @type {Record<string, unknown>} */
  const fields = {
    name,
    description,
    price,
    category: 'pack',
    fragrance: 'Varias',
    stock: 0,
    is_pack: true,
    envio_incluido: form.get('envio_incluido') === 'on',
    featured: form.get('featured') === 'on',
    active: form.get('active') === 'on',
    delivery: true,
  };

  // Al crear, el slug se genera una vez y se usa para la fila y para la foto.
  const slugFinal = slug ?? slugify(name);
  if (!slug) fields.slug = slugFinal;
  if (hayFoto) {
    fields.image_path = await uploadProductImage(foto, slugFinal);
  }

  return { error: null, fields, componentes };
}

/**
 * Slug legible con un sufijo aleatorio, para que dos packs con el mismo nombre no choquen.
 * @param {string} texto
 */
export function slugify(texto) {
  const base = texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `pack-${base}-${Math.random().toString(36).slice(2, 7)}`;
}
