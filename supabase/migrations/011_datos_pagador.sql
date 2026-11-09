-- Datos de quien transfiere (pago por alias), para cruzar la transferencia con el pedido.
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
alter table orders add column if not exists payer_name text;
alter table orders add column if not exists payer_cuit text;
