-- Forma del producto (gatito, perrito, rectangular, circular, masajeador).
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
alter table products add column if not exists shape text;

-- Completa la forma de los productos existentes a partir del nombre.
update products
set shape = case
  when name ilike '%circular%' then 'circular'
  when name ilike '%rectangular%' then 'rectangular'
  when name ilike '%masaje%' then 'masajeador'
  when name ilike '%perrit%' then 'perrito'
  when name ilike '%gatit%' then 'gatito'
end
where shape is null and is_pack = false;
