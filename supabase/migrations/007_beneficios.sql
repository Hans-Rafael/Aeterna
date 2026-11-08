-- Beneficios e ingredientes editables por producto (antes estaban fijos en el código por aroma).
-- `benefits`: un beneficio por línea. `ingredients`: texto libre.
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
alter table products add column if not exists benefits text not null default '';
alter table products add column if not exists ingredients text not null default '';
