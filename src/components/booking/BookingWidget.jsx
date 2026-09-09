import { useEffect } from 'react'
import { BookingProvider, useBooking } from '../../context/BookingContext'
import StepsBar from './StepsBar'
import Step1Service from './Step1Service'
import Step2Day from './Step2Day'
import Step3Time from './Step3Time'
import Step4Details from './Step4Details'
import BookingSuccess from './BookingSuccess'

const STEPS = { 1: Step1Service, 2: Step2Day, 3: Step3Time, 4: Step4Details }

function CuposNote() {
  const { state, actualizarCupos } = useBooking()

  useEffect(() => { actualizarCupos() }, [actualizarCupos])

  const texto = state.cuposRestantes === null
    ? 'Calculando disponibilidad...'
    : state.cuposRestantes > 0
      ? state.cuposRestantes === 1
        ? 'Queda 1 turno con descuento de bienvenida esta semana'
        : `Quedan ${state.cuposRestantes} turnos con descuento de bienvenida esta semana`
      : 'Esta semana ya no quedan turnos con descuento de bienvenida'

  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-[0.83rem] font-medium text-[#C7CEDB] sm:mt-3.5 sm:bg-transparent sm:px-0 sm:py-0 sm:text-[0.85rem]">
      <span className="h-[7px] w-[7px] flex-shrink-0 rounded-full bg-rojo" />
      {texto}
    </div>
  )
}

function TicketBody() {
  const { state } = useBooking()
  const StepComponent = STEPS[state.step]

  return (
    <div className="relative rounded-2xl bg-hueso text-tinta shadow-[0_18px_40px_rgba(0,0,0,0.28)] dark:bg-navy-card dark:text-navy-text sm:rounded-[18px]">
      <span className="ticket-notch -left-3.5" />
      <span className="ticket-notch -right-3.5" />
      {!state.confirmado && <StepsBar />}
      <div className="p-5 sm:p-7">
        {state.confirmado ? <BookingSuccess /> : <StepComponent />}
      </div>
    </div>
  )
}

export default function BookingWidget() {
  return (
    <section className="scroll-mt-16 bg-azul px-5 py-14 text-hueso dark:bg-navy sm:scroll-mt-[76px] sm:px-6 sm:py-[72px]" id="turnos">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-6 max-w-[56ch] sm:mb-8">
          <h2 className="text-[clamp(1.7rem,7vw,2.5rem)] uppercase text-hueso">Reservá tu turno</h2>
          <p className="mt-2.5 text-[#C7CEDB]">
            Cuatro pasos y listo — al final te llevamos a WhatsApp con todo ya escrito.
          </p>
        </div>
        <BookingProvider>
          <CuposNote />
          <div className="mt-6 sm:mt-8">
            <TicketBody />
          </div>
        </BookingProvider>
      </div>
    </section>
  )
}
