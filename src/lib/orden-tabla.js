/**
 * @typedef {'name' | 'category' | 'shape' | 'fragrance' | 'price' | 'stock'} Col
 * @typedef {{ col: Col, asc: boolean }} Criterio
 */

/**
 * Agrega una columna al orden (de menor a mayor) o, si ya estaba, invierte su sentido.
 * El orden sigue la secuencia de clics: la primera columna manda y las siguientes desempatan.
 * @param {Criterio[]} orden
 * @param {Col} col
 * @returns {Criterio[]}
 */
export function alternarOrden(orden, col) {
  return orden.some((o) => o.col === col)
    ? orden.map((o) => (o.col === col ? { col, asc: !o.asc } : o))
    : [...orden, { col, asc: true }];
}

/**
 * Devuelve una copia ordenada por los criterios, en ese orden. Los valores vacíos van siempre
 * al final y, si todo empata, se desempata por nombre.
 * @param {any[]} filas
 * @param {Criterio[]} orden
 * @param {(fila: any, col: Col) => string | number} valor
 * @returns {any[]}
 */
export function ordenarFilas(filas, orden, valor) {
  return [...filas].sort((a, b) => {
    for (const { col, asc } of orden) {
      // El stock de los packs sale de sus componentes: van siempre al final.
      if (col === 'stock' && a.is_pack !== b.is_pack) return a.is_pack ? 1 : -1;
      const va = valor(a, col);
      const vb = valor(b, col);
      if (va === '' || vb === '') {
        if (va !== vb) return va === '' ? 1 : -1;
        continue;
      }
      const cmp =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'es');
      if (cmp) return asc ? cmp : -cmp;
    }
    return a.name.localeCompare(b.name, 'es');
  });
}
