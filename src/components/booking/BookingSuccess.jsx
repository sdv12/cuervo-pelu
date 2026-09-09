import { CheckCircle2, CalendarPlus, MessageCircle } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { generarICS } from '../../utils/ics'

export default function BookingSuccess() {
  const { state, reiniciar } = useBooking()
  const icsHref = generarICS({ dayDate: state.dayDate, time: state.time, service: state.service })

  return (
    <div className="py-2 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rojo/10 text-rojo dark:bg-rojo/20">
        <CheckCircle2 size={36} />
      </div>
      <h3 className="text-[1.3rem] uppercase text-azul dark:text-navy-text">¡Turno confirmado!</h3>
      <p className="mx-auto mt-2 max-w-[38ch] text-[0.95rem] text-tinta-suave dark:text-navy-soft">
        Te esperamos el <strong className="text-azul dark:text-navy-text">{state.day}</strong> a las{' '}
        <strong className="text-azul dark:text-navy-text">{state.time}</strong> para tu {state.service?.toLowerCase()}.
      </p>

      <div className="mx-auto mt-6 flex max-w-[320px] flex-col gap-3">
        <a href={state.confirmado?.whatsappUrl} target="_blank" rel="noopener" className="btn-primary w-full justify-center">
          <MessageCircle size={18} />
          Volver a abrir WhatsApp
        </a>
        <a href={icsHref} download="turno-cuervo-peluqueria.ics" className="btn-ghost w-full justify-center">
          <CalendarPlus size={18} />
          Agregar a mi calendario
        </a>
        <button
          type="button"
          onClick={reiniciar}
          className="mt-1 text-[0.85rem] font-semibold text-tinta-suave underline-offset-2 hover:text-rojo hover:underline dark:text-navy-soft"
        >
          Reservar otro turno
        </button>
      </div>
    </div>
  )
}
