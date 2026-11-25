-- =====================================================================
-- RADIO VIENE · Muro de oración
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pega TODO este
-- archivo → Run. Requiere haber ejecutado antes esquema.sql.
-- Se puede ejecutar varias veces sin duplicar nada.
--
-- Seguridad:
--   · El público NO puede escribir en las tablas directamente. Solo puede
--     usar dos funciones controladas: crear_peticion y orar_por.
--   · Toda petición nace "pendiente": solo se ve cuando un administrador
--     la publica.
--   · El público solo puede leer el texto, el nombre (si lo dejó), el
--     contador y la fecha de las peticiones publicadas. Nada más.
--   · No se guardan direcciones IP: solo una "huella" cifrada, que no
--     permite saber quién es la persona.
-- =====================================================================


-- 1. PETICIONES ---------------------------------------------------------

create table if not exists public.peticiones (
  id             uuid primary key default gen_random_uuid(),
  -- null = anónima (si la persona elige el anonimato, el nombre no se guarda)
  nombre         text check (nombre is null or char_length(nombre) between 1 and 60),
  texto          text not null check (char_length(texto) between 10 and 600),
  estado         text not null default 'pendiente'
                   check (estado in ('pendiente', 'publicada', 'archivada')),
  oraciones      integer not null default 0 check (oraciones >= 0),
  -- huella cifrada de quien la envió: solo para frenar el spam
  huella         text not null check (huella ~ '^[0-9a-f]{64}$'),
  creado_en      timestamptz not null default now(),
  publicada_en   timestamptz,
  actualizado_en timestamptz not null default now()
);

create index if not exists peticiones_estado_idx on public.peticiones (estado, publicada_en desc);
create index if not exists peticiones_huella_idx on public.peticiones (huella, creado_en desc);

drop trigger if exists peticiones_actualizado on public.peticiones;
create trigger peticiones_actualizado
  before update on public.peticiones
  for each row execute function public.marcar_actualizado();

alter table public.peticiones enable row level security;

drop policy if exists "Peticiones publicadas visibles para todos" on public.peticiones;
create policy "Peticiones publicadas visibles para todos"
  on public.peticiones for select
  to anon, authenticated
  using (estado = 'publicada' or (select public.es_admin()));

drop policy if exists "Administradores moderan peticiones" on public.peticiones;
create policy "Administradores moderan peticiones"
  on public.peticiones for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

drop policy if exists "Administradores borran peticiones" on public.peticiones;
create policy "Administradores borran peticiones"
  on public.peticiones for delete
  to authenticated
  using ((select public.es_admin()));

-- El público solo puede leer estas columnas (nunca la huella).
revoke all on public.peticiones from anon, authenticated;
grant select (id, nombre, texto, estado, oraciones, publicada_en) on public.peticiones to anon;
grant select, update, delete on public.peticiones to authenticated;


-- 2. ORACIONES («Estoy orando por ti») -----------------------------------
-- Una fila por persona y petición: así nadie puede sumar dos veces.

create table if not exists public.peticiones_oraciones (
  peticion_id uuid not null references public.peticiones (id) on delete cascade,
  huella      text not null check (huella ~ '^[0-9a-f]{64}$'),
  creado_en   timestamptz not null default now(),
  primary key (peticion_id, huella)
);

alter table public.peticiones_oraciones enable row level security;
revoke all on public.peticiones_oraciones from anon, authenticated;


-- 3. FUNCIONES PÚBLICAS CONTROLADAS ----------------------------------------

-- Enviar una petición: valida todo y la deja pendiente de revisión.
-- Máximo 3 peticiones por hora desde una misma huella.
create or replace function public.crear_peticion(p_nombre text, p_texto text, p_huella text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nombre text := nullif(btrim(coalesce(p_nombre, '')), '');
  v_texto  text := btrim(coalesce(p_texto, ''));
begin
  if p_huella is null or p_huella !~ '^[0-9a-f]{64}$' then
    raise exception 'huella_invalida';
  end if;
  if char_length(v_texto) not between 10 and 600 then
    raise exception 'texto_invalido';
  end if;
  if v_nombre is not null and char_length(v_nombre) > 60 then
    raise exception 'nombre_invalido';
  end if;
  if (select count(*) from public.peticiones
      where huella = p_huella and creado_en > now() - interval '1 hour') >= 3 then
    raise exception 'demasiadas_peticiones';
  end if;

  insert into public.peticiones (nombre, texto, huella)
  values (v_nombre, v_texto, p_huella);
end;
$$;

-- Sumar una oración: una sola vez por persona y petición publicada.
-- Devuelve el total actualizado (o null si la petición no está publicada).
create or replace function public.orar_por(p_peticion uuid, p_huella text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_total integer;
  v_nuevas integer;
begin
  if p_huella is null or p_huella !~ '^[0-9a-f]{64}$' then
    raise exception 'huella_invalida';
  end if;
  if not exists (select 1 from public.peticiones where id = p_peticion and estado = 'publicada') then
    return null;
  end if;

  insert into public.peticiones_oraciones (peticion_id, huella)
  values (p_peticion, p_huella)
  on conflict do nothing;
  get diagnostics v_nuevas = row_count;

  if v_nuevas > 0 then
    update public.peticiones set oraciones = oraciones + 1
    where id = p_peticion
    returning oraciones into v_total;
  else
    select oraciones into v_total from public.peticiones where id = p_peticion;
  end if;
  return v_total;
end;
$$;

revoke all on function public.crear_peticion(text, text, text) from public;
revoke all on function public.orar_por(uuid, text) from public;
grant execute on function public.crear_peticion(text, text, text) to anon, authenticated;
grant execute on function public.orar_por(uuid, text) to anon, authenticated;
