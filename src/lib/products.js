/**
 * Catálogo de productos (datos de muestra).
 * Cuando conectemos Supabase, esta lista se reemplaza por una consulta a la tabla `products`.
 *
 * ⚠️ Los precios son de ejemplo: cambialos por los reales (en ARS).
 *
 * @typedef {Object} Product
 * @property {string} slug
 * @property {string} name
 * @property {'jabon' | 'vela' | 'pack'} category
 * @property {string} fragrance aroma o función (Rosa, Menta, Exfoliante…)
 * @property {string} [shape] forma (ver `formas`)
 * @property {string} description puede tener varias líneas (p. ej. eslogan y descripción)
 * @property {string[]} [benefits] beneficios cargados en el admin
 * @property {string} [ingredients] ingredientes cargados en el admin
 * @property {number} price
 * @property {string} image
 * @property {string[]} [extraImages] fotos de contexto (además de la principal)
 * @property {boolean} [featured]
 * @property {boolean} [delivery]
 * @property {number} [stock]
 * @property {boolean} [isPack]
 * @property {boolean} [envioIncluido]
 * @property {{ product_id: string, quantity: number }[]} [componentes]
 */

/** @type {Product[]} */
export const products = [
  {
    slug: 'jabon-rosa-circular',
    shape: 'circular',
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
    shape: 'rectangular',
    name: 'Rosa Rectangular',
    category: 'jabon',
    fragrance: 'Rosa',
    description: 'Jabón artesanal de rosa en barra rectangular. Hecho a mano con amor.',
    price: 2500,
    image: '/productos/jabon-rosa-rectangular.jpeg',
  },
  {
    slug: 'jabon-lavanda-circular',
    shape: 'circular',
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
    shape: 'masajeador',
    name: 'Lavanda Masaje',
    category: 'jabon',
    fragrance: 'Lavanda',
    description: 'Jabón de lavanda con textura de masaje. Ideal para la ducha de cada día.',
    price: 2800,
    image: '/productos/jabon-lavanda-masaje.jpeg',
  },
  {
    slug: 'jabon-vainilla-circular',
    shape: 'circular',
    name: 'Vainilla Circular',
    category: 'jabon',
    fragrance: 'Vainilla',
    description: 'Jabón artesanal de vainilla en forma circular. Cálido y dulce.',
    price: 2500,
    image: '/productos/jabon-vainilla-circular.jpeg',
  },
  {
    slug: 'jabon-vainilla-rectangular',
    shape: 'rectangular',
    name: 'Vainilla Rectangular',
    category: 'jabon',
    fragrance: 'Vainilla',
    description: 'Jabón artesanal de vainilla en barra rectangular. Cálido y dulce.',
    price: 2500,
    image: '/productos/jabon-vainilla-rectangular.jpeg',
  },
  {
    slug: 'jabon-vainilla',
    shape: 'circular',
    name: 'Vainilla Clásico',
    category: 'jabon',
    fragrance: 'Vainilla',
    description: 'Nuestro jabón de vainilla clásico. Hecho a mano en pequeños lotes.',
    price: 2500,
    image: '/productos/jabon-vainilla.jpeg',
  },
  {
    slug: 'jabon-coco-rectangular',
    shape: 'rectangular',
    name: 'Coco Rectangular',
    category: 'jabon',
    fragrance: 'Coco',
    description: 'Jabón artesanal de coco en barra rectangular. Suave e hidratante.',
    price: 2500,
    image: '/productos/jabon-coco-rectangular.jpeg',
  },
  {
    slug: 'vela-lavanda',
    shape: 'cubica',
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
    shape: 'perrito',
    name: 'Vela Rosa Perrito',
    category: 'vela',
    fragrance: 'Rosa',
    description: 'Vela artesanal con forma de perrito y fragancia de rosa. Cera premium.',
    price: 4800,
    image: '/productos/vela-rosa-perrito.jpeg',
  },
  {
    slug: 'vela-vainilla-perrito',
    shape: 'perrito',
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
    shape: 'gatito',
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
  pack: { label: 'Packs', singular: 'Pack' },
};

/** Con este stock o menos se avisa "Últimas unidades". */
export const UMBRAL_STOCK_BAJO = 3;

/**
 * true si queda poco stock (pero no está agotado).
 * @param {Product} product
 */
export function stockBajo(product) {
  return (
    typeof product.stock === 'number' && product.stock > 0 && product.stock <= UMBRAL_STOCK_BAJO
  );
}

/** @param {string} slug @returns {Product | undefined} */
export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

/** Formas disponibles por categoría. */
export const formas = {
  jabon: ['gatito', 'perrito', 'rectangular', 'circular', 'masajeador'],
  vela: ['gatito', 'perrito', 'rectangular', 'cubica'],
};

/** @type {Record<string, string>} */
export const formaLabels = {
  gatito: 'Gatito',
  perrito: 'Perrito',
  rectangular: 'Rectangular',
  circular: 'Circular',
  masajeador: 'Masajeador',
  cubica: 'Cúbica',
};

/**
 * Aromas y funciones sugeridas por categoría (en el admin se puede escribir otro).
 * Blanqueador y exfoliante son funciones de jabón; el cítrico es solo Limón.
 */
export const aromas = {
  jabon: [
    'Rosa',
    'Lavanda',
    'Vainilla',
    'Coco',
    'Manzana',
    'Limón',
    'Menta',
    'Incienso',
    'Blanqueador',
    'Exfoliante',
  ],
  vela: ['Rosa', 'Lavanda', 'Vainilla', 'Coco', 'Manzana', 'Limón', 'Menta', 'Incienso'],
};

/** @param {string} texto */
const clave = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-');

/**
 * Qué aporta cada jabón a la piel, según su aroma o función.
 * ⚠️ Texto de ejemplo: revisalo y ajustalo a los ingredientes reales de cada jabón.
 * @type {Record<string, string[]>}
 */
const beneficiosJabon = {
  rosa: ['Hidratante y suave', 'Ideal para pieles sensibles', 'Aroma floral delicado'],
  lavanda: ['Relajante', 'Calma la piel', 'Ideal para la ducha de la noche'],
  vainilla: ['Nutritivo y suavizante', 'Deja la piel suave', 'Aroma cálido y dulce'],
  coco: ['Muy hidratante', 'Ideal para pieles secas', 'Aroma tropical y fresco'],
  manzana: ['Refrescante y suave', 'Limpia sin resecar', 'Aroma frutal fresco'],
  limon: ['Cítrico y energizante', 'Deja la piel fresca', 'Aroma cítrico vibrante'],
  menta: ['Refrescante', 'Sensación de frescura', 'Ideal para la mañana'],
  incienso: ['Aroma cálido y envolvente', 'Ideal para relajarte', 'Ambiente sereno'],
  blanqueador: [
    'Con harina de arroz: aporta luminosidad a la piel',
    'Con avena: calma y suaviza',
    'Con glicerina: deja la piel hidratada',
  ],
  exfoliante: [
    'Con carbón: limpieza profunda y purificante',
    'Exfolia suavemente y renueva la piel',
    'Con glicerina: no reseca',
  ],
};

/**
 * Ingredientes de los jabones que los tienen cargados.
 * @type {Record<string, string>}
 */
const ingredientesJabon = {
  blanqueador: 'Base vegetal de coco, glicerina, harina de arroz y avena',
  exfoliante: 'Base vegetal de coco, glicerina y carbón',
};

/**
 * Ingredientes de un jabón (texto vacío si no hay datos).
 * @param {Product} product
 * @returns {string}
 */
export function getIngredientes(product) {
  // Lo cargado en el admin tiene prioridad sobre el texto fijo por aroma.
  if (product.ingredients) return product.ingredients;
  if (product.category !== 'jabon') return '';
  return ingredientesJabon[clave(product.fragrance)] ?? '';
}

/**
 * Beneficios para la piel de un jabón (lista vacía si no es jabón o no hay datos).
 * @param {Product} product
 * @returns {string[]}
 */
export function getBeneficios(product) {
  // Lo cargado en el admin tiene prioridad sobre la lista fija por aroma.
  if (product.benefits?.length) return product.benefits;
  if (product.category !== 'jabon') return [];
  return beneficiosJabon[clave(product.fragrance)] ?? [];
}

/**
 * Convierte el texto del admin (un beneficio por línea) en lista, sin líneas vacías.
 * @param {string} texto
 * @returns {string[]}
 */
export function parseBeneficios(texto) {
  return texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);
}
