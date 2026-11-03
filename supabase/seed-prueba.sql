-- Productos de PRUEBA para ver el paginador (16 en total = 2 páginas).
-- Ejecutar en el SQL Editor de Supabase. Para borrarlos después:
--   delete from products where slug like 'prueba-%';

insert into products (slug, name, category, fragrance, description, price, image_path, featured, active) values
  ('prueba-1', 'Producto de prueba 1', 'jabon', 'Prueba', 'Producto de prueba.', 1000, 'jabon-rosa-circular.jpeg', false, true),
  ('prueba-2', 'Producto de prueba 2', 'jabon', 'Prueba', 'Producto de prueba.', 1000, 'jabon-lavanda-circular.jpeg', false, true),
  ('prueba-3', 'Producto de prueba 3', 'vela',  'Prueba', 'Producto de prueba.', 1000, 'vela-lavanda.jpeg', false, true),
  ('prueba-4', 'Producto de prueba 4', 'vela',  'Prueba', 'Producto de prueba.', 1000, 'vela-rosa-gatito.jpeg', false, true)
on conflict (slug) do nothing;
