import { useRef } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { CUALQUIERA } from '../../services/bookingService'
import { getTurnosDelDia, getTurnosDelDiaCombinado, fechaISO, pasoPorRol } from '../../utils/businessDays'

function rangoDeMeses(dias) {
  const meses = [...new Set(dias.map(d => d.fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })))]
  return meses.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' / ')
}

function FlechaDias({ dir, onClick }) {
  const Icono = dir < 0 ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? 'Ver días anteriores' : 'Ver más días'}
      className={`absolute top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-linea bg-white text-azul shadow-sm hover:border-rojo hover:text-rojo dark:border-navy-border dark:bg-navy-card dark:text-navy-text sm:flex ${dir < 0 ? '-left-2' : '-right-2'}`}
    >
      <Icono size={18} />
    </button>
  )
}

// Paso 2 del wizard: día y horario en la misma pantalla. Los horarios
// aparecen debajo apenas se elige el día — se ve de un vistazo todo lo
// que queda por decidir.
export default function StepFechaHora() {
  const { state, diasHabiles, seleccionarDia, seleccionarHora, irAPaso } = useBooking()
  const scrollRef = useRef(null)
  const ocupados = state.horariosOcupados || []
  const barbero = state.barberoId !== CUALQUIERA ? state.staff.find(s => s.id === state.barberoId) : null
  const turnos = !state.dayDate ? [] : barbero
    ? getTurnosDelDia(state.dayDate, pasoPorRol(barbero.rol))
    : getTurnosDelDiaCombinado(state.dayDate)
  const esHoy = state.dayIso === fechaISO(new Date())
  const horaActual = esHoy ? new Date().toTimeString().slice(0, 5) : null

  function desplazar(dir) {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[1.2rem] uppercase text-azul dark:text-navy-text">Qué día y a qué hora</h3>
        <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
          {rangoDeMeses(diasHabiles)}
        </span>
      </div>

      <div className="relative">
        <FlechaDias dir={-1} onClick={() => desplazar(-1)} />
        <div ref={scrollRef} className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1.5">
          {diasHabiles.map(d => {
            const selected = state.dayIso === d.iso
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => seleccionarDia(d)}
                className={`relative min-w-[68px] flex-shrink-0 rounded-[10px] border-[1.5px] bg-white px-3.5 py-3.5 text-center active:scale-[0.97] dark:bg-navy-card
                  ${selected ? 'border-rojo bg-rojo/[0.06] dark:bg-rojo/10' : 'border-linea dark:border-navy-border'}`}
              >
                {selected && <CheckCircle2 size={15} className="absolute right-1 top-1 text-rojo" />}
                <span className="block text-[0.74rem] uppercase text-tinta-suave dark:text-navy-soft">{d.nombreDia}</span>
                <span className={`block font-display text-[1.25rem] ${selected ? 'text-rojo' : 'text-azul dark:text-navy-text'}`}>
                  {d.numero}
                </span>
              </button>
            )
          })}
        </div>
        <FlechaDias dir={1} onClick={() => desplazar(1)} />
      </div>

      {state.loadingHorarios && <p className="loading-note mt-4">Consultando horarios disponibles...</p>}

      {!state.loadingHorarios && state.dayDate && (
        <div className="mt-6">
          <h3 className="mb-3 text-[1.2rem] uppercase text-azul dark:text-navy-text">Elegí el horario</h3>
          {turnos.map(grupo => (
            <div key={grupo.label || 'unico'} className="mb-4 last:mb-0">
              {grupo.label && (
                <p className="mb-2 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
                  {grupo.label}
                </p>
              )}
              <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(78px,1fr))] sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {grupo.horarios.map(t => {
                  const pasado = esHoy && t <= horaActual
                  const ocupado = ocupados.includes(t) || pasado
                  const selected = state.time === t
                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={ocupado}
                      title={pasado ? 'Ese horario ya pasó' : ocupado ? 'Ese horario ya está reservado' : undefined}
                      onClick={() => seleccionarHora(t)}
                      className={`min-h-[52px] min-w-[84px] flex-shrink-0 snap-start rounded-lg border-[1.5px] bg-white px-3 py-3 text-center text-[1rem] sm:min-w-0 active:scale-[0.97] dark:bg-navy-card
                        ${ocupado ? 'cursor-not-allowed border-linea opacity-35 line-through dark:border-navy-border' : 'border-linea dark:border-navy-border'}
                        ${selected ? 'border-rojo bg-rojo/[0.06] font-semibold text-rojo dark:bg-rojo/10' : ''}`}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between gap-3 sm:mt-5.5">
        <button type="button" className="btn-ghost btn-small" onClick={() => irAPaso(1)}>Atrás</button>
        <button
          type="button"
          className="btn-primary btn-small flex-1 justify-center sm:flex-none"
          disabled={!state.time || state.loadingHorarios}
          onClick={() => irAPaso(3)}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
