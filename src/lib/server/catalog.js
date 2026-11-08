import { PRODUCT_IMAGES_BUCKET, supabase } from '#lib/supabaseClient.js';
import { products as sampleProducts } from '#lib/products.js';
import { IMAGE_FALLBACK } from '#lib/images.js';

/**
 * Productos activos para la tienda.
 * Lee de Supabase; si no está configurado o falla, usa los productos de muestra.
 * El stock de un pack es la cantidad de packs que se pueden armar con sus componentes.
 * @returns {Promise<import('#lib/products.js').Product[]>}
 */
export async function getActiveProducts() {
  const db = supabase;
  if (!db) return sampleProducts;

  const { data, error } = await db
    .from('products')
    .select(
      'id, slug, name, category, fragrance, shape, description, price, image_path, featured, delivery, stock, is_pack, envio_incluido, extra_images'
    )
    .eq('active', true)
    .order('created_at');

  if (error) {
    console.error('[catalog] No se pudieron cargar los productos:', error.message);
    return sampleProducts;
  }

  const { data: componentes, error: errorComponentes } = await db
    .from('pack_items')
    .select('pack_id, product_id, quantity');
  if (errorComponentes) {
    console.error('[catalog] No se pudieron cargar los componentes:', errorComponentes.message);
  }

  const stockPorId = new Map(data.map((row) => [row.id, row.stock ?? 0]));
  /** @type {Map<string, { product_id: string, quantity: number }[]>} */
  const componentesPorPack = new Map();
  for (const c of componentes ?? []) {
    const lista = componentesPorPack.get(c.pack_id) ?? [];
    lista.push({ product_id: c.product_id, quantity: c.quantity });
    componentesPorPack.set(c.pack_id, lista);
  }

  return data.map((row) => {
    const comps = componentesPorPack.get(row.id) ?? [];
    let stock = row.stock ?? 0;
    if (row.is_pack) {
      stock =
        comps.length === 0
          ? 0
          : Math.min(
              ...comps.map((c) => Math.floor((stockPorId.get(c.product_id) ?? 0) / c.quantity))
            );
    }

    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      fragrance: row.fragrance,
      shape: row.shape ?? undefined,
      description: row.description,
      price: row.price,
      featured: row.featured,
      delivery: row.delivery,
      stock,
      isPack: row.is_pack,
      envioIncluido: row.envio_incluido,
      componentes: comps,
      image: row.image_path
        ? db.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(row.image_path).data.publicUrl
        : IMAGE_FALLBACK,
      extraImages: (row.extra_images ?? []).map(
        (/** @type {string} */ path) =>
          db.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
      ),
    };
  });
}
