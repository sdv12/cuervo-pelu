import { Shuffle, Scissors, CheckCircle2 } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { CUALQUIERA } from '../../services/bookingService'
import { formatearPrecio, etiquetaRol } from '../../utils/formato'

const CARD = 'relative flex min-h-[64px] items-center gap-3 rounded-lg border-[1.5px] bg-white px-4 py-3.5 text-left transition-colors active:scale-[0.98] dark:bg-navy-card'
const SELECCIONADA = 'border-rojo bg-rojo/[0.06] dark:bg-rojo/10'
const NO_SELECCIONADA = 'border-linea hover:border-rojo dark:border-navy-border'

function Check({ visible }) {
  return visible ? <CheckCircle2 size={19} className="absolute right-3 top-3 text-rojo" /> : null
}

// Paso 1 del wizard: qué corte y quién lo hace. Van juntos porque los dos
// son decisiones de "qué voy a hacerme" — separarlos sumaba un clic sin
// aportar información.
export default function StepTurno() {
  const { state, seleccionarServicio, seleccionarBarbero, irAPaso } = useBooking()

  return (
    <div>
      <h3 className="mb-3 text-[1.2rem] uppercase text-azul dark:text-navy-text">Qué te hacés</h3>
      {state.serviciosCargando ? (
        <p className="loading-note">Consultando servicios...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {state.servicios.map(s => {
            const selected = state.service === s.nombre
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => seleccionarServicio(s.nombre, s.precio)}
                className={`${CARD} flex-col items-start ${selected ? SELECCIONADA : NO_SELECCIONADA}`}
              >
                <Check visible={selected} />
                <strong className="block pr-6 text-[1rem] text-azul dark:text-navy-text">{s.nombre}</strong>
                <span className="text-[0.85rem] text-tinta-suave dark:text-navy-soft">{formatearPrecio(s.precio)}</span>
              </button>
            )
          })}
        </div>
      )}

      <h3 className="mb-3 mt-7 text-[1.2rem] uppercase text-azul dark:text-navy-text">¿Quién te atiende?</h3>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => seleccionarBarbero(CUALQUIERA)}
          className={`${CARD} ${state.barberoId === CUALQUIERA ? SELECCIONADA : NO_SELECCIONADA}`}
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-azul/10 text-azul dark:bg-navy-soft/15 dark:text-navy-text">
            <Shuffle size={18} />
          </span>
          <span className="pr-6">
            <strong className="block text-[1rem] text-azul dark:text-navy-text">Cualquiera disponible</strong>
            <span className="text-[0.82rem] text-tinta-suave dark:text-navy-soft">Te asignamos quien tenga lugar</span>
          </span>
          <Check visible={state.barberoId === CUALQUIERA} />
        </button>

        {state.staffCargando && <p className="loading-note sm:col-span-2">Consultando quién atiende...</p>}

        {!state.staffCargando && state.staff.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => seleccionarBarbero(s.id)}
            className={`${CARD} ${state.barberoId === s.id ? SELECCIONADA : NO_SELECCIONADA}`}
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rojo/10 text-rojo">
              <Scissors size={17} />
            </span>
            <span className="pr-6">
              <strong className="block text-[1rem] text-azul dark:text-navy-text">{s.nombre}</strong>
              <span className="text-[0.82rem] text-tinta-suave dark:text-navy-soft">{etiquetaRol(s.rol)}</span>
            </span>
            <Check visible={state.barberoId === s.id} />
          </button>
        ))}
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
