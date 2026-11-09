<script>
  import FotoPrincipalInput from '#lib/components/admin/FotoPrincipalInput.svelte';
  import { aromas, formaLabels, formas } from '#lib/products.js';

  let { form } = $props();
  /** @type {'jabon' | 'vela'} */
  let categoria = $state('jabon');
</script>

<svelte:head>
  <title>Nuevo producto · Admin</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 pt-10 pb-16">
  <a href="/admin" class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase">← Productos</a>
  <h1 class="mt-3 font-serif text-3xl text-cacao">Nuevo producto</h1>
  <p class="mt-2 text-sm text-cacao/60">
    Después de crearlo podés sumar fotos de contexto desde la edición.
  </p>

  {#if form?.error}
    <p class="mt-6 rounded-2xl bg-rosa/30 p-3 text-sm">{form.error}</p>
  {/if}

  <form method="POST" enctype="multipart/form-data" class="mt-8 grid gap-8 md:grid-cols-2">
    <div class="space-y-4">
      <FotoPrincipalInput
        label="Foto principal"
        info="Opcional · JPG, PNG o WebP · máx. 5 MB. Sin foto se muestra una imagen por defecto."
      />
    </div>

    <div class="space-y-4">
      <label class="block text-sm">
        <span class="text-cacao/70">Nombre</span>
        <input name="name" required class="field" />
      </label>
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
            <option value={f}>{formaLabels[f]}</option>
          {/each}
        </select>
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Aroma o función</span>
        <input name="fragrance" required class="field" list="aromas" />
        <datalist id="aromas">
          {#each aromas[categoria] as a (a)}
            <option value={a}></option>
          {/each}
        </datalist>
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Descripción</span>
        <textarea name="description" rows="4" class="field"></textarea>
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
          placeholder="Hidratante y suave&#10;Ideal para pieles sensibles"></textarea>
      </label>
      <label class="block text-sm">
        <span class="text-cacao/70">Ingredientes</span>
        <input name="ingredients" class="field" value="" />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="block text-sm">
          <span class="text-cacao/70">Precio (ARS)</span>
          <input name="price" type="number" min="0" step="1" required class="field" />
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Stock</span>
          <input name="stock" type="number" min="0" step="1" value="0" class="field" />
        </label>
      </div>
      <div class="flex gap-6 text-sm">
        <label class="flex items-center gap-2">
          <input type="checkbox" name="featured" /> Destacado
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" name="active" checked /> Visible en la tienda
        </label>
      </div>

      <button
        type="submit"
        class="w-full rounded-full bg-cacao py-3 text-sm text-crema transition hover:bg-rosa-oscuro"
      >
        Crear producto
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
