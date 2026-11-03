-- Packs armados desde el admin. Ejecutar en el SQL Editor de Supabase (una sola vez).

-- 1) Un pack es un producto más, con categoría 'pack'
alter table products drop constraint if exists products_category_check;
alter table products add constraint products_category_check
  check (category in ('jabon', 'vela', 'pack'));
alter table products add column if not exists is_pack boolean not null default false;
alter table products add column if not exists envio_incluido boolean not null default false;

-- 2) Componentes de cada pack
create table if not exists pack_items (
  pack_id uuid not null references products(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  primary key (pack_id, product_id),
  check (pack_id <> product_id)
);
alter table pack_items enable row level security;
create policy "componentes de packs visibles"
  on pack_items for select
  to anon, authenticated
  using (true);

-- 3) Devolver stock: si la línea es un pack, devuelve el stock de sus componentes.
create or replace function liberar_pedido(p_order_id uuid, p_nuevo_estado text)
returns boolean
language plpgsql
as $$
declare
  v_status text;
begin
  select status into v_status from orders where id = p_order_id for update;
  if v_status is distinct from 'pendiente' then
    return false;
  end if;

  with lineas as (
    select oi.product_id, oi.quantity
      from order_items oi
     where oi.order_id = p_order_id
  ),
  expandidas as (
    select pi.product_id, pi.quantity * l.quantity as qty
      from lineas l
      join pack_items pi on pi.pack_id = l.product_id
    union all
    select l.product_id, l.quantity
      from lineas l
     where not exists (select 1 from pack_items pi where pi.pack_id = l.product_id)
  ),
  totales as (
    select product_id, sum(qty) as qty from expandidas group by product_id
  )
  update products p
     set stock = p.stock + t.qty
    from totales t
   where p.id = t.product_id;

  update orders set status = p_nuevo_estado where id = p_order_id;
  return true;
end;
$$;
