-- Pago por transferencia (alias). Ejecutar en el SQL Editor de Supabase (una sola vez).

-- 1) Ajustes editables desde el admin (alias y titular). Sin policies: solo el servidor
--    (service_role) puede leerla o escribirla.
create table if not exists settings (
  key text primary key,
  value text not null
);
alter table settings enable row level security;

insert into settings (key, value) values
  ('pago_alias', 'Jabones.eva'),
  ('pago_titular', 'Eva Esteban')
on conflict (key) do nothing;

-- 2) Método de pago de cada pedido
alter table orders add column if not exists payment_method text not null default 'mercadopago';
alter table orders drop constraint if exists orders_payment_method_check;
alter table orders add constraint orders_payment_method_check
  check (payment_method in ('mercadopago', 'alias'));

-- 3) Vencer pedidos pendientes: los de alias conservan el stock más tiempo (transferir tarda).
drop function if exists vencer_pedidos(int);
create or replace function vencer_pedidos(p_minutos int, p_minutos_alias int default 1440)
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
       and created_at < now() - make_interval(
         mins => case when payment_method = 'alias' then p_minutos_alias else p_minutos end
       )
  loop
    if liberar_pedido(pedido.id, 'vencido') then
      total := total + 1;
    end if;
  end loop;
  return total;
end;
$$;
