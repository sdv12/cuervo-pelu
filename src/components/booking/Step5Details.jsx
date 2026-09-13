import { useState } from 'react'
import { useBooking } from '../../context/BookingContext'
import { useAuth } from '../../context/AuthContext'
import { WHATSAPP_NUMBER } from '../../config/contact'
import { CUALQUIERA } from '../../services/bookingService'
import { formatearPrecio, etiquetaRol } from '../../utils/formato'

export default function Step5Details() {
  const { state, irAPaso, confirmarTurno } = useBooking()
  const { perfil } = useAuth()
  const [nombre, setNombre] = useState(perfil?.nombre || '')
  const [telefono, setTelefono] = useState(perfil?.telefono || '')
  const [error, setError] = useState(null)

  const barberoElegido = state.barberoId !== CUALQUIERA
    ? state.staff.find(s => s.id === state.barberoId)
    : null

  function handleConfirmar() {
    if (!nombre.trim()) { setError('nombre'); return }
    if (!telefono.trim()) { setError('telefono'); return }
    setError(null)

    const nombreFinal = nombre.trim()
    const telefonoFinal = telefono.trim()
    const lineaBarbero = barberoElegido
      ? `Con: ${barberoElegido.nombre} (${etiquetaRol(barberoElegido.rol)})\n`
      : ''
    const mensaje =
`Hola! Quiero reservar un turno en Cuervo Peluquería.
Servicio: ${state.service} (${formatearPrecio(state.price)})
${lineaBarbero}Día: ${state.day}
Hora: ${state.time}
Nombre: ${nombreFinal}
Teléfono: ${telefonoFinal}`
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`

    // Abrimos WhatsApp ya, en el mismo tick del click: si esperamos a que
    // termine el guardado, Safari/iOS deja de contarlo como interacción
    // directa del usuario y bloquea la ventana como popup.
    window.open(whatsappUrl, '_blank')

    confirmarTurno({ nombre: nombreFinal, telefono: telefonoFinal, whatsappUrl })
  }

  return (
    <div>
      <h3 className="mb-4 text-[1.2rem] uppercase text-azul dark:text-navy-text">Tus datos</h3>

      <div className="mb-3.5">
        <label htmlFor="nombre" className="mb-1.5 block text-[0.85rem] font-semibold text-tinta-suave dark:text-navy-soft">
          Nombre
        </label>
        <input
          id="nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)}
          placeholder="¿Cómo te llamás?"
          className={`w-full rounded-lg border-[1.5px] bg-white px-3.5 py-3 text-base focus:border-rojo
                      dark:bg-navy-card dark:text-navy-text ${error === 'nombre' ? 'border-rojo' : 'border-linea dark:border-navy-border'}`}
        />
      </div>
      <div className="mb-3.5">
        <label htmlFor="telefono" className="mb-1.5 block text-[0.85rem] font-semibold text-tinta-suave dark:text-navy-soft">
          Tu teléfono
        </label>
        <input
          id="telefono" type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
          placeholder="Para tu tarjeta de fidelidad y avisos"
          className={`w-full rounded-lg border-[1.5px] bg-white px-3.5 py-3 text-base focus:border-rojo
                      dark:bg-navy-card dark:text-navy-text ${error === 'telefono' ? 'border-rojo' : 'border-linea dark:border-navy-border'}`}
        />
      </div>

      <div className="mt-4 border-t border-dashed border-linea pt-4 text-[0.88rem] text-tinta-suave dark:border-navy-border dark:text-navy-soft">
        <strong className="text-azul dark:text-navy-text">{state.service}</strong> · {state.day} a las{' '}
        <strong className="text-azul dark:text-navy-text">{state.time}</strong> · {formatearPrecio(state.price)}
        {barberoElegido && (
          <>
            {' '}· Con <strong className="text-azul dark:text-navy-text">{barberoElegido.nombre}</strong>
          </>
        )}
      </div>

      {state.saveError && (
        <p className="mt-3 rounded-lg bg-rojo/10 px-3 py-2 text-[0.85rem] font-semibold text-rojo">
          {state.saveError === 'ocupado'
            ? 'Uy, ese horario se ocupó recién. Volvé atrás y elegí otro.'
            : 'No pudimos guardar el turno. Probá de nuevo en un momento.'}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-5.5 sm:flex-row sm:justify-between">
        <button type="button" className="btn-ghost btn-small w-full justify-center sm:w-auto" onClick={() => irAPaso(4)}>
          Atrás
        </button>
        <button
          type="button"
          className="btn-primary w-full justify-center sm:w-auto"
          disabled={state.saving}
          onClick={handleConfirmar}
        >
          {state.saving ? 'Guardando turno...' : 'Confirmar por WhatsApp'}
        </button>
      </div>
    </div>
  )
}
