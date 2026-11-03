<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ProductCard from '#lib/components/ProductCard.svelte';
  import { paginate } from '#lib/pagination.js';
  import { categories } from '#lib/products.js';
  import { ORDENES, sortProducts } from '#lib/sort.js';

  let { data } = $props();

  const filters = [
    { value: null, label: 'Todo' },
    { value: 'jabon', label: categories.jabon.label },
    { value: 'vela', label: categories.vela.label },
    { value: 'pack', label: categories.pack.label },
  ];

  let categoriaPedida = $derived(page.url.searchParams.get('categoria') ?? '');
  let categoria = $derived(categories[categoriaPedida] ? categoriaPedida : null);
  let orden = $derived(
    ORDENES.some((o) => o.value === page.url.searchParams.get('orden'))
      ? page.url.searchParams.get('orden')
      : 'recomendados'
  );

  let filtrados = $derived(
    categoria ? data.products.filter((p) => p.category === categoria) : data.products
  );
  let ordenados = $derived(sortProducts(filtrados, orden));
  let pag = $derived(paginate(ordenados, page.url.searchParams.get('pagina')));
  let titulo = $derived(categoria ? categories[categoria].label : 'Tienda');
  let numeros = $derived(Array.from({ length: pag.totalPages }, (_, i) => i + 1));

  /**
   * Arma la URL de la tienda. Los valores ya fueron validados arriba
   * (categoría y orden contra sus listas), así que no hace falta escaparlos.
   * @param {{ categoria?: string | null, orden?: string | null, pagina?: number | null }} params
   */
  function urlTienda({ categoria: cat = categoria, orden: ord = orden, pagina = null }) {
    const partes = [];
    if (cat) partes.push(`categoria=${cat}`);
    if (ord && ord !== 'recomendados') partes.push(`orden=${ord}`);
    if (pagina && pagina > 1) partes.push(`pagina=${pagina}`);
    return partes.length ? `/tienda?${partes.join('&')}` : '/tienda';
  }

  /** @param {Event} event */
  function cambiarOrden(event) {
    const value = /** @type {HTMLSelectElement} */ (event.currentTarget).value;
    // Al cambiar el orden volvemos a la primera página.
    goto(urlTienda({ orden: value, pagina: null }));
  }
</script>

<svelte:head>
  <title>{titulo} · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-16">
  <div class="text-center">
    <p class="text-xs tracking-[0.4em] text-rosa-oscuro uppercase">Colección</p>
    <h1 class="mt-3 font-serif text-4xl text-cacao sm:text-5xl">{titulo}</h1>
  </div>

  <div class="mt-10 flex flex-wrap justify-center gap-2">
    {#each filters as f (f.label)}
      {@const activo = categoria === f.value}
      <a
        href={urlTienda({ categoria: f.value, pagina: null })}
        class="rounded-full border px-5 py-2 text-sm transition {activo
          ? 'border-cacao bg-cacao text-crema'
          : 'border-cacao/20 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro'}"
      >
        {f.label}
      </a>
    {/each}
  </div>

  <div class="mt-8 flex items-center justify-between gap-4 text-sm text-cacao/70">
    <p>{pag.total} {pag.total === 1 ? 'producto' : 'productos'}</p>
    <label class="flex items-center gap-2">
      <span>Ordenar por</span>
      <select
        class="rounded-full border border-cacao/20 bg-white px-4 py-2 text-cacao focus:outline-2 focus:outline-rosa-oscuro"
        value={orden}
        onchange={cambiarOrden}
      >
        {#each ORDENES as o (o.value)}
          <option value={o.value}>{o.label}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
    {#each pag.items as product (product.slug)}
      <ProductCard {product} />
    {:else}
      <p class="col-span-full py-10 text-center text-cacao/60">
        No hay productos en esta categoría.
      </p>
    {/each}
  </div>

  {#if pag.totalPages > 1}
    <nav aria-label="Paginación" class="mt-14 mb-10 flex items-center justify-center gap-2 text-sm">
      {#if pag.hasPrev}
        <a
          href={urlTienda({ pagina: pag.page - 1 })}
          class="rounded-full border border-cacao/20 px-4 py-2 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro"
          rel="prev">Anterior</a
        >
      {/if}

      {#each numeros as n (n)}
        <a
          href={urlTienda({ pagina: n })}
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
          href={urlTienda({ pagina: pag.page + 1 })}
          class="rounded-full border border-cacao/20 px-4 py-2 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro"
          rel="next">Siguiente</a
        >
      {/if}
    </nav>
  {:else}
    <div class="pb-10"></div>
  {/if}
</section>
