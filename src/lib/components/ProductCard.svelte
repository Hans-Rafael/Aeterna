<script>
  import { formatPrice } from '#lib/format.js';
  import { categories } from '#lib/products.js';

  let { product } = $props();
</script>

<a href="/producto/{product.slug}" class="group block">
  <div class="aspect-square overflow-hidden rounded-3xl bg-vainilla/30 shadow-sm">
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />
  </div>
  <p class="mt-4 text-[11px] tracking-[0.2em] text-rosa-oscuro uppercase">
    {categories[product.category].singular}
  </p>
  <div class="mt-1 flex items-baseline justify-between gap-3">
    <h3 class="font-serif text-lg text-cacao">{product.name}</h3>
    <p class="text-sm text-cacao/70">{formatPrice(product.price)}</p>
  </div>
</a>
