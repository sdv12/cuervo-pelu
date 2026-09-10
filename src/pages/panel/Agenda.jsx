import { useState, useEffect, useCallback } from 'react'
import { Check, X, RotateCcw } from 'lucide-react'
import { panelService } from '../../services/panelService'
import { useAuth } from '../../context/AuthContext'
import { fechaISO } from '../../utils/businessDays'
import { formatearPrecio } from '../../utils/formato'

const ESTADO_STYLE = {
  confirmado: 'bg-azul/10 text-azul dark:bg-navy-soft/20 dark:text-navy-text',
  completado: 'bg-green-500/15 text-green-700 dark:text-green-400',
  cancelado: 'bg-rojo/10 text-rojo',
}

export default function Agenda() {
  const { usuario } = useAuth()
  const [fecha, setFecha] = useState(fechaISO(new Date()))
  const [turnos, setTurnos] = useState([])
  const [cargando, setCargando] = useState(true)

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

  async function cambiar(t, estado) {
    try {
      await panelService.marcarEstado(t.id, estado, usuario.id)
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
        <input
          type="date" value={fecha} onChange={e => setFecha(e.target.value)}
          className="rounded-lg border-[1.5px] border-linea bg-white px-3 py-2 text-[0.9rem] dark:border-navy-border dark:bg-navy-card dark:text-navy-text"
        />
      </div>

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
                  <td className="py-2.5">
                    <div className="flex gap-1.5">
                      {t.estado === 'confirmado' ? (
                        <>
                          <button onClick={() => cambiar(t, 'completado')} title="Marcar completado"
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
