# CLAUDE.md

Guía para Claude Code en este repositorio. Responde en español con el usuario.

## Proyecto

Sitio web de **Aeterna**, tienda de jabones y velas artesanales. Las carpetas `fotos-Jabon/`, `fotos-Velas/` y `publicidad/` contienen fotos de producto y material publicitario (no son assets servidos por la web todavía).

Las dependencias `@supabase/supabase-js` (base de datos/auth) y `mercadopago` (pagos) están instaladas pero aún no se usan en el código.

## Stack

- **SvelteKit 3** con **Svelte 5** (modo runes forzado para el código de la app en `vite.config.js`)
- **Vite 8**
- **Tailwind CSS v4** vía `@tailwindcss/vite` (no hay `tailwind.config.js` ni PostCSS; la config va en `src/app.css` con `@import 'tailwindcss';`)
- **adapter-auto** (despliegue automático según el entorno)
- **JavaScript** con JSDoc y `jsconfig.json` en modo `strict` (no TypeScript)
- **pnpm** (lockfile v9). Usa `pnpm`, no `npm` ni `yarn`.
- **ESLint 10** (flat config en `eslint.config.js`) y **Prettier** (`.prettierrc`)

## Comandos

```bash
pnpm install            # instalar dependencias (usa el lockfile)
pnpm dev                # servidor de desarrollo
pnpm build              # build de producción
pnpm preview            # previsualizar el build
pnpm check              # sync de SvelteKit + svelte-check (tipos)
pnpm exec eslint .      # lint
pnpm exec prettier --check .   # comprobar formato (usar --write para corregir)
```

Antes de dar un cambio por terminado, ejecuta `pnpm build`, `pnpm check` y `pnpm exec eslint .`. Los tres deben pasar.

## Estructura

```
src/
  app.css            # entrada de Tailwind (@import 'tailwindcss')
  app.html           # plantilla HTML base
  app.d.ts           # tipos globales de SvelteKit
  lib/               # código reutilizable; alias #lib (ver abajo)
    assets/          # imágenes/SVG importables desde código
  routes/
    +layout.svelte   # layout raíz; importa app.css
    +page.svelte     # página de inicio (todavía es la plantilla por defecto)
static/              # archivos servidos tal cual (robots.txt, etc.)
```

## Convenciones

- **Alias de importación:** `#lib` apunta a `src/lib` (definido en `package.json` → `imports`). El layout ya lo usa, p. ej. `import favicon from "#lib/assets/favicon.svg"`. `$lib` también funciona en SvelteKit; mantén uno de los dos de forma consistente.
- **Svelte 5 runes:** usa `$state`, `$derived`, `$props`, `$effect`. No uses la sintaxis antigua de Svelte 4 (`export let`, `$:`, `<slot>`).
- **Estilo:** clases de Tailwind directamente en el markup. Prettier usa comillas simples, `printWidth` 100 y `trailingComma` es5. Los archivos existentes no siguen un solo estilo (`+layout.svelte` usa espacios, `app.html` usa tabs). Ejecuta Prettier sobre los archivos que toques.
- **Secretos:** las claves de Supabase y Mercado Pago van en `.env` (ignorado por git), nunca en el código ni en el repo. Si se añade una plantilla, usa `.env.example`.

## Estado conocido (pendientes)

- `README.md` sigue con el texto de la plantilla `sv`; hay que reescribirlo con la info real del proyecto.
- `pnpm exec prettier --check .` reporta archivos sin formatear (plantillas por defecto y `vite.config.js`). Formatear con `pnpm exec prettier --write .` cuando se decida.
- `src/routes/+page.svelte` es el placeholder de SvelteKit.
