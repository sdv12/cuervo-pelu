import { CheckCircle2, XCircle, CalendarPlus, MessageCircle } from 'lucide-react'
import { useBooking } from '../../context/BookingContext'
import { generarICS } from '../../utils/ics'
import { WHATSAPP_NUMBER } from '../../config/contact'

function horasHastaElTurno(dayDate, time) {
  const [h, m] = time.split(':').map(Number)
  const fecha = new Date(dayDate)
  fecha.setHours(h, m, 0, 0)
  return (fecha.getTime() - Date.now()) / 3600000
}

export default function BookingSuccess() {
  const { state, reiniciar, cancelarTurno } = useBooking()

  if (state.confirmado?.cancelado) {
    return (
      <div className="py-2 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tinta-suave/10 text-tinta-suave dark:bg-navy-soft/10 dark:text-navy-soft">
          <XCircle size={36} />
        </div>
        <h3 className="text-[1.3rem] uppercase text-azul dark:text-navy-text">Turno cancelado</h3>
        <p className="mx-auto mt-2 max-w-[38ch] text-[0.95rem] text-tinta-suave dark:text-navy-soft">
          Liberamos tu horario del {state.day} a las {state.time}. Cuando quieras, reservá de nuevo.
        </p>
        <div className="mx-auto mt-6 max-w-[320px]">
          <button type="button" onClick={reiniciar} className="btn-primary w-full justify-center">
            Reservar otro turno
          </button>
        </div>
      </div>
    )
  }

  const icsHref = generarICS({ dayDate: state.dayDate, time: state.time, service: state.service })
  const horas = state.dayDate && state.time ? horasHastaElTurno(state.dayDate, state.time) : null
  const puedeCancelarSolo = horas === null || horas >= 2

  async function handleCancelar() {
    const mensaje =
`Hola! Quiero cancelar mi turno del ${state.day} a las ${state.time} (${state.service}).
Nombre: ${state.confirmado?.nombre || ''}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank')
    await cancelarTurno()
  }

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

      <div className="mx-auto mt-6 max-w-[360px] border-t border-dashed border-linea pt-5 dark:border-navy-border">
        <p className="text-[0.82rem] text-tinta-suave dark:text-navy-soft">
          ¿No podés venir? Avisanos con al menos <strong className="text-azul dark:text-navy-text">2 horas de anticipación</strong>.
        </p>
        {puedeCancelarSolo ? (
          <button
            type="button"
            onClick={handleCancelar}
            disabled={state.cancelando}
            className="mt-2 text-[0.85rem] font-semibold text-rojo underline-offset-2 hover:underline disabled:opacity-60"
          >
            {state.cancelando ? 'Cancelando...' : 'Cancelar turno'}
          </button>
        ) : (
          <p className="mt-2 text-[0.82rem] font-semibold text-rojo">
            Quedan menos de 2hs para tu turno — escribinos directo por WhatsApp para avisar.
          </p>
        )}
      </div>
    </div>
  )
}
