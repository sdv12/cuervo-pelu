import { Star } from 'lucide-react'
import { TESTIMONIOS } from '../../data/testimonios'
import { GOOGLE_REVIEWS_URL } from '../../config/contact'

function Estrellas({ n }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={15} className={i < n ? 'fill-dorado text-dorado' : 'text-linea dark:text-navy-border'} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-panel dark:bg-navy">
      <div className="mx-auto max-w-[1080px] px-5 py-14 sm:px-6 sm:py-[72px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[56ch]">
            <span className="tag-canchera">Reseñas reales de Google</span>
            <h2 className="mt-3 text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">
              Lo que dicen los clientes
            </h2>
            <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
              Tal cual las dejaron en Google, sin retocar.
            </p>
          </div>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 rounded-lg border-[1.5px] border-azul px-4 py-2.5 text-[0.9rem] font-semibold text-azul no-underline hover:bg-azul hover:text-hueso dark:border-navy-text dark:text-navy-text dark:hover:bg-navy-text dark:hover:text-navy"
          >
            <Star size={16} className="fill-current" /> Ver todas en Google
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIOS.map(t => (
            <div
              key={t.autor}
              className="flex flex-col gap-3 rounded-xl border border-linea bg-white p-5 dark:border-navy-border dark:bg-navy-card"
            >
              <Estrellas n={t.estrellas} />
              <p className="m-0 flex-1 text-[0.95rem] text-tinta dark:text-navy-text">&quot;{t.texto}&quot;</p>
              <span className="text-[0.85rem] font-semibold text-tinta-suave dark:text-navy-soft">— {t.autor}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
