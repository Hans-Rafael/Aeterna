<script>
  import { page } from '$app/state';
  import PackForm from '#lib/components/admin/PackForm.svelte';

  let { data, form } = $props();
  let guardado = $derived(page.url.searchParams.has('guardado'));
</script>

<svelte:head>
  <title>Editar {data.pack.name} · Admin</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-4 pt-10 pb-16">
  <a href="/admin" class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase">← Productos</a>
  <h1 class="mt-3 font-serif text-3xl text-cacao">Editar {data.pack.name}</h1>

  {#if guardado && !form?.error}
    <p class="mt-6 rounded-2xl bg-salvia/20 p-3 text-sm">Cambios guardados.</p>
  {/if}

  <PackForm
    pack={data.pack}
    componentes={data.componentes}
    candidatos={data.candidatos}
    imageUrl={data.imageUrl}
    extras={data.extras}
    error={form?.error ?? null}
  />
</section>
