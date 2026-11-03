-- Envío a domicilio por producto. Ejecutar en el SQL Editor de Supabase (una sola vez).
-- Los productos existentes quedan con envío habilitado; desmarcalos desde el admin si hace falta.
alter table products add column if not exists delivery boolean not null default true;
