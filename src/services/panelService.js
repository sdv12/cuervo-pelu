import { supabase } from '../lib/supabase'

// Consultas del panel (solo tienen sentido con Supabase — el acceso está
// protegido por RLS: staff ve turnos/clientes, admin gestiona perfiles).
export const panelService = {
  async getTurnos({ desde, hasta, incluirCancelados = false }) {
    let q = supabase.from('turnos').select('*')
      .gte('fecha', desde).lte('fecha', hasta)
      .order('fecha', { ascending: true }).order('hora', { ascending: true })
    if (!incluirCancelados) q = q.neq('estado', 'cancelado')
    const { data, error } = await q
    if (error) throw error
    return data || []
  },

  async marcarEstado(turnoId, estado, atendidoPor) {
    const patch = { estado }
    if (estado === 'completado') patch.atendido_por = atendidoPor
    else if (estado === 'confirmado') patch.atendido_por = null
    const { error } = await supabase.from('turnos').update(patch).eq('id', turnoId)
    if (error) throw error
  },

  async getCompletados({ desde, hasta }) {
    const { data, error } = await supabase.from('turnos').select('*')
      .eq('estado', 'completado').gte('fecha', desde).lte('fecha', hasta)
      .order('fecha', { ascending: true }).order('hora', { ascending: true })
    if (error) throw error
    return data || []
  },

  async getPerfiles() {
    const { data, error } = await supabase.from('perfiles').select('*').order('nombre', { ascending: true })
    if (error) throw error
    return data || []
  },
  async setRol(perfilId, rol) {
    const { error } = await supabase.from('perfiles').update({ rol }).eq('id', perfilId)
    if (error) throw error
  },
  async setActivo(perfilId, activo) {
    const { error } = await supabase.from('perfiles').update({ activo }).eq('id', perfilId)
    if (error) throw error
  },
  async setAtiende(perfilId, atiende) {
    const { error } = await supabase.from('perfiles').update({ atiende }).eq('id', perfilId)
    if (error) throw error
  },

  // ── Precios: servicios (cortes) ─────────────────────────────────────
  async getServiciosAdmin() {
    const { data, error } = await supabase.from('servicios').select('*').order('orden', { ascending: true })
    if (error) throw error
    return data || []
  },
  async setPrecioServicio(id, precio) {
    const { error } = await supabase.from('servicios').update({ precio }).eq('id', id)
    if (error) throw error
  },
  async setActivoServicio(id, activo) {
    const { error } = await supabase.from('servicios').update({ activo }).eq('id', id)
    if (error) throw error
  },

  // ── Precios: productos (bebidas / snacks) ───────────────────────────
  async getProductosAdmin() {
    const { data, error } = await supabase.from('productos').select('*').order('orden', { ascending: true })
    if (error) throw error
    return data || []
  },
  async setPrecioProducto(id, precio) {
    const { error } = await supabase.from('productos').update({ precio }).eq('id', id)
    if (error) throw error
  },
  async setActivoProducto(id, activo) {
    const { error } = await supabase.from('productos').update({ activo }).eq('id', id)
    if (error) throw error
  },

  // ── Consumos: ventas de productos registradas por el staff ──────────
  async registrarConsumo({ productoId, productoNombre, precio, cantidad, clienteNombre }) {
    const { data: sesion } = await supabase.auth.getSession()
    const { error } = await supabase.from('consumos').insert({
      producto_id: productoId,
      producto_nombre: productoNombre,
      precio,
      cantidad,
      cliente_nombre: clienteNombre || null,
      registrado_por: sesion?.session?.user?.id ?? null,
    })
    if (error) throw error
  },
  async getConsumos({ desde, hasta }) {
    const { data, error } = await supabase.from('consumos').select('*')
      .gte('created_at', desde).lte('created_at', hasta + 'T23:59:59')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  // ── Registro de actividad (auditoría, solo admin) ───────────────────
  async getActividad({ desde, hasta }) {
    const { data, error } = await supabase.from('registro_actividad').select('*')
      .gte('created_at', desde).lte('created_at', hasta + 'T23:59:59')
      .order('created_at', { ascending: false })
    if (error) throw error
    const filas = data || []
    const ids = [...new Set(filas.map(f => f.perfil_id).filter(Boolean))]
    let nombres = {}
    if (ids.length) {
      const { data: perfiles } = await supabase.from('perfiles').select('id, nombre').in('id', ids)
      nombres = Object.fromEntries((perfiles || []).map(p => [p.id, p.nombre]))
    }
    return filas.map(f => ({ ...f, perfil_nombre: f.perfil_id ? (nombres[f.perfil_id] || 'Ex-usuario') : 'Cliente' }))
  },

  // Realtime: llama a `callback` ante cualquier cambio en la tabla turnos.
  suscribirTurnos(callback) {
    const canal = supabase
      .channel('turnos-panel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'turnos' }, callback)
      .subscribe()
    return () => supabase.removeChannel(canal)
  },
}
