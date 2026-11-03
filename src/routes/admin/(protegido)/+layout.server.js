import { redirect } from '@sveltejs/kit';
import { COOKIE_NAME, isValidSession } from '#lib/server/auth.js';

/** Todo lo que está dentro de (protegido) exige sesión de admin válida. */
export function load({ cookies }) {
  const valida = isValidSession(
    cookies.get(COOKIE_NAME),
    process.env.ADMIN_USERNAME,
    process.env.ADMIN_SESSION_SECRET
  );
  if (!valida) redirect(303, '/admin/login');
  return {};
}
