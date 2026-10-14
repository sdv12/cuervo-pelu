const ITEMS = [
  { titulo: 'Atención detallista', texto: 'Cada corte se piensa para la cara y el pelo de la persona que se sienta en la silla, no en serie.' },
  { titulo: 'Precios de barrio', texto: 'Tarifas pensadas para que venir cada tres semanas no sea un lujo.' },
  { titulo: 'Técnicas al día', texto: 'Fade, diseño y degradé actualizados, sin perder el corte clásico de toda la vida.' },
]

export default function WhyUs() {
  return (
    <section className="scroll-mt-16 px-5 py-14 sm:scroll-mt-[76px] sm:px-6 sm:py-[72px]" id="por-que">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch]">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Por qué nosotros</h2>
          <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
            No competimos por ser los más grandes del barrio, sino por ser los que mejor te atienden.
          </p>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ITEMS.map(item => (
            <div
              key={item.titulo}
              className="w-[80vw] max-w-[320px] flex-shrink-0 snap-start rounded-xl border border-linea bg-white px-6 py-6.5 dark:border-navy-border dark:bg-navy-card sm:w-auto sm:max-w-none"
            >
              <h3 className="mb-2 text-[1.05rem] uppercase text-rojo">{item.titulo}</h3>
              <p className="m-0 text-[0.95rem] text-tinta-suave dark:text-navy-soft">{item.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
