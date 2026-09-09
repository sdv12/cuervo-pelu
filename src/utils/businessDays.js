const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Próximos días hábiles (saltea domingo y lunes, cerrado), con su fecha real
// y la misma etiqueta 'DD/MM/YYYY' que usa la capa de datos como clave.
export function getProximosDiasHabiles(cantidad = 6) {
  const dias = []
  const hoy = new Date()
  let offset = 1
  while (dias.length < cantidad) {
    const fecha = new Date(hoy)
    fecha.setDate(hoy.getDate() + offset)
    offset++
    if (fecha.getDay() === 0 || fecha.getDay() === 1) continue // cerrado domingo/lunes
    dias.push({
      fecha,
      label: fecha.toLocaleDateString('es-AR'),
      nombreDia: DAY_NAMES[fecha.getDay()],
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
