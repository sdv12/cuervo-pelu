import { useBooking } from '../../context/BookingContext'

function rangoDeMeses(dias) {
  const meses = [...new Set(dias.map(d => d.fecha.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })))]
  return meses.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' / ')
}

export default function Step2Day() {
  const { state, diasHabiles, seleccionarDia, irAPaso } = useBooking()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-[1.2rem] uppercase text-azul dark:text-navy-text">Elegí el día</h3>
        <span className="text-[0.8rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
          {rangoDeMeses(diasHabiles)}
        </span>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-1 px-1">
        {diasHabiles.map(d => {
          const selected = state.day === d.label
          return (
            <button
              key={d.label}
              type="button"
              onClick={() => seleccionarDia(d.label, d.fecha)}
              className={`min-w-[64px] flex-shrink-0 rounded-[10px] border-[1.5px] bg-white px-3.5 py-3 text-center active:scale-[0.97]
                dark:bg-navy-card
                ${selected ? 'border-rojo bg-rojo/[0.06] dark:bg-rojo/10' : 'border-linea dark:border-navy-border'}`}
            >
              <span className="block text-[0.72rem] uppercase text-tinta-suave dark:text-navy-soft">{d.nombreDia}</span>
              <span className={`block font-display text-[1.15rem] ${selected ? 'text-rojo' : 'text-azul dark:text-navy-text'}`}>
                {d.numero}
              </span>
            </button>
          )
        })}
      </div>
      {state.loadingHorarios && (
        <p className="loading-note">Consultando horarios disponibles...</p>
      )}
      <div className="mt-6 flex justify-between gap-3 sm:mt-5.5">
        <button type="button" className="btn-ghost btn-small" onClick={() => irAPaso(1)}>Atrás</button>
        <button
          type="button"
          className="btn-primary btn-small flex-1 justify-center sm:flex-none"
          disabled={!state.day || state.loadingHorarios}
          onClick={() => irAPaso(3)}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
