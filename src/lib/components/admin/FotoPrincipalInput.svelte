<script>
  /** Selector de una sola foto con aspecto de botón y la info debajo. */
  let { label = 'Elegir foto', info = 'JPG, PNG o WebP · máx. 5 MB', name = 'foto' } = $props();
  let nombre = $state('');
</script>

<div class="space-y-1">
  <label
    class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cacao/30 bg-white px-5 py-2.5 text-sm text-cacao transition focus-within:outline-2 focus-within:outline-rosa-oscuro hover:border-rosa-oscuro hover:text-rosa-oscuro"
  >
    <span aria-hidden="true">📷</span>
    {label}
    <input
      type="file"
      {name}
      accept="image/jpeg,image/png,image/webp"
      class="sr-only"
      onchange={(e) => (nombre = e.currentTarget.files?.[0]?.name ?? '')}
    />
  </label>
  {#if nombre}<p class="text-xs text-cacao">Seleccionada: {nombre}</p>{/if}
  <p class="text-xs text-cacao/60">{info}</p>
</div>
