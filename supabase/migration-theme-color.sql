-- Separa a cor usada no card do diretório inicial (brand_color) da cor usada
-- no tema interno do site da loja (catálogo, checkout, painel admin), que
-- antes eram a mesma coluna. Por padrão o tema herda o mesmo valor de
-- brand_color, então nenhuma loja existente muda de aparência até que o
-- dono edite o campo novo em /admin/loja.
alter table stores add column if not exists theme_color text not null default '#4f7a5c';

update stores set theme_color = brand_color;
