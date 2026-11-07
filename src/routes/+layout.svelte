<script>
  import favicon from '#lib/assets/favicon.svg';
  import { cart } from '#lib/cart.svelte.js';
  import Header from '#lib/components/Header.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import WhatsAppFlotante from '#lib/components/WhatsAppFlotante.svelte';
  import '../app.css';

  /** @type {{children: import('svelte').Snippet, data: { products: import('#lib/products.js').Product[] }}} */
  let { children, data } = $props();

  // El carrito necesita los precios actuales (vienen de Supabase).
  $effect(() => {
    cart.setCatalog(data.products);
  });
</script>

<svelte:head>
  <title>Aeterna · Jabones y velas hechos a mano</title>
  <meta
    name="description"
    content="Jabones y velas artesanales hechos a mano, con amor. Comprá online con Mercado Pago."
  />
  <link rel="icon" href={favicon} />
</svelte:head>

<Header />
<main class="min-h-[70vh]">
  {@render children()}
</main>
<Footer />
<WhatsAppFlotante />
