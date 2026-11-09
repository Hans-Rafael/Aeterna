<script>
  import { untrack } from 'svelte';
  import { cart } from '#lib/cart.svelte.js';
  import { formatPrice } from '#lib/format.js';
  import { LIMITES } from '#lib/validar.js';

  /** @type {{ form: any }} */
  let { form } = $props();

  // El servidor recalcula precios desde la base; acá solo mandamos slug y cantidad.
  const PATRON_TELEFONO = String.raw`\+?[0-9 \(\)\-]{8,20}`;
  const PATRON_CUIT = String.raw`[0-9 \-]{11,14}`;
  let metodo = $state(untrack(() => form?.metodo_pago ?? 'mercadopago'));
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
            minlength={LIMITES.nombreMin}
            maxlength={LIMITES.nombreMax}
            pattern=".*\S\s+\S.*"
            title="Escribí nombre y apellido"
            value={form?.nombre ?? ''}
            class="field"
            autocomplete="name"
          />
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Email{metodo === 'alias' ? ' (opcional)' : ''}</span>
          <input
            required={metodo !== 'alias'}
            type="email"
            name="email"
            maxlength={LIMITES.emailMax}
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
            inputmode="tel"
            minlength="8"
            maxlength={LIMITES.telefonoMax}
            pattern={PATRON_TELEFONO}
            title="Solo números (8 a 15 dígitos). Ej: 11 2345-6789"
            placeholder="11 2345-6789"
            value={form?.telefono ?? ''}
            class="field"
            autocomplete="tel"
          />
        </label>

        <div class="rounded-2xl bg-vainilla/20 p-5 text-sm text-cacao/80">
          <p class="font-serif text-lg text-cacao">Entrega</p>
          <p class="mt-1">
            Retiro o punto de encuentro en Escobar. No hacemos envíos a domicilio: después del pago
            coordinamos el lugar y el horario por WhatsApp.
          </p>
        </div>

        <fieldset class="space-y-2">
          <legend class="font-serif text-xl text-cacao">Forma de pago</legend>
          <label
            class="flex cursor-pointer items-start gap-3 rounded-2xl border border-cacao/15 bg-white p-4 text-sm has-[:checked]:border-rosa-oscuro"
          >
            <input
              type="radio"
              name="metodo_pago"
              value="mercadopago"
              bind:group={metodo}
              class="mt-1"
            />
            <span>
              <span class="font-medium">Mercado Pago</span>
              <span class="block text-cacao/60">Tarjeta, dinero en cuenta u otros medios.</span>
            </span>
          </label>
          <label
            class="flex cursor-pointer items-start gap-3 rounded-2xl border border-cacao/15 bg-white p-4 text-sm has-[:checked]:border-rosa-oscuro"
          >
            <input type="radio" name="metodo_pago" value="alias" bind:group={metodo} class="mt-1" />
            <span>
              <span class="font-medium">Transferencia por alias</span>
              <span class="block text-cacao/60">
                Te mostramos el alias y envías el comprobante por WhatsApp.
              </span>
            </span>
          </label>
        </fieldset>

        {#if metodo === 'alias'}
          <div class="space-y-4 rounded-2xl bg-vainilla/20 p-5">
            <p class="text-sm text-cacao/80">
              Para identificar tu transferencia, indicá los datos de la cuenta <strong
                >desde la que vas a transferir</strong
              > (pueden ser distintos a los tuyos).
            </p>
            <label class="block text-sm">
              <span class="text-cacao/70">Nombre y apellido completo del titular de la cuenta</span>
              <input
                required
                name="pagador_nombre"
                minlength={LIMITES.nombreMin}
                maxlength={LIMITES.nombreMax}
                pattern=".*\S\s+\S.*"
                title="Escribí nombre y apellido completos"
                value={form?.pagador_nombre ?? ''}
                class="field"
                autocomplete="off"
              />
            </label>
            <label class="block text-sm">
              <span class="text-cacao/70">CUIT / CUIL del titular</span>
              <input
                required
                name="pagador_cuit"
                inputmode="numeric"
                maxlength={LIMITES.cuitMax}
                pattern={PATRON_CUIT}
                title="11 dígitos, con o sin guiones"
                placeholder="20-12345678-9"
                value={form?.pagador_cuit ?? ''}
                class="field"
                autocomplete="off"
              />
            </label>
          </div>
        {/if}

        <button
          type="submit"
          class="w-full rounded-full px-7 py-3.5 text-sm font-medium tracking-wide text-white transition hover:brightness-95 {metodo ===
          'alias'
            ? 'bg-[#25D366]'
            : 'bg-[#009ee3]'}"
        >
          {metodo === 'alias' ? 'Confirmar pedido y ver alias' : 'Pagar con Mercado Pago'}
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
