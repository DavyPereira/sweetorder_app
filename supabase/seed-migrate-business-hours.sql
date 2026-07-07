-- Migração pontual dos turnos de funcionamento existentes no SQLite antigo.
-- Rode uma vez no SQL Editor do Supabase.

insert into business_hour_shifts (day_of_week, open_time, close_time, sort_order)
values
  (1, '14:00', '18:00', 0),
  (6, '08:00', '18:00', 0);
