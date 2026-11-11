import { redirect } from '@sveltejs/kit';
import { COOKIE_NAME, isValidSession } from '#lib/server/auth.js';

/**
 * Protege todo /admin (también los POST de formularios, que no pasan por el load del layout).
 * La única ruta pública es /admin/login.
 * @param {{ event: import('@sveltejs/kit').RequestEvent, resolve: (event: import('@sveltejs/kit').RequestEvent) => Promise<Response> }} input
 */
export async function handle({ event, resolve }) {
  const { pathname } = event.url;
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const valida = isValidSession(
      event.cookies.get(COOKIE_NAME),
      process.env.ADMIN_USERNAME,
      process.env.ADMIN_SESSION_SECRET
    );
    if (!valida) redirect(303, '/admin/login');
  }
  const response = await resolve(event);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (event.url.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  return response;
}
