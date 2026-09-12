import { useBooking } from '../../context/BookingContext'

const PASOS = [
  { n: 1, label: 'Servicio' },
  { n: 2, label: 'Atendido por' },
  { n: 3, label: 'Día' },
  { n: 4, label: 'Hora' },
  { n: 5, label: 'Tus datos' },
]

export default function StepsBar() {
  const { state } = useBooking()
  const actual = PASOS.find(p => p.n === state.step)

  return (
    <div className="border-b-[1.5px] border-dashed border-linea px-5 pb-4 pt-5 dark:border-navy-border sm:px-7 sm:pb-4.5 sm:pt-5.5">
      {/* Mobile: progreso compacto */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between text-[0.8rem] font-semibold text-tinta-suave dark:text-navy-soft">
          <span>Paso {state.step} de {PASOS.length}</span>
          <span className="text-rojo">{actual?.label}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-linea dark:bg-navy-border">
          <div
            className="h-full rounded-full bg-rojo transition-all duration-300"
            style={{ width: `${(state.step / PASOS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* sm+: pills completas */}
      <div className="hidden flex-wrap gap-1.5 sm:flex">
        {PASOS.map(p => {
          const active = state.step === p.n
          return (
            <div
              key={p.n}
              className={`flex items-center gap-2 rounded-full border-[1.5px] px-3 py-1.5 text-[0.85rem] font-semibold
                ${active
                  ? 'border-rojo bg-rojo/[0.06] text-rojo'
                  : 'border-linea text-tinta-suave dark:border-navy-border dark:text-navy-soft'}`}
            >
              <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[0.72rem] text-white
                ${active ? 'bg-rojo' : 'bg-linea dark:bg-navy-border'}`}
              >
                {p.n}
              </span>
              {p.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
