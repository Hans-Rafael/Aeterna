import { redirect } from '@sveltejs/kit';
import { COOKIE_NAME } from '#lib/server/auth.js';
import { listAllProducts } from '#lib/server/admin-products.js';

export async function load() {
  return { products: await listAllProducts() };
}

/** @type {import('./$types').Actions} */
export const actions = {
  salir: async ({ cookies }) => {
    cookies.delete(COOKIE_NAME, { path: '/' });
    redirect(303, '/admin/login');
  },
};
