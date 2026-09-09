import { useState } from 'react'
import bookingService from '../../services/bookingService'

function Sello({ lleno, rotar }) {
  return (
    <div
      className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 transition-transform sm:h-16 sm:w-16
        ${lleno ? 'border-rojo' : 'border-dashed border-linea dark:border-navy-border'}`}
      style={lleno ? { transform: `rotate(${rotar}deg)` } : undefined}
    >
      <img
        src="/logo-cuervo.webp"
        alt=""
        aria-hidden="true"
        className={`h-full w-full rounded-full object-cover object-top transition-all duration-300
          ${lleno ? 'opacity-100' : 'opacity-15 grayscale'}`}
      />
      {lleno && <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-rojo/70" />}
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

  let titulo = 'Tu tarjeta de sellos'
  let mensaje = 'Consultá cuántos cortes ya llevás con tu teléfono.'
  if (loading) {
    mensaje = 'Buscando tu tarjeta...'
  } else if (resultado && !resultado.encontrado) {
    titulo = 'Todavía no tenés tarjeta'
    mensaje = 'Reservá tu primer turno y arrancamos a sellarla.'
  } else if (resultado?.encontrado) {
    const enCiclo = sellosLlenos
    titulo = cortesCount > 0 && enCiclo === 5
      ? `${resultado.nombre}, tu próximo corte va con 20% off`
      : `${resultado.nombre}, vas ${enCiclo} de 5`
    mensaje = cortesCount > 0 && enCiclo === 5
      ? 'Completaste el ciclo de 5 cortes.'
      : 'Cada 5 cortes, el sexto va con 20% off.'
  }

  const rotaciones = [-6, 4, -3, 5, -5]

  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[72px]">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch]">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Tarjeta de fidelidad</h2>
          <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
            Cada 5 cortes, el sexto va con 20% off. Cada corte suma un sello.
          </p>
        </div>

        <div className="relative rounded-2xl border-[1.5px] border-dashed border-linea bg-panel px-6 py-8 dark:border-navy-border dark:bg-navy-card sm:px-10">
          <span className="ticket-notch -left-3.5 bg-hueso dark:bg-navy" />
          <span className="ticket-notch -right-3.5 bg-hueso dark:bg-navy" />

          <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
            {Array.from({ length: 5 }, (_, i) => (
              <Sello key={i} lleno={i < sellosLlenos} rotar={rotaciones[i]} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-[1.1rem] uppercase text-azul dark:text-navy-text sm:text-[1.15rem]">{titulo}</h3>
            <p className="mx-auto mt-1 max-w-[42ch] text-[0.9rem] text-tinta-suave dark:text-navy-soft">{mensaje}</p>
          </div>

          <div className="mx-auto mt-6 flex max-w-[320px] items-center gap-2 border-t border-dashed border-linea pt-5 dark:border-navy-border">
            <input
              type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
              placeholder="Tu teléfono"
              className="min-w-0 flex-1 rounded-lg border-[1.5px] border-linea bg-white px-3 py-2.5 text-[0.9rem]
                         focus:border-rojo dark:border-navy-border dark:bg-navy dark:text-navy-text"
            />
            <button
              type="button"
              className="btn-ghost flex-shrink-0 px-4 py-2.5 text-[0.85rem]"
              disabled={loading}
              onClick={buscar}
            >
              Ver
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
