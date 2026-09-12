-- =====================================================================
-- Cuervo Peluquería — esquema inicial
-- Correr UNA SOLA VEZ en el SQL Editor de Supabase (proyecto nuevo).
-- =====================================================================

create extension if not exists pgcrypto;

-- ── Tipos ────────────────────────────────────────────────────────────
do $$ begin
  create type rol_usuario as enum ('admin', 'empleado', 'cliente');
exception when duplicate_object then null; end $$;

do $$ begin
  create type estado_turno as enum ('confirmado', 'cancelado', 'completado');
exception when duplicate_object then null; end $$;

-- ── perfiles ─────────────────────────────────────────────────────────
-- Un perfil por usuario de Supabase Auth. El rol define los permisos.
create table if not exists perfiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nombre     text not null,
  email      text,
  telefono   text,
  rol        rol_usuario not null default 'cliente',
  activo     boolean not null default true,
  atiende    boolean not null default true,  -- aparece como opción para elegir en la reserva
  created_at timestamptz not null default now()
);
alter table perfiles add column if not exists email text;
alter table perfiles add column if not exists atiende boolean not null default true;

-- Crea el perfil automáticamente al registrarse un usuario (rol 'cliente').
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfiles (id, nombre, email, telefono, rol)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'telefono',
    'cliente'
  );
  return new;
end;
$$;

-- Backfill del email para perfiles que ya existían.
update public.perfiles p set email = u.email
  from auth.users u where u.id = p.id and p.email is null;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Un usuario no puede cambiarse a sí mismo el rol ni el estado. Solo lo
-- puede hacer un admin, o el SQL Editor (auth.uid() null = contexto de
-- confianza, para poder crear el primer admin).
create or replace function public.proteger_rol()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (new.rol is distinct from old.rol or new.activo is distinct from old.activo)
     and auth.uid() is not null
     and not public.es_admin() then
    raise exception 'solo un admin puede cambiar el rol o el estado de un perfil';
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_rol_trigger on perfiles;
create trigger proteger_rol_trigger
  before update on perfiles
  for each row execute function public.proteger_rol();

-- ── clientes ─────────────────────────────────────────────────────────
-- Ficha de fidelidad, identificada por teléfono. perfil_id se completa
-- solo si ese cliente además se creó una cuenta.
create table if not exists clientes (
  telefono     text primary key,
  nombre       text not null,
  cortes_count integer not null default 0,
  perfil_id    uuid references perfiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── turnos ───────────────────────────────────────────────────────────
create table if not exists turnos (
  id               uuid primary key default gen_random_uuid(),
  fecha            date not null,
  hora             time not null,
  servicio         text not null,
  precio           integer not null,          -- en pesos, para poder sumar (contabilidad)
  cliente_nombre   text not null,
  cliente_telefono text not null,
  perfil_id        uuid references perfiles(id) on delete set null,  -- si reservó logueado
  estado           estado_turno not null default 'confirmado',
  barbero_id       uuid references perfiles(id) on delete set null,  -- a quién eligió el cliente
  atendido_por     uuid references perfiles(id) on delete set null,  -- quién lo completó realmente
  completado_at    timestamptz,
  created_at       timestamptz not null default now()
);
alter table turnos add column if not exists barbero_id uuid references perfiles(id) on delete set null;

-- Un mismo slot (fecha+hora) ya no es único a nivel local: dos barberos
-- distintos pueden atender en simultáneo. Lo que no puede pisarse es el
-- mismo barbero dos veces a la misma hora (barbero_id null = turnos
-- viejos sin barbero asignado; Postgres no los choca entre sí).
drop index if exists turnos_slot_activo;
create unique index if not exists turnos_slot_barbero_activo on turnos (fecha, hora, barbero_id)
  where estado <> 'cancelado';
create index if not exists turnos_fecha_idx  on turnos (fecha);
create index if not exists turnos_estado_idx on turnos (estado);

-- Al marcar un turno como 'completado' se suma el sello de fidelidad;
-- si se revierte, se descuenta.
create or replace function public.on_turno_estado()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.estado = 'completado' and old.estado is distinct from 'completado' then
    update clientes set cortes_count = cortes_count + 1, updated_at = now()
      where telefono = new.cliente_telefono;
    new.completado_at = now();
  elsif old.estado = 'completado' and new.estado is distinct from 'completado' then
    update clientes set cortes_count = greatest(0, cortes_count - 1), updated_at = now()
      where telefono = new.cliente_telefono;
    new.completado_at = null;
  end if;
  return new;
end;
$$;

drop trigger if exists turno_estado_trigger on turnos;
create trigger turno_estado_trigger
  before update on turnos
  for each row execute function public.on_turno_estado();

-- Al reservar, asegura que exista la ficha del cliente (para la fidelidad).
create or replace function public.on_turno_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.clientes (telefono, nombre)
  values (new.cliente_telefono, new.cliente_nombre)
  on conflict (telefono) do update set nombre = excluded.nombre, updated_at = now();
  return new;
end;
$$;

drop trigger if exists turno_insert_trigger on turnos;
create trigger turno_insert_trigger
  after insert on turnos
  for each row execute function public.on_turno_insert();

-- ── Helpers de rol ───────────────────────────────────────────────────
create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfiles where id = auth.uid() and rol = 'admin' and activo);
$$;

