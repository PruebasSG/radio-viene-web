-- =====================================================================
-- RADIO VIENE · Base de datos del panel administrativo
--
-- Cómo usarlo: Supabase → SQL Editor → New query → pega TODO este
-- archivo → Run. Se puede ejecutar varias veces sin duplicar nada.
--
-- Seguridad: cada tabla tiene RLS (seguridad a nivel de fila).
--   · Cualquiera puede LEER la programación visible y los datos públicos.
--   · Solo quien figure en la tabla "administradores" puede MODIFICAR.
-- =====================================================================


-- 1. ADMINISTRADORES ---------------------------------------------------
-- Quién puede usar el panel. Nadie puede leer ni tocar esta tabla desde
-- la web: solo se gestiona aquí, desde el SQL Editor de Supabase.

create table if not exists public.administradores (
  user_id   uuid primary key references auth.users (id) on delete cascade,
  email     text not null,
  creado_en timestamptz not null default now()
);

alter table public.administradores enable row level security;
revoke all on public.administradores from anon, authenticated;

-- ¿La persona que hace la petición es administradora?
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.administradores
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.es_admin() from public;
grant execute on function public.es_admin() to anon, authenticated;

-- Actualiza la fecha de modificación automáticamente.
create or replace function public.marcar_actualizado()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;


-- 2. PROGRAMACIÓN ------------------------------------------------------

