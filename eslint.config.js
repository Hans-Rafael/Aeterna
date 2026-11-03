import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
  {
    ignores: ['.svelte-kit/', 'build/', '.output/', 'node_modules/'],
  },
  js.configs.recommended,
  ...svelte.configs['flat/recommended'],
  {
    // Sitio pequeño con rutas fijas: no usamos resolve() de $app/paths en cada href.
    rules: {
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
