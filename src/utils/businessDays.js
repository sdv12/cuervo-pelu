const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Intervalo entre turnos según quién atiende: Cristian (dueño) corta más
// rápido que el resto del equipo, por ahora.
export const PASO_MIN_DEFAULT = 30
export function pasoPorRol(rol) {
  return rol === 'admin' ? 20 : 45
}

// 'YYYY-MM-DD' en hora local (no UTC) — es la clave que usa la base de datos.
export function fechaISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Bloques horarios reales del local por día de semana (getDay()). Lunes
// abre solo la tarde; martes a viernes, mañana y tarde separadas; sábado
// corrido; domingo cerrado (no tiene entrada = cerrado).
const BLOQUES_POR_DIA = {
  1: [{ label: null, desde: '17:00', hasta: '20:30' }],
  2: [{ label: 'Mañana', desde: '10:00', hasta: '14:00' }, { label: 'Tarde', desde: '16:00', hasta: '21:00' }],
  3: [{ label: 'Mañana', desde: '10:00', hasta: '14:00' }, { label: 'Tarde', desde: '16:00', hasta: '21:00' }],
  4: [{ label: 'Mañana', desde: '10:00', hasta: '14:00' }, { label: 'Tarde', desde: '16:00', hasta: '21:00' }],
  5: [{ label: 'Mañana', desde: '10:00', hasta: '14:00' }, { label: 'Tarde', desde: '16:00', hasta: '21:00' }],
  6: [{ label: null, desde: '10:00', hasta: '20:00' }],
}

function bloquesDelDia(fecha) {
  return BLOQUES_POR_DIA[fecha.getDay()] || []
}

// ¿Todavía queda algún horario por empezar hoy? Mira el cierre del último
// bloque del día (no depende del paso entre turnos de cada barbero).
function quedanHorariosHoy(ahora) {
  const bloques = bloquesDelDia(ahora)
  if (!bloques.length) return false
  const [h, m] = bloques.at(-1).hasta.split(':').map(Number)
  const limite = new Date(ahora)
  limite.setHours(h, m, 0, 0)
  return ahora < limite
}

// Próximos días hábiles (saltea domingo, cerrado). Si hoy todavía tiene
// horarios por delante, es el primero de la lista — si no, arranca
// mañana. `iso` es la clave de base de datos; `label` es para mostrar.
export function getProximosDiasHabiles(cantidad = 6) {
  const dias = []
  const ahora = new Date()
  let offset = 0
  while (dias.length < cantidad) {
    const fecha = new Date(ahora)
    fecha.setDate(ahora.getDate() + offset)
    offset++
    if (fecha.getDay() === 0) continue // cerrado domingo
    const esHoy = fechaISO(fecha) === fechaISO(ahora)
    if (esHoy && !quedanHorariosHoy(ahora)) continue // hoy ya no tiene turnos por delante
    dias.push({
      fecha,
      iso: fechaISO(fecha),
      label: fecha.toLocaleDateString('es-AR'),
      nombreDia: esHoy ? 'Hoy' : DAY_NAMES[fecha.getDay()],
      numero: fecha.getDate(),
    })
  }
  return dias
}

// `hasta` es el límite de inicio del último turno (no de cierre): un
// bloque que cierra a las 14:00 tiene su último turno antes de esa hora,
// para que termine (más o menos) justo al cierre.
function generarSlots(desde, hasta, pasoMin) {
  const slots = []
  let [h, m] = desde.split(':').map(Number)
  const [hFin, mFin] = hasta.split(':').map(Number)
  while (h < hFin || (h === hFin && m < mFin)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += pasoMin
    if (m >= 60) { h += Math.floor(m / 60); m %= 60 }
  }
  return slots
}

// Horarios del día agrupados por bloque (para mostrar "Mañana" y "Tarde"
// como secciones separadas cuando corresponde). `pasoMin` es cada cuánto
// arranca un turno — depende de quién atiende (ver pasoPorRol).
export function getTurnosDelDia(fecha, pasoMin = PASO_MIN_DEFAULT) {
  return bloquesDelDia(fecha).map(b => ({ label: b.label, horarios: generarSlots(b.desde, b.hasta, pasoMin) }))
}

export function getHorariosDelDia(fecha, pasoMin = PASO_MIN_DEFAULT) {
  return getTurnosDelDia(fecha, pasoMin).flatMap(t => t.horarios)
}

// Cuando no hay preferencia de barbero, se ofrece la unión de los
// horarios de todos los roles (hoy: 20 y 45 min) — más opciones a la
// vista; cuál barbero termina asignado se resuelve recién al confirmar.
export function getTurnosDelDiaCombinado(fecha) {
  const a = getTurnosDelDia(fecha, 20)
  const b = getTurnosDelDia(fecha, 45)
  return a.map((grupo, i) => ({
    label: grupo.label,
    horarios: [...new Set([...grupo.horarios, ...(b[i]?.horarios || [])])].sort(),
  }))
}
