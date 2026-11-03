<script>
  import favicon from '#lib/assets/favicon.svg';
  import Header from '#lib/components/Header.svelte';
  import Footer from '#lib/components/Footer.svelte';
  import '../app.css';

  /** @type {{children: import('svelte').Snippet}} */
  let { children } = $props();
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
