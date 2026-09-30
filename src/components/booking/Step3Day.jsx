import { useRef } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'

function rangoDeMeses(dias) {
  const meses = [...new Set(dias.map(d => d.fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })))]
  return meses.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' / ')
}

export default function Step3Day() {
  const { state, diasHabiles, seleccionarDia, irAPaso } = useBooking()
  const scrollRef = useRef(null)

  function desplazar(dir) {
    scrollRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[1.2rem] uppercase text-azul dark:text-navy-text">Elegí el día</h3>
        <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
          {rangoDeMeses(diasHabiles)}
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => desplazar(-1)}
          aria-label="Ver días anteriores"
          className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full
                     border border-linea bg-white text-azul shadow-sm hover:border-rojo hover:text-rojo
                     dark:border-navy-border dark:bg-navy-card dark:text-navy-text sm:flex"
        >
          <ChevronLeft size={18} />
        </button>

        <div ref={scrollRef} className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-1 px-1 sm:px-1 sm:scroll-smooth">
          {diasHabiles.map(d => {
            const selected = state.dayIso === d.iso
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => seleccionarDia(d)}
                className={`relative min-w-[68px] flex-shrink-0 rounded-[10px] border-[1.5px] bg-white px-3.5 py-3.5 text-center active:scale-[0.97]
                  dark:bg-navy-card
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

        <button
          type="button"
          onClick={() => desplazar(1)}
          aria-label="Ver más días"
          className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full
                     border border-linea bg-white text-azul shadow-sm hover:border-rojo hover:text-rojo
                     dark:border-navy-border dark:bg-navy-card dark:text-navy-text sm:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {state.loadingHorarios && (
        <p className="loading-note">Consultando horarios disponibles...</p>
      )}
      <div className="mt-6 flex justify-between gap-3 sm:mt-5.5">
        <button type="button" className="btn-ghost btn-small" onClick={() => irAPaso(2)}>Atrás</button>
        <button
          type="button"
          className="btn-primary btn-small flex-1 justify-center sm:flex-none"
          disabled={!state.day || state.loadingHorarios}
          onClick={() => irAPaso(4)}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
