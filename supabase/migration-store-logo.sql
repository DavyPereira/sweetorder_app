-- Move a logo da loja de arquivo estático em /public/logos/{slug}.png para
-- upload via Cloudflare R2 (mesmo bucket já usado pelas imagens de produto),
-- configurável pelo admin da loja em vez de depender de deploy manual.
alter table stores add column if not exists logo_url text;
