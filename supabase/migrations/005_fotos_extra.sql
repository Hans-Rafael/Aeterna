-- Fotos de contexto por producto (además de la foto principal `image_path`).
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
alter table products add column if not exists extra_images text[] not null default '{}';
