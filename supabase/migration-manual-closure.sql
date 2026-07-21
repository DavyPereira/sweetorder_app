-- Permite ao admin fechar a loja manualmente só por hoje (ex: imprevisto,
-- sem estoque, viagem). Guardamos a data (no fuso da loja) em que o fechamento
-- foi ativado — assim, quando o dia vira, a loja volta a abrir sozinha no
-- horário normal, sem precisar de um job/cron para "reabrir".
alter table stores add column if not exists manually_closed_date date;
