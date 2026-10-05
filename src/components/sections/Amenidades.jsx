import { Gamepad2, Tv } from 'lucide-react'
import { AMENIDADES } from '../../data/amenidades'

const ICONOS = { gamepad: Gamepad2, tv: Tv }

export default function Amenidades() {
  return (
    <section className="bg-azul px-5 py-14 text-hueso dark:bg-navy sm:px-6 sm:py-[72px]">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch] sm:mb-10">
          <div className="mb-2.5 text-[1rem] font-semibold text-rojo">Más que un corte</div>
          <h2 className="text-[clamp(1.7rem,7vw,2.5rem)] uppercase text-hueso">Mientras esperás, disfrutá</h2>
          <p className="mt-2.5 text-[1.05rem] text-[#D5DAE4]">
            Jugá, mirá el partido y esperá tranquilo. Todo gratis.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          {AMENIDADES.map(a => {
            const Icono = ICONOS[a.icono]
            return (
              <div
                key={a.id}
                className="relative flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
              >
                <span className="absolute right-4 top-4 rounded-full bg-rojo px-2.5 py-1 text-[0.75rem] font-bold uppercase tracking-wide text-white">
                  Gratis
                </span>
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-rojo/15 text-rojo">
                  <Icono size={30} />
                </div>
                <div className="pr-14">
                  <h3 className="text-[1.05rem] font-semibold uppercase tracking-wide text-hueso">{a.titulo}</h3>
                  <p className="mt-1.5 text-[0.98rem] text-[#D5DAE4]">{a.descripcion}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
