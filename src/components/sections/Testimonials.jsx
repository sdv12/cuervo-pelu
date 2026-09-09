import { TESTIMONIOS } from '../../data/testimonios'

export default function Testimonials() {
  return (
    <section className="bg-panel dark:bg-navy">
      <div className="mx-auto max-w-[1080px] px-5 py-14 sm:px-6 sm:py-[72px]">
        <div className="mb-8 max-w-[56ch]">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Lo que dicen los clientes</h2>
          <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
            Ejemplos de comentarios — cambialos por reseñas reales apenas las tengas.
          </p>
        </div>
        <div className="grid grid-cols-1 border-y border-linea dark:border-navy-border md:grid-cols-3">
          {TESTIMONIOS.map((t, i) => (
            <div
              key={t.autor}
              className={`px-6.5 py-6 ${i > 0 ? 'border-t border-linea dark:border-navy-border md:border-t-0 md:border-l' : ''}`}
            >
              <p className="m-0 mb-3 text-[0.98rem]">&quot;{t.texto}&quot;</p>
              <span className="text-[0.85rem] font-semibold text-tinta-suave dark:text-navy-soft">— {t.autor}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
