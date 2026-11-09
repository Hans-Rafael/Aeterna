-- El email solo es obligatorio con Mercado Pago; con alias es opcional.
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
alter table orders alter column customer_email drop not null;
