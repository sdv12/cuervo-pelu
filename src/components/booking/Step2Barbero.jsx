import { Shuffle, Scissors } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { CUALQUIERA } from '../../services/bookingService'
import { etiquetaRol } from '../../utils/formato'

export default function Step2Barbero() {
  const { state, seleccionarBarbero, irAPaso } = useBooking()

  return (
    <div>
      <h3 className="mb-4 text-[1.2rem] uppercase text-azul dark:text-navy-text">¿Quién te atiende?</h3>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => seleccionarBarbero(CUALQUIERA)}
          className={`flex min-h-[64px] items-center gap-3 rounded-lg border-[1.5px] bg-white px-4 py-3.5 text-left transition-colors active:scale-[0.98]
            dark:bg-navy-card
            ${state.barberoId === CUALQUIERA ? 'border-rojo bg-rojo/[0.06] dark:bg-rojo/10' : 'border-linea hover:border-rojo dark:border-navy-border'}`}
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-azul/10 text-azul dark:bg-navy-soft/15 dark:text-navy-text">
            <Shuffle size={17} />
          </span>
          <span>
            <strong className="block text-[0.95rem] text-azul dark:text-navy-text">Cualquiera disponible</strong>
            <span className="text-[0.8rem] text-tinta-suave dark:text-navy-soft">Te asignamos quien tenga lugar</span>
          </span>
        </button>

        {state.staffCargando && (
          <p className="loading-note sm:col-span-2">Consultando quién atiende...</p>
        )}

        {!state.staffCargando && state.staff.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => seleccionarBarbero(s.id)}
            className={`flex min-h-[64px] items-center gap-3 rounded-lg border-[1.5px] bg-white px-4 py-3.5 text-left transition-colors active:scale-[0.98]
              dark:bg-navy-card
              ${state.barberoId === s.id ? 'border-rojo bg-rojo/[0.06] dark:bg-rojo/10' : 'border-linea hover:border-rojo dark:border-navy-border'}`}
          >
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-rojo/10 text-rojo">
              <Scissors size={16} />
            </span>
            <span>
              <strong className="block text-[0.95rem] text-azul dark:text-navy-text">{s.nombre}</strong>
              <span className="text-[0.8rem] text-tinta-suave dark:text-navy-soft">{etiquetaRol(s.rol)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between gap-3 sm:mt-5.5">
        <button type="button" className="btn-ghost btn-small" onClick={() => irAPaso(1)}>Atrás</button>
        <button
          type="button"
          className="btn-primary btn-small flex-1 justify-center sm:flex-none"
          onClick={() => irAPaso(3)}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
