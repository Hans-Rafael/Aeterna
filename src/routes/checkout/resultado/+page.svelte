<script>
  import { onMount } from 'svelte';
  import { cart } from '#lib/cart.svelte.js';
  import { mensajeCoordinacion, whatsappUrl } from '#lib/whatsapp.js';

  let { data } = $props();
  let estado = $derived(data.pedido?.status ?? null);

  // Pago confirmado: vaciamos el carrito de este navegador una sola vez.
  // (Con $effect se genera un bucle, porque clear() lee y escribe el mismo estado.)
  onMount(() => {
    if (data.pedido?.status === 'pagado') cart.clear();
  });

  /** @type {Record<string, { titulo: string, texto: string }>} */
  const mensajes = {
    pagado: {
      titulo: '¡Gracias por tu compra!',
      texto: 'Recibimos tu pago. Te vamos a contactar para coordinar la entrega.',
    },
    pendiente: {
      titulo: 'Estamos confirmando tu pago',
      texto:
        'Si ya pagaste, en unos minutos se actualiza. Si no pagaste todavía, podés volver a intentarlo.',
    },
    rechazado: {
      titulo: 'El pago no se completó',
      texto: 'No se pudo cobrar la compra. Podés intentar de nuevo desde el carrito.',
    },
  };
  let mensaje = $derived(
    mensajes[estado] ?? {
      titulo: 'No encontramos tu pedido',
      texto: 'Si creés que es un error, escribinos y lo revisamos.',
    }
  );
</script>

<svelte:head>
  <title>Resultado de la compra · Aeterna</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 pt-24 pb-24 text-center">
  <h1 class="font-serif text-4xl text-cacao">{mensaje.titulo}</h1>
  <p class="mt-5 leading-relaxed text-cacao/75">{mensaje.texto}</p>
  {#if data.pedido && (estado === 'pagado' || estado === 'pendiente')}
    <a
      href={whatsappUrl(mensajeCoordinacion(data.pedido))}
      target="_blank"
      rel="noopener noreferrer"
      class="mt-8 inline-block rounded-full bg-[#25D366] px-7 py-3 text-sm font-medium text-white hover:brightness-95"
    >
      Coordinar la entrega por WhatsApp
    </a>
  {/if}
  <a
    href="/tienda"
    class="mt-6 inline-block rounded-full bg-cacao px-7 py-3 text-sm text-crema hover:bg-rosa-oscuro"
  >
    Volver a la tienda
  </a>
</section>
