<script>
  import { page } from '$app/state';
  import { formatPrice } from '#lib/format.js';
  import { formaLabels } from '#lib/products.js';
  import EncabezadosOrdenables from '#lib/components/EncabezadosOrdenables.svelte';
  import ResumenOrden from '#lib/components/ResumenOrden.svelte';
  import { alternarOrden, ordenarFilas } from '#lib/orden-tabla.js';

  let { data } = $props();
  /** @type {Record<string, string>} */
  const categorias = { jabon: 'Jabón', vela: 'Vela', pack: 'Pack' };
  /** Umbral para avisar que el stock está bajo. */
  const UMBRAL_ALERTA = 3;
  /** @param {number} stock */
  const estadoStock = (stock) => (stock <= 0 ? 'sin' : stock <= UMBRAL_ALERTA ? 'bajo' : 'ok');
  /**
   * @param {string | undefined} valor
   * @param {Record<string, string>} etiquetas
   */
  function detalle(valor, etiquetas) {
    return valor ? (etiquetas[valor] ?? valor) : '';
  }

  /**
   * @param {any} p
   * @param {import('#lib/orden-tabla.js').Col} col
   */
  function valorOrden(p, col) {
    if (col === 'category') return categorias[p.category];
    if (col === 'shape') return detalle(p.shape, formaLabels);
    return p[col] ?? '';
  }

  /** @type {{ col: import('#lib/orden-tabla.js').Col, titulo: string }[]} */
  const columnas = [
    { col: 'name', titulo: 'Producto' },
    { col: 'category', titulo: 'Categoría' },
    { col: 'shape', titulo: 'Forma' },
    { col: 'fragrance', titulo: 'Aroma' },
    { col: 'price', titulo: 'Precio' },
    { col: 'stock', titulo: 'Stock' },
  ];
  /** Columnas de la tabla de reponer, en el orden en que se muestran. */
  const columnasReponer = ['name', 'stock', 'category', 'shape', 'fragrance'].map(
    (col) => /** @type {(typeof columnas)[number]} */ (columnas.find((c) => c.col === col))
  );

  /**
   * Cada tabla tiene su propio orden, en el orden de los clics. Vacío: la de productos respeta
   * el orden de carga y la de reponer se agrupa por categoría y forma.
   * @type {import('#lib/orden-tabla.js').Criterio[]}
   */
  let orden = $state([]);
  /** @type {import('#lib/orden-tabla.js').Criterio[]} */
  let ordenReponer = $state([]);
  /** @type {import('#lib/orden-tabla.js').Criterio[]} */
  const REPONER_POR_DEFECTO = [
    { col: 'category', asc: true },
    { col: 'shape', asc: true },
  ];

  let productos = $derived(
    orden.length ? ordenarFilas(data.products, orden, valorOrden) : data.products
  );
  let enAlerta = $derived(
    ordenarFilas(
      data.products.filter((/** @type {any} */ p) => !p.is_pack && estadoStock(p.stock) !== 'ok'),
      ordenReponer.length ? ordenReponer : REPONER_POR_DEFECTO,
      valorOrden
    )
  );
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
        href="/admin/pedidos"
        class="rounded-full border border-cacao/20 px-4 py-2 hover:border-rosa-oscuro">Pedidos</a
      >
      <a
        href="/admin/ajustes"
        class="rounded-full border border-cacao/20 px-4 py-2 hover:border-rosa-oscuro">Ajustes</a
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
      <ResumenOrden
        columnas={columnasReponer}
        orden={ordenReponer}
        limpiar={() => (ordenReponer = [])}
      />
      <div class="mt-3 overflow-x-auto">
        <table class="w-full text-left">
          <thead class="text-cacao/60">
            <tr>
              <EncabezadosOrdenables
                columnas={columnasReponer}
                orden={ordenReponer}
                alternar={(c) => (ordenReponer = alternarOrden(ordenReponer, c))}
                claseNombre="py-1 pr-4"
              />
            </tr>
          </thead>
          <tbody>
            {#each enAlerta as p (p.id)}
              <tr class="border-t border-cacao/10">
                <td class="py-1 pr-4">{p.name}</td>
                <td class="py-1 pr-4">{p.stock <= 0 ? 'sin stock' : `quedan ${p.stock}`}</td>
                <td class="py-1 pr-4">{categorias[p.category]}</td>
                <td class="py-1 pr-4">{detalle(p.shape, formaLabels) || '—'}</td>
                <td class="py-1">{p.fragrance || '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <ResumenOrden {columnas} {orden} limpiar={() => (orden = [])} />

  <div class="mt-8 overflow-x-auto rounded-2xl border border-cacao/10 bg-white">
    <table class="w-full text-sm">
      <thead class="bg-vainilla/30 text-left text-cacao/70">
        <tr>
          <EncabezadosOrdenables
            {columnas}
            {orden}
            alternar={(c) => (orden = alternarOrden(orden, c))}
            claseNombre="px-4 py-3"
          />
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
