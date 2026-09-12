import { useState, useEffect } from 'react'
import { DollarSign, Tag, XCircle, UserPlus, ShoppingBag } from 'lucide-react'
import { panelService } from '../../services/panelService'
import { rangoDia, rangoSemana, rangoMes } from '../../utils/rangos'
import { formatearPrecio } from '../../utils/formato'

const PERIODOS = [
  { id: 'dia', label: 'Hoy', rango: rangoDia },
  { id: 'semana', label: 'Semana', rango: rangoSemana },
  { id: 'mes', label: 'Mes', rango: rangoMes },
]

const TIPOS = {
  precio_servicio: { icono: Tag, label: 'Precio de corte', color: 'text-azul dark:text-navy-text' },
  precio_producto: { icono: Tag, label: 'Precio de producto', color: 'text-azul dark:text-navy-text' },
  cancelacion: { icono: XCircle, label: 'Cancelación', color: 'text-rojo' },
  cliente_nuevo: { icono: UserPlus, label: 'Cliente nuevo', color: 'text-green-600 dark:text-green-400' },
  venta_producto: { icono: ShoppingBag, label: 'Venta de producto', color: 'text-dorado' },
}

export default function Actividad() {
  const [periodo, setPeriodo] = useState('dia')
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)

  const rango = PERIODOS.find(p => p.id === periodo).rango()

  useEffect(() => {
    let vivo = true
    setCargando(true)
    panelService.getActividad({ desde: rango.desde, hasta: rango.hasta })
      .then(d => { if (vivo) setEventos(d) })
      .catch(() => { if (vivo) setEventos([]) })
      .finally(() => { if (vivo) setCargando(false) })
    return () => { vivo = false }
  }, [periodo, rango.desde, rango.hasta])

  const ventas = eventos.filter(e => e.tipo === 'venta_producto')
  const cancelaciones = eventos.filter(e => e.tipo === 'cancelacion')
  const clientesNuevos = eventos.filter(e => e.tipo === 'cliente_nuevo')
  const cambiosPrecio = eventos.filter(e => e.tipo === 'precio_servicio' || e.tipo === 'precio_producto')
  const totalVentas = ventas.reduce((s, e) => s + (e.monto || 0), 0)
  const totalPerdidoCancelaciones = cancelaciones.reduce((s, e) => s + (e.monto || 0), 0)

  return (
    <div>
      <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Actividad</h1>
      <p className="mt-1 text-[0.82rem] text-tinta-suave dark:text-navy-soft">
        Registro de cambios y movimientos — solo vos podés ver esto.
      </p>

      <div className="mt-3 flex gap-1 rounded-lg bg-panel p-1 dark:bg-navy-card">
        {PERIODOS.map(p => (
          <button key={p.id} onClick={() => setPeriodo(p.id)}
            className={`flex-1 rounded-md py-2 text-[0.82rem] font-semibold transition-colors
              ${periodo === p.id ? 'bg-rojo text-white' : 'text-tinta-suave dark:text-navy-soft'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[0.8rem] capitalize text-tinta-suave dark:text-navy-soft">{rango.etiqueta}</p>

      {cargando ? (
        <p className="loading-note">Calculando...</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Tarjeta icono={DollarSign} titulo="Vendido en productos" valor={formatearPrecio(totalVentas)} />
            <Tarjeta icono={XCircle} titulo="Cancelaciones" valor={cancelaciones.length} sub={totalPerdidoCancelaciones ? `${formatearPrecio(totalPerdidoCancelaciones)} no facturados` : null} />
            <Tarjeta icono={UserPlus} titulo="Clientes nuevos" valor={clientesNuevos.length} />
            <Tarjeta icono={Tag} titulo="Cambios de precio" valor={cambiosPrecio.length} />
          </div>

          <h2 className="mb-1.5 mt-6 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
            Historial del período
          </h2>
          <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
            {eventos.length === 0 && (
              <div className="px-3 py-6 text-center text-[0.85rem] text-tinta-suave dark:text-navy-soft">Sin movimientos en este período.</div>
            )}
            {eventos.map(e => {
              const info = TIPOS[e.tipo] || { icono: Tag, label: e.tipo, color: 'text-tinta-suave' }
              const Icono = info.icono
              return (
                <div key={e.id} className="flex items-start gap-2.5 border-b border-linea/60 px-3 py-2.5 text-[0.85rem] last:border-0 dark:border-navy-border/60">
                  <Icono size={16} className={`mt-0.5 flex-shrink-0 ${info.color}`} />
                  <div className="min-w-0 flex-1">
                    <span className="block text-azul dark:text-navy-text">{e.descripcion}</span>
                    <span className="text-[0.72rem] text-tinta-suave dark:text-navy-soft">
                      {new Date(e.created_at).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      {' · '}{e.perfil_nombre}
                    </span>
                  </div>
                  {e.monto != null && (
                    <span className={`whitespace-nowrap font-semibold ${info.color}`}>{formatearPrecio(e.monto)}</span>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function Tarjeta({ icono: Icono, titulo, valor, sub }) {
  return (
    <div className="rounded-xl border border-linea bg-white p-4 dark:border-navy-border dark:bg-navy-card">
      <p className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
        <Icono size={13} /> {titulo}
      </p>
      <p className="mt-1 font-display text-[1.6rem] text-azul dark:text-navy-text">{valor}</p>
      {sub && <p className="text-[0.72rem] text-tinta-suave dark:text-navy-soft">{sub}</p>}
    </div>
  )
}
