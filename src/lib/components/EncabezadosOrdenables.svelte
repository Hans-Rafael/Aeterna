<script>
  /**
   * Celdas de encabezado (`<th>`) con botón para ordenar. Va dentro de un `<tr>`.
   * @type {{
   *   columnas: { col: import('#lib/orden-tabla.js').Col, titulo: string }[],
   *   orden: import('#lib/orden-tabla.js').Criterio[],
   *   alternar: (col: import('#lib/orden-tabla.js').Col) => void,
   *   claseNombre?: string
   * }}
   */
  let { columnas, orden, alternar, claseNombre = '' } = $props();
</script>

{#each columnas as { col, titulo } (col)}
  {@const i = orden.findIndex((o) => o.col === col)}
  <th
    class="font-normal {col === 'name' ? claseNombre : ''}"
    aria-sort={i < 0 ? 'none' : orden[i].asc ? 'ascending' : 'descending'}
  >
    <button
      type="button"
      onclick={() => alternar(col)}
      class="hover:text-rosa-oscuro {i < 0 ? '' : 'text-cacao'}"
      title="Ordenar por {titulo.toLowerCase()}"
    >
      {titulo}
      <span class="text-xs"
        >{i < 0 ? '↕' : `${orden[i].asc ? '▲' : '▼'}${orden.length > 1 ? i + 1 : ''}`}</span
      >
    </button>
  </th>
{/each}
