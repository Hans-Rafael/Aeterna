import { fail, redirect } from '@sveltejs/kit';
import {
  COOKIE_NAME,
  DURACION_S,
  createSessionToken,
  limpiarFallos,
  registrarFallo,
  segundosBloqueado,
  verifyPassword,
} from '#lib/server/auth.js';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies, url, getClientAddress }) => {
    const ip = getClientAddress();
    const espera = segundosBloqueado(ip);
    if (espera > 0) {
      return fail(429, {
        error: `Demasiados intentos. Probá de nuevo en ${Math.ceil(espera / 60)} min.`,
        usuario: '',
      });
    }

    const form = await request.formData();
    const usuario = String(form.get('usuario') ?? '').trim();
    const contrasena = String(form.get('contrasena') ?? '');

    const adminUser = process.env.ADMIN_USERNAME;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;
    const secret = process.env.ADMIN_SESSION_SECRET;

    const okUsuario = Boolean(adminUser) && usuario === adminUser;
    const okContrasena = verifyPassword(contrasena, adminHash);

    if (!secret || !okUsuario || !okContrasena) {
      registrarFallo(ip);
      return fail(400, { error: 'Usuario o contraseña incorrectos.', usuario });
    }

    limpiarFallos(ip);
    cookies.set(COOKIE_NAME, createSessionToken(usuario, secret), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      maxAge: DURACION_S,
    });
    redirect(303, '/admin');
  },
};
