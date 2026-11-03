<script>
  import { cart } from '#lib/cart.svelte.js';
</script>

<header class="sticky top-0 z-40 border-b border-cacao/10 bg-crema/90 backdrop-blur">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
    <a href="/" class="font-serif text-2xl tracking-[0.3em] text-cacao">AETERNA</a>

    <nav class="flex items-center gap-5 text-sm text-cacao/80 sm:gap-7">
      <a href="/tienda" class="hover:text-rosa-oscuro">Tienda</a>
      <a href="/tienda?categoria=jabon" class="hidden hover:text-rosa-oscuro sm:inline">Jabones</a>
      <a href="/tienda?categoria=vela" class="hidden hover:text-rosa-oscuro sm:inline">Velas</a>
      <a
        href="/carrito"
        class="flex items-center gap-2 rounded-full border border-cacao/20 px-4 py-1.5 hover:border-rosa-oscuro hover:text-rosa-oscuro"
      >
        Carrito
        <span
          class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rosa-oscuro px-1.5 text-xs text-white"
        >
          {cart.count}
        </span>
      </a>
    </nav>
  </div>
</header>