create or replace function public.es_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfiles where id = auth.uid() and rol in ('admin','empleado') and activo);
$$;

-- ── Permisos de tabla ──────────────────────────────────────────────────
-- RLS filtra FILAS, pero antes de eso Postgres exige permiso a nivel de
-- TABLA para el rol que hace el pedido (anon/authenticated). Sin este
-- grant, anon no puede ni intentar el insert aunque la política lo
-- permita — la reserva sin cuenta queda rota.
grant usage on schema public to anon, authenticated;
grant insert on public.turnos to anon;                          -- reservar sin cuenta
grant select, insert, update on public.turnos to authenticated;  -- staff (todo) y cliente (lo suyo) via RLS
grant select, insert, update on public.clientes to authenticated;
grant select, update on public.perfiles to authenticated;

-- ── RLS ──────────────────────────────────────────────────────────────
alter table perfiles enable row level security;
alter table clientes enable row level security;
alter table turnos   enable row level security;

-- perfiles: cada uno ve/edita el suyo; el admin gestiona todos
drop policy if exists "perfiles ver" on perfiles;
create policy "perfiles ver" on perfiles
  for select using (id = auth.uid() or public.es_admin());

drop policy if exists "perfiles editar propio" on perfiles;
create policy "perfiles editar propio" on perfiles
  for update using (id = auth.uid());

drop policy if exists "perfiles admin gestiona" on perfiles;
create policy "perfiles admin gestiona" on perfiles
  for all using (public.es_admin()) with check (public.es_admin());

-- turnos: reservar es público; el staff ve y actualiza todo; el cliente ve los suyos
drop policy if exists "turnos reservar" on turnos;
create policy "turnos reservar" on turnos for insert to anon, authenticated with check (true);

drop policy if exists "turnos staff ve" on turnos;
create policy "turnos staff ve" on turnos for select using (public.es_staff());

drop policy if exists "turnos cliente ve los suyos" on turnos;
create policy "turnos cliente ve los suyos" on turnos for select using (perfil_id = auth.uid());

drop policy if exists "turnos staff actualiza" on turnos;
create policy "turnos staff actualiza" on turnos
  for update using (public.es_staff()) with check (public.es_staff());

-- clientes: el staff ve todo; el cliente ve su ficha; upsert al reservar es público
drop policy if exists "clientes staff ve" on clientes;
create policy "clientes staff ve" on clientes for select using (public.es_staff());

drop policy if exists "clientes cliente ve su ficha" on clientes;
create policy "clientes cliente ve su ficha" on clientes for select using (perfil_id = auth.uid());

drop policy if exists "clientes upsert" on clientes;
create policy "clientes upsert" on clientes for insert with check (true);

drop policy if exists "clientes actualizar" on clientes;
create policy "clientes actualizar" on clientes
  for update using (public.es_staff() or perfil_id = auth.uid());

-- ── Vista pública de horarios ocupados (sin datos personales) ─────────
create or replace view turnos_publicos as
  select fecha, hora, barbero_id from turnos where estado <> 'cancelado';
grant select on turnos_publicos to anon, authenticated;

-- ── Vista pública de quién atiende (para elegir al reservar) ─────────
create or replace view staff_publico as
  select id, nombre, rol from perfiles
  where rol in ('admin', 'empleado') and activo and atiende;
grant select on staff_publico to anon, authenticated;

-- ── Consulta de fidelidad por teléfono (anónima, solo devuelve el conteo) ──
create or replace function public.sellos_por_telefono(tel text)
returns table (nombre text, cortes_count integer)
language sql stable security definer set search_path = public as $$
  select nombre, cortes_count from clientes where telefono = tel;
$$;
grant execute on function public.sellos_por_telefono(text) to anon, authenticated;

-- ── Cancelar el propio turno (sin cuenta) ────────────────────────────
-- Solo cancela si coinciden fecha + hora + teléfono (los datos que el
-- cliente tiene porque acaba de reservar).
create or replace function public.cancelar_turno(p_fecha date, p_hora time, p_telefono text)
returns boolean language plpgsql security definer set search_path = public as $$
declare filas int;
begin
  update turnos set estado = 'cancelado'
  where fecha = p_fecha and hora = p_hora
    and cliente_telefono = p_telefono and estado = 'confirmado';
  get diagnostics filas = row_count;
  return filas > 0;
end;
$$;
grant execute on function public.cancelar_turno(date, time, text) to anon, authenticated;

-- ── Realtime: la agenda del panel se actualiza sola ──────────────────
do $$ begin
  alter publication supabase_realtime add table turnos;
exception when duplicate_object then null; end $$;

-- =====================================================================
-- DESPUÉS de correr esto (una sola vez):
--
--   1. Authentication > Providers > Email  → destildá "Confirm email"
--      (así el admin puede crear cuentas de empleado que entren directo).
--
--   2. Authentication > Users > Add user  → creás tu usuario (email + pass),
--      tildando "Auto Confirm User".
--
--   3. Te hacés admin desde el SQL Editor (con tu email real):
--        update perfiles set rol = 'admin'
--        where email = 'TU-EMAIL';
--
--   4. (opcional) Limpiar turnos de prueba:
--        delete from turnos;  delete from clientes;
-- =====================================================================
