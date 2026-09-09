import { HORARIOS_DISPONIBLES } from '../../utils/businessDays'
import { useBooking } from '../../context/BookingContext'

export default function Step3Time() {
  const { state, seleccionarHora, irAPaso } = useBooking()
  const ocupados = state.horariosOcupados || []

  return (
    <div>
      <h3 className="mb-4 text-[1.2rem] uppercase text-azul dark:text-navy-text">Elegí el horario</h3>
      <div className="mt-3.5 grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(78px,1fr))]">
        {HORARIOS_DISPONIBLES.map(t => {
          const ocupado = ocupados.includes(t)
          const selected = state.time === t
          return (
            <button
              key={t}
              type="button"
              disabled={ocupado}
              title={ocupado ? 'Ese horario ya está reservado' : undefined}
              onClick={() => seleccionarHora(t)}
              className={`min-h-[48px] rounded-lg border-[1.5px] bg-white py-3 text-center text-[0.9rem] active:scale-[0.97] dark:bg-navy-card
                ${ocupado ? 'cursor-not-allowed opacity-35 line-through' : 'border-linea dark:border-navy-border'}
                ${selected ? 'border-rojo bg-rojo/[0.06] font-semibold text-rojo dark:bg-rojo/10' : ''}`}
            >
              {t}
            </button>
          )
        })}
      </div>
      <div className="mt-6 flex justify-between gap-3 sm:mt-5.5">
        <button type="button" className="btn-ghost btn-small" onClick={() => irAPaso(2)}>Atrás</button>
        <button
          type="button"
          className="btn-primary btn-small flex-1 justify-center sm:flex-none"
          disabled={!state.time}
          onClick={() => irAPaso(4)}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
