-- Borra cada día los pedidos rechazados/cancelados con más de 1 mes.
-- Sus líneas (order_items) se borran solas (on delete cascade) y el stock ya se devolvió al rechazarlos.
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
create extension if not exists pg_cron;

-- Si ya existe un job con este nombre, cron.schedule lo reemplaza.
select cron.schedule(
  'limpiar-pedidos-rechazados',
  '0 6 * * *', -- todos los días a las 06:00 UTC (03:00 en Argentina)
  $$delete from public.orders where status = 'rechazado' and created_at < now() - interval '1 month'$$
);
