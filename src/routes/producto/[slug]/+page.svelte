<script>
  import { cart } from '#lib/cart.svelte.js';
  import ProductCard from '#lib/components/ProductCard.svelte';
  import { formatPrice } from '#lib/format.js';
  import { onImageError } from '#lib/images.js';
  import { categories } from '#lib/products.js';

  let { data } = $props();
  let product = $derived(data.product);

  let qty = $state(1);
  let agregado = $state(false);

  function agregar() {
    cart.add(product.slug, qty);
    agregado = true;
    setTimeout(() => (agregado = false), 2000);
  }
</script>

<svelte:head>
  <title>{product.name} · Aeterna</title>
  <meta name="description" content={product.description} />
</svelte:head>

<section class="mx-auto grid max-w-6xl gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
  <div class="overflow-hidden rounded-3xl bg-vainilla/30 shadow-sm">
    <img
      src={product.image}
      alt={product.name}
      onerror={onImageError}
      class="h-full w-full object-cover"
    />
  </div>

  <div class="flex flex-col justify-center">
    <a
      href="/tienda?categoria={product.category}"
      class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase"
    >
      ← {categories[product.category].label}
    </a>
    <h1 class="mt-3 font-serif text-4xl text-cacao sm:text-5xl">{product.name}</h1>
    <p class="mt-2 text-sm text-cacao/60">Fragancia: {product.fragrance}</p>

    <p class="mt-6 font-serif text-3xl text-cacao">{formatPrice(product.price)}</p>
    <p class="mt-4 leading-relaxed text-cacao/75">{product.description}</p>

    {#if data.incluye?.length}
      <div class="mt-4 text-sm text-cacao/80">
        <p class="font-medium">Incluye:</p>
        <ul class="mt-1 list-disc pl-5">
          {#each data.incluye as item (item.name)}
            <li>{item.quantity} × {item.name}</li>
          {/each}
        </ul>
        <p class="mt-2 text-xs text-cacao/60">
          {product.envioIncluido ? 'Envío incluido.' : 'El envío a domicilio se cobra aparte.'}
        </p>
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
        class="h-11 rounded-full bg-cacao px-8 text-sm tracking-wide text-crema transition hover:bg-rosa-oscuro"
      >
        {agregado ? 'Agregado ✓' : 'Agregar al carrito'}
      </button>
    </div>

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
