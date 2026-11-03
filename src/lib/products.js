/**
 * Catálogo de productos (datos de muestra).
 * Cuando conectemos Supabase, esta lista se reemplaza por una consulta a la tabla `products`.
 *
 * ⚠️ Los precios son de ejemplo: cambialos por los reales (en ARS).
 *
 * @typedef {Object} Product
 * @property {string} slug
 * @property {string} name
 * @property {'jabon' | 'vela'} category
 * @property {string} fragrance
 * @property {string} description
 * @property {number} price
 * @property {string} image
 * @property {boolean} [featured]
 * @property {boolean} [delivery]
 */

/** @type {Product[]} */
export const products = [
  {
    slug: 'jabon-rosa-circular',
    name: 'Rosa Circular',
    category: 'jabon',
    fragrance: 'Rosa',
    description: 'Jabón artesanal de rosa en forma circular. Hecho a mano en pequeños lotes.',
    price: 2500,
    image: '/productos/jabon-rosa-circular.jpeg',
    featured: true,
  },
  {
    slug: 'jabon-rosa-rectangular',
    name: 'Rosa Rectangular',
    category: 'jabon',
    fragrance: 'Rosa',
    description: 'Jabón artesanal de rosa en barra rectangular. Hecho a mano con amor.',
    price: 2500,
    image: '/productos/jabon-rosa-rectangular.jpeg',
  },
  {
    slug: 'jabon-lavanda-circular',
    name: 'Lavanda Circular',
    category: 'jabon',
    fragrance: 'Lavanda',
    description: 'Jabón artesanal de lavanda en forma circular. Aroma suave y relajante.',
    price: 2500,
    image: '/productos/jabon-lavanda-circular.jpeg',
    featured: true,
  },
  {
    slug: 'jabon-lavanda-masaje',
    name: 'Lavanda Masaje',
    category: 'jabon',
    fragrance: 'Lavanda',
    description: 'Jabón de lavanda con textura de masaje. Ideal para la ducha de cada día.',
    price: 2800,
    image: '/productos/jabon-lavanda-masaje.jpeg',
  },
  {
    slug: 'jabon-vainilla-circular',
    name: 'Vainilla Circular',
    category: 'jabon',
    fragrance: 'Vainilla',
    description: 'Jabón artesanal de vainilla en forma circular. Cálido y dulce.',
    price: 2500,
    image: '/productos/jabon-vainilla-circular.jpeg',
  },
  {
    slug: 'jabon-vainilla-rectangular',
    name: 'Vainilla Rectangular',
    category: 'jabon',
    fragrance: 'Vainilla',
    description: 'Jabón artesanal de vainilla en barra rectangular. Cálido y dulce.',
    price: 2500,
    image: '/productos/jabon-vainilla-rectangular.jpeg',
  },
  {
    slug: 'jabon-vainilla',
    name: 'Vainilla Clásico',
    category: 'jabon',
    fragrance: 'Vainilla',
    description: 'Nuestro jabón de vainilla clásico. Hecho a mano en pequeños lotes.',
    price: 2500,
    image: '/productos/jabon-vainilla.jpeg',
  },
  {
    slug: 'jabon-coco-rectangular',
    name: 'Coco Rectangular',
    category: 'jabon',
    fragrance: 'Coco',
    description: 'Jabón artesanal de coco en barra rectangular. Suave e hidratante.',
    price: 2500,
    image: '/productos/jabon-coco-rectangular.jpeg',
  },
  {
    slug: 'vela-lavanda',
    name: 'Vela Lavanda',
    category: 'vela',
    fragrance: 'Lavanda',
    description: 'Vela artesanal de cera premium con fragancia de lavanda. Hecha a mano.',
    price: 4500,
    image: '/productos/vela-lavanda.jpeg',
    featured: true,
  },
  {
    slug: 'vela-rosa-perrito',
    name: 'Vela Rosa Perrito',
    category: 'vela',
    fragrance: 'Rosa',
    description: 'Vela artesanal con forma de perrito y fragancia de rosa. Cera premium.',
    price: 4800,
    image: '/productos/vela-rosa-perrito.jpeg',
  },
  {
    slug: 'vela-vainilla-perrito',
    name: 'Vela Vainilla Perrito',
    category: 'vela',
    fragrance: 'Vainilla',
    description: 'Vela artesanal con forma de perrito y fragancia de vainilla. Cera premium.',
    price: 4800,
    image: '/productos/vela-vainilla-perrito.jpeg',
    featured: true,
  },
  {
    slug: 'vela-rosa-gatito',
    name: 'Vela Rosa Gatito',
    category: 'vela',
    fragrance: 'Rosa',
    description: 'Vela artesanal con forma de gatito y fragancia de rosa. Cera premium.',
    price: 4800,
    image: '/productos/vela-rosa-gatito.jpeg',
  },
];

/** @type {Record<string, { label: string, singular: string }>} */
export const categories = {
  jabon: { label: 'Jabones', singular: 'Jabón' },
  vela: { label: 'Velas', singular: 'Vela' },
};

/** @param {string} slug @returns {Product | undefined} */
export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
