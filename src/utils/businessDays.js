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

export const HORARIOS_DISPONIBLES = [
  '10:00', '10:40', '11:20', '12:00',
  '15:00', '15:40', '16:20', '17:00', '17:40', '18:20',
]
