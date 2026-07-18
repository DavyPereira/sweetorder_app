-- SweetOrder — adiciona cor de marca por loja, escolhida pelo admin.
-- Rode DEPOIS de migration-multitenant.sql.

alter table stores add column if not exists brand_color text not null default '#4f7a5c';
