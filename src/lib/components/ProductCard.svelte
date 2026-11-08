<script>
  import { formatPrice } from '#lib/format.js';
  import { onImageError } from '#lib/images.js';
  import { categories, stockBajo } from '#lib/products.js';

  /** @type {{ product: any, compacta?: boolean }} */
  let { product, compacta = false } = $props();
</script>

<a href="/producto/{product.slug}" class="group block">
  <div
    class="relative aspect-square overflow-hidden rounded-3xl bg-vainilla/30 shadow-sm {compacta
      ? 'lg:aspect-[4/3]'
      : ''}"
  >
    {#if typeof product.stock === 'number' && product.stock <= 0}
      <span
        class="absolute top-3 left-3 z-10 rounded-full bg-cacao/85 px-3 py-1 text-xs tracking-wide text-crema"
      >
        Agotado
      </span>
    {:else if stockBajo(product)}
      <span
        class="absolute top-3 left-3 z-10 rounded-full bg-rosa-oscuro/90 px-3 py-1 text-xs tracking-wide text-white"
      >
        Últimas unidades
      </span>
    {/if}
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      onerror={onImageError}
      class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />
  </div>
  <p class="mt-2 text-[11px] tracking-[0.2em] text-rosa-oscuro uppercase">
    {categories[product.category].singular}
  </p>
  <div class="mt-1 flex items-baseline justify-between gap-3">
    <h3 class="font-serif text-lg text-cacao">{product.name}</h3>
    <p class="text-sm text-cacao/70">{formatPrice(product.price)}</p>
  </div>
</a>
