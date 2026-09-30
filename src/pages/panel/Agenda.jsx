import { useState, useEffect, useCallback } from 'react'
import { Check, X, RotateCcw, Banknote, CreditCard, UserPlus } from 'lucide-react'
import { panelService } from '../../services/panelService'
import bookingService from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'
import { fechaISO, getHorariosDelDia } from '../../utils/businessDays'
import { formatearPrecio } from '../../utils/formato'

const ESTADO_STYLE = {
  confirmado: 'bg-azul/10 text-azul dark:bg-navy-soft/20 dark:text-navy-text',
  completado: 'bg-green-500/15 text-green-700 dark:text-green-400',
  cancelado: 'bg-rojo/10 text-rojo',
}

const METODO_LABEL = { efectivo: 'Efectivo', mercado_pago: 'Mercado Pago' }
const INPUT = 'rounded-lg border-[1.5px] border-linea bg-white px-3 py-2 text-base dark:border-navy-border dark:bg-navy dark:text-navy-text'

export default function Agenda() {
  const { usuario } = useAuth()
  const [fecha, setFecha] = useState(fechaISO(new Date()))
  const [turnos, setTurnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [confirmandoId, setConfirmandoId] = useState(null) // turno esperando que se elija método de pago
  const [turnoRapido, setTurnoRapido] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      setTurnos(await panelService.getTurnos({ desde: fecha, hasta: fecha, incluirCancelados: true }))
    } catch {
      setTurnos([])
    } finally {
      setCargando(false)
    }
  }, [fecha])

  useEffect(() => { cargar() }, [cargar])

  // Realtime: cualquier cambio en turnos recarga la agenda
  useEffect(() => panelService.suscribirTurnos(() => cargar()), [cargar])

  async function cambiar(t, estado, metodoPago) {
    try {
      await panelService.marcarEstado(t.id, estado, usuario.id, metodoPago)
      setConfirmandoId(null)
      cargar()
    } catch (e) {
      alert('No se pudo actualizar: ' + (e.message || e))
    }
  }

  const activos = turnos.filter(t => t.estado !== 'cancelado')
  const cobrado = turnos.filter(t => t.estado === 'completado').reduce((s, t) => s + t.precio, 0)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Agenda</h1>
          <p className="text-[0.85rem] text-tinta-suave dark:text-navy-soft">
            {activos.length} turno{activos.length === 1 ? '' : 's'} · {formatearPrecio(cobrado)} cobrado
            <span className="ml-2 inline-flex items-center gap-1 text-green-600 dark:text-green-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /> en vivo
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date" value={fecha} onChange={e => setFecha(e.target.value)}
            className="rounded-lg border-[1.5px] border-linea bg-white px-3 py-2 text-[0.9rem] dark:border-navy-border dark:bg-navy-card dark:text-navy-text"
          />
          <button
            type="button"
            onClick={() => setTurnoRapido(v => !v)}
            className={`btn-small flex items-center gap-1.5 rounded-lg border-[1.5px] px-3 py-2 text-[0.85rem] font-semibold
              ${turnoRapido ? 'border-rojo bg-rojo/10 text-rojo' : 'border-linea text-azul dark:border-navy-border dark:text-navy-text'}`}
          >
            <UserPlus size={15} /> Turno rápido
          </button>
        </div>
      </div>

      {turnoRapido && (
        <TurnoRapido
          fecha={fecha}
          turnosDelDia={turnos}
          onCreado={() => { setTurnoRapido(false); cargar() }}
        />
      )}

      {cargando ? (
        <p className="loading-note">Cargando agenda...</p>
      ) : turnos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-linea px-4 py-10 text-center text-tinta-suave dark:border-navy-border dark:text-navy-soft">
          No hay turnos para este día.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] border-collapse text-[0.88rem]">
            <thead>
              <tr className="border-b border-linea text-left text-[0.72rem] uppercase tracking-wide text-tinta-suave dark:border-navy-border dark:text-navy-soft">
                <th className="py-2 pr-3">Hora</th>
                <th className="py-2 pr-3">Cliente</th>
                <th className="py-2 pr-3">Servicio</th>
                <th className="py-2 pr-3">Monto</th>
                <th className="py-2 pr-3">Estado</th>
                <th className="py-2 pr-3">Pago</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnos.map(t => (
                <tr key={t.id} className="border-b border-linea/60 dark:border-navy-border/60">
                  <td className="py-2.5 pr-3 font-semibold text-azul dark:text-navy-text">{String(t.hora).slice(0, 5)}</td>
                  <td className="py-2.5 pr-3">
                    {t.cliente_nombre}
                    <a href={`https://wa.me/${t.cliente_telefono}`} target="_blank" rel="noopener"
                      className="block text-[0.75rem] text-rojo dark:text-navy-accent">{t.cliente_telefono}</a>
                  </td>
                  <td className="py-2.5 pr-3">{t.servicio}</td>
                  <td className="py-2.5 pr-3">{formatearPrecio(t.precio)}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`rounded-full px-2 py-0.5 text-[0.7rem] font-bold uppercase ${ESTADO_STYLE[t.estado]}`}>
                      {t.estado}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-[0.8rem] text-tinta-suave dark:text-navy-soft">
                    {t.estado === 'completado' && t.metodo_pago ? METODO_LABEL[t.metodo_pago] : '—'}
                  </td>
                  <td className="py-2.5">
                    {confirmandoId === t.id ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[0.75rem] text-tinta-suave dark:text-navy-soft">¿Cómo pagó?</span>
                        <button onClick={() => cambiar(t, 'completado', 'efectivo')}
                          className="flex items-center gap-1 rounded-md bg-green-500/15 px-2 py-1 text-[0.78rem] font-semibold text-green-700 hover:bg-green-500/25 dark:text-green-400">
                          <Banknote size={13} /> Efectivo
                        </button>
                        <button onClick={() => cambiar(t, 'completado', 'mercado_pago')}
                          className="flex items-center gap-1 rounded-md bg-azul/10 px-2 py-1 text-[0.78rem] font-semibold text-azul dark:bg-navy-soft/20 dark:text-navy-text">
                          <CreditCard size={13} /> Mercado Pago
                        </button>
                        <button onClick={() => setConfirmandoId(null)} title="Cancelar"
                          className="rounded-md p-1 text-tinta-suave hover:bg-linea/40 dark:text-navy-soft">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        {t.estado === 'confirmado' ? (
                          <>
                            <button onClick={() => setConfirmandoId(t.id)} title="Marcar completado"
                              className="rounded-md bg-green-500/15 p-1.5 text-green-700 hover:bg-green-500/25 dark:text-green-400">
                              <Check size={15} />
                            </button>
                            <button onClick={() => cambiar(t, 'cancelado')} title="Cancelar"
                              className="rounded-md bg-rojo/10 p-1.5 text-rojo hover:bg-rojo/20">
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => cambiar(t, 'confirmado')} title="Volver a confirmado"
                            className="rounded-md bg-linea/40 p-1.5 text-tinta-suave hover:bg-linea/70 dark:bg-navy-border/40 dark:text-navy-soft">
                            <RotateCcw size={15} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Carga rápida de un turno para un cliente que llega sin haber reservado
// antes (walk-in) — pensado para que Cristian o el empleado lo completen
// en segundos, sin pasar por el wizard público ni por WhatsApp.
function TurnoRapido({ fecha, turnosDelDia, onCreado }) {
  const [servicios, setServicios] = useState([])
  const [staff, setStaff] = useState([])
  const [servicioId, setServicioId] = useState('')
  const [barberoId, setBarberoId] = useState('')
  const [hora, setHora] = useState('')
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [msg, setMsg] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    bookingService.getServicios().then(s => { setServicios(s); if (s.length) setServicioId(s[0].id) })
    bookingService.getStaff().then(s => { setStaff(s); if (s.length) setBarberoId(s[0].id) })
  }, [])

  const horariosDelDia = getHorariosDelDia(new Date(fecha + 'T00:00'))
  const ocupadosDeEseBarbero = turnosDelDia
    .filter(t => t.estado !== 'cancelado' && t.barbero_id === barberoId)
    .map(t => String(t.hora).slice(0, 5))
  const horariosLibres = horariosDelDia.filter(h => !ocupadosDeEseBarbero.includes(h))

  useEffect(() => {
    if (!horariosLibres.includes(hora)) setHora(horariosLibres[0] || '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberoId, fecha])

  async function crear(e) {
    e.preventDefault()
    const servicio = servicios.find(s => s.id === servicioId)
    if (!servicio || !hora || !nombre.trim() || !telefono.trim()) { setMsg({ tipo: 'error', txt: 'Completá todos los campos.' }); return }
    setMsg(null); setGuardando(true)
    try {
      await panelService.crearTurnoRapido({
        fecha, hora, servicio: servicio.nombre, precio: servicio.precio,
        barberoId, clienteNombre: nombre.trim(), clienteTelefono: telefono.trim(),
      })
      onCreado()
    } catch (e) {
      setMsg({ tipo: 'error', txt: e.message === 'duplicate key value violates unique constraint "turnos_slot_barbero_activo"'
        ? 'Ese horario ya se ocupó, elegí otro.' : e.message })
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={crear} className="mb-4 grid gap-2.5 rounded-xl border border-linea bg-white p-4 dark:border-navy-border dark:bg-navy-card sm:grid-cols-6">
      <h2 className="text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft sm:col-span-6">
        Turno rápido — cliente que llegó sin reservar
      </h2>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del cliente" className={`${INPUT} sm:col-span-2`} />
      <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" className={`${INPUT} sm:col-span-2`} />
      <select value={servicioId} onChange={e => setServicioId(e.target.value)} className={`${INPUT} sm:col-span-2`}>
        {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre} — {formatearPrecio(s.precio)}</option>)}
      </select>
      <select value={barberoId} onChange={e => setBarberoId(e.target.value)} className={`${INPUT} sm:col-span-3`}>
        {staff.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
      </select>
      <select value={hora} onChange={e => setHora(e.target.value)} className={`${INPUT} sm:col-span-3`}>
        {horariosLibres.length === 0 && <option value="">Sin horarios libres hoy</option>}
        {horariosLibres.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <button disabled={guardando || !horariosLibres.length} className="btn-primary btn-small justify-center sm:col-span-6">
        {guardando ? 'Guardando...' : 'Agregar a la agenda'}
      </button>
      {msg && <p className="text-[0.82rem] font-semibold text-rojo sm:col-span-6">{msg.txt}</p>}
    </form>
  )
}
