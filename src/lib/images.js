/** Imagen que se muestra cuando un producto no tiene foto o la foto no carga. */
export const IMAGE_FALLBACK = '/img/sin-foto.svg';

/**
 * Handler para `onerror` de una <img>: cambia a la imagen de respaldo una sola vez.
 * @param {Event} event
 */
export function onImageError(event) {
  const img = /** @type {HTMLImageElement} */ (event.currentTarget);
  if (!img.src.endsWith(IMAGE_FALLBACK)) img.src = IMAGE_FALLBACK;
}
