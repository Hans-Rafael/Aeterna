<script>
  let { form } = $props();
</script>

<svelte:head>
  <title>Ingresar · Admin Aeterna</title>
</svelte:head>

<section class="mx-auto flex max-w-sm flex-col px-4 pt-24 pb-24">
  <h1 class="text-center font-serif text-3xl text-cacao">Panel de admin</h1>

  <form method="POST" class="mt-10 space-y-4">
    <label class="block text-sm">
      <span class="text-cacao/70">Usuario</span>
      <input
        name="usuario"
        required
        autocomplete="username"
        value={form?.usuario ?? ''}
        class="field"
      />
    </label>
    <label class="block text-sm">
      <span class="text-cacao/70">Contraseña</span>
      <input
        name="contrasena"
        type="password"
        required
        autocomplete="current-password"
        class="field"
      />
    </label>

    {#if form?.error}
      <p class="rounded-2xl bg-rosa/30 p-3 text-sm text-cacao">{form.error}</p>
    {/if}

    <button
      type="submit"
      class="w-full rounded-full bg-cacao py-3 text-sm text-crema transition hover:bg-rosa-oscuro"
    >
      Ingresar
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
