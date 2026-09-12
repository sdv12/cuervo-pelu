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

  // Realtime: llama a `callback` ante cualquier cambio en la tabla turnos.
  suscribirTurnos(callback) {
    const canal = supabase
      .channel('turnos-panel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'turnos' }, callback)
      .subscribe()
    return () => supabase.removeChannel(canal)
  },
}
