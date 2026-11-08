<script>
  import ProductCard from '#lib/components/ProductCard.svelte';

  let { data } = $props();
  let featured = $derived(data.products.filter((p) => p.featured));

  /**
   * Foto de cada categoría en el home: la primera foto de contexto de un producto de esa
   * categoría (los destacados primero). Si no hay ninguna, se usa la foto de siempre.
   * @param {string} categoria
   * @param {string} respaldo
   */
  function fotoCategoria(categoria, respaldo) {
    const candidatos = data.products
      .filter((p) => p.category === categoria && p.extraImages?.length)
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return candidatos[0]?.extraImages?.[0] ?? respaldo;
  }
  let fotoJabones = $derived(fotoCategoria('jabon', '/productos/jabon-lavanda-masaje.jpeg'));
  let fotoVelas = $derived(fotoCategoria('vela', '/productos/vela-vainilla-perrito.jpeg'));
</script>

<!-- Hero -->
<section class="relative isolate overflow-hidden">
  <img
    src="/img/hero.png"
    alt=""
    class="absolute inset-0 -z-10 h-full w-full object-cover opacity-90"
  />
  <div class="absolute inset-0 -z-10 bg-gradient-to-b from-crema/70 via-crema/40 to-crema"></div>

  <div class="mx-auto flex max-w-3xl flex-col items-center px-4 pt-28 pb-44 text-center sm:pt-36">
    <p class="text-xs tracking-[0.4em] text-rosa-oscuro uppercase">Hecho a mano</p>
    <h1 class="mt-4 font-serif text-5xl tracking-[0.3em] text-cacao sm:text-7xl">AETERNA</h1>
    <p class="mt-5 font-serif text-lg text-cacao/80 italic sm:text-xl">
      jabones y velas hechos a mano, con amor
    </p>
    <div class="mt-10 flex flex-wrap justify-center gap-3">
      <a
        href="/tienda?categoria=jabon"
        class="rounded-full bg-cacao px-7 py-3 text-sm tracking-wide text-crema transition hover:bg-rosa-oscuro"
      >
        Ver jabones
      </a>
      <a
        href="/tienda?categoria=vela"
        class="rounded-full border border-cacao/30 bg-crema/60 px-7 py-3 text-sm tracking-wide text-cacao backdrop-blur transition hover:border-rosa-oscuro hover:text-rosa-oscuro"
      >
        Ver velas
      </a>
    </div>
  </div>
</section>

<!-- Destacados -->
<section class="mx-auto max-w-6xl px-4 -mt-24 relative">
  <div class="mb-10 text-center">
    <h2 class="font-serif text-3xl text-cacao sm:text-4xl">Destacados</h2>
    <p class="mt-2 text-sm text-cacao/60">Nuestros favoritos de la temporada</p>
  </div>
  <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
    {#each featured as product (product.slug)}
      <ProductCard {product} />
    {/each}
  </div>
  <div class="mt-12 text-center">
    <a href="/tienda" class="text-sm tracking-wide text-rosa-oscuro underline underline-offset-4">
      Ver toda la tienda →
    </a>
  </div>
</section>

<!-- Categorías -->
<section class="mx-auto mt-24 grid max-w-6xl gap-6 px-4 md:grid-cols-2">
  <a
    href="/tienda?categoria=jabon"
    class="group relative block aspect-[4/3] overflow-hidden rounded-3xl"
  >
    <img
      src={fotoJabones}
      alt="Jabones artesanales"
      loading="lazy"
      class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-cacao/70 to-transparent"></div>
    <div class="absolute bottom-6 left-6 text-crema">
      <p class="font-serif text-3xl">Jabones</p>
      <p class="mt-1 text-sm opacity-90">Rosa, lavanda, vainilla y coco</p>
    </div>
  </a>
  <a
    href="/tienda?categoria=vela"
    class="group relative block aspect-[4/3] overflow-hidden rounded-3xl"
  >
    <img
      src={fotoVelas}
      alt="Velas artesanales"
      loading="lazy"
      class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-cacao/70 to-transparent"></div>
    <div class="absolute bottom-6 left-6 text-crema">
      <p class="font-serif text-3xl">Velas</p>
      <p class="mt-1 text-sm opacity-90">Cera premium con fragancia</p>
    </div>
  </a>
</section>

<!-- Manifiesto -->
<section class="mx-auto mt-24 max-w-2xl px-4 text-center">
  <p class="font-serif text-2xl leading-relaxed text-cacao/85 italic">
    Cada pieza se hace a mano, en pequeños lotes, con ingredientes que cuidan tu piel y tu espacio.
  </p>
</section>
