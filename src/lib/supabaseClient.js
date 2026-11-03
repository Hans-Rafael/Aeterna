import { createClient } from '@supabase/supabase-js';

/** Bucket de Storage donde están las fotos de los productos. */
export const PRODUCT_IMAGES_BUCKET = 'productos';

// Solo se usa en el servidor (catálogo). Las variables vienen de .env (ver vite.config.js).
const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** `null` si faltan las variables de entorno: el sitio usa los productos de muestra. */
export const supabase = url && key ? createClient(url, key) : null;
