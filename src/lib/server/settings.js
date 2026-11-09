import { adminClient } from '#lib/server/supabaseAdmin.js';

const DEFECTO = { alias: 'Jabones.eva', titular: 'Eva Esteban' };

/** Alias y titular para transferencias (editables desde /admin/ajustes). */
export async function getPagoAlias() {
  const { data, error } = await adminClient()
    .from('settings')
    .select('key, value')
    .in('key', ['pago_alias', 'pago_titular']);
  if (error) {
    console.error('[settings] No se pudo leer el alias:', error.message);
    return { ...DEFECTO };
  }
  const mapa = Object.fromEntries((data ?? []).map((/** @type {any} */ r) => [r.key, r.value]));
  return {
    alias: mapa.pago_alias || DEFECTO.alias,
    titular: mapa.pago_titular || DEFECTO.titular,
  };
}

/** @param {{ alias: string, titular: string }} valores */
export async function setPagoAlias({ alias, titular }) {
  const { error } = await adminClient()
    .from('settings')
    .upsert([
      { key: 'pago_alias', value: alias },
      { key: 'pago_titular', value: titular },
    ]);
  if (error) throw error;
}
