import { fechaISO } from './businessDays'

// Rangos de fechas (ISO) para los reportes contables.
export function rangoDia(d = new Date()) {
  const iso = fechaISO(d)
  return {
    desde: iso, hasta: iso,
    etiqueta: d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }),
  }
}

export function rangoSemana(d = new Date()) {
  const inicio = new Date(d)
  inicio.setDate(d.getDate() - d.getDay())
  const fin = new Date(inicio)
  fin.setDate(inicio.getDate() + 6)
  return {
    desde: fechaISO(inicio), hasta: fechaISO(fin),
    etiqueta: `Semana del ${inicio.getDate()}/${inicio.getMonth() + 1} al ${fin.getDate()}/${fin.getMonth() + 1}`,
  }
}

export function rangoMes(d = new Date()) {
  const inicio = new Date(d.getFullYear(), d.getMonth(), 1)
  const fin = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return {
    desde: fechaISO(inicio), hasta: fechaISO(fin),
    etiqueta: d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }),
  }
}
