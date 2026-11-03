import { getProduct } from './products.js';

const STORAGE_KEY = 'aeterna-carrito';

/** @typedef {{ slug: string, qty: number }} CartItem */
/** @typedef {import('./products.js').Product & { qty: number }} CartLine */

/** Lee el carrito guardado en el navegador. Nunca lanza error. @returns {CartItem[]} */
function loadItems() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => getProduct(i.slug) && Number.isInteger(i.qty) && i.qty > 0);
  } catch {
    return [];
  }
}

class Cart {
  /** @type {CartItem[]} */
  items = $state([]);

  constructor() {
    this.items = loadItems();
  }

  /** Líneas del carrito con los datos del producto (precio siempre actual). @returns {CartLine[]} */
  get lines() {
    /** @type {CartLine[]} */
    const out = [];
    for (const item of this.items) {
      const product = getProduct(item.slug);
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
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    } catch {
      // almacenamiento bloqueado (modo privado, etc.): el carrito sigue funcionando en memoria
    }
  }
}

export const cart = new Cart();
