import { PRODUCT_IMAGES_BUCKET, supabase } from '#lib/supabaseClient.js';
import { products as sampleProducts } from '#lib/products.js';

/**
 * Productos activos para la tienda.
 * Lee de Supabase; si no está configurado o falla, usa los productos de muestra.
 * @returns {Promise<import('#lib/products.js').Product[]>}
 */
export async function getActiveProducts() {
  const db = supabase;
  if (!db) return sampleProducts;

  const { data, error } = await db
    .from('products')
    .select('slug, name, category, fragrance, description, price, image_path, featured')
    .eq('active', true)
    .order('created_at');

  if (error) {
    console.error('[catalog] No se pudieron cargar los productos:', error.message);
    return sampleProducts;
  }

  return data.map((row) => ({
    slug: row.slug,
    name: row.name,
    category: row.category,
    fragrance: row.fragrance,
    description: row.description,
    price: row.price,
    featured: row.featured,
    image: db.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(row.image_path).data.publicUrl,
  }));
}
