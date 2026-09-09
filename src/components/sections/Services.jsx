import { SERVICIOS } from '../../data/servicios'

export default function Services() {
  return (
    <section className="scroll-mt-16 bg-panel px-5 py-14 dark:bg-navy sm:scroll-mt-[76px] sm:px-6 sm:py-[72px]" id="servicios">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch]">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Servicios</h2>
          <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
            Precios de referencia — ajustalos cuando quieras desde <code className="text-[0.85em]">src/data/servicios.js</code>.
          </p>
        </div>
        <div className="border-t border-linea dark:border-navy-border">
          {SERVICIOS.map(s => (
            <div key={s.id} className="flex items-baseline gap-4 border-b border-linea py-5 dark:border-navy-border">
              <span className={`whitespace-nowrap font-display text-[1.15rem] font-medium ${s.destacado ? 'text-rojo' : 'text-azul dark:text-navy-text'}`}>
                {s.nombre}
                {s.nota && <span className="mt-0.5 block text-[0.85rem] font-normal text-tinta-suave dark:text-navy-soft">{s.nota}</span>}
              </span>
              <span className="mb-1.5 min-w-6 flex-1 border-b-2 border-dotted border-tinta-suave opacity-40" />
              <span className="whitespace-nowrap text-[1.05rem] font-semibold">{s.precio}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
