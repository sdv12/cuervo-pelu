import { useState } from 'react'
import bookingService from '../../services/bookingService'

function Sello({ lleno }) {
  return (
    <div className={`flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-[1.5px]
      ${lleno ? 'border-rojo border-solid bg-rojo/[0.06]' : 'border-dashed border-linea dark:border-navy-border'}`}
    >
      {lleno && (
        <svg viewBox="0 0 24 24" fill="#A32638" className="h-5 w-5">
          <path d="M8 20c4-10 12-18 24-18-8 4-14 10-16 18-2-1-6-1-8 0z" transform="scale(0.5) translate(4,4)" />
        </svg>
      )}
    </div>
  )
}

export default function FidelityCard() {
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null) // { encontrado, nombre, cortesCount }

  async function buscar() {
    if (!telefono.trim()) return
    setLoading(true)
    const cliente = await bookingService.getCliente(telefono.trim())
    setLoading(false)
    setResultado(cliente
      ? { encontrado: true, nombre: cliente.nombre, cortesCount: cliente.cortes_count }
      : { encontrado: false })
  }

  const cortesCount = resultado?.encontrado ? resultado.cortesCount : 0
  const sellosLlenos = cortesCount > 0 && cortesCount % 5 === 0 ? 5 : cortesCount % 5

  let titulo = 'Consultá tu tarjeta'
  let mensaje = 'Ingresá el teléfono con el que reservás para ver cuántos cortes llevás.'
  if (loading) {
    mensaje = 'Buscando tu tarjeta...'
  } else if (resultado && !resultado.encontrado) {
    titulo = 'Todavía no tenés tarjeta'
    mensaje = 'Reservá tu primer turno y arrancamos a contar tus cortes.'
  } else if (resultado?.encontrado) {
    const enCiclo = sellosLlenos
    titulo = cortesCount > 0 && enCiclo === 5
      ? `${resultado.nombre}, tu próximo corte va con 20% off`
      : `${resultado.nombre}, vas ${enCiclo} de 5`
    mensaje = cortesCount > 0 && enCiclo === 5
      ? 'Completaste el ciclo de 5 cortes.'
      : 'Cada 5 cortes, el sexto va con 20% off.'
  }

  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[72px]">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch]">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Tarjeta de fidelidad</h2>
          <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
            Cada 5 cortes, el sexto va con 20% off. Por ahora la llevamos a mano en el local — contanos cuántos
            cortes ya te hiciste y te los anotamos.
          </p>
        </div>
        <div className="flex flex-col gap-6 rounded-2xl border-[1.5px] border-dashed border-linea bg-panel px-5 py-6 dark:border-navy-border dark:bg-navy-card sm:flex-row sm:flex-wrap sm:items-center sm:gap-7 sm:px-7 sm:py-7">
          <div className="flex justify-center gap-2.5 sm:justify-start" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => <Sello key={i} lleno={i < sellosLlenos} />)}
          </div>
          <div className="min-w-[220px] flex-1">
            <h3 className="mb-2 text-[1.1rem] uppercase text-azul dark:text-navy-text sm:text-[1.15rem]">{titulo}</h3>
            <p className="m-0 max-w-[48ch] text-[0.95rem] text-tinta-suave dark:text-navy-soft">{mensaje}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <input
                type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
                placeholder="Tu teléfono"
                className="min-w-[160px] flex-1 rounded-lg border-[1.5px] border-linea bg-white px-3.5 py-3 text-base
                           focus:border-rojo dark:border-navy-border dark:bg-navy dark:text-navy-text"
              />
              <button type="button" className="btn-ghost btn-small w-full justify-center sm:w-auto" disabled={loading} onClick={buscar}>
                Ver mi tarjeta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
