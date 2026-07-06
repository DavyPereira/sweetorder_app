-- Migração pontual do único produto existente no SQLite antigo.
-- Rode uma vez no SQL Editor do Supabase.

insert into products (name, description, price, category, visual_bg, visual_emoji, active, sort_order, created_at, updated_at)
values (
  'hvghufvngvbhufdg',
  'gdfgfggf',
  112123,
  'recheado',
  '#F2E0C4',
  '🌾',
  true,
  1,
  '2026-07-04T17:16:44.760Z',
  '2026-07-04T17:16:44.760Z'
);
