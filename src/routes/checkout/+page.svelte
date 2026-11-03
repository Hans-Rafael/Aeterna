<script>
  import { cart } from '#lib/cart.svelte.js';
  import { formatPrice } from '#lib/format.js';

  /** @type {{ form: any }} */
  let { form } = $props();
  let entrega = $state('retiro');

  // El servidor recalcula precios desde la base; acá solo mandamos slug y cantidad.
  let carrito = $derived(JSON.stringify(cart.items.map((i) => ({ slug: i.slug, qty: i.qty }))));
</script>

<svelte:head>
  <title>Checkout · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-4 pt-12 pb-10">
  <h1 class="text-center font-serif text-4xl text-cacao">Finalizar compra</h1>

  {#if cart.lines.length === 0}
    <div class="mt-16 text-center">
      <p class="text-cacao/70">Tu carrito está vacío.</p>
      <a
        href="/tienda"
        class="mt-6 inline-block rounded-full bg-cacao px-7 py-3 text-sm text-crema hover:bg-rosa-oscuro"
      >
        Ir a la tienda
      </a>
    </div>
  {:else}
    <div class="mt-12 grid gap-10 md:grid-cols-5">
      <form method="POST" class="space-y-5 md:col-span-3">
        <input type="hidden" name="carrito" value={carrito} />

        <h2 class="font-serif text-xl text-cacao">Tus datos</h2>

        <label class="block text-sm">
          <span class="text-cacao/70">Nombre y apellido</span>
          <input
            required
            name="nombre"
            value={form?.nombre ?? ''}
            class="field"
            autocomplete="name"
          />
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Email</span>
          <input
            required
            type="email"
            name="email"
            value={form?.email ?? ''}
            class="field"
            autocomplete="email"
          />
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Teléfono</span>
          <input
            required
            type="tel"
            name="telefono"
            value={form?.telefono ?? ''}
            class="field"
            autocomplete="tel"
          />
        </label>

        <fieldset class="space-y-3 pt-2">
          <legend class="font-serif text-xl text-cacao">Entrega</legend>
          <label class="flex items-center gap-3 text-sm">
            <input type="radio" name="entrega" value="retiro" bind:group={entrega} />
            Retiro en persona
          </label>
          <label class="flex items-center gap-3 text-sm">
            <input type="radio" name="entrega" value="envio" bind:group={entrega} />
            Envío a domicilio
          </label>
        </fieldset>

        {#if entrega === 'envio'}
          <label class="block text-sm">
            <span class="text-cacao/70">Dirección</span>
            <input required name="direccion" class="field" autocomplete="street-address" />
          </label>
        {/if}

        <button
          type="submit"
          class="w-full rounded-full bg-[#009ee3] px-7 py-3.5 text-sm font-medium tracking-wide text-white transition hover:brightness-95"
        >
          Pagar con Mercado Pago
        </button>

        {#if form?.error}
          <p class="rounded-2xl bg-rosa/30 p-4 text-sm text-cacao">{form.error}</p>
        {/if}
      </form>

      <aside class="rounded-3xl bg-vainilla/25 p-6 md:col-span-2 md:self-start">
        <h2 class="font-serif text-xl text-cacao">Resumen</h2>
        <ul class="mt-5 space-y-4">
          {#each cart.lines as line (line.slug)}
            <li class="flex justify-between gap-3 text-sm">
              <span class="text-cacao/80">{line.name} × {line.qty}</span>
              <span class="text-cacao">{formatPrice(line.price * line.qty)}</span>
            </li>
          {/each}
        </ul>
        <div class="mt-6 flex justify-between border-t border-cacao/10 pt-4">
          <span class="text-cacao/70">Total</span>
          <span class="font-serif text-2xl text-cacao">{formatPrice(cart.total)}</span>
        </div>
        <a
          href="/carrito"
          class="mt-4 inline-block text-xs text-rosa-oscuro underline underline-offset-4"
        >
          Editar carrito
        </a>
      </aside>
    </div>
  {/if}
</section>

<style>
  .field {
    display: block;
    width: 100%;
    margin-top: 0.375rem;
    border-radius: 0.75rem;
    border: 1px solid rgb(74 59 53 / 0.2);
    background: white;
    padding: 0.625rem 0.875rem;
    color: var(--color-cacao);
  }
  .field:focus {
    outline: 2px solid var(--color-rosa-oscuro);
    outline-offset: 1px;
  }
</style>
