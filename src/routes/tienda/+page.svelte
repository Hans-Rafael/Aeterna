<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import ProductCard from '#lib/components/ProductCard.svelte';
  import { paginate } from '#lib/pagination.js';
  import { categories, formaLabels, formas } from '#lib/products.js';
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

  let enCategoria = $derived(
    categoria ? data.products.filter((p) => p.category === categoria) : data.products
  );

  // Forma: se puede elegir en toda la tienda; si hay categoría, solo sus formas.
  let formasDisponibles = $derived(
    (categoria && categoria in formas
      ? formas[/** @type {keyof typeof formas} */ (categoria)]
      : [...new Set([...formas.jabon, ...formas.vela])]
    ).filter((f) => enCategoria.some((p) => p.shape === f))
  );
  let formaPedida = $derived(page.url.searchParams.get('forma') ?? '');
  let forma = $derived(formasDisponibles.includes(formaPedida) ? formaPedida : null);

  let enForma = $derived(forma ? enCategoria.filter((p) => p.shape === forma) : enCategoria);
  let aromasDisponibles = $derived(
    categoria === 'jabon' || categoria === 'vela'
      ? [...new Set(enCategoria.map((p) => p.fragrance))].sort((a, b) => a.localeCompare(b, 'es'))
      : []
  );
  let aromaPedido = $derived(page.url.searchParams.get('aroma') ?? '');
  let aroma = $derived(aromasDisponibles.includes(aromaPedido) ? aromaPedido : null);

  let filtrados = $derived(aroma ? enForma.filter((p) => p.fragrance === aroma) : enForma);
  let ordenados = $derived(sortProducts(filtrados, orden));
  let pag = $derived(paginate(ordenados, page.url.searchParams.get('pagina')));
  let titulo = $derived(categoria ? categories[categoria].label : 'Tienda');
  let numeros = $derived(Array.from({ length: pag.totalPages }, (_, i) => i + 1));

  /**
   * Arma la URL de la tienda. Los valores ya fueron validados arriba
   * (categoría, forma, aroma y orden contra sus listas); el aroma se codifica porque
   * puede tener tildes o espacios.
   * @param {{ categoria?: string | null, forma?: string | null, aroma?: string | null, orden?: string | null, pagina?: number | null }} params
   */
  function urlTienda({
    categoria: cat = categoria,
    forma: form = null,
    aroma: aro = null,
    orden: ord = orden,
    pagina = null,
  }) {
    const partes = [];
    if (cat) partes.push(`categoria=${cat}`);
    if (form) partes.push(`forma=${form}`);
    if (aro) partes.push(`aroma=${encodeURIComponent(aro)}`);
    if (ord && ord !== 'recomendados') partes.push(`orden=${ord}`);
    if (pagina && pagina > 1) partes.push(`pagina=${pagina}`);
    return partes.length ? `/tienda?${partes.join('&')}` : '/tienda';
  }

  /** @param {Event} event */
  function cambiarForma(event) {
    const value = /** @type {HTMLSelectElement} */ (event.currentTarget).value;
    goto(urlTienda({ forma: value || null, aroma, pagina: null }));
  }

  /** @param {Event} event */
  function cambiarOrden(event) {
    const value = /** @type {HTMLSelectElement} */ (event.currentTarget).value;
    // Al cambiar el orden volvemos a la primera página.
    goto(urlTienda({ forma, aroma, orden: value, pagina: null }));
  }
</script>

<svelte:head>
  <title>{titulo} · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-6xl px-4 pt-8">
  <div class="text-center">
    <p class="text-xs tracking-[0.4em] text-rosa-oscuro uppercase">Colección</p>
    <h1 class="mt-2 font-serif text-4xl text-cacao">{titulo}</h1>
  </div>

  <div class="mt-5 flex flex-wrap justify-center gap-2">
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

  {#if aromasDisponibles.length > 1}
    <div class="mt-2 flex flex-wrap justify-center gap-2 text-xs">
      <span class="self-center text-cacao/60">Aroma o función:</span>
      <a
        href={urlTienda({ forma, aroma: null })}
        class="rounded-full border px-4 py-1.5 {aroma === null
          ? 'border-rosa-oscuro text-rosa-oscuro'
          : 'border-cacao/20 text-cacao/70 hover:border-rosa-oscuro'}">Todos</a
      >
      {#each aromasDisponibles as a (a)}
        <a
          href={urlTienda({ forma, aroma: a })}
          class="rounded-full border px-4 py-1.5 {aroma === a
            ? 'border-rosa-oscuro text-rosa-oscuro'
            : 'border-cacao/20 text-cacao/70 hover:border-rosa-oscuro'}">{a}</a
        >
      {/each}
    </div>
  {/if}

  <div
    class="mt-4 flex flex-col gap-3 text-sm text-cacao/70 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
  >
    <p class="order-2 sm:order-1">{pag.total} {pag.total === 1 ? 'producto' : 'productos'}</p>
    <div
      class="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-4"
    >
      {#if formasDisponibles.length}
        <label class="flex items-center justify-between gap-2 sm:justify-start">
          <span>Forma</span>
          <select
            class="rounded-full border border-cacao/20 bg-white px-4 py-2 text-cacao focus:outline-2 focus:outline-rosa-oscuro"
            value={forma ?? ''}
            onchange={cambiarForma}
          >
            <option value="">Todas</option>
            {#each formasDisponibles as f (f)}
              <option value={f}>{formaLabels[f] ?? f}</option>
            {/each}
          </select>
        </label>
      {/if}
      <label class="flex items-center justify-between gap-2 sm:justify-start">
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
  </div>

  <div class="mt-4 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
    {#each pag.items as product (product.slug)}
      <ProductCard {product} />
    {:else}
      <p class="col-span-full py-10 text-center text-cacao/60">
        No hay productos en esta categoría.
      </p>
    {/each}
  </div>

  {#if pag.totalPages > 1}
    <nav aria-label="Paginación" class="mt-8 mb-6 flex items-center justify-center gap-2 text-sm">
      {#if pag.hasPrev}
        <a
          href={urlTienda({ forma, aroma, pagina: pag.page - 1 })}
          class="rounded-full border border-cacao/20 px-4 py-2 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro"
          rel="prev">Anterior</a
        >
      {/if}

      {#each numeros as n (n)}
        <a
          href={urlTienda({ forma, aroma, pagina: n })}
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
          href={urlTienda({ forma, aroma, pagina: pag.page + 1 })}
          class="rounded-full border border-cacao/20 px-4 py-2 text-cacao/70 hover:border-rosa-oscuro hover:text-rosa-oscuro"
          rel="next">Siguiente</a
        >
      {/if}
    </nav>
  {:else}
    <div class="pb-6"></div>
  {/if}
</section>
