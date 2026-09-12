import { supabase } from '../lib/supabase'
import { CUPOS_PROMO_SEMANALES } from '../config/contact'
import { fechaISO } from '../utils/businessDays'

// ── Capa de datos ──────────────────────────────────────────────────────
// Si hay Supabase configurado, usa la base real. Si no, cae a MOCK_DB
// (memoria del navegador) para poder trabajar sin backend.

// Sentinel para "no tengo preferencia, cualquiera que esté libre".
export const CUALQUIERA = 'cualquiera'

function semanaActualISO() {
  const hoy = new Date()
  const inicio = new Date(hoy)
  inicio.setHours(0, 0, 0, 0)
  inicio.setDate(hoy.getDate() - hoy.getDay())
  const fin = new Date(inicio)
  fin.setDate(inicio.getDate() + 6)
  return { inicio: fechaISO(inicio), fin: fechaISO(fin) }
}

// De una lista de turnos del día, calcula qué horarios quedan bloqueados
// para una preferencia dada: un barbero puntual, o "cualquiera" (bloqueado
// solo si TODO el staff activo ya está ocupado a esa hora).
function horariosBloqueados(turnosDelDia, staff, barberoId) {
  if (barberoId && barberoId !== CUALQUIERA) {
    return turnosDelDia.filter(t => t.barbero_id === barberoId).map(t => t.hora)
  }
  const porHora = {}
  for (const t of turnosDelDia) {
    if (!t.barbero_id) continue
    porHora[t.hora] = porHora[t.hora] || new Set()
    porHora[t.hora].add(t.barbero_id)
  }
  const totalStaff = staff.length || 1
  return Object.entries(porHora).filter(([, ids]) => ids.size >= totalStaff).map(([hora]) => hora)
}

// Elige un barbero libre a esa fecha+hora entre el staff activo (para
// cuando el cliente no tiene preferencia). Si están todos ocupados,
// devuelve el primero igual — el índice único de la base es la última
// palabra y avisa "ocupado" si justo se pisan.
function elegirBarberoLibre(staff, ocupadosEnEseHorario) {
  const libre = staff.find(s => !ocupadosEnEseHorario.includes(s.id))
  return (libre || staff[0])?.id ?? null
}

