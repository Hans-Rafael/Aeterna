import { PRODUCT_IMAGES_BUCKET } from '#lib/supabaseClient.js';
import { adminClient } from '#lib/server/supabaseAdmin.js';

const COLUMNAS =
  'id, slug, name, category, fragrance, description, price, stock, image_path, featured, active';

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
