<script>
  import { cart } from '#lib/cart.svelte.js';
  import { formatPrice } from '#lib/format.js';
  import { onImageError } from '#lib/images.js';
</script>

<svelte:head>
  <title>Carrito · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 pt-12 pb-10">
  <h1 class="text-center font-serif text-4xl text-cacao">Tu carrito</h1>

  {#if cart.lines.length === 0}
    <div class="mt-16 text-center">
      <p class="text-cacao/70">Todavía no agregaste nada.</p>
      <a
        href="/tienda"
        class="mt-6 inline-block rounded-full bg-cacao px-7 py-3 text-sm text-crema hover:bg-rosa-oscuro"
      >
        Ir a la tienda
      </a>
    </div>
  {:else}
    <ul class="mt-12 divide-y divide-cacao/10">
      {#each cart.lines as line (line.slug)}
        <li class="flex items-center gap-4 py-5">
          <a
            href="/producto/{line.slug}"
            class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-vainilla/30"
          >
            <img
              src={line.image}
              alt={line.name}
              onerror={onImageError}
              class="h-full w-full object-cover"
            />
          </a>

          <div class="min-w-0 flex-1">
            <a
              href="/producto/{line.slug}"
              class="font-serif text-lg text-cacao hover:text-rosa-oscuro"
            >
              {line.name}
            </a>
            <p class="text-sm text-cacao/60">{formatPrice(line.price)}</p>
          </div>

          <div class="flex items-center rounded-full border border-cacao/20 text-sm">
            <button
              type="button"
              class="h-9 w-9 hover:text-rosa-oscuro"
              aria-label="Quitar uno"
              onclick={() => cart.setQty(line.slug, line.qty - 1)}>−</button
            >
            <span class="w-6 text-center">{line.qty}</span>
            <button
              type="button"
              class="h-9 w-9 hover:text-rosa-oscuro"
              aria-label="Agregar uno"
              onclick={() => cart.setQty(line.slug, line.qty + 1)}>+</button
            >
          </div>

          <p class="hidden w-24 text-right text-cacao sm:block">
            {formatPrice(line.price * line.qty)}
          </p>

          <button
            type="button"
            class="text-xs text-cacao/50 underline underline-offset-4 hover:text-rosa-oscuro"
            onclick={() => cart.remove(line.slug)}
          >
            Quitar
          </button>
        </li>
      {/each}
    </ul>

    <div class="mt-10 flex flex-col items-end gap-4 border-t border-cacao/10 pt-8">
      <p class="text-cacao/70">
        Total <span class="ml-3 font-serif text-3xl text-cacao">{formatPrice(cart.total)}</span>
      </p>
      <div class="flex gap-3">
        <a
          href="/tienda"
          class="rounded-full border border-cacao/20 px-6 py-3 text-sm hover:border-rosa-oscuro"
        >
          Seguir comprando
        </a>
        <a
          href="/checkout"
          class="rounded-full bg-cacao px-7 py-3 text-sm text-crema hover:bg-rosa-oscuro"
        >
          Finalizar compra
        </a>
      </div>
    </div>
  {/if}
</section>
