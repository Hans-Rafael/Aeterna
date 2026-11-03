import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { products } = await parent();
  const product = products.find((p) => p.slug === params.slug);
  if (!product) error(404, 'Producto no encontrado');

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  return { product, related };
}
