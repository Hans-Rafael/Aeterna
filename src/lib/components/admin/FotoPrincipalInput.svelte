<script>
  /** Selector de una sola foto con aspecto de botón y la info debajo. */
  let { label = 'Elegir foto', info = 'JPG, PNG o WebP · máx. 5 MB', name = 'foto' } = $props();
  /** @type {File | null} */
  let archivo = $state(null);
  let vista = $derived(archivo ? URL.createObjectURL(archivo) : '');
</script>

<div class="space-y-1">
  <label
    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-rosa-oscuro px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-cacao focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cacao"
  >
    <span aria-hidden="true">📷</span>
    {label}
    <input
      type="file"
      {name}
      accept="image/jpeg,image/png,image/webp"
      class="sr-only"
      onchange={(e) => (archivo = e.currentTarget.files?.[0] ?? null)}
    />
  </label>
  {#if archivo}
    <div class="flex items-center gap-3 pt-1">
      <img src={vista} alt="Vista previa" class="size-20 rounded-xl object-cover" />
      <p class="text-xs text-cacao">Nueva foto: {archivo.name}<br />Se aplicará al guardar.</p>
    </div>
  {/if}
  <p class="text-xs text-cacao/60">{info}</p>
</div>
