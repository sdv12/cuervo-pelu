import { CUPOS_PROMO_SEMANALES } from '../config/contact'

// ── Capa de datos ──────────────────────────────────────────────────────
// Única puerta de entrada a turnos, cupos y clientes. Hoy lee/escribe en
// MOCK_DB (memoria del navegador, se pierde al recargar). Cuando se
// conecte Supabase, solo hace falta reescribir el cuerpo de estas cuatro
// funciones para que usen el cliente de Supabase — los componentes que
// las llaman no necesitan cambiar.

const MOCK_DB = {
  turnos: [], // { fecha, hora, servicio, precio, nombre, telefono, estado }
  clientes: {
    // Cliente de ejemplo para poder probar la tarjeta de fidelidad ya mismo.
    '5491111111111': { nombre: 'Cliente Demo', cortes_count: 2 },
  },
}

// Sembramos un par de turnos de ejemplo para poder ver el bloqueo de
// horarios funcionando sin backend todavía. Se puede borrar en cuanto
// MOCK_DB deje de usarse.
export function sembrarTurnoDemo(fecha, hora) {
  if (MOCK_DB.turnos.some(t => t.fecha === fecha && t.hora === hora)) return
  MOCK_DB.turnos.push({
    fecha, hora, servicio: 'Corte clásico', precio: '$6.000',
    nombre: 'Reserva demo', telefono: '0000000000', estado: 'confirmado',
  })
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const bookingService = {
  // TODO(supabase): select hora from turnos_publicos where fecha = fechaStr
  async getHorariosOcupados(fechaStr) {
    await delay(350)
    return MOCK_DB.turnos
      .filter(t => t.fecha === fechaStr && t.estado !== 'cancelado')
      .map(t => t.hora)
  },

  // TODO(supabase): contar turnos (estado <> 'cancelado') con fecha dentro de la semana actual
  async getCuposRestantesSemana() {
    await delay(300)
    const hoy = new Date()
    const inicioSemana = new Date(hoy)
    inicioSemana.setHours(0, 0, 0, 0)
    inicioSemana.setDate(hoy.getDate() - hoy.getDay())
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(inicioSemana.getDate() + 6)

    const enEstaSemana = fechaStr => {
      const [d, m, y] = fechaStr.split('/').map(Number)
      const fecha = new Date(y, m - 1, d)
      return fecha >= inicioSemana && fecha <= finSemana
    }

    const reservados = MOCK_DB.turnos.filter(t => t.estado !== 'cancelado' && enEstaSemana(t.fecha)).length
    return Math.max(0, CUPOS_PROMO_SEMANALES - reservados)
  },

  // TODO(supabase): upsert en clientes (incrementando cortes_count) + insert en turnos
  async guardarTurno({ fecha, hora, servicio, precio, nombre, telefono }) {
    await delay(400)
    MOCK_DB.turnos.push({ fecha, hora, servicio, precio, nombre, telefono, estado: 'confirmado' })
    const cliente = MOCK_DB.clientes[telefono]
    if (cliente) {
      cliente.cortes_count += 1
      cliente.nombre = nombre
    } else {
      MOCK_DB.clientes[telefono] = { nombre, cortes_count: 1 }
    }
    return true
  },

  // TODO(supabase): select nombre, cortes_count from clientes where telefono = telefono
  async getCliente(telefono) {
    await delay(350)
    return MOCK_DB.clientes[telefono] || null
  },
}

export default bookingService
