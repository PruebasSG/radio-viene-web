-- =====================================================================
-- RADIO VIENE · Blog
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pega TODO este
-- archivo → Run. Requiere haber ejecutado antes esquema.sql.
-- Se puede ejecutar varias veces sin duplicar nada.
--
-- Seguridad:
--   · Cualquiera puede LEER los artículos publicados (y ya en fecha).
--   · Los borradores y los programados solo los ven los administradores.
--   · Solo los administradores pueden crear, editar, borrar o subir imágenes.
-- =====================================================================


-- 1. ARTÍCULOS ---------------------------------------------------------

create table if not exists public.articulos (
  id             uuid primary key default gen_random_uuid(),
  titulo         text not null check (char_length(titulo) between 1 and 120),
  slug           text not null unique check (
                   char_length(slug) between 1 and 100
                   and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
                 ),
  extracto       text not null default '' check (char_length(extracto) <= 300),
  contenido      text not null default '' check (char_length(contenido) <= 100000),
  categoria      text not null default 'Reflexiones' check (char_length(categoria) between 1 and 40),
  autor          text not null default '' check (char_length(autor) <= 80),
  portada_url    text check (portada_url is null or portada_url ~ '^https://'),
  portada_ancho  integer check (portada_ancho is null or portada_ancho between 1 and 4000),
  portada_alto   integer check (portada_alto is null or portada_alto between 1 and 4000),
  portada_alt    text not null default '' check (char_length(portada_alt) <= 200),
  estado         text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  publicado_en   timestamptz,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint articulos_publicado_con_fecha check (estado = 'borrador' or publicado_en is not null)
);

create index if not exists articulos_publicados_idx
  on public.articulos (estado, publicado_en desc);

drop trigger if exists articulos_actualizado on public.articulos;
create trigger articulos_actualizado
  before update on public.articulos
  for each row execute function public.marcar_actualizado();

alter table public.articulos enable row level security;

drop policy if exists "Artículos publicados visibles para todos" on public.articulos;
create policy "Artículos publicados visibles para todos"
  on public.articulos for select
  to anon, authenticated
  using (
    (estado = 'publicado' and publicado_en <= now())
    or (select public.es_admin())
  );

drop policy if exists "Administradores crean artículos" on public.articulos;
create policy "Administradores crean artículos"
  on public.articulos for insert
  to authenticated
  with check ((select public.es_admin()));

drop policy if exists "Administradores editan artículos" on public.articulos;
create policy "Administradores editan artículos"
  on public.articulos for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

drop policy if exists "Administradores borran artículos" on public.articulos;
create policy "Administradores borran artículos"
  on public.articulos for delete
  to authenticated
  using ((select public.es_admin()));

grant select on public.articulos to anon, authenticated;
grant insert, update, delete on public.articulos to authenticated;


-- 2. IMÁGENES DEL BLOG ---------------------------------------------------
-- Carpeta pública "blog": cualquiera puede VER las imágenes (por su
-- dirección), pero solo los administradores pueden subirlas o borrarlas.
-- Máximo 5 MB por imagen y solo JPG, PNG o WebP.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administradores suben imágenes del blog" on storage.objects;
create policy "Administradores suben imágenes del blog"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and (select public.es_admin()));

drop policy if exists "Administradores editan imágenes del blog" on storage.objects;
create policy "Administradores editan imágenes del blog"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and (select public.es_admin()))
  with check (bucket_id = 'blog' and (select public.es_admin()));

drop policy if exists "Administradores borran imágenes del blog" on storage.objects;
create policy "Administradores borran imágenes del blog"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and (select public.es_admin()));
