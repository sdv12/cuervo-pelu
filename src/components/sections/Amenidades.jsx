import { Gamepad2, Tv, CupSoda, Popcorn } from 'lucide-react'
import { AMENIDADES } from '../../data/amenidades'

const ICONOS = { gamepad: Gamepad2, tv: Tv, bebida: CupSoda, nueces: Popcorn }

export default function Amenidades() {
  return (
    <section className="bg-azul px-5 py-14 text-hueso dark:bg-navy sm:px-6 sm:py-[72px]">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch] sm:mb-10">
          <div className="mb-2.5 text-[0.9rem] font-semibold text-rojo">Más que un corte</div>
          <h2 className="text-[clamp(1.7rem,7vw,2.5rem)] uppercase text-hueso">Mientras esperás, disfrutá</h2>
          <p className="mt-2.5 text-[#C7CEDB]">
            En Cuervo no solo te cortás el pelo — te quedás un rato. Todo esto va incluido en tu visita.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {AMENIDADES.map(a => {
            const Icono = ICONOS[a.icono]
            return (
              <div
                key={a.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-rojo/50 hover:bg-white/[0.07] sm:p-6"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rojo/15 text-rojo sm:h-14 sm:w-14">
                  <Icono size={26} />
                </div>
                <h3 className="text-[0.98rem] font-semibold uppercase tracking-wide text-hueso">{a.titulo}</h3>
                <p className="mt-1.5 text-[0.85rem] text-[#C7CEDB]">{a.descripcion}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
