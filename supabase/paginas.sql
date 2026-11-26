-- =====================================================================
-- RADIO VIENE · Páginas institucionales
-- (Quiénes somos, Nuestras creencias, Contacto)
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pega TODO este
-- archivo → Run. Requiere haber ejecutado antes esquema.sql.
-- Se puede ejecutar varias veces sin duplicar nada.
--
-- Mientras el texto de una página esté vacío, la web muestra el
-- borrador incluido en el código (src/content/paginas.ts).
-- =====================================================================

create table if not exists public.paginas (
  slug           text primary key
                   check (slug in ('quienes-somos', 'nuestras-creencias', 'contacto')),
  titulo         text not null check (char_length(titulo) between 1 and 80),
  descripcion    text not null default '' check (char_length(descripcion) <= 200),
  contenido      text not null default '' check (char_length(contenido) <= 50000),
  actualizado_en timestamptz not null default now()
);

drop trigger if exists paginas_actualizado on public.paginas;
create trigger paginas_actualizado
  before update on public.paginas
  for each row execute function public.marcar_actualizado();

alter table public.paginas enable row level security;

drop policy if exists "Páginas visibles para todos" on public.paginas;
create policy "Páginas visibles para todos"
  on public.paginas for select
  to anon, authenticated
  using (true);

drop policy if exists "Administradores editan páginas" on public.paginas;
create policy "Administradores editan páginas"
  on public.paginas for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

-- Las tres páginas existen siempre: nadie puede crear otras ni borrarlas.
grant select on public.paginas to anon, authenticated;
grant update on public.paginas to authenticated;

insert into public.paginas (slug, titulo) values
  ('quienes-somos', 'Quiénes somos'),
  ('nuestras-creencias', 'Nuestras creencias'),
  ('contacto', 'Contacto')
on conflict (slug) do nothing;
