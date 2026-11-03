-- Esquema de Aeterna para Supabase.
-- Ejecutar completo en el SQL Editor (una sola vez, en un proyecto nuevo).

-- ---------------------------------------------------------------------------
-- Productos (lectura pública solo de los activos)
-- ---------------------------------------------------------------------------
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  category    text not null check (category in ('jabon', 'vela')),
  fragrance   text not null,
  description text not null default '',
  price       integer not null check (price >= 0),        -- en pesos, sin decimales
  image_path  text not null,                              -- nombre del archivo en el bucket "productos"
  featured    boolean not null default false,
  stock       integer not null default 0 check (stock >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Pedidos (solo el servidor escribe y lee; el público no tiene acceso)
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  status            text not null default 'pendiente'
                    check (status in ('pendiente', 'pagado', 'rechazado', 'entregado')),
  total             integer not null check (total >= 0),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text not null,
  delivery_type     text not null check (delivery_type in ('retiro', 'envio')),
  address           text,
  mp_preference_id  text,
  mp_payment_id     text unique,
  created_at        timestamptz not null default now()
);

create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid not null references products(id),
  quantity    integer not null check (quantity > 0),
  unit_price  integer not null check (unit_price >= 0)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Cualquiera (anon) puede leer productos activos.
create policy "productos activos visibles"
  on products for select
  to anon, authenticated
  using (active = true);

-- orders y order_items no tienen policies: el público no puede leerlas ni escribirlas.
-- Solo la clave service_role (en el servidor) puede hacerlo, y esa clave nunca va al navegador.

-- ---------------------------------------------------------------------------
-- Datos de muestra (mismos slugs que src/lib/products.js)
-- Los precios son de ejemplo: cambialos después desde el panel.
-- ---------------------------------------------------------------------------
insert into products (slug, name, category, fragrance, description, price, image_path, featured) values
  ('jabon-rosa-circular',      'Rosa Circular',        'jabon', 'Rosa',     'Jabón artesanal de rosa en forma circular. Hecho a mano en pequeños lotes.', 2500, 'jabon-rosa-circular.jpeg', true),
  ('jabon-rosa-rectangular',   'Rosa Rectangular',     'jabon', 'Rosa',     'Jabón artesanal de rosa en barra rectangular. Hecho a mano con amor.', 2500, 'jabon-rosa-rectangular.jpeg', false),
  ('jabon-lavanda-circular',   'Lavanda Circular',     'jabon', 'Lavanda',  'Jabón artesanal de lavanda en forma circular. Aroma suave y relajante.', 2500, 'jabon-lavanda-circular.jpeg', true),
  ('jabon-lavanda-masaje',     'Lavanda Masaje',       'jabon', 'Lavanda',  'Jabón de lavanda con textura de masaje. Ideal para la ducha de cada día.', 2800, 'jabon-lavanda-masaje.jpeg', false),
  ('jabon-vainilla-circular',  'Vainilla Circular',    'jabon', 'Vainilla', 'Jabón artesanal de vainilla en forma circular. Cálido y dulce.', 2500, 'jabon-vainilla-circular.jpeg', false),
  ('jabon-vainilla-rectangular','Vainilla Rectangular','jabon', 'Vainilla', 'Jabón artesanal de vainilla en barra rectangular. Cálido y dulce.', 2500, 'jabon-vainilla-rectangular.jpeg', false),
  ('jabon-vainilla',           'Vainilla Clásico',     'jabon', 'Vainilla', 'Nuestro jabón de vainilla clásico. Hecho a mano en pequeños lotes.', 2500, 'jabon-vainilla.jpeg', false),
  ('jabon-coco-rectangular',   'Coco Rectangular',     'jabon', 'Coco',     'Jabón artesanal de coco en barra rectangular. Suave e hidratante.', 2500, 'jabon-coco-rectangular.jpeg', false),
  ('vela-lavanda',             'Vela Lavanda',         'vela',  'Lavanda',  'Vela artesanal de cera premium con fragancia de lavanda. Hecha a mano.', 4500, 'vela-lavanda.jpeg', true),
  ('vela-rosa-perrito',        'Vela Rosa Perrito',    'vela',  'Rosa',     'Vela artesanal con forma de perrito y fragancia de rosa. Cera premium.', 4800, 'vela-rosa-perrito.jpeg', false),
  ('vela-vainilla-perrito',    'Vela Vainilla Perrito','vela',  'Vainilla', 'Vela artesanal con forma de perrito y fragancia de vainilla. Cera premium.', 4800, 'vela-vainilla-perrito.jpeg', true),
  ('vela-rosa-gatito',         'Vela Rosa Gatito',     'vela',  'Rosa',     'Vela artesanal con forma de gatito y fragancia de rosa. Cera premium.', 4800, 'vela-rosa-gatito.jpeg', false)
on conflict (slug) do nothing;
