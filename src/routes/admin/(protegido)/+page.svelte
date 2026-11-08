<script>
  import { page } from '$app/state';
  import { formatPrice } from '#lib/format.js';
  import { formaLabels } from '#lib/products.js';

  let { data } = $props();
  /** @type {Record<string, string>} */
  const categorias = { jabon: 'Jabón', vela: 'Vela', pack: 'Pack' };
  /** Umbral para avisar que el stock está bajo. */
  const UMBRAL_ALERTA = 3;
  /** @param {number} stock */
  const estadoStock = (stock) => (stock <= 0 ? 'sin' : stock <= UMBRAL_ALERTA ? 'bajo' : 'ok');
  let enAlerta = $derived(
    data.products.filter((/** @type {any} */ p) => !p.is_pack && estadoStock(p.stock) !== 'ok')
  );

  /** Orden de la tabla: columna y sentido. Sin elegir, se respeta el orden de carga. */
  /** @type {{ col: 'name' | 'category' | 'shape' | 'fragrance' | 'price' | 'stock' | null, asc: boolean }} */
  let orden = $state({ col: null, asc: true });

  /** @param {'name' | 'category' | 'shape' | 'fragrance' | 'price' | 'stock'} col */
  function ordenarPor(col) {
    // Primer clic: de menor a mayor. Clic en la misma columna: se invierte.
    orden = orden.col === col ? { col, asc: !orden.asc } : { col, asc: true };
  }

  /** @type {{ col: 'name' | 'category' | 'shape' | 'fragrance' | 'price' | 'stock', titulo: string }[]} */
  const columnas = [
    { col: 'name', titulo: 'Producto' },
    { col: 'category', titulo: 'Categoría' },
    { col: 'shape', titulo: 'Forma' },
    { col: 'fragrance', titulo: 'Aroma' },
    { col: 'price', titulo: 'Precio' },
    { col: 'stock', titulo: 'Stock' },
  ];

  /**
   * @param {any} p
   * @param {string} col
   */
  function valorOrden(p, col) {
    if (col === 'category') return categorias[p.category];
    if (col === 'shape')
      return p.shape
        ? (formaLabels[/** @type {keyof typeof formaLabels} */ (p.shape)] ?? p.shape)
        : '';
    return p[col] ?? '';
  }

  let productos = $derived.by(() => {
    const { col, asc } = orden;
    if (!col) return data.products;
    const signo = asc ? 1 : -1;
    return [...data.products].sort((/** @type {any} */ a, /** @type {any} */ b) => {
      // El stock de los packs sale de sus componentes: van siempre al final.
      if (col === 'stock' && a.is_pack !== b.is_pack) return a.is_pack ? 1 : -1;
      const va = valorOrden(a, col);
      const vb = valorOrden(b, col);
      // Los productos sin valor (p. ej. packs sin forma) van siempre al final.
      if (va === '' || vb === '') return va === vb ? 0 : va === '' ? 1 : -1;
      const cmp =
        typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'es');
      return cmp * signo || a.name.localeCompare(b.name, 'es');
    });
  });
</script>

<svelte:head>
  <title>Admin · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-4 pt-12 pb-16">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <h1 class="font-serif text-3xl text-cacao">Productos</h1>
    <div class="flex items-center gap-3 text-sm">
      <a
        href="/tienda"
        class="rounded-full border border-cacao/20 px-4 py-2 hover:border-rosa-oscuro">Ver tienda</a
      >
      <a
        href="/admin/producto/nuevo"
        class="rounded-full border border-cacao/20 px-4 py-2 hover:border-rosa-oscuro"
        >+ Nuevo producto</a
      >
      <a
        href="/admin/packs/nuevo"
        class="rounded-full border border-cacao/20 px-4 py-2 hover:border-rosa-oscuro"
        >+ Nuevo pack</a
      >
      <form method="POST" action="?/salir">
        <button class="rounded-full bg-cacao px-4 py-2 text-crema hover:bg-rosa-oscuro"
          >Salir</button
        >
      </form>
    </div>
  </div>

  {#if page.url.searchParams.has('pack')}
    <p class="mt-6 rounded-2xl bg-salvia/20 p-3 text-sm">Pack creado.</p>
  {/if}

  {#if enAlerta.length > 0}
    <div class="mt-6 rounded-2xl bg-rosa/30 p-4 text-sm text-cacao">
      <p class="font-medium">Stock para reponer ({enAlerta.length})</p>
      <ul class="mt-2 list-disc space-y-1 pl-5">
        {#each enAlerta as p (p.id)}
          <li>
            {p.name}: {p.stock <= 0 ? 'sin stock' : `quedan ${p.stock}`}
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <div class="mt-8 overflow-x-auto rounded-2xl border border-cacao/10 bg-white">
    <table class="w-full text-sm">
      <thead class="bg-vainilla/30 text-left text-cacao/70">
        <tr>
          {#each columnas as { col, titulo } (col)}
            <th
              class="font-normal {col === 'name' ? 'px-4 py-3' : ''}"
              aria-sort={orden.col === col ? (orden.asc ? 'ascending' : 'descending') : 'none'}
            >
              <button
                type="button"
                onclick={() => ordenarPor(col)}
                class="hover:text-rosa-oscuro {orden.col === col ? 'text-cacao' : ''}"
                title="Ordenar por {titulo.toLowerCase()}"
              >
                {titulo}
                <span class="text-xs">{orden.col === col ? (orden.asc ? '▲' : '▼') : '↕'}</span>
              </button>
            </th>
          {/each}
          <th class="font-normal">Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each productos as p (p.id)}
          <tr class="border-t border-cacao/10">
            <td class="px-4 py-3 font-serif text-base">
              {p.name}
              {#if p.featured}
                <span
                  class="ml-2 rounded-full bg-rosa/40 px-2 py-0.5 align-middle font-sans text-xs text-cacao"
                  title="Destacado en la tienda">★ Destacado</span
                >
              {/if}
            </td>
            <td>{categorias[p.category]}</td>
            <td>{valorOrden(p, 'shape') || '—'}</td>
            <td>{p.fragrance || '—'}</td>
            <td>{formatPrice(p.price)}</td>
            <td>
              {#if p.is_pack}
                <span class="text-xs text-cacao/60">según componentes</span>
              {:else}
                <span
                  class="rounded-full px-2 py-0.5 text-xs {estadoStock(p.stock) === 'ok'
                    ? 'bg-salvia/20 text-cacao'
                    : estadoStock(p.stock) === 'bajo'
                      ? 'bg-vainilla text-cacao'
                      : 'bg-rosa text-cacao'}"
                >
                  {p.stock}
                </span>
              {/if}
            </td>
            <td>{p.active ? 'Visible' : 'Oculto'}</td>
            <td class="pr-4 text-right">
              <a
                href={p.is_pack ? `/admin/packs/${p.id}` : `/admin/producto/${p.id}`}
                class="text-rosa-oscuro underline underline-offset-4">Editar</a
              >
            </td>
          </tr>
        {:else}
          <tr><td colspan="8" class="px-4 py-6 text-center text-cacao/60">No hay productos.</td></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</section>
