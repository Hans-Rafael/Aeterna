<script>
  import { page } from '$app/state';
  import ProductCard from '#lib/components/ProductCard.svelte';
  import { categories, products } from '#lib/products.js';

  const filters = [
    { value: null, label: 'Todo' },
    { value: 'jabon', label: categories.jabon.label },
    { value: 'vela', label: categories.vela.label },
  ];

  let categoria = $derived(page.url.searchParams.get('categoria'));
  let visibles = $derived(
    categoria && categories[categoria] ? products.filter((p) => p.category === categoria) : products
  );
  let titulo = $derived(
    categoria && categories[categoria] ? categories[categoria].label : 'Tienda'
  );
</script>

<svelte:head>
  <title>{titulo} · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-16">
  <div class="text-center">
    <p class="text-xs tracking-[0.4em] text-rosa-oscuro uppercase">Colección</p>
    <h1 class="mt-3 font-serif text-4xl text-cacao sm:text-5xl">{titulo}</h1>
  </div>

  <div class="mt-10 flex justify-center gap-2">
    {#each filters as f (f.label)}
      {@const activo = (categoria ?? null) === f.value}
      <a
        href={f.value ? `/tienda?categoria=${f.value}` : '/tienda'}
        class="rounded-full border px-5 py-2 text-sm transition {activo
          ? 'border-cacao bg-cacao text-crema'
          : 'border-cacao/20 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro'}"
      >
        {f.label}
      </a>
    {/each}
  </div>

  <div class="mt-12 grid grid-cols-2 gap-6 pb-10 md:grid-cols-3 lg:grid-cols-4">
    {#each visibles as product (product.slug)}
      <ProductCard {product} />
    {/each}
  </div>
</section>