// ── Implementación Supabase ───────────────────────────────────────────
const real = {
  async getStaff() {
    const { data, error } = await supabase.from('staff_publico').select('*').order('nombre', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getServicios() {
    const { data, error } = await supabase.from('servicios_publicos').select('*').order('orden', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getProductos() {
    const { data, error } = await supabase.from('productos_publicos').select('*').order('orden', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getHorariosOcupados(fechaIso, barberoId) {
    const { data, error } = await supabase
      .from('turnos_publicos').select('hora, barbero_id').eq('fecha', fechaIso)
    if (error) throw error
    const turnos = (data || []).map(r => ({ hora: String(r.hora).slice(0, 5), barbero_id: r.barbero_id }))
    const staff = await this.getStaff()
    return horariosBloqueados(turnos, staff, barberoId)
  },

  async getCuposRestantesSemana() {
    const { inicio, fin } = semanaActualISO()
    const { count, error } = await supabase
      .from('turnos_publicos').select('*', { count: 'exact', head: true })
      .gte('fecha', inicio).lte('fecha', fin)
    if (error) throw error
    return Math.max(0, CUPOS_PROMO_SEMANALES - (count || 0))
  },

  // Devuelve { ok, barbero } o { ok:false, motivo:'ocupado' } si el slot se tomó justo antes.
  async guardarTurno({ fecha, hora, servicio, precio, nombre, telefono, barberoId }) {
    const staff = await this.getStaff()
    let barbero = staff.find(s => s.id === barberoId)
    if (!barbero) {
      // sin preferencia (o la opción elegida ya no está disponible): elegimos entre los libres a esa hora
      const { data } = await supabase.from('turnos_publicos').select('barbero_id').eq('fecha', fecha).eq('hora', hora)
      const ocupados = (data || []).map(r => r.barbero_id).filter(Boolean)
      const elegidoId = elegirBarberoLibre(staff, ocupados)
      barbero = staff.find(s => s.id === elegidoId) || null
    }
    if (!barbero) return { ok: false, motivo: 'sin_staff' }

    const { data: sesion } = await supabase.auth.getSession()
    const { error } = await supabase.from('turnos').insert({
      fecha, hora, servicio, precio,
      cliente_nombre: nombre, cliente_telefono: telefono,
      perfil_id: sesion?.session?.user?.id ?? null,
      barbero_id: barbero.id,
    })
    if (error) {
      if (error.code === '23505') return { ok: false, motivo: 'ocupado' }
      throw error
    }
    return { ok: true, barbero }
  },

  async getCliente(telefono) {
    const { data, error } = await supabase.rpc('sellos_por_telefono', { tel: telefono })
    if (error) throw error
    const row = data?.[0]
    return row ? { nombre: row.nombre, cortes_count: row.cortes_count } : null
  },

  async cancelarTurno({ fecha, hora, telefono }) {
    const { data, error } = await supabase.rpc('cancelar_turno', {
      p_fecha: fecha, p_hora: hora, p_telefono: telefono,
    })
    if (error) throw error
    return data === true
  },
}

// ── Implementación mock (sin backend) ─────────────────────────────────
const MOCK_STAFF = [
  { id: 'mock-cristian', nombre: 'Cristian', rol: 'admin' },
  { id: 'mock-empleado', nombre: 'Empleado Demo', rol: 'empleado' },
]

const MOCK_SERVICIOS = [
  { id: 'clasico', nombre: 'Corte clásico', precio: 6000, destacado: true },
  { id: 'corte-barba', nombre: 'Corte + barba', precio: 8500 },
  { id: 'barba', nombre: 'Barba y perfilado', precio: 4000 },
  { id: 'fade', nombre: 'Diseño / fade', precio: 7500, nota: 'Incluye línea y dibujo a pedido' },
  { id: 'ninos', nombre: 'Corte niños', precio: 5000 },
]

const MOCK_PRODUCTOS = [
  { id: 'bebida', nombre: 'Birra o Coca', precio: 5000 },
  { id: 'nueces', nombre: 'Nueces confitadas', precio: 9000 },
]

const MOCK_DB = {
  turnos: [], // { fecha (ISO), hora, servicio, precio, nombre, telefono, estado, barbero_id }
  clientes: {
    '5491111111111': { nombre: 'Cliente Demo', cortes_count: 2 },
  },
}

export function sembrarTurnoDemo(fechaIso, hora) {
  if (supabase || !fechaIso) return
  if (MOCK_DB.turnos.some(t => t.fecha === fechaIso && t.hora === hora)) return
  MOCK_DB.turnos.push({
    fecha: fechaIso, hora, servicio: 'Corte clásico', precio: 6000,
    nombre: 'Reserva demo', telefono: '0000000000', estado: 'confirmado',
    barbero_id: MOCK_STAFF[0].id,
  })
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

const mock = {
  async getStaff() {
    await delay(150)
    return MOCK_STAFF
  },

  async getServicios() {
    await delay(150)
    return MOCK_SERVICIOS
  },

  async getProductos() {
    await delay(150)
    return MOCK_PRODUCTOS
  },

  async getHorariosOcupados(fechaIso, barberoId) {
    await delay(300)
    const turnos = MOCK_DB.turnos.filter(t => t.fecha === fechaIso && t.estado !== 'cancelado')
    return horariosBloqueados(turnos, MOCK_STAFF, barberoId)
  },

  async getCuposRestantesSemana() {
    await delay(250)
    const { inicio, fin } = semanaActualISO()
    const reservados = MOCK_DB.turnos.filter(
      t => t.estado !== 'cancelado' && t.fecha >= inicio && t.fecha <= fin
    ).length
    return Math.max(0, CUPOS_PROMO_SEMANALES - reservados)
  },

  async guardarTurno({ fecha, hora, servicio, precio, nombre, telefono, barberoId }) {
    await delay(350)
    let barbero = MOCK_STAFF.find(s => s.id === barberoId)
    if (!barbero) {
      const ocupados = MOCK_DB.turnos
        .filter(t => t.fecha === fecha && t.hora === hora && t.estado !== 'cancelado')
        .map(t => t.barbero_id)
      barbero = MOCK_STAFF.find(s => s.id === elegirBarberoLibre(MOCK_STAFF, ocupados))
    }
    if (!barbero) return { ok: false, motivo: 'sin_staff' }
    if (MOCK_DB.turnos.some(t => t.fecha === fecha && t.hora === hora && t.barbero_id === barbero.id && t.estado !== 'cancelado')) {
      return { ok: false, motivo: 'ocupado' }
    }
    MOCK_DB.turnos.push({ fecha, hora, servicio, precio, nombre, telefono, estado: 'confirmado', barbero_id: barbero.id })
    if (!MOCK_DB.clientes[telefono]) MOCK_DB.clientes[telefono] = { nombre, cortes_count: 0 }
    else MOCK_DB.clientes[telefono].nombre = nombre
    return { ok: true, barbero }
  },

  async getCliente(telefono) {
    await delay(300)
    return MOCK_DB.clientes[telefono] || null
  },

  async cancelarTurno({ fecha, hora, telefono }) {
    await delay(300)
    const turno = MOCK_DB.turnos.find(
      t => t.fecha === fecha && t.hora === hora && t.telefono === telefono && t.estado === 'confirmado'
    )
    if (!turno) return false
    turno.estado = 'cancelado'
    return true
  },
}

const bookingService = supabase ? real : mock
export default bookingService
