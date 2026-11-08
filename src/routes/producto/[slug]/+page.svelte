<script>
  import { cart } from '#lib/cart.svelte.js';
  import ProductCard from '#lib/components/ProductCard.svelte';
  import { formatPrice } from '#lib/format.js';
  import { onImageError } from '#lib/images.js';
  import { categories, formaLabels, getBeneficios, getIngredientes } from '#lib/products.js';

  let { data } = $props();
  let product = $derived(data.product);
  let beneficios = $derived(getBeneficios(product));
  let ingredientes = $derived(getIngredientes(product));

  let galeria = $derived([product.image, ...(product.extraImages ?? [])]);
  let elegida = $state(0);
  // Al cambiar de producto, volver a la foto principal.
  $effect(() => {
    void product.slug;
    elegida = 0;
    aviso = '';
  });

  let qty = $state(1);
  let agregado = $state(false);

  let aviso = $state('');
  let agotado = $derived(typeof product.stock === 'number' && product.stock <= 0);

  function agregar() {
    const resultado = cart.add(product.slug, qty);
    if (resultado === 'agotado') {
      aviso = 'Este producto está agotado por el momento.';
      return;
    }
    if (resultado === 'limite') {
      aviso = `Solo hay ${product.stock} ${product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'} y ya están en tu carrito.`;
      return;
    }
    aviso = '';
    agregado = true;
    setTimeout(() => (agregado = false), 2000);
  }
</script>

<svelte:head>
  <title>{product.name} · Aeterna</title>
  <meta name="description" content={product.description} />
</svelte:head>

<section class="mx-auto grid max-w-6xl gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
  <div>
    <div class="overflow-hidden rounded-3xl bg-vainilla/30 shadow-sm">
      <img
        src={galeria[elegida] ?? product.image}
        alt={product.name}
        onerror={onImageError}
        class="aspect-square w-full object-cover"
      />
    </div>
    {#if galeria.length > 1}
      <ul class="mt-3 grid grid-cols-5 gap-2">
        {#each galeria as src, i (src)}
          <li>
            <button
              type="button"
              onclick={() => (elegida = i)}
              aria-label="Ver foto {i + 1} de {galeria.length}"
              aria-current={i === elegida}
              class="block w-full overflow-hidden rounded-xl border-2 {i === elegida
                ? 'border-rosa-oscuro'
                : 'border-transparent opacity-70 hover:opacity-100'}"
            >
              <img {src} alt="" onerror={onImageError} class="aspect-square w-full object-cover" />
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="flex flex-col justify-center">
    <a
      href="/tienda?categoria={product.category}"
      class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase"
    >
      ← {categories[product.category].label}
    </a>
    <h1 class="mt-3 font-serif text-4xl text-cacao sm:text-5xl">{product.name}</h1>
    <p class="mt-2 text-sm text-cacao/60">
      {product.shape ? `${formaLabels[product.shape] ?? product.shape} · ` : ''}Aroma o función: {product.fragrance}
    </p>

    <p class="mt-6 font-serif text-3xl text-cacao">{formatPrice(product.price)}</p>
    <p class="mt-4 leading-relaxed text-cacao/75">{product.description}</p>

    {#if beneficios.length}
      <div class="mt-4 text-sm text-cacao/80">
        <p class="font-medium">Beneficios para tu piel:</p>
        <ul class="mt-1 list-disc pl-5">
          {#each beneficios as beneficio (beneficio)}
            <li>{beneficio}</li>
          {/each}
        </ul>
        {#if ingredientes}
          <p class="mt-2 text-xs text-cacao/60">Ingredientes: {ingredientes}.</p>
        {/if}
      </div>
    {/if}

    {#if data.incluye?.length}
      <div class="mt-4 text-sm text-cacao/80">
        <p class="font-medium">Incluye:</p>
        <ul class="mt-1 list-disc pl-5">
          {#each data.incluye as item (item.name)}
            <li>{item.quantity} × {item.name}</li>
          {/each}
        </ul>
      </div>
    {/if}

    <div class="mt-8 flex flex-wrap items-center gap-4">
      <div class="flex items-center rounded-full border border-cacao/20">
        <button
          type="button"
          class="h-11 w-11 text-lg hover:text-rosa-oscuro"
          onclick={() => (qty = Math.max(1, qty - 1))}
          aria-label="Quitar uno">−</button
        >
        <span class="w-8 text-center" aria-live="polite">{qty}</span>
        <button
          type="button"
          class="h-11 w-11 text-lg hover:text-rosa-oscuro"
          onclick={() => (qty = Math.min(99, qty + 1))}
          aria-label="Agregar uno">+</button
        >
      </div>

      <button
        type="button"
        onclick={agregar}
        class="h-11 rounded-full px-8 text-sm tracking-wide text-crema transition {agotado
          ? 'bg-cacao/50 hover:bg-cacao/60'
          : 'bg-cacao hover:bg-rosa-oscuro'}"
      >
        {agregado ? 'Agregado ✓' : 'Agregar al carrito'}
      </button>
    </div>
    {#if agotado && !aviso}
      <p class="mt-3 text-sm text-rosa-oscuro">Agotado por el momento.</p>
    {/if}
    {#if aviso}
      <p role="alert" class="mt-3 rounded-2xl bg-rosa/30 p-3 text-sm text-cacao">{aviso}</p>
    {/if}

    {#if cart.count > 0}
      <a href="/carrito" class="mt-5 text-sm text-rosa-oscuro underline underline-offset-4">
        Ver carrito ({cart.count})
      </a>
    {/if}
  </div>
</section>

{#if data.related.length}
  <section class="mx-auto mt-24 max-w-6xl px-4 pb-10">
    <h2 class="mb-8 text-center font-serif text-3xl text-cacao">También te puede gustar</h2>
    <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
      {#each data.related as p (p.slug)}
        <ProductCard product={p} />
      {/each}
    </div>
  </section>
{/if}