create table if not exists public.programas (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null check (char_length(nombre) between 1 and 80),
  descripcion    text not null default '' check (char_length(descripcion) <= 300),
  conductor      text check (conductor is null or char_length(conductor) <= 80),
  dias           text[] not null check (
                   cardinality(dias) between 1 and 7
                   and dias <@ array['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
                 ),
  inicio         time not null,
  fin            time not null, -- 24:00 significa "hasta medianoche"
  activo         boolean not null default true,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint programas_horario_valido check (fin > inicio)
);

drop trigger if exists programas_actualizado on public.programas;
create trigger programas_actualizado
  before update on public.programas
  for each row execute function public.marcar_actualizado();

alter table public.programas enable row level security;

drop policy if exists "Programación visible para todos" on public.programas;
create policy "Programación visible para todos"
  on public.programas for select
  to anon, authenticated
  using (activo or (select public.es_admin()));

drop policy if exists "Administradores crean programas" on public.programas;
create policy "Administradores crean programas"
  on public.programas for insert
  to authenticated
  with check ((select public.es_admin()));

drop policy if exists "Administradores editan programas" on public.programas;
create policy "Administradores editan programas"
  on public.programas for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

drop policy if exists "Administradores borran programas" on public.programas;
create policy "Administradores borran programas"
  on public.programas for delete
  to authenticated
  using ((select public.es_admin()));

grant select on public.programas to anon, authenticated;
grant insert, update, delete on public.programas to authenticated;


-- 3. DATOS DE LA RADIO -------------------------------------------------
-- Una sola fila (id = 1) con los textos y contactos editables.

create table if not exists public.ajustes (
  id             smallint primary key default 1 check (id = 1),
  lema           text not null check (char_length(lema) between 1 and 120),
  descripcion    text not null check (char_length(descripcion) between 1 and 400),
  whatsapp       text not null default '' check (whatsapp ~ '^([0-9]{8,15})?$'),
  correo         text not null default '' check (char_length(correo) <= 120),
  redes          jsonb not null default '[]'::jsonb check (jsonb_typeof(redes) = 'array'),
  actualizado_en timestamptz not null default now()
);

drop trigger if exists ajustes_actualizado on public.ajustes;
create trigger ajustes_actualizado
  before update on public.ajustes
  for each row execute function public.marcar_actualizado();

alter table public.ajustes enable row level security;

drop policy if exists "Datos de la radio visibles para todos" on public.ajustes;
create policy "Datos de la radio visibles para todos"
  on public.ajustes for select
  to anon, authenticated
  using (true);

drop policy if exists "Administradores editan los datos" on public.ajustes;
create policy "Administradores editan los datos"
  on public.ajustes for update
  to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

grant select on public.ajustes to anon, authenticated;
grant update on public.ajustes to authenticated;


-- 4. DATOS INICIALES ---------------------------------------------------
-- Solo se cargan si las tablas están vacías.

insert into public.ajustes (id, lema, descripcion, whatsapp)
values (
  1,
  'Música, Biblia y esperanza para cada día.',
  'Somos una radio adventista del séptimo día. Te acompañamos con música cristiana, estudio de la Biblia y mensajes de esperanza para toda la familia.',
  '584126909569'
)
on conflict (id) do nothing;

insert into public.programas (nombre, descripcion, dias, inicio, fin)
select v.nombre, v.descripcion, v.dias, v.inicio::time, v.fin::time
from (values
  ('Música de madrugada', 'Himnos y alabanzas instrumentales para las horas de la noche.',
     array['lunes','martes','miercoles','jueves','viernes','sabado','domingo'], '00:00', '05:00'),
  ('Amanecer con Dios', 'Una lectura, una reflexión y un momento de oración para empezar el día.',
     array['lunes','martes','miercoles','jueves','viernes'], '05:00', '06:00'),
  ('Buenos días, esperanza', 'Música, saludos de los oyentes y lo que necesitas saber para arrancar la mañana.',
     array['lunes','martes','miercoles','jueves','viernes'], '06:00', '09:00'),
  ('Melodías de fe', 'Música cristiana en español para acompañar tu jornada.',
     array['lunes','martes','miercoles','jueves','viernes'], '09:00', '12:00'),
  ('Salud integral', 'Consejos prácticos para cuidar el cuerpo, la mente y el espíritu.',
     array['lunes','martes','miercoles','jueves','viernes'], '12:00', '13:00'),
  ('Tarde en familia', 'Reflexiones y música para fortalecer los lazos del hogar.',
     array['lunes','martes','miercoles','jueves','viernes'], '13:00', '16:00'),
  ('Abre tu Biblia', 'Estudio bíblico sencillo, versículo a versículo.',
     array['lunes','martes','miercoles','jueves','viernes'], '16:00', '18:00'),
  ('Cultivando la esperanza', 'Testimonios, entrevistas y música al caer la tarde.',
     array['lunes','martes','miercoles','jueves'], '18:00', '20:00'),
  ('Recibiendo el sábado', 'Música sacra y meditación para dar la bienvenida al sábado.',
     array['viernes'], '18:00', '20:00'),
  ('Escuela Sabática', 'Repaso de la lección de la semana.',
     array['sabado'], '08:00', '10:00'),
  ('Culto divino', 'Transmisión del servicio de adoración.',
     array['sabado'], '10:00', '12:00'),
  ('Sábado en armonía', 'Música sacra para disfrutar el día de reposo.',
     array['sabado'], '12:00', '18:00'),
  ('Domingo en familia', 'Una mañana tranquila con música, historias y reflexiones para todos.',
     array['domingo'], '08:00', '12:00'),
  ('Noche de alabanza', 'Cantos de adoración para cerrar el día.',
     array['lunes','martes','miercoles','jueves','viernes','sabado','domingo'], '20:00', '24:00')
) as v(nombre, descripcion, dias, inicio, fin)
where not exists (select 1 from public.programas);


-- 5. DAR ACCESO A UN ADMINISTRADOR -------------------------------------
-- Primero crea el usuario en Authentication → Users → Add user.
-- Después cambia el correo de abajo, selecciona SOLO estas líneas y pulsa Run:
--
-- insert into public.administradores (user_id, email)
-- select id, email from auth.users where email = 'correo@ejemplo.com'
-- on conflict (user_id) do nothing;
--
-- Para quitarle el acceso a alguien:
--
-- delete from public.administradores where email = 'correo@ejemplo.com';
