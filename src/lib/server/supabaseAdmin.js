import { createClient } from '@supabase/supabase-js';

/** @type {any} */
let client;

/**
 * Cliente con la clave service_role: salta RLS. SOLO se usa en el servidor,
 * para el panel de admin. Nunca importar este archivo desde componentes del navegador.
 * @returns {any}
 */
export function adminClient() {
  if (!client) {
    const url = process.env.PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Falta PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el .env');
    }
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}
