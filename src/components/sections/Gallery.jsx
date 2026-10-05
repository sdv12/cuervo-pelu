import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BarberProfile from './BarberProfile'

const CORTES = Array.from({ length: 11 }, (_, i) => `/estilos/corte-${String(i + 1).padStart(2, '0')}.webp`)

export default function Gallery() {
  const trackRef = useRef(null)
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const card = track.firstElementChild
      if (!card) return
      setActivo(Math.round(track.scrollLeft / (card.offsetWidth + 14)))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  function ir(dir) {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * (track.firstElementChild.offsetWidth + 14), behavior: 'smooth' })
  }

  const progreso = ((activo + 1) / CORTES.length) * 100

  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[72px]" id="estilos">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[56ch]">
            <span className="tag-canchera">Lo que sale de la silla</span>
            <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Estilos que hacemos</h2>
            <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
              Cortes reales hechos en Cuervo. Deslizá para ver más.
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={() => ir(-1)} aria-label="Foto anterior"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-azul text-azul hover:bg-azul hover:text-hueso dark:border-navy-text dark:text-navy-text dark:hover:bg-navy-text dark:hover:text-navy">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => ir(1)} aria-label="Foto siguiente"
              className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-azul text-azul hover:bg-azul hover:text-hueso dark:border-navy-text dark:text-navy-text dark:hover:bg-navy-text dark:hover:text-navy">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CORTES.map((src, i) => (
            <figure
              key={src}
              className="group relative w-[78vw] max-w-[320px] flex-shrink-0 snap-start overflow-hidden rounded-[18px] bg-azul sm:w-[300px]"
            >
              <img
                src={src}
                alt={`Corte realizado en Cuervo Peluquería, ejemplo ${i + 1}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 -skew-x-6 rounded-md bg-rojo px-2.5 py-1 font-display text-[0.8rem] font-semibold uppercase tracking-wider text-hueso">
                Corte {String(i + 1).padStart(2, '0')}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-4">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-linea dark:bg-navy-border">
            <div className="h-full rounded-full bg-rojo transition-[width] duration-300" style={{ width: `${progreso}%` }} />
          </div>
          <span className="font-display text-[0.95rem] tabular-nums text-azul dark:text-navy-text">
            {String(activo + 1).padStart(2, '0')} <span className="text-tinta-suave dark:text-navy-soft">/ {String(CORTES.length).padStart(2, '0')}</span>
          </span>
        </div>

        <BarberProfile />
      </div>
    </section>
  )
}
