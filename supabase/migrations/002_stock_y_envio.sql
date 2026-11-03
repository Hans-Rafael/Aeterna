-- Stock y envío. Ejecutar en el SQL Editor de Supabase (una sola vez).

-- 1) Datos de envío y costo en pedidos
alter table orders add column if not exists shipping_cost integer not null default 0 check (shipping_cost >= 0);
alter table orders add column if not exists postal_code text;
alter table orders add column if not exists province text;
alter table orders add column if not exists city text;
alter table orders add column if not exists street text;
alter table orders add column if not exists street_number text;
alter table orders add column if not exists floor_apartment text;
alter table orders add column if not exists notes text;

-- 2) Estado "vencido" para pedidos que nunca se pagaron
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pendiente', 'pagado', 'rechazado', 'entregado', 'vencido'));

-- 3) Descontar stock de forma atómica: si algún producto no alcanza, no se descuenta nada.
create or replace function reservar_stock(p_items jsonb)
returns void
language plpgsql
as $$
declare
  item jsonb;
  filas int;
begin
  for item in select * from jsonb_array_elements(p_items) loop
    update products
       set stock = stock - (item->>'qty')::int
     where id = (item->>'product_id')::uuid
       and stock >= (item->>'qty')::int;
    get diagnostics filas = row_count;
    if filas = 0 then
      raise exception 'sin_stock:%', item->>'product_id';
    end if;
  end loop;
end;
$$;

-- 4) Devolver el stock de un pedido y cambiar su estado.
-- Solo actúa si el pedido sigue "pendiente", así no se devuelve dos veces.
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

  update products p
     set stock = p.stock + oi.quantity
    from order_items oi
   where oi.order_id = p_order_id
     and oi.product_id = p.id;

  update orders set status = p_nuevo_estado where id = p_order_id;
  return true;
end;
$$;

-- 5) Vencer pedidos pendientes más viejos que N minutos (libera su stock).
create or replace function vencer_pedidos(p_minutos int)
returns int
language plpgsql
as $$
declare
  pedido record;
  total int := 0;
begin
  for pedido in
    select id from orders
     where status = 'pendiente'
       and created_at < now() - make_interval(mins => p_minutos)
  loop
    if liberar_pedido(pedido.id, 'vencido') then
      total := total + 1;
    end if;
  end loop;
  return total;
end;
$$;

-- Los productos de prueba o los que no tengan stock cargado no se pueden vender:
-- cargá el stock real de cada producto desde el panel de admin.
