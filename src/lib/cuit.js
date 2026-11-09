/**
 * Valida un CUIT/CUIL argentino (11 dígitos con dígito verificador) y lo devuelve como
 * "XX-XXXXXXXX-X", o null si no es válido.
 * @param {string} valor
 */
export function normalizarCuit(valor) {
  const d = valor.replace(/\D/g, '');
  if (d.length !== 11) return null;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((t, p, i) => t + p * Number(d[i]), 0);
  let verif = 11 - (suma % 11);
  if (verif === 11) verif = 0;
  if (verif === 10 || verif !== Number(d[10])) return null;
  return `${d.slice(0, 2)}-${d.slice(2, 10)}-${d[10]}`;
}
