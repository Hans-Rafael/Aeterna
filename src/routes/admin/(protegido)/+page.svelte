<script>
  import { formatPrice } from '#lib/format.js';

  let { data } = $props();
  /** @type {Record<string, string>} */
  const categorias = { jabon: 'Jabón', vela: 'Vela' };
  /** Umbral para avisar que el stock está bajo. */
  const UMBRAL_ALERTA = 3;
  /** @param {number} stock */
  const estadoStock = (stock) => (stock <= 0 ? 'sin' : stock <= UMBRAL_ALERTA ? 'bajo' : 'ok');
  let enAlerta = $derived(
    data.products.filter((/** @type {any} */ p) => estadoStock(p.stock) !== 'ok')
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
      <form method="POST" action="?/salir">
        <button class="rounded-full bg-cacao px-4 py-2 text-crema hover:bg-rosa-oscuro"
          >Salir</button
        >
      </form>
    </div>
  </div>

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
          <th class="px-4 py-3 font-normal">Producto</th>
          <th class="font-normal">Categoría</th>
          <th class="font-normal">Precio</th>
          <th class="font-normal">Stock</th>
          <th class="font-normal">Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.products as p (p.id)}
          <tr class="border-t border-cacao/10">
            <td class="px-4 py-3 font-serif text-base">{p.name}</td>
            <td>{categorias[p.category]}</td>
            <td>{formatPrice(p.price)}</td>
            <td>
              <span
                class="rounded-full px-2 py-0.5 text-xs {estadoStock(p.stock) === 'ok'
                  ? 'bg-salvia/20 text-cacao'
                  : estadoStock(p.stock) === 'bajo'
                    ? 'bg-vainilla text-cacao'
                    : 'bg-rosa text-cacao'}"
              >
                {p.stock}
              </span>
            </td>
            <td>{p.active ? 'Visible' : 'Oculto'}</td>
            <td class="pr-4 text-right">
              <a href="/admin/producto/{p.id}" class="text-rosa-oscuro underline underline-offset-4"
                >Editar</a
              >
            </td>
          </tr>
        {:else}
          <tr><td colspan="6" class="px-4 py-6 text-center text-cacao/60">No hay productos.</td></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</section>
