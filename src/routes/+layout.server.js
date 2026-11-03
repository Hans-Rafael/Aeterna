import { getActiveProducts } from '#lib/server/catalog.js';

/** Los productos se cargan en el layout para que estén disponibles en todas las páginas. */
export async function load() {
  return { products: await getActiveProducts() };
}
