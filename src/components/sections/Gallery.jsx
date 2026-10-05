import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BarberProfile from './BarberProfile'

const foto = n => `/estilos/corte-${String(n).padStart(2, '0')}.webp`

const GRUPOS = [
  { id: 'cristian', tab: 'Cortes de Cristian', fotos: [1, 2, 3, 4, 5, 6] },
  { id: 'equipo', tab: 'Cortes del equipo', fotos: [7, 8, 9, 10, 11] },
]

function Carrusel({ fotos, prefijo }) {
  const trackRef = useRef(null)
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const card = track.firstElementChild
      if (card) setActivo(Math.round(track.scrollLeft / (card.offsetWidth + 14)))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  function ir(dir) {
    const track = trackRef.current
    if (track) track.scrollBy({ left: dir * (track.firstElementChild.offsetWidth + 14), behavior: 'smooth' })
  }

  const progreso = ((activo + 1) / fotos.length) * 100

  return (
    <>
      <div className="mb-5 flex items-center justify-end gap-2">
        <button type="button" onClick={() => ir(-1)} aria-label="Foto anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-azul text-azul hover:bg-azul hover:text-hueso dark:border-navy-text dark:text-navy-text dark:hover:bg-navy-text dark:hover:text-navy">
          <ChevronLeft size={22} />
        </button>
        <button type="button" onClick={() => ir(1)} aria-label="Foto siguiente"
          className="flex h-12 w-12 items-center justify-center rounded-full border-[1.5px] border-azul text-azul hover:bg-azul hover:text-hueso dark:border-navy-text dark:text-navy-text dark:hover:bg-navy-text dark:hover:text-navy">
          <ChevronRight size={22} />
        </button>
      </div>

      <div
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((n, i) => (
          <figure key={n} className="group relative w-[80vw] max-w-[320px] flex-shrink-0 snap-start overflow-hidden rounded-[18px] bg-azul sm:w-[300px]">
            <img
              src={foto(n)}
              alt={`${prefijo} · corte ${i + 1}`}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <figcaption className="absolute bottom-3 left-3 -skew-x-6 rounded-md bg-rojo px-3 py-1.5 font-display text-[0.9rem] font-semibold uppercase tracking-wider text-hueso">
              {prefijo} {String(i + 1).padStart(2, '0')}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-4">
        <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-linea dark:bg-navy-border">
          <div className="h-full rounded-full bg-rojo transition-[width] duration-300" style={{ width: `${progreso}%` }} />
        </div>
        <span className="font-display text-[1rem] tabular-nums text-azul dark:text-navy-text">
          {String(activo + 1).padStart(2, '0')} <span className="text-tinta-suave dark:text-navy-soft">/ {String(fotos.length).padStart(2, '0')}</span>
        </span>
      </div>
    </>
  )
}

export default function Gallery() {
  const [grupo, setGrupo] = useState(GRUPOS[0].id)
  const actual = GRUPOS.find(g => g.id === grupo)

  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[72px]" id="estilos">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-7 max-w-[56ch]">
          <span className="tag-canchera">Lo que sale de la silla</span>
          <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Estilos que hacemos</h2>
          <p className="mt-2.5 text-[1.05rem] text-tinta-suave dark:text-navy-soft">
            Cortes reales hechos en Cuervo. Elegí quién te los hizo para ver sus trabajos.
          </p>
        </div>

        <div role="tablist" className="mb-7 inline-flex w-full flex-col gap-2 rounded-2xl bg-panel p-1.5 sm:w-auto sm:flex-row dark:bg-navy-card">
          {GRUPOS.map(g => (
            <button
              key={g.id}
              role="tab"
              aria-selected={grupo === g.id}
              type="button"
              onClick={() => setGrupo(g.id)}
              className={`min-h-[52px] rounded-xl px-6 py-3 text-[1.02rem] font-semibold transition-colors
                ${grupo === g.id ? 'bg-azul text-hueso shadow-sm dark:bg-navy-text dark:text-navy' : 'text-tinta-suave hover:text-azul dark:text-navy-soft dark:hover:text-navy-text'}`}
            >
              {g.tab}
            </button>
          ))}
        </div>

        <Carrusel key={actual.id} fotos={actual.fotos} prefijo={actual.id === 'cristian' ? 'Cristian' : 'Equipo'} />

        <BarberProfile />
      </div>
    </section>
  )
}
