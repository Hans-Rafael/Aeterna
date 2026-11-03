// Tipos de las variables públicas de entorno (ver `.env`).
// Son declaradas a mano porque SvelteKit 3 no las genera automáticamente en este proyecto.
declare module '$env/dynamic/public' {
  export const env: Record<string, string | undefined>;
}
