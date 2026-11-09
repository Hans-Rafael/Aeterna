<script>
  import { enhance } from '$app/forms';
  import { formatPrice } from '#lib/format.js';

  let { data } = $props();

  /** @type {Record<string, string>} */
  const estados = {
    pendiente: 'Pendiente',
    pagado: 'Pagado',
    entregado: 'Entregado',
    rechazado: 'Cancelado',
    vencido: 'Vencido',
  };
  /** @type {Record<string, string>} */
  const metodos = { mercadopago: 'Mercado Pago', alias: 'Alias' };
</script>

<svelte:head>
  <title>Pedidos · Admin</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-4 pt-10 pb-16">
  <a href="/admin" class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase">← Productos</a>
  <h1 class="mt-3 font-serif text-3xl text-cacao">Pedidos</h1>

  {#if data.pedidos.length === 0}
    <p class="mt-8 text-cacao/70">Todavía no hay pedidos.</p>
  {:else}
    <div class="mt-8 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="text-xs text-cacao/60 uppercase">
          <tr>
            <th class="py-2 pr-3">Fecha</th>
            <th class="pr-3">Pedido</th>
            <th class="pr-3">Cliente</th>
            <th class="pr-3">Total</th>
            <th class="pr-3">Pago</th>
            <th class="pr-3">Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-cacao/10">
          {#each data.pedidos as p (p.id)}
            <tr>
              <td class="py-3 pr-3 whitespace-nowrap">
                {new Date(p.created_at).toLocaleString('es-AR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </td>
              <td class="pr-3">#{p.id.slice(0, 8)}</td>
              <td class="pr-3"
                >{p.customer_name}<br /><span class="text-xs text-cacao/60">{p.customer_phone}</span
                ></td
              >
              <td class="pr-3">{formatPrice(p.total)}</td>
              <td class="pr-3">{metodos[p.payment_method] ?? p.payment_method}</td>
              <td class="pr-3">{estados[p.status] ?? p.status}</td>
              <td class="space-x-2 text-right whitespace-nowrap">
                {#if p.status === 'pendiente' || p.status === 'vencido'}
                  <form method="POST" action="?/pagado" use:enhance class="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      class="rounded-full bg-cacao px-3 py-1 text-xs text-crema hover:bg-rosa-oscuro"
                      >Marcar pagado</button
                    >
                  </form>
                {/if}
                {#if p.status === 'pendiente'}
                  <form method="POST" action="?/cancelar" use:enhance class="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      class="rounded-full border border-cacao/20 px-3 py-1 text-xs hover:border-rosa-oscuro"
                      >Cancelar</button
                    >
                  </form>
                {/if}
                {#if p.status === 'pagado'}
                  <form method="POST" action="?/entregado" use:enhance class="inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      class="rounded-full border border-cacao/20 px-3 py-1 text-xs hover:border-rosa-oscuro"
                      >Entregado</button
                    >
                  </form>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
