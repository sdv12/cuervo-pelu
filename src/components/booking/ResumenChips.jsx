import { Pencil } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { formatearPrecio } from '../../utils/formato'

function Chip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-linea bg-white px-3.5 py-2 text-[0.82rem]
                 font-semibold text-azul active:scale-[0.97] dark:border-navy-border dark:bg-navy-card dark:text-navy-text"
    >
      {label}
      <Pencil size={12} className="flex-shrink-0 text-tinta-suave dark:text-navy-soft" />
    </button>
  )
}

// Franja de "migas" siempre visible con lo ya elegido — así nadie pierde de
// vista qué seleccionó, y puede corregirlo con un toque sin ir paso a paso
// hacia atrás. Pensado especialmente para que sea fácil de seguir en mobile
// y para clientes menos acostumbrados a wizards de varios pasos.
export default function ResumenChips() {
  const { state, irAPaso } = useBooking()
  if (state.step < 2) return null

  const barbero = state.staff.find(s => s.id === state.barberoId)

  const chips = []
  if (state.service) {
    chips.push({ key: 'servicio', paso: 1, label: `${state.service} · ${formatearPrecio(state.price)}` })
  }
  chips.push({ key: 'barbero', paso: 1, label: barbero ? barbero.nombre : 'Cualquiera disponible' })
  if (state.day) chips.push({ key: 'dia', paso: 2, label: state.day })
  if (state.time) chips.push({ key: 'hora', paso: 2, label: state.time })

  if (!chips.length) return null

  return (
    <div className="flex flex-wrap gap-2 border-b border-dashed border-linea bg-panel/60 px-5 py-3 dark:border-navy-border dark:bg-navy/40 sm:px-7">
      {chips.map(c => (
        <Chip key={c.key} label={c.label} onClick={() => irAPaso(c.paso)} />
      ))}
    </div>
  )
}
