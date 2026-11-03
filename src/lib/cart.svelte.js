import { browser } from '$app/environment';

const STORAGE_KEY = 'aeterna-carrito';

/** @typedef {{ slug: string, qty: number }} CartItem */
/** @typedef {import('./products.js').Product & { qty: number }} CartLine */

/**
 * Lee el carrito guardado en el navegador. Nunca lanza error.
 * En el servidor no hay localStorage, así que no se toca.
 * @returns {CartItem[]}
 */
function loadItems() {
  if (!browser) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => typeof i.slug === 'string' && Number.isInteger(i.qty) && i.qty > 0);
  } catch {
    return [];
  }
}

class Cart {
  /** @type {CartItem[]} */
  items = $state([]);

  /** Catálogo actual (lo carga el layout). @type {import('./products.js').Product[]} */
  catalog = $state([]);

  constructor() {
    this.items = loadItems();
  }

  /** @param {import('./products.js').Product[]} products */
  setCatalog(products) {
    this.catalog = products;
  }

  /** Líneas del carrito con los datos del producto (precio siempre actual). @returns {CartLine[]} */
  get lines() {
    /** @type {CartLine[]} */
    const out = [];
    for (const item of this.items) {
      const product = this.catalog.find((p) => p.slug === item.slug);
      if (product) out.push({ ...product, qty: item.qty });
    }
    return out;
  }

  get count() {
    return this.items.reduce((n, i) => n + i.qty, 0);
  }

  get total() {
    return this.lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  }

  /** @param {string} slug @param {number} [qty] */
  add(slug, qty = 1) {
    const existing = this.items.find((i) => i.slug === slug);
    if (existing) existing.qty += qty;
    else this.items.push({ slug, qty });
    this.#save();
  }

  /** @param {string} slug @param {number} qty */
  setQty(slug, qty) {
    if (qty < 1) return this.remove(slug);
    const item = this.items.find((i) => i.slug === slug);
    if (item) item.qty = qty;
    this.#save();
  }

  /** @param {string} slug */
  remove(slug) {
    this.items = this.items.filter((i) => i.slug !== slug);
    this.#save();
  }

  clear() {
    this.items = [];
    this.#save();
  }

  #save() {
    if (!browser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // almacenamiento bloqueado (modo privado, etc.): el carrito sigue funcionando en memoria
    }
  }
}

export const cart = new Cart();
