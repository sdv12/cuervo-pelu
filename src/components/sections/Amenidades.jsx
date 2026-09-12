import { useState, useEffect } from 'react'
import { Gamepad2, Tv, CupSoda, Popcorn } from 'lucide-react'
import { AMENIDADES } from '../../data/amenidades'
import bookingService from '../../services/bookingService'
import { formatearPrecio } from '../../utils/formato'

const ICONOS = { gamepad: Gamepad2, tv: Tv, bebida: CupSoda, nueces: Popcorn }

export default function Amenidades() {
  const [precios, setPrecios] = useState({})

  useEffect(() => {
    bookingService.getProductos().then(productos => {
      setPrecios(Object.fromEntries(productos.map(p => [p.id, p.precio])))
    })
  }, [])

  return (
    <section className="bg-azul px-5 py-14 text-hueso dark:bg-navy sm:px-6 sm:py-[72px]">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch] sm:mb-10">
          <div className="mb-2.5 text-[0.9rem] font-semibold text-rojo">Más que un corte</div>
          <h2 className="text-[clamp(1.7rem,7vw,2.5rem)] uppercase text-hueso">Mientras esperás, disfrutá</h2>
          <p className="mt-2.5 text-[#C7CEDB]">
            En Cuervo no solo te cortás el pelo — te quedás un rato. Jugás gratis, y si tenés hambre o sed, te lo servimos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {AMENIDADES.map(a => {
            const Icono = ICONOS[a.icono]
            return (
              <div
                key={a.id}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:border-rojo/50 hover:bg-white/[0.07] sm:p-6"
              >
                {a.gratis ? (
                  <span className="absolute right-3 top-3 rounded-full bg-rojo px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
                    Gratis
                  </span>
                ) : (
                  <span className="absolute right-3 top-3 rounded-full border border-dorado/60 bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-dorado">
                    {precios[a.productoId] != null ? formatearPrecio(precios[a.productoId]) : '...'}
                  </span>
                )}
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
