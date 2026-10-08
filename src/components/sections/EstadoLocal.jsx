import { useState, useEffect } from 'react'
import { estaAbiertoAhora, getProximosHorarios } from '../../utils/businessDays'

// Aviso en vivo en el hero: si hay alguien atendiendo ahora mismo y qué
// horarios quedan hoy, o si está cerrado y cuáles son los próximos
// turnos disponibles. Se recalcula solo (cada minuto) por si alguien
// deja la pestaña abierta justo cuando abre o cierra el local.
export default function EstadoLocal() {
  const [info, setInfo] = useState(() => ({ abierto: estaAbiertoAhora(), ...getProximosHorarios() }))

  useEffect(() => {
    const id = setInterval(() => setInfo({ abierto: estaAbiertoAhora(), ...getProximosHorarios() }), 60000)
    return () => clearInterval(id)
  }, [])

  const { abierto, dia, horarios } = info
  const esHoy = dia?.nombreDia === 'Hoy'

  return (
    <a
      href="#turnos"
      className="mt-5 flex flex-col gap-2.5 rounded-xl border-[1.5px] border-dashed border-linea bg-panel/70 px-4 py-3.5
                 no-underline transition-colors hover:border-rojo dark:border-navy-border dark:bg-navy-card/60 sm:mt-5.5"
    >
      <span className="flex items-center gap-2 text-[0.92rem] font-semibold text-azul dark:text-navy-text">
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${abierto ? 'animate-pulse bg-green-500' : 'bg-tinta-suave/50 dark:bg-navy-soft/50'}`} />
        {abierto ? 'Estamos trabajando' : 'Estamos cerrados'}
        <span className="font-normal text-tinta-suave dark:text-navy-soft">
          {abierto
            ? '· quedan estos horarios hoy'
            : horarios.length
              ? `· próximos turnos${esHoy ? ' de hoy' : ` (${dia.nombreDia.toLowerCase()} ${dia.numero})`}`
              : ''}
        </span>
      </span>

      {horarios.length > 0 ? (
        <span className="flex flex-wrap gap-1.5">
          {horarios.map(h => (
            <span key={h} className="rounded-md bg-white px-2.5 py-1 text-[0.85rem] font-semibold text-azul dark:bg-navy dark:text-navy-text">
              {h}
            </span>
          ))}
        </span>
      ) : (
        <span className="text-[0.85rem] text-tinta-suave dark:text-navy-soft">Consultá los horarios y reservá tu turno.</span>
      )}
    </a>
  )
}
