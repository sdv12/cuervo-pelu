import { Clock, MessageCircle } from 'lucide-react'

export default function Hero() {
  return (
    <>
      <section className="px-5 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-16">
        <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-7 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
          <div>
            <div className="mb-2.5 text-[0.9rem] font-semibold text-rojo sm:text-[0.95rem]">
              Barrio de siempre, corte de siempre
            </div>
            <h1 className="text-[clamp(2.4rem,10vw,4.6rem)] uppercase leading-[0.98] text-azul dark:text-navy-text">
              Cuervo<br /><em className="not-italic text-rojo">Peluquería</em>
            </h1>
            <p className="mt-4 max-w-[46ch] text-[1.02rem] text-tinta-suave dark:text-navy-soft sm:mt-4.5 sm:text-[1.08rem]">
              Atención detallista, precios de barrio y técnicas al día. Elegís el corte, el día y la hora,
              y confirmás por WhatsApp en dos minutos.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <a href="#turnos" className="btn-primary w-full justify-center text-center sm:w-auto">Reservar turno</a>
              <a href="#servicios" className="btn-ghost w-full justify-center text-center sm:w-auto">Ver servicios y precios</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.88rem] text-tinta-suave dark:text-navy-soft sm:mt-6.5 sm:text-[0.9rem]">
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-rojo" />
                Mar. a sáb. · 10 a 20 hs
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={16} className="text-rojo" />
                Turnos por WhatsApp
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center py-2 md:py-0">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-rojo/20 blur-2xl" />
              <div className="h-[220px] w-[220px] overflow-hidden rounded-full border-4 border-panel shadow-[0_18px_40px_rgba(0,0,0,0.25)]
                              dark:border-navy-card sm:h-[280px] sm:w-[280px] md:h-[320px] md:w-[320px]">
                <img
                  src="/logo-cuervo.webp"
                  alt="Cuervo Peluquería — cuervo posado sobre una copa"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-full
                              border-4 border-hueso bg-rojo text-white shadow-lg dark:border-navy sm:h-16 sm:w-16">
                <MessageCircle size={22} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="stripe" role="presentation" />
    </>
  )
}
