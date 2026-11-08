<script>
  /**
   * @type {{
   *   columnas: { col: import('#lib/orden-tabla.js').Col, titulo: string }[],
   *   orden: import('#lib/orden-tabla.js').Criterio[],
   *   limpiar: () => void
   * }}
   */
  let { columnas, orden, limpiar } = $props();
</script>

{#if orden.length}
  <p class="mt-4 text-sm text-cacao/70">
    Ordenado por: {orden
      .map((o) => columnas.find((c) => c.col === o.col)?.titulo + (o.asc ? ' ▲' : ' ▼'))
      .join(' → ')}
    <button
      type="button"
      onclick={limpiar}
      class="ml-2 text-rosa-oscuro underline underline-offset-4">Quitar orden</button
    >
  </p>
{/if}
