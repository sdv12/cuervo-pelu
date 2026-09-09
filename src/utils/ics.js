// Genera un archivo .ics de 30 minutos (duración de cada turno) para el turno elegido
export function generarICS({ dayDate, time, service }) {
  const [h, m] = time.split(':').map(Number)
  const start = new Date(dayDate)
  start.setHours(h, m, 0, 0)
  const end = new Date(start.getTime() + 30 * 60000)
  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:Turno en Cuervo Peluquería (${service})`,
    'DESCRIPTION:Recordatorio de tu turno en Cuervo Peluquería.',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  return 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics)
}
