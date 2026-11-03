import { error } from '@sveltejs/kit';
import { getProduct, products } from '#lib/products.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const product = getProduct(params.slug);
  if (!product) error(404, 'Producto no encontrado');

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return { product, related };
}
