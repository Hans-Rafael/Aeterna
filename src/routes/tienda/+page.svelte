<script>
  import { page } from '$app/state';
  import ProductCard from '#lib/components/ProductCard.svelte';
  import { paginate } from '#lib/pagination.js';
  import { categories } from '#lib/products.js';

  let { data } = $props();

  const filters = [
    { value: null, label: 'Todo' },
    { value: 'jabon', label: categories.jabon.label },
    { value: 'vela', label: categories.vela.label },
  ];

  let categoria = $derived(page.url.searchParams.get('categoria'));
  let filtrados = $derived(
    categoria && categories[categoria]
      ? data.products.filter((p) => p.category === categoria)
      : data.products
  );
  let pag = $derived(paginate(filtrados, page.url.searchParams.get('pagina')));
  let titulo = $derived(
    categoria && categories[categoria] ? categories[categoria].label : 'Tienda'
  );

  /** Link a una página conservando el filtro de categoría. */
  /** @param {number} n */
  function hrefPagina(n) {
    // categoria ya fue validada contra el catálogo, así que no hace falta escaparla
    const partes = [];
    if (categoria && categories[categoria]) partes.push(`categoria=${categoria}`);
    if (n > 1) partes.push(`pagina=${n}`);
    return partes.length ? `/tienda?${partes.join('&')}` : '/tienda';
  }

  let numeros = $derived(Array.from({ length: pag.totalPages }, (_, i) => i + 1));
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

  <div class="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
    {#each pag.items as product (product.slug)}
      <ProductCard {product} />
    {/each}
  </div>

  {#if pag.totalPages > 1}
    <nav aria-label="Paginación" class="mt-14 mb-10 flex items-center justify-center gap-2 text-sm">
      {#if pag.hasPrev}
        <a
          href={hrefPagina(pag.page - 1)}
          class="rounded-full border border-cacao/20 px-4 py-2 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro"
          rel="prev">Anterior</a
        >
      {/if}

      {#each numeros as n (n)}
        <a
          href={hrefPagina(n)}
          aria-current={n === pag.page ? 'page' : undefined}
          class="h-9 w-9 rounded-full border text-center leading-9 transition {n === pag.page
            ? 'border-cacao bg-cacao text-crema'
            : 'border-cacao/20 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro'}"
        >
          {n}
        </a>
      {/each}

      {#if pag.hasNext}
        <a
          href={hrefPagina(pag.page + 1)}
          class="rounded-full border border-cacao/20 px-4 py-2 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro"
          rel="next">Siguiente</a
        >
      {/if}
    </nav>
  {:else}
    <div class="pb-10"></div>
  {/if}
</section>
