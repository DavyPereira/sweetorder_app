-- Permite deixar uma loja "em preparação": ela some do diretório público da
-- home (getAllStores) até o dono marcar como publicada, mas continua
-- acessível por link direto (/slug) para testes.
-- Default false para que lojas recém-criadas (autocadastro/convite) só
-- apareçam no diretório quando estiverem prontas.
alter table stores add column if not exists is_published boolean not null default false;

-- Lojas que já existiam antes desse campo (ex: lolocookies) já estão no ar
-- de verdade, então marcamos como publicadas para não sumirem do diretório.
update stores set is_published = true where slug = 'lolocookies';
