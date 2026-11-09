<script>
  import { onMount } from 'svelte';
  import { cart } from '#lib/cart.svelte.js';
  import { formatPrice } from '#lib/format.js';
  import { mensajeTransferencia, whatsappUrl } from '#lib/whatsapp.js';

  let { data } = $props();
  let copiado = $state(false);
  let referencia = $state('');

  // El pedido ya está registrado: vaciamos el carrito de este navegador.
  onMount(() => {
    if (data.pedido) cart.clear();
  });

  async function copiar() {
    try {
      await navigator.clipboard.writeText(data.pago?.alias ?? '');
      copiado = true;
      setTimeout(() => (copiado = false), 2000);
    } catch {
      // sin permiso de portapapeles: el alias queda visible para copiarlo a mano
    }
  }
</script>

<svelte:head>
  <title>Pago por alias · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 pt-16 pb-24 text-center">
  {#if data.pedido && data.pago}
    <h1 class="font-serif text-4xl text-cacao">¡Pedido registrado!</h1>
    <p class="mt-4 text-cacao/75">
      Pedido <strong>#{data.pedido.id.slice(0, 8)}</strong>. Transferí el total al siguiente alias y
      envíanos el comprobante por WhatsApp.
    </p>

    <div class="mt-8 rounded-3xl bg-vainilla/25 p-6 text-left">
      <p class="text-sm text-cacao/60">Alias</p>
      <div class="flex items-center justify-between gap-3">
        <p class="font-serif text-2xl text-cacao">{data.pago.alias}</p>
        <button
          type="button"
          onclick={copiar}
          class="rounded-full border border-cacao/20 px-4 py-1.5 text-xs hover:border-rosa-oscuro"
        >
          {copiado ? '¡Copiado!' : 'Copiar'}
        </button>
      </div>
      <p class="mt-4 text-sm text-cacao/60">Titular</p>
      <p class="text-cacao">{data.pago.titular}</p>
      <p class="mt-4 text-sm text-cacao/60">Total a transferir</p>
      <p class="font-serif text-3xl text-cacao">{formatPrice(data.pedido.total)}</p>
    </div>

    <label class="mt-8 block text-left text-sm">
      <span class="text-cacao/70">
        Código de identificación de la transferencia (opcional, lo ves en el comprobante del banco:
        "ID COELSA", "Nº de comprobante" o "Nº de operación")
      </span>
      <input
        bind:value={referencia}
        inputmode="numeric"
        maxlength="40"
        class="mt-1.5 block w-full rounded-xl border border-cacao/20 bg-white px-3.5 py-2.5"
      />
    </label>

    <a
      href={whatsappUrl(mensajeTransferencia(data.pedido, data.pago, referencia))}
      target="_blank"
      rel="noopener noreferrer"
      class="mt-6 inline-block rounded-full bg-[#25D366] px-7 py-3 text-sm font-medium text-white hover:brightness-95"
    >
      Enviar comprobante por WhatsApp
    </a>
    <p class="mt-3 text-xs text-cacao/60">
      Reservamos tu pedido por 24 horas. Cuando confirmemos la transferencia coordinamos la entrega
      en Escobar.
    </p>
  {:else}
    <h1 class="font-serif text-4xl text-cacao">No encontramos tu pedido</h1>
    <p class="mt-5 text-cacao/75">Si creés que es un error, escribinos y lo revisamos.</p>
    <a
      href="/tienda"
      class="mt-10 inline-block rounded-full bg-cacao px-7 py-3 text-sm text-crema hover:bg-rosa-oscuro"
    >
      Volver a la tienda
    </a>
  {/if}
</section>
