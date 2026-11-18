-- =====================================================================
-- RADIO VIENE · Fotos y portada
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pega TODO este
-- archivo → Run. Requiere haber ejecutado antes esquema.sql.
-- Se puede ejecutar varias veces sin duplicar nada.
--
-- Seguridad:
--   · Cualquiera puede VER las fotos marcadas como visibles.
--   · Solo los administradores pueden subir, ordenar, ocultar o borrar.
-- =====================================================================


-- 1. TEXTOS DE LA PORTADA (en la tabla de datos de la radio) ------------

alter table public.ajustes
  add column if not exists titular text not null default 'Esperanza que'
    check (char_length(titular) between 1 and 40),
  add column if not exists titular_destacado text not null default 'se escucha.'
    check (char_length(titular_destacado) between 1 and 40),
  add column if not exists frases text[] not null default array[
    'Música que edifica',
    'La Biblia para cada día',
    'Oramos contigo',
    'Esperanza para tu familia',
    'Jesús viene'
  ]
    check (cardinality(frases) <= 8);


-- 2. FOTOS ---------------------------------------------------------------
-- Cada foto se guarda en dos tamaños: "url" (hasta 1600 px) y "url_mini"
-- (hasta 640 px, para el mosaico y las miniaturas: carga mucho más rápido).

create table if not exists public.fotos (
  id             uuid primary key default gen_random_uuid(),
  url            text not null check (url ~ '^https://'),
  url_mini       text not null check (url_mini ~ '^https://'),
  ancho          integer not null check (ancho between 1 and 4000),
  alto           integer not null check (alto between 1 and 4000),
  alt            text not null default '' check (char_length(alt) <= 200),
  seccion        text not null default 'portada' check (seccion in ('portada', 'cabina', 'comunidad')),
  orden          integer not null default 0,
  activo         boolean not null default true,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create index if not exists fotos_seccion_orden_idx on public.fotos (seccion, orden);

drop trigger if exists fotos_actualizado on public.fotos;
create trigger fotos_actualizado
  before update on public.fotos
  for each row execute function public.marcar_actualizado();

alter table public.fotos enable row level security;

drop policy if exists "Fotos visibles para todos" on public.fotos;
create policy "Fotos visibles para todos"
  on public.fotos for select
  to anon, authenticated
  using (activo or (select public.es_admin()));

drop policy if exists "Administradores suben fotos" on public.fotos;
create policy "Administradores suben fotos"
  on public.fotos for insert
  to authenticated
  with check ((select public.es_admin()));

drop policy if exists "Administradores editan fotos" on public.fotos;
create policy "Administradores editan fotos"
  on public.fotos for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

drop policy if exists "Administradores borran fotos" on public.fotos;
create policy "Administradores borran fotos"
  on public.fotos for delete
  to authenticated
  using ((select public.es_admin()));

grant select on public.fotos to anon, authenticated;
grant insert, update, delete on public.fotos to authenticated;


-- 3. CARPETA DE FOTOS ------------------------------------------------------
-- Pública para ver; solo administradores suben o borran. Máximo 5 MB.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administradores suben a fotos" on storage.objects;
create policy "Administradores suben a fotos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos' and (select public.es_admin()));

drop policy if exists "Administradores editan en fotos" on storage.objects;
create policy "Administradores editan en fotos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'fotos' and (select public.es_admin()))
  with check (bucket_id = 'fotos' and (select public.es_admin()));

drop policy if exists "Administradores borran de fotos" on storage.objects;
create policy "Administradores borran de fotos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos' and (select public.es_admin()));
