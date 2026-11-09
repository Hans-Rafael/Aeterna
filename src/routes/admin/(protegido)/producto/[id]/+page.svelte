<script>
  import { untrack } from 'svelte';
  import { page } from '$app/state';

  import { aromas, formaLabels, formas } from '#lib/products.js';

  let { data, form } = $props();
  let p = $derived(data.product);
  let categoria = $state(/** @type {'jabon' | 'vela'} */ (untrack(() => data.product.category)));
  let guardado = $derived(page.url.searchParams.has('guardado'));
</script>

<svelte:head>
  <title>Editar {p.name} · Admin</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 pt-10 pb-16">
  <a href="/admin" class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase">← Productos</a>
  <h1 class="mt-3 font-serif text-3xl text-cacao">Editar {p.name}</h1>

  {#if guardado && !form?.error}
    <p class="mt-6 rounded-2xl bg-salvia/20 p-3 text-sm">Cambios guardados.</p>
  {/if}
  {#if form?.error}
    <p class="mt-6 rounded-2xl bg-rosa/30 p-3 text-sm">{form.error}</p>
  {/if}

  <form method="POST" enctype="multipart/form-data" class="mt-8 grid gap-8 md:grid-cols-2">
    <div class="space-y-4">
      <img
        src={data.imageUrl}
        alt={p.name}
        class="aspect-square w-full rounded-3xl bg-vainilla/30 object-cover"
      />
      <label class="block text-sm">
        <span class="text-cacao/70">Cambiar foto (JPG, PNG o WebP, máx. 5 MB)</span>
        <input
          type="file"
          name="foto"
          accept="image/jpeg,image/png,image/webp"
          class="mt-2 block w-full text-sm"
        />
      </label>

      <div class="space-y-2 border-t border-cacao/10 pt-4 text-sm">
        <p class="text-cacao/70">Fotos de contexto (el jabón en un baño, la vela encendida…)</p>
        {#if data.extras.length}
          <ul class="grid grid-cols-3 gap-2">
            {#each data.extras as extra (extra.path)}
              <li class="space-y-1 text-xs">
                <img
                  src={extra.url}
                  alt="Foto de contexto de {p.name}"
                  class="aspect-square w-full rounded-xl object-cover"
                />
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
          <span class="text-cacao/70"
            >Agregar fotos (JPG, PNG o WebP, máx. 5 MB c/u). Total: hasta 4 fotos con la principal.</span
          >
          <input
            type="file"
            name="fotos_extra"
            multiple
            accept="image/jpeg,image/png,image/webp"
            class="mt-2 block w-full text-sm"
          />
        </label>
      </div>
    </div>

    <div class="space-y-4">
      <label class="block text-sm">
        <span class="text-cacao/70">Nombre</span>
        <input name="name" required value={p.name} class="field" />
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Aroma o función</span>
        <input name="fragrance" required value={p.fragrance} class="field" list="aromas" />
        <datalist id="aromas">
          {#each aromas[categoria] as a (a)}
            <option value={a}></option>
          {/each}
        </datalist>
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Descripción</span>
        <textarea name="description" rows="4" class="field">{p.description}</textarea>
        <span class="text-xs text-cacao/50"
          >Puedes escribir varias líneas: por ejemplo, un eslogan y debajo una descripción corta.</span
        >
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Beneficios (uno por línea)</span>
        <textarea
          name="benefits"
          rows="4"
          class="field"
          placeholder="Hidratante y suave&#10;Ideal para pieles sensibles"
          >{p.benefits ?? ''}</textarea
        >
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Ingredientes</span>
        <input name="ingredients" class="field" value={p.ingredients ?? ''} />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="block text-sm">
          <span class="text-cacao/70">Precio (ARS)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="1"
            required
            value={p.price}
            class="field"
          />
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Stock</span>
          <input name="stock" type="number" min="0" step="1" value={p.stock} class="field" />
        </label>
      </div>
      <label class="block text-sm">
        <span class="text-cacao/70">Categoría</span>
        <select name="category" class="field" bind:value={categoria}>
          <option value="jabon">Jabón</option>
          <option value="vela">Vela</option>
        </select>
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Forma</span>
        <select name="shape" class="field">
          <option value="">Sin forma</option>
          {#each formas[categoria] as f (f)}
            <option value={f} selected={p.shape === f}>{formaLabels[f]}</option>
          {/each}
        </select>
      </label>
      <div class="flex gap-6 text-sm">
        <label class="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={p.featured} /> Destacado
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" name="active" checked={p.active} /> Visible en la tienda
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" name="delivery" checked={p.delivery} /> Envío a domicilio
        </label>
      </div>

      <button
        type="submit"
        class="w-full rounded-full bg-cacao py-3 text-sm text-crema transition hover:bg-rosa-oscuro"
      >
        Guardar cambios
      </button>
    </div>
  </form>
</section>

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
