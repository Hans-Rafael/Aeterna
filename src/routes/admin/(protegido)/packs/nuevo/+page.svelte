<script>
  import PackForm from '#lib/components/admin/PackForm.svelte';

  let { data, form } = $props();
</script>

<svelte:head>
  <title>Nuevo pack · Admin</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 pt-10 pb-16">
  <a href="/admin" class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase">← Productos</a>
  <h1 class="mt-3 font-serif text-3xl text-cacao">Nuevo pack</h1>
  <p class="mt-2 text-sm text-cacao/60">
    El stock del pack sale de sus productos: cada pack descuenta las unidades de cada uno.
  </p>

  <PackForm candidatos={data.candidatos} error={form?.error ?? null} />
</section>
