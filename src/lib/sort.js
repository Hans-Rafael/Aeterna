/** Opciones de orden para la tienda. "recomendados" respeta el orden de carga de la base. */
export const ORDENES = [
  { value: 'recomendados', label: 'Recomendados' },
  { value: 'nombre', label: 'Nombre (A–Z)' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'aroma', label: 'Aroma (A–Z)' },
];

/**
 * Devuelve una copia ordenada de la lista. Desempata por nombre.
 * @template {{ name: string, price: number, fragrance: string }} T
 * @param {T[]} list
 * @param {string | null} orden
 * @returns {T[]}
 */
export function sortProducts(list, orden) {
  const copia = [...list];
  const porNombre = (/** @type {T} */ a, /** @type {T} */ b) => a.name.localeCompare(b.name, 'es');

  switch (orden) {
    case 'nombre':
      return copia.sort(porNombre);
    case 'precio-asc':
      return copia.sort((a, b) => a.price - b.price || porNombre(a, b));
    case 'precio-desc':
      return copia.sort((a, b) => b.price - a.price || porNombre(a, b));
    case 'aroma':
      return copia.sort((a, b) => a.fragrance.localeCompare(b.fragrance, 'es') || porNombre(a, b));
    default:
      return copia;
  }
}
