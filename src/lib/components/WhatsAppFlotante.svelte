<script>
  import { WHATSAPP_NUMERO, whatsappUrl } from '#lib/whatsapp.js';
</script>

{#if WHATSAPP_NUMERO}
  <a
    href={whatsappUrl('¡Hola Aeterna! Tengo una consulta.')}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Escribinos por WhatsApp"
    class="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105"
  >
    <svg viewBox="0 0 32 32" class="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path
        d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.3.6 4.4 1.7 6.3L3 29l7.4-1.9a12.8 12.8 0 0 0 5.6 1.3c7 0 12.7-5.600 12.700-12.500S23 3 16 3Zm0 23c-1.800 0-3.500-.5-5-1.400l-.4-.2-4.400 1.100 1.200-4.200-.3-.4a10 10 0 0 1-1.500-5.300C5.600 9.900 10.300 5.400 16 5.400s10.400 4.500 10.400 10.100S21.700 26 16 26Zm5.700-7.500c-.3-.2-1.800-.9-2.100-1-.3-.1-.5-.2-.7.200-.2.300-.8 1-1 1.200-.2.200-.4.200-.7.100-.3-.2-1.300-.5-2.500-1.500-.9-.8-1.500-1.800-1.700-2.100-.2-.3 0-.5.100-.6l.5-.5c.1-.2.200-.3.300-.5.100-.2 0-.4 0-.5l-1-2.300c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1 1-1 2.400s1 2.800 1.200 3c.1.200 2 3.100 4.900 4.300 2.900 1.200 2.900.8 3.400.7.500-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  </a>
{/if}
