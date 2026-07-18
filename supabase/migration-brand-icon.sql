-- SweetOrder — adiciona ícone de marca por loja, escolhido pelo admin.
-- Rode DEPOIS de migration-multitenant.sql.

alter table stores add column if not exists brand_icon text not null default 'Cookie';
