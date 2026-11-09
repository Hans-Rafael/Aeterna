<script>
  import { untrack } from 'svelte';
  import { cart } from '#lib/cart.svelte.js';
  import { formatPrice } from '#lib/format.js';
  import { normalizarCuit } from '#lib/cuit.js';
  import { LIMITES, errorEmail, errorNombre, errorTelefono } from '#lib/validar.js';

  /** @type {{ form: any }} */
  let { form } = $props();

  // El servidor recalcula precios desde la base; acá solo mandamos slug y cantidad.
  let metodo = $state(untrack(() => form?.metodo_pago ?? 'mercadopago'));

  const valores = $state({
    nombre: untrack(() => form?.nombre ?? ''),
    email: untrack(() => form?.email ?? ''),
    telefono: untrack(() => form?.telefono ?? ''),
    pagador_nombre: untrack(() => form?.pagador_nombre ?? ''),
    pagador_cuit: untrack(() => form?.pagador_cuit ?? ''),
  });
  /** Campos que el usuario ya tocó (salió de ellos con Tab/clic): recién ahí mostramos el error. */
  const tocados = $state({
    nombre: false,
    email: false,
    telefono: false,
    pagador_nombre: false,
    pagador_cuit: false,
  });

  /** @param {string} valor @param {string} campo */
  function nombreError(valor, campo) {
    const v = valor.trim();
    if (!v) return `Ingresá ${campo}.`;
    const e = errorNombre(v);
    return e ? `Este campo ${e}.` : null;
  }

  let errores = $derived({
    nombre: nombreError(valores.nombre, 'tu nombre y apellido'),
    email: (() => {
      const v = valores.email.trim();
      if (!v) return metodo === 'alias' ? null : 'Ingresá tu email.';
      const e = errorEmail(v);
      return e ? `El email ${e}.` : null;
    })(),
    telefono: (() => {
      const v = valores.telefono.trim();
      if (!v) return 'Ingresá tu teléfono.';
      const e = errorTelefono(v);
      return e ? `El teléfono ${e}.` : null;
    })(),
    pagador_nombre:
      metodo === 'alias'
        ? nombreError(valores.pagador_nombre, 'el nombre completo del titular')
        : null,
    pagador_cuit: (() => {
      if (metodo !== 'alias') return null;
      const v = valores.pagador_cuit.trim();
      if (!v) return 'Ingresá el CUIT/CUIL del titular.';
      return normalizarCuit(v)
        ? null
        : 'El CUIT/CUIL no es válido (11 dígitos, ej. 20-12345678-9).';
    })(),
  });

  /** @param {keyof typeof errores} campo */
  const ver = (campo) => (tocados[campo] ? errores[campo] : null);

  /** @param {SubmitEvent} e */
  function alEnviar(e) {
    for (const campo of /** @type {(keyof typeof tocados)[]} */ (Object.keys(tocados))) {
      tocados[campo] = true;
    }
    const primero = /** @type {(keyof typeof errores)[]} */ (Object.keys(errores)).find(
      (c) => errores[c]
    );
    if (primero) {
      e.preventDefault();
      /** @type {HTMLElement | null} */ (
        /** @type {HTMLFormElement} */ (e.currentTarget).elements.namedItem(primero)
      )?.focus();
    }
  }

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
      <form method="POST" novalidate onsubmit={alEnviar} class="space-y-5 md:col-span-3">
        <input type="hidden" name="carrito" value={carrito} />

        <h2 class="font-serif text-xl text-cacao">Tus datos</h2>

        <label class="block text-sm">
          <span class="text-cacao/70">Nombre y apellido</span>
          <input
            name="nombre"
            maxlength={LIMITES.nombreMax}
            bind:value={valores.nombre}
            onblur={() => (tocados.nombre = true)}
            aria-invalid={!!ver('nombre')}
            class="field"
            autocomplete="name"
          />
          {#if ver('nombre')}<span class="err" role="alert">{ver('nombre')}</span>{/if}
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Email{metodo === 'alias' ? ' (opcional)' : ''}</span>
          <input
            type="email"
            name="email"
            maxlength={LIMITES.emailMax}
            bind:value={valores.email}
            onblur={() => (tocados.email = true)}
            aria-invalid={!!ver('email')}
            class="field"
            autocomplete="email"
          />
          {#if ver('email')}<span class="err" role="alert">{ver('email')}</span>{/if}
        </label>
        <label class="block text-sm">
          <span class="text-cacao/70">Teléfono</span>
          <input
            type="tel"
            name="telefono"
            inputmode="tel"
            maxlength={LIMITES.telefonoMax}
            placeholder="11 2345-6789"
            bind:value={valores.telefono}
            onblur={() => (tocados.telefono = true)}
            aria-invalid={!!ver('telefono')}
            class="field"
            autocomplete="tel"
          />
          {#if ver('telefono')}<span class="err" role="alert">{ver('telefono')}</span>{/if}
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
                name="pagador_nombre"
                maxlength={LIMITES.nombreMax}
                bind:value={valores.pagador_nombre}
                onblur={() => (tocados.pagador_nombre = true)}
                aria-invalid={!!ver('pagador_nombre')}
                class="field"
                autocomplete="off"
              />
              {#if ver('pagador_nombre')}<span class="err" role="alert"
                  >{ver('pagador_nombre')}</span
                >{/if}
            </label>
            <label class="block text-sm">
              <span class="text-cacao/70">CUIT / CUIL del titular</span>
              <input
                name="pagador_cuit"
                inputmode="numeric"
                maxlength={LIMITES.cuitMax}
                placeholder="20-12345678-9"
                bind:value={valores.pagador_cuit}
                onblur={() => (tocados.pagador_cuit = true)}
                aria-invalid={!!ver('pagador_cuit')}
                class="field"
                autocomplete="off"
              />
              {#if ver('pagador_cuit')}<span class="err" role="alert">{ver('pagador_cuit')}</span
                >{/if}
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
  .field[aria-invalid='true'] {
    border-color: var(--color-rosa-oscuro);
  }
  .err {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: var(--color-rosa-oscuro);
  }
  .field:focus {
    outline: 2px solid var(--color-rosa-oscuro);
    outline-offset: 1px;
  }
</style>
