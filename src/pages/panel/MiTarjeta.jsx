import { useState, useEffect, useCallback } from 'react'
import { CalendarPlus, X, Zap, MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { panelService } from '../../services/panelService'
import { BookingProvider } from '../../context/BookingContext'
import BookingWidget from '../../components/booking/BookingWidget'
import bookingService from '../../services/bookingService'
import { getProximosDiasHabiles, getHorariosDelDia, pasoPorRol } from '../../utils/businessDays'
import { WHATSAPP_NUMBER } from '../../config/contact'
import { formatearPrecio } from '../../utils/formato'

const ESTADO_STYLE = {
  confirmado: 'bg-azul/10 text-azul dark:bg-navy-soft/20 dark:text-navy-text',
  completado: 'bg-green-500/15 text-green-700 dark:text-green-400',
  cancelado: 'bg-rojo/10 text-rojo',
}

const METODO_LABEL = { efectivo: 'Efectivo', mercado_pago: 'Transferencia' }

export default function MiTarjeta() {
  const { usuario, perfil } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [consumosPorTurno, setConsumosPorTurno] = useState({})
  const [ficha, setFicha] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [reservando, setReservando] = useState(false)

  const cargar = useCallback(async () => {
    const { data: ts } = await supabase.from('turnos').select('*')
      .eq('perfil_id', usuario.id).order('fecha', { ascending: false }).order('hora', { ascending: false })
    let f = null
    if (perfil?.telefono) {
      const { data } = await supabase.rpc('sellos_por_telefono', { tel: perfil.telefono })
      f = data?.[0] || null
    }
    const consumos = await panelService.getConsumosPorTurnos((ts || []).map(t => t.id)).catch(() => [])
    const agrupado = {}
    for (const c of consumos) {
      agrupado[c.turno_id] = agrupado[c.turno_id] || []
      agrupado[c.turno_id].push(c)
    }
    setTurnos(ts || []); setFicha(f); setConsumosPorTurno(agrupado); setCargando(false)
  }, [usuario.id, perfil?.telefono])

  useEffect(() => { cargar() }, [cargar])

  // Realtime: si reserva un turno nuevo (o el staff lo actualiza), la lista se actualiza sola.
  useEffect(() => panelService.suscribirTurnos(() => cargar()), [cargar])

  const cortes = ficha?.cortes_count ?? 0
  const sellos = cortes > 0 && cortes % 5 === 0 ? 5 : cortes % 5
  const ultimoCorte = turnos.find(t => t.estado === 'completado')

  if (cargando) return <p className="loading-note">Cargando tu info...</p>

  return (
    <div>
      <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Mi tarjeta</h1>

      <div className="mt-4 rounded-2xl border-[1.5px] border-dashed border-linea bg-panel p-6 dark:border-navy-border dark:bg-navy-card">
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${i < sellos ? 'border-rojo' : 'border-dashed border-linea dark:border-navy-border'}`}>
              <img src="/logo-cuervo.webp" alt="" className={`h-full w-full rounded-full object-cover object-top ${i < sellos ? '' : 'opacity-15 grayscale'}`} />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-[38ch] text-center text-[0.9rem] text-tinta-suave dark:text-navy-soft">
          {perfil?.telefono
            ? `Vas ${sellos} de 5. Cada 5 cortes, el sexto va con 20% off.`
            : 'Cargá tu teléfono en el perfil para asociar tu tarjeta de fidelidad (por ahora se lleva por número).'}
        </p>
      </div>

      {ultimoCorte && (
        <TurnoExpress
          ultimoCorte={ultimoCorte}
          perfil={perfil}
          onReservado={() => { setReservando(false); cargar() }}
        />
      )}

      <div className="mb-2 mt-6 flex items-center justify-between gap-2">
        <h2 className="text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">Mis turnos</h2>
        <button
          type="button"
          onClick={() => setReservando(r => !r)}
          className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-rojo hover:underline"
        >
          {reservando ? <><X size={14} /> Cerrar</> : <><CalendarPlus size={14} /> Reservar turno</>}
        </button>
      </div>

      {reservando && (
        <div className="mb-5 overflow-hidden rounded-2xl">
          <BookingProvider>
            <BookingWidget />
          </BookingProvider>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
        {turnos.length === 0 && (
          <div className="px-3 py-8 text-center text-[0.85rem] text-tinta-suave dark:text-navy-soft">
            Todavía no reservaste ningún turno con esta cuenta.
          </div>
        )}
        {turnos.map(t => {
          const extras = consumosPorTurno[t.id] || []
          return (
            <div key={t.id} className="flex items-center justify-between gap-3 border-b border-linea/60 px-3 py-2.5 text-[0.85rem] last:border-0 dark:border-navy-border/60">
              <span className="text-azul dark:text-navy-text">
                {new Date(t.fecha + 'T00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · {String(t.hora).slice(0, 5)}
                <span className="block text-[0.75rem] text-tinta-suave dark:text-navy-soft">
                  {t.servicio} · {formatearPrecio(t.precio)}
                  {t.estado === 'completado' && t.metodo_pago && ` · pagó con ${METODO_LABEL[t.metodo_pago]}`}
                </span>
                {extras.length > 0 && (
                  <span className="block text-[0.75rem] text-tinta-suave dark:text-navy-soft">
                    + {extras.map(c => `${c.cantidad}x ${c.producto_nombre}`).join(', ')}
                  </span>
                )}
              </span>
              <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[0.7rem] font-bold uppercase ${ESTADO_STYLE[t.estado]}`}>
                {t.estado}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// "Repetime el último corte, con Cristian, lo antes posible" — sin pasar
// por el wizard: busca el próximo horario libre de Cristian y reserva
// directo con un toque.
function TurnoExpress({ ultimoCorte, perfil, onReservado }) {
  const [estado, setEstado] = useState('inicial') // inicial | buscando | encontrado | sin_cupo | reservando | error
  const [propuesta, setPropuesta] = useState(null) // { dia, hora, cristian, servicio, precio }

  async function buscar() {
    setEstado('buscando')
    try {
      const staff = await bookingService.getStaff()
      const cristian = staff.find(s => s.rol === 'admin')
      if (!cristian) { setEstado('sin_cupo'); return }

      const servicios = await bookingService.getServicios()
      // Si el servicio de aquel corte ya no existe tal cual (cambió de
      // nombre o se dio de baja), repetimos el destacado del catálogo
      // actual en vez de arrastrar un precio viejo.
      const vigente = servicios.find(s => s.nombre === ultimoCorte.servicio)
        || servicios.find(s => s.destacado) || servicios[0]
      if (!vigente) { setEstado('sin_cupo'); return }
      const { nombre: servicio, precio } = vigente

      const paso = pasoPorRol(cristian.rol)
      for (const dia of getProximosDiasHabiles(7)) {
        const ocupados = await bookingService.getHorariosOcupados(dia.iso, cristian.id)
        const horaActual = dia.nombreDia === 'Hoy' ? new Date().toTimeString().slice(0, 5) : null
        const libre = getHorariosDelDia(dia.fecha, paso).find(h => !ocupados.includes(h) && (!horaActual || h > horaActual))
        if (libre) {
          setPropuesta({ dia, hora: libre, cristian, servicio, precio })
          setEstado('encontrado')
          return
        }
      }
      setEstado('sin_cupo')
    } catch {
      setEstado('error')
    }
  }

  async function confirmar() {
    setEstado('reservando')
    try {
      const res = await bookingService.guardarTurno({
        fecha: propuesta.dia.iso, hora: propuesta.hora, servicio: propuesta.servicio, precio: propuesta.precio,
        nombre: perfil.nombre, telefono: perfil.telefono, barberoId: propuesta.cristian.id,
      })
      if (!res.ok) { setEstado('sin_cupo'); return }
      const mensaje = `Hola! Reservé por Turno Express: ${propuesta.servicio} con Cristian el ${propuesta.dia.label} a las ${propuesta.hora}.`
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank')
      onReservado()
    } catch {
      setEstado('error')
    }
  }

  return (
    <div className="mt-6 rounded-2xl border-[1.5px] border-dashed border-rojo/50 bg-rojo/[0.04] p-5 dark:bg-rojo/10">
      <h2 className="flex items-center gap-1.5 text-[0.98rem] font-semibold text-azul dark:text-navy-text">
        <Zap size={17} className="text-rojo" /> Turno Express
      </h2>
      <p className="mt-1 text-[0.85rem] text-tinta-suave dark:text-navy-soft">
        Repetí tu último corte ({ultimoCorte.servicio}) con Cristian, en el horario más próximo que haya libre.
      </p>

      {estado === 'inicial' && (
        <button type="button" className="btn-primary btn-small mt-3" onClick={buscar}>
          Buscar el próximo libre
        </button>
      )}
      {estado === 'buscando' && <p className="loading-note mt-3">Buscando el próximo horario con Cristian...</p>}
      {estado === 'sin_cupo' && (
        <p className="mt-3 text-[0.85rem] font-semibold text-rojo">No encontramos un horario libre con Cristian en los próximos días. Probá reservar manualmente.</p>
      )}
      {estado === 'error' && (
        <p className="mt-3 text-[0.85rem] font-semibold text-rojo">No pudimos buscar un turno ahora. Probá de nuevo en un momento.</p>
      )}
      {(estado === 'encontrado' || estado === 'reservando') && propuesta && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-white px-4 py-3 dark:bg-navy-card">
          <div>
            <strong className="block text-[0.95rem] text-azul dark:text-navy-text">
              {propuesta.dia.label} a las {propuesta.hora}
            </strong>
            <span className="text-[0.82rem] text-tinta-suave dark:text-navy-soft">
              {propuesta.servicio} · {formatearPrecio(propuesta.precio)} · con Cristian
            </span>
          </div>
          <button
            type="button"
            disabled={estado === 'reservando'}
            onClick={confirmar}
            className="btn-primary btn-small ml-auto"
          >
            <MessageCircle size={15} /> {estado === 'reservando' ? 'Reservando...' : 'Confirmar por WhatsApp'}
          </button>
        </div>
      )}
    </div>
  )
}
