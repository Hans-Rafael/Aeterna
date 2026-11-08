import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { products } = await parent();
  const product = products.find((p) => p.slug === params.slug);
  if (!product) error(404, 'Producto no encontrado');

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  // Qué incluye un pack, con los nombres de sus productos.
  const incluye = (product.componentes ?? []).map((c) => {
    const componente = /** @type {any[]} */ (products).find((p) => p.id === c.product_id);
    return {
      name: componente?.name ?? 'Producto',
      quantity: c.quantity,
      price: componente?.price ?? 0,
    };
  });

  // Lo que costarían los productos del pack comprados por separado.
  const sumaSueltos = incluye.reduce((total, item) => total + item.price * item.quantity, 0);

  return { product, related, incluye, sumaSueltos };
}
