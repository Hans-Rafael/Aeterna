<script>
  import { untrack } from 'svelte';
  import { formatPrice } from '#lib/format.js';

  /**
   * @type {{
   *   pack?: any,
   *   componentes?: { product_id: string, quantity: number }[],
   *   candidatos?: { id: string, name: string, stock: number, price: number }[],
   *   error?: string | null,
   *   imageUrl?: string | null,
   *   extras?: { path: string, url: string }[],
   * }}
   */
  let {
    pack = null,
    componentes = [],
    candidatos = [],
    error = null,
    imageUrl = null,
    extras = [],
  } = $props();

  const MIN_FILAS = 3;
  const MAX_FILAS = 8;

  let filas = $state(
    untrack(() => {
      const iniciales = componentes.map((c) => ({
        product_id: c.product_id,
        quantity: c.quantity,
      }));
      while (iniciales.length < MIN_FILAS) iniciales.push({ product_id: '', quantity: 1 });
      return iniciales;
    })
  );

  /** Suma de los productos sueltos, para comparar con el precio del pack. */
  let sumaSueltos = $derived(
    filas.reduce((total, f) => {
      const producto = candidatos.find((c) => c.id === f.product_id);
      return producto ? total + producto.price * (Number(f.quantity) || 0) : total;
    }, 0)
  );

  function agregarFila() {
    if (filas.length < MAX_FILAS) filas.push({ product_id: '', quantity: 1 });
  }

  /** @param {number} i */
  function quitarFila(i) {
    if (filas.length > MIN_FILAS) filas.splice(i, 1);
  }
</script>

{#if error}
  <p class="rounded-2xl bg-rosa/30 p-3 text-sm">{error}</p>
{/if}

<form method="POST" enctype="multipart/form-data" class="mt-8 grid gap-8 md:grid-cols-2">
  <div class="space-y-4">
    {#if imageUrl}
      <img
        src={imageUrl}
        alt=""
        class="aspect-square w-full rounded-3xl bg-vainilla/30 object-cover"
      />
    {/if}
    <label class="block text-sm">
      <span class="text-cacao/70"
        >{imageUrl ? 'Cambiar foto' : 'Foto del pack'} (opcional · JPG, PNG o WebP, máx. 5 MB)</span
      >
      <input
        type="file"
        name="foto"
        accept="image/jpeg,image/png,image/webp"
        class="mt-2 block w-full text-sm"
      />
    </label>

    {#if pack}
      <div class="space-y-2 border-t border-cacao/10 pt-4 text-sm">
        <p class="text-cacao/70">Fotos adicionales (hasta 4 fotos en total con la principal)</p>
        {#if extras.length}
          <ul class="grid grid-cols-3 gap-2">
            {#each extras as extra (extra.path)}
              <li class="space-y-1 text-xs">
                <img src={extra.url} alt="" class="aspect-square w-full rounded-xl object-cover" />
                <label class="flex items-center gap-1">
                  <input type="checkbox" name="hacer_principal" value={extra.path} /> Hacer principal
                </label>
                <label class="flex items-center gap-1">
                  <input type="checkbox" name="quitar_extra" value={extra.path} /> Quitar
                </label>
              </li>
            {/each}
          </ul>
        {/if}
        <label class="block">
          <span class="text-cacao/70">Agregar fotos (JPG, PNG o WebP, máx. 5 MB c/u)</span>
          <input
            type="file"
            name="fotos_extra"
            multiple
            accept="image/jpeg,image/png,image/webp"
            class="mt-2 block w-full text-sm"
          />
        </label>
      </div>
    {:else}
      <p class="text-xs text-cacao/50">
        Después de crear el pack podés sumar hasta 3 fotos más desde la edición.
      </p>
    {/if}
  </div>

  <div class="space-y-4">
    <label class="block text-sm">
      <span class="text-cacao/70">Nombre del pack</span>
      <input name="name" required value={pack?.name ?? ''} class="field" placeholder="Pack Relax" />
    </label>
    <label class="block text-sm">
      <span class="text-cacao/70">Descripción</span>
      <textarea name="description" rows="3" class="field">{pack?.description ?? ''}</textarea>
    </label>

    <fieldset class="space-y-2">
      <legend class="text-sm text-cacao/70">Productos del pack</legend>
      {#each filas as fila, i (i)}
        <div class="grid grid-cols-[1fr_5rem_auto] items-center gap-2">
          <select name="componente" bind:value={fila.product_id} class="field">
            <option value="">Elegí un producto…</option>
            {#each candidatos as c (c.id)}
              <option value={c.id}>
                {c.name} (stock {c.stock})
              </option>
            {/each}
          </select>
          <input
            name="cantidad"
            type="number"
            min="1"
            max="99"
            step="1"
            bind:value={fila.quantity}
            class="field"
            aria-label="Cantidad"
          />
          <button
            type="button"
            class="text-xs text-cacao/50 hover:text-rosa-oscuro disabled:opacity-30"
            onclick={() => quitarFila(i)}
            disabled={filas.length <= MIN_FILAS}
          >
            Quitar
          </button>
        </div>
      {/each}
      <button
        type="button"
        onclick={agregarFila}
        disabled={filas.length >= MAX_FILAS}
        class="text-xs text-rosa-oscuro underline underline-offset-4 disabled:opacity-30"
      >
        + Agregar producto
      </button>
    </fieldset>

    <p class="text-xs text-cacao/60">
      Por separado, estos productos suman {formatPrice(sumaSueltos)}.
    </p>

    <label class="block text-sm">
      <span class="text-cacao/70">Precio del pack (ARS)</span>
      <input
        name="price"
        type="number"
        min="0"
        step="1"
        required
        value={pack?.price ?? ''}
        class="field"
      />
    </label>

    <div class="flex flex-wrap gap-6 text-sm">
      <label class="flex items-center gap-2">
        <input type="checkbox" name="envio_incluido" checked={pack?.envio_incluido ?? false} />
        Envío incluido
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" name="featured" checked={pack?.featured ?? false} /> Destacado
      </label>
      <label class="flex items-center gap-2">
        <input type="checkbox" name="active" checked={pack ? pack.active : true} /> Visible en la tienda
      </label>
    </div>

    <button
      type="submit"
      class="w-full rounded-full bg-cacao py-3 text-sm text-crema transition hover:bg-rosa-oscuro"
    >
      {pack ? 'Guardar pack' : 'Crear pack'}
    </button>
  </div>
</form>

<style>
  .field {
    display: block;
    width: 100%;
    margin-top: 0.375rem;
    border-radius: 0.75rem;
    border: 1px solid rgb(74 59 53 / 0.2);
    background: white;
    padding: 0.625rem 0.875rem;
    color: var(--color-cacao);
  }
  .field:focus {
    outline: 2px solid var(--color-rosa-oscuro);
    outline-offset: 1px;
  }
</style>
