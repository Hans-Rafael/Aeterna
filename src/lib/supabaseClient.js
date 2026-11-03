import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

/** Bucket de Storage donde están las fotos de los productos. */
export const PRODUCT_IMAGES_BUCKET = 'productos';

const url = env.PUBLIC_SUPABASE_URL;
const key = env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** `null` si faltan las variables de entorno: el sitio usa los productos de muestra. */
export const supabase = url && key ? createClient(url, key) : null;
