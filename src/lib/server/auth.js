import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/** Nombre de la cookie de sesión del admin. */
export const COOKIE_NAME = 'aeterna_admin';
/** Duración de la sesión: 8 horas. */
export const DURACION_S = 8 * 60 * 60;

/**
 * Verifica la contraseña contra un hash con formato `scrypt:<salt>:<hash>`
 * (generado con `node scripts/hash-password.mjs "contraseña"`).
 * @param {string} password
 * @param {string | undefined} stored
 */
export function verifyPassword(password, stored) {
  const [alg, saltB64, hashB64] = (stored ?? '').split(':');
  if (alg !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64');
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64'), expected.length);
  return timingSafeEqual(actual, expected);
}

/**
 * Crea un token firmado: `<payload en base64url>.<firma HMAC>`.
 * @param {string} username
 * @param {string} secret
 */
export function createSessionToken(username, secret) {
  const expiresAt = Date.now() + DURACION_S * 1000;
  const payload = Buffer.from(`${username}|${expiresAt}`).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

/**
 * Comprueba que el token tenga firma válida, sea del usuario esperado y no esté vencido.
 * @param {string | undefined} token
 * @param {string | undefined} username
 * @param {string | undefined} secret
 */
export function isValidSession(token, username, secret) {
  if (!token || !username || !secret) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;

  const expectedSig = createHmac('sha256', secret).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const [user, expiresAt] = Buffer.from(payload, 'base64url').toString().split('|');
  return user === username && Number(expiresAt) > Date.now();
}

/** Genera una contraseña aleatoria (solo para pruebas locales). */
export function randomSecret() {
  return randomBytes(32).toString('hex');
}

const MAX_INTENTOS = 5;
const VENTANA_MS = 15 * 60 * 1000;
/** @type {Map<string, { fallos: number, desde: number }>} */
const intentos = new Map();

/**
 * Límite de intentos de login por IP (en memoria; en serverless es por instancia).
 * @param {string} ip
 * @returns {number} segundos restantes de bloqueo, o 0 si puede intentar
 */
export function segundosBloqueado(ip) {
  const r = intentos.get(ip);
  if (!r) return 0;
  const restante = r.desde + VENTANA_MS - Date.now();
  if (restante <= 0) {
    intentos.delete(ip);
    return 0;
  }
  return r.fallos >= MAX_INTENTOS ? Math.ceil(restante / 1000) : 0;
}

/** @param {string} ip */
export function registrarFallo(ip) {
  const r = intentos.get(ip);
  if (!r || r.desde + VENTANA_MS <= Date.now()) intentos.set(ip, { fallos: 1, desde: Date.now() });
  else r.fallos++;
}

/** @param {string} ip */
export function limpiarFallos(ip) {
  intentos.delete(ip);
}
