import { supabase } from '../lib/supabase'
import { CUPOS_PROMO_SEMANALES } from '../config/contact'
import { fechaISO } from '../utils/businessDays'

// ── Capa de datos ──────────────────────────────────────────────────────
// Si hay Supabase configurado, usa la base real. Si no, cae a MOCK_DB
// (memoria del navegador) para poder trabajar sin backend.

function semanaActualISO() {
  const hoy = new Date()
  const inicio = new Date(hoy)
  inicio.setHours(0, 0, 0, 0)
  inicio.setDate(hoy.getDate() - hoy.getDay())
  const fin = new Date(inicio)
  fin.setDate(inicio.getDate() + 6)
  return { inicio: fechaISO(inicio), fin: fechaISO(fin) }
}

// ── Implementación Supabase ───────────────────────────────────────────
const real = {
  async getHorariosOcupados(fechaIso) {
    const { data, error } = await supabase
      .from('turnos_publicos').select('hora').eq('fecha', fechaIso)
    if (error) throw error
    return (data || []).map(r => String(r.hora).slice(0, 5))
  },

  async getCuposRestantesSemana() {
    const { inicio, fin } = semanaActualISO()
    const { count, error } = await supabase
      .from('turnos_publicos').select('*', { count: 'exact', head: true })
      .gte('fecha', inicio).lte('fecha', fin)
    if (error) throw error
    return Math.max(0, CUPOS_PROMO_SEMANALES - (count || 0))
  },

  // Devuelve { ok } o { ok:false, motivo:'ocupado' } si el slot se tomó justo antes.
  async guardarTurno({ fecha, hora, servicio, precio, nombre, telefono }) {
    const { data: sesion } = await supabase.auth.getSession()
    const { error } = await supabase.from('turnos').insert({
      fecha, hora, servicio, precio,
      cliente_nombre: nombre, cliente_telefono: telefono,
      perfil_id: sesion?.session?.user?.id ?? null,
    })
    if (error) {
      if (error.code === '23505') return { ok: false, motivo: 'ocupado' }
      throw error
    }
    return { ok: true }
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
const MOCK_DB = {
  turnos: [], // { fecha (ISO), hora, servicio, precio, nombre, telefono, estado }
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
  })
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

const mock = {
  async getHorariosOcupados(fechaIso) {
    await delay(300)
    return MOCK_DB.turnos
      .filter(t => t.fecha === fechaIso && t.estado !== 'cancelado')
      .map(t => t.hora)
  },

  async getCuposRestantesSemana() {
    await delay(250)
    const { inicio, fin } = semanaActualISO()
    const reservados = MOCK_DB.turnos.filter(
      t => t.estado !== 'cancelado' && t.fecha >= inicio && t.fecha <= fin
    ).length
    return Math.max(0, CUPOS_PROMO_SEMANALES - reservados)
  },

  async guardarTurno({ fecha, hora, servicio, precio, nombre, telefono }) {
    await delay(350)
    if (MOCK_DB.turnos.some(t => t.fecha === fecha && t.hora === hora && t.estado !== 'cancelado')) {
      return { ok: false, motivo: 'ocupado' }
    }
    MOCK_DB.turnos.push({ fecha, hora, servicio, precio, nombre, telefono, estado: 'confirmado' })
    if (!MOCK_DB.clientes[telefono]) MOCK_DB.clientes[telefono] = { nombre, cortes_count: 0 }
    else MOCK_DB.clientes[telefono].nombre = nombre
    return { ok: true }
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
