const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// 'YYYY-MM-DD' en hora local (no UTC) — es la clave que usa la base de datos.
export function fechaISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ¿Todavía queda algún horario por empezar hoy? Compara contra el último
// slot del día (p. ej. sábado el último es 19:30) para saber si tiene
// sentido ofrecer "hoy" como opción.
function quedanHorariosHoy(ahora) {
  const ultimo = getHorariosDelDia(ahora).at(-1)
  if (!ultimo) return false
  const [h, m] = ultimo.split(':').map(Number)
  const limite = new Date(ahora)
  limite.setHours(h, m, 0, 0)
  return ahora < limite
}

// Próximos días hábiles (saltea domingo y lunes, cerrado). Si hoy todavía
// tiene horarios por delante, es el primero de la lista — si no, arranca
// mañana. `iso` es la clave de base de datos; `label` es para mostrar.
export function getProximosDiasHabiles(cantidad = 6) {
  const dias = []
  const ahora = new Date()
  let offset = 0
  while (dias.length < cantidad) {
    const fecha = new Date(ahora)
    fecha.setDate(ahora.getDate() + offset)
    offset++
    if (fecha.getDay() === 0 || fecha.getDay() === 1) continue // cerrado domingo/lunes
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

// Turnos cada 30 minutos. `hasta` es el límite de inicio del último turno
// (no de cierre): un local que cierra a las 13:00 tiene su último turno a
// las 12:30, para que termine justo al cierre.
function generarSlots(desde, hasta) {
  const slots = []
  let [h, m] = desde.split(':').map(Number)
  const [hFin, mFin] = hasta.split(':').map(Number)
  while (h < hFin || (h === hFin && m < mFin)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += 30
    if (m >= 60) { m -= 60; h += 1 }
  }
  return slots
}

// Martes a viernes: dos turnos (mañana y tarde). Sábados: corrido.
const TURNOS_MARTES_A_VIERNES = [
  { label: 'Mañana', horarios: generarSlots('10:00', '13:00') },
  { label: 'Tarde', horarios: generarSlots('17:00', '20:00') },
]
const TURNOS_SABADO = [
  { label: null, horarios: generarSlots('9:00', '20:00') },
]

// Devuelve los horarios del día agrupados por turno (para mostrar "Mañana"
// y "Tarde" como secciones separadas cuando corresponde).
export function getTurnosDelDia(fecha) {
  return fecha.getDay() === 6 ? TURNOS_SABADO : TURNOS_MARTES_A_VIERNES
}

export function getHorariosDelDia(fecha) {
  return getTurnosDelDia(fecha).flatMap(t => t.horarios)
}
