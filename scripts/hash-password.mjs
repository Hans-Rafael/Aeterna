// Genera el hash de la contraseña de admin para ADMIN_PASSWORD_HASH.
// Uso: node scripts/hash-password.mjs "tu-contraseña"
import { randomBytes, scryptSync } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/hash-password.mjs "tu-contraseña"');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
console.log(`scrypt:${salt.toString('base64')}:${hash.toString('base64')}`);
