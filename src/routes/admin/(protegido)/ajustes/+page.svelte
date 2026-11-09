<script>
  import { page } from '$app/state';

  let { data, form } = $props();
  let guardado = $derived(page.url.searchParams.has('guardado'));
</script>

<svelte:head>
  <title>Ajustes · Admin</title>
</svelte:head>

<section class="mx-auto max-w-xl px-4 pt-10 pb-16">
  <a href="/admin" class="text-xs tracking-[0.25em] text-rosa-oscuro uppercase">← Productos</a>
  <h1 class="mt-3 font-serif text-3xl text-cacao">Ajustes de pago</h1>
  <p class="mt-2 text-sm text-cacao/70">
    Estos datos se muestran al cliente cuando elige pagar por transferencia.
  </p>

  {#if guardado && !form?.error}
    <p class="mt-6 rounded-2xl bg-salvia/20 p-3 text-sm">Cambios guardados.</p>
  {/if}
  {#if form?.error}
    <p class="mt-6 rounded-2xl bg-rosa/30 p-3 text-sm">{form.error}</p>
  {/if}

  <form method="POST" class="mt-8 space-y-4">
    <label class="block text-sm">
      <span class="text-cacao/70">Alias</span>
      <input name="alias" required maxlength="60" value={data.pago.alias} class="field" />
    </label>
    <label class="block text-sm">
      <span class="text-cacao/70">Titular de la cuenta</span>
      <input name="titular" required maxlength="80" value={data.pago.titular} class="field" />
    </label>
    <button
      type="submit"
      class="w-full rounded-full bg-cacao py-3 text-sm text-crema transition hover:bg-rosa-oscuro"
    >
      Guardar
    </button>
  </form>
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
