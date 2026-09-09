import { SERVICIOS } from '../../data/servicios'
import { useBooking } from '../../context/BookingContext'

export default function Step1Service() {
  const { state, seleccionarServicio, irAPaso } = useBooking()

  return (
    <div>
      <h3 className="mb-4 text-[1.2rem] uppercase text-azul dark:text-navy-text">Elegí el servicio</h3>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICIOS.map(s => {
          const selected = state.service === s.nombre
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => seleccionarServicio(s.nombre, s.precio)}
              className={`min-h-[56px] rounded-lg border-[1.5px] bg-white px-4 py-3.5 text-left transition-colors active:scale-[0.98]
                dark:bg-navy-card
                ${selected ? 'border-rojo bg-rojo/[0.06] dark:bg-rojo/10' : 'border-linea hover:border-rojo dark:border-navy-border'}`}
            >
              <strong className="block text-[0.95rem] text-azul dark:text-navy-text">{s.nombre}</strong>
              <span className="text-[0.82rem] text-tinta-suave dark:text-navy-soft">{s.precio}</span>
            </button>
          )
        })}
      </div>
      <div className="mt-6 flex justify-end gap-3 sm:mt-5.5">
        <button
          type="button"
          className="btn-primary btn-small w-full justify-center sm:w-auto"
          disabled={!state.service}
          onClick={() => irAPaso(2)}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
