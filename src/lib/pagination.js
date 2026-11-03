/** Máximo de productos por página. */
export const PAGE_SIZE = 8;

/**
 * Divide una lista en páginas. Si `page` no es válido, cae en la primera página
 * o en la última que exista.
 *
 * @template T
 * @param {T[]} items
 * @param {number | string | null} page número de página pedido (1-based)
 * @param {number} [size]
 */
export function paginate(items, page, size = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const requested = Number.parseInt(String(page ?? ''), 10);
  const current = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), totalPages);
  const start = (current - 1) * size;

  return {
    items: items.slice(start, start + size),
    page: current,
    totalPages,
    total: items.length,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}
