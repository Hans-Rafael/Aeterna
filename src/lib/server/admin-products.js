import { PRODUCT_IMAGES_BUCKET } from '#lib/supabaseClient.js';
import { IMAGE_FALLBACK } from '#lib/images.js';
import { adminClient } from '#lib/server/supabaseAdmin.js';

const COLUMNAS =
  'id, slug, name, category, fragrance, shape, description, price, stock, image_path, featured, active, delivery, is_pack, envio_incluido, extra_images';

/** Todos los productos, incluidos los ocultos. */
export async function listAllProducts() {
  const { data, error } = await adminClient().from('products').select(COLUMNAS).order('created_at');
  if (error) throw error;
  return data;
}

/** @param {string} id */
export async function getProductById(id) {
  const { data, error } = await adminClient()
    .from('products')
    .select(COLUMNAS)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * @param {string} id
 * @param {Record<string, unknown>} fields
 */
export async function updateProduct(id, fields) {
  const { error } = await adminClient().from('products').update(fields).eq('id', id);
  if (error) throw error;
}

/**
 * URL pública de la foto de un producto.
 * @param {string} path
 */
export function publicImageUrl(path) {
  if (!path) return IMAGE_FALLBACK;
  return adminClient().storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl;
}

const EXTENSIONES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/**
 * Sube una foto al bucket y devuelve su nombre de archivo.
 * @param {File} file
 * @param {string} slug
 */
export async function uploadProductImage(file, slug) {
  const ext = EXTENSIONES[/** @type {keyof typeof EXTENSIONES} */ (file.type)];
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await adminClient()
    .storage.from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return path;
}

/** Productos que pueden formar parte de un pack (no son packs). */
export async function listComponentesPosibles() {
  const { data, error } = await adminClient()
    .from('products')
    .select('id, name, stock, price')
    .eq('is_pack', false)
    .order('name');
  if (error) throw error;
  return data;
}

/** @param {string} packId */
export async function getPackComponentes(packId) {
  const { data, error } = await adminClient()
    .from('pack_items')
    .select('product_id, quantity')
    .eq('pack_id', packId);
  if (error) throw error;
  return data;
}

/**
 * Crea o actualiza un pack y reemplaza sus componentes.
 * @param {{
 *   id: string | null,
 *   fields: Record<string, unknown>,
 *   componentes: { product_id: string, quantity: number }[],
 * }} opts
 * @returns {Promise<string>} id del pack
 */
export async function guardarPack({ id, fields, componentes }) {
  const db = adminClient();
  let packId = id;
  if (packId) {
    const { error } = await db.from('products').update(fields).eq('id', packId);
    if (error) throw error;
    const { error: errorBorrar } = await db.from('pack_items').delete().eq('pack_id', packId);
    if (errorBorrar) throw errorBorrar;
  } else {
    const { data, error } = await db.from('products').insert(fields).select('id').single();
    if (error) throw error;
    packId = data.id;
  }
  const { error: errorComp } = await db
    .from('pack_items')
    .insert(
      componentes.map((c) => ({ pack_id: packId, product_id: c.product_id, quantity: c.quantity }))
    );
  if (errorComp) throw errorComp;
  return /** @type {string} */ (packId);
}

/**
 * Slug legible con un sufijo aleatorio, para que dos productos con el mismo nombre no choquen.
 * @param {string} texto
 */
export function slugProducto(texto) {
  const base = texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'producto'}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Crea un producto nuevo y devuelve su id.
 * @param {Record<string, unknown>} fields
 * @returns {Promise<string>}
 */
export async function createProduct(fields) {
  const { data, error } = await adminClient().from('products').insert(fields).select('id').single();
  if (error) throw error;
  return data.id;
}
