/** Límites y validaciones de los datos del checkout (se usan en el navegador y en el servidor). */
export const LIMITES = {
  nombreMin: 3,
  nombreMax: 80,
  emailMax: 120,
  telefonoMax: 20,
  cuitMax: 14,
};

const NOMBRE = /^\p{L}[\p{L}\p{M}'’. -]*$/u;
const EMAIL =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const TELEFONO = /^\+?[0-9 ()-]+$/;

/**
 * Nombre y apellido: solo letras, espacios, apóstrofes, puntos y guiones; al menos dos palabras.
 * @param {string} valor
 * @returns {string | null} mensaje de error, o null si es válido
 */
export function errorNombre(valor) {
  if (valor.length < LIMITES.nombreMin || valor.length > LIMITES.nombreMax) {
    return `debe tener entre ${LIMITES.nombreMin} y ${LIMITES.nombreMax} caracteres`;
  }
  if (!NOMBRE.test(valor)) return 'solo puede tener letras y espacios';
  if (valor.split(/\s+/).length < 2) return 'tiene que incluir nombre y apellido';
  return null;
}

/**
 * @param {string} valor
 * @returns {string | null}
 */
export function errorEmail(valor) {
  if (valor.length > LIMITES.emailMax) return `no puede superar ${LIMITES.emailMax} caracteres`;
  if (!EMAIL.test(valor) || valor.split('@')[0].length > 64) return 'no es un email válido';
  return null;
}

/**
 * Teléfono: solo dígitos (con +, espacios, guiones o paréntesis), entre 8 y 15 dígitos.
 * @param {string} valor
 * @returns {string | null}
 */
export function errorTelefono(valor) {
  if (valor.length > LIMITES.telefonoMax)
    return `no puede superar ${LIMITES.telefonoMax} caracteres`;
  const digitos = valor.replace(/\D/g, '').length;
  if (!TELEFONO.test(valor) || digitos < 8 || digitos > 15) {
    return 'tiene que ser un número de 8 a 15 dígitos';
  }
  return null;
}
