-- PedeNaHora — histórico de pedidos por cliente
-- Rode DEPOIS de migration-customers.sql.
--
-- Itens e endereço são gravados como snapshot (jsonb) no momento do pedido, não como
-- referência a products/customer_addresses — preço e nome do produto podem mudar depois,
-- e o endereço pode ser editado/removido, mas o histórico deve continuar mostrando
-- exatamente o que foi comprado e para onde foi entregue naquele momento.
--
-- Mesmo padrão de customers/customer_addresses: RLS ligado, sem policies — acesso só
-- pelas Server Actions via service role (lib/supabase/admin.ts).

create table orders (
  id             uuid primary key default gen_random_uuid(),
  store_id       uuid not null references stores(id) on delete cascade,
  customer_id    uuid not null references customers(id) on delete cascade,
  items          jsonb not null,
  address        jsonb not null,
  subtotal       numeric(10,2) not null,
  delivery_fee   numeric(10,2) not null,
  total          numeric(10,2) not null,
  payment_method text not null,
  payment_note   text,
  created_at     timestamptz not null default now()
);

create index orders_customer_id_idx on orders (customer_id);
create index orders_store_id_idx on orders (store_id);

alter table orders enable row level security;
-- Sem policies: só o service role acessa.
