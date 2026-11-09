<script>
  /** Selector de fotos que acumula las elecciones (el <input file> nativo reemplaza la anterior). */
  let { max = 3, name = 'fotos_extra' } = $props();

  /** @type {File[]} */
  let archivos = $state([]);
  /** @type {HTMLInputElement | undefined} */
  let input = $state();
  let aviso = $state('');

  let vistas = $derived(archivos.map((f) => ({ file: f, url: URL.createObjectURL(f) })));

  function sincronizar() {
    if (!input) return;
    const dt = new DataTransfer();
    for (const f of archivos) dt.items.add(f);
    input.files = dt.files;
  }

  function alElegir() {
    aviso = '';
    for (const f of Array.from(input?.files ?? [])) {
      const repetida = archivos.some((a) => a.name === f.name && a.size === f.size);
      if (repetida) continue;
      if (archivos.length >= max) {
        aviso = `Solo se pueden agregar ${max} foto${max === 1 ? '' : 's'} más.`;
        break;
      }
      archivos.push(f);
    }
    sincronizar();
  }

  /** @param {number} i */
  function quitar(i) {
    archivos.splice(i, 1);
    aviso = '';
    sincronizar();
  }
</script>

{#if max > 0}
  <div class="space-y-2">
    {#if vistas.length}
      <ul class="grid grid-cols-3 gap-2">
        {#each vistas as v, i (v.url)}
          <li class="space-y-1 text-xs">
            <img
              src={v.url}
              alt="Nueva foto"
              class="aspect-square w-full rounded-xl object-cover"
            />
            <button type="button" class="underline" onclick={() => quitar(i)}>Quitar</button>
          </li>
        {/each}
      </ul>
    {/if}
    {#if archivos.length < max}
      <label
        class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-rosa-oscuro px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-cacao focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-cacao"
      >
        <span aria-hidden="true">＋</span> Agregar fotos
        <input
          bind:this={input}
          onchange={alElegir}
          type="file"
          {name}
          multiple
          accept="image/jpeg,image/png,image/webp"
          class="sr-only"
        />
      </label>
      <p class="text-xs text-cacao/60">
        JPG, PNG o WebP · máx. 5 MB c/u. Puedes elegir una y luego otra: se suman.
      </p>
    {:else}
      <input bind:this={input} type="file" {name} multiple class="hidden" />
    {/if}
    {#if aviso}<p class="text-xs text-rosa-oscuro">{aviso}</p>{/if}
  </div>
{:else}
  <p class="text-xs text-cacao/50">
    Ya llegaste al máximo de 4 fotos. Quita alguna para agregar otra.
  </p>
{/if}
