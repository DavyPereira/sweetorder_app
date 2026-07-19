-- Adiciona campo de imagem ao produto (upload feito via Cloudflare R2, URL pública salva aqui)
alter table products add column image_url text;
