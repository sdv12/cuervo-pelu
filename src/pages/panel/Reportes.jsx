import { useState, useEffect } from 'react'
import { panelService } from '../../services/panelService'
import { rangoDia, rangoSemana, rangoMes } from '../../utils/rangos'
import { formatearPrecio } from '../../utils/formato'

const PERIODOS = [
  { id: 'dia', label: 'Hoy', rango: rangoDia },
  { id: 'semana', label: 'Semana', rango: rangoSemana },
  { id: 'mes', label: 'Mes', rango: rangoMes },
]

export default function Reportes() {
  const [periodo, setPeriodo] = useState('dia')
  const [turnos, setTurnos] = useState([])
  const [consumos, setConsumos] = useState([])
  const [cargando, setCargando] = useState(true)

  const rango = PERIODOS.find(p => p.id === periodo).rango()

  useEffect(() => {
    let vivo = true
    setCargando(true)
    Promise.all([
      panelService.getCompletados({ desde: rango.desde, hasta: rango.hasta }),
      panelService.getConsumos({ desde: rango.desde, hasta: rango.hasta }),
    ])
      .then(([t, c]) => { if (vivo) { setTurnos(t); setConsumos(c) } })
      .catch(() => { if (vivo) { setTurnos([]); setConsumos([]) } })
      .finally(() => { if (vivo) setCargando(false) })
    return () => { vivo = false }
  }, [periodo, rango.desde, rango.hasta])

  const totalCortes = turnos.reduce((s, t) => s + t.precio, 0)
  const totalProductos = consumos.reduce((s, c) => s + c.precio * c.cantidad, 0)
  const total = totalCortes + totalProductos
  const totalEfectivo = turnos.filter(t => t.metodo_pago === 'efectivo').reduce((s, t) => s + t.precio, 0)
  const totalMercadoPago = turnos.filter(t => t.metodo_pago === 'mercado_pago').reduce((s, t) => s + t.precio, 0)

  const porServicio = agrupar(turnos, t => t.servicio)
  const porDia = agrupar(turnos, t => t.fecha)
  const porProducto = agruparProductos(consumos)

  return (
    <div>
      <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Reportes</h1>

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
            <Tarjeta titulo="Clientes atendidos" valor={turnos.length} />
            <Tarjeta titulo="Total cobrado" valor={formatearPrecio(total)} />
          </div>

          <Seccion titulo="Cortes por método de pago">
            <Fila a="Efectivo" b="" c={formatearPrecio(totalEfectivo)} />
            <Fila a="Mercado Pago" b="" c={formatearPrecio(totalMercadoPago)} />
          </Seccion>

          <Seccion titulo="Por servicio">
            {porServicio.length === 0 && <Vacio />}
            {porServicio.map(([serv, x]) => (
              <Fila key={serv} a={serv} b={`${x.count} corte${x.count === 1 ? '' : 's'}`} c={formatearPrecio(x.monto)} />
            ))}
          </Seccion>

          <Seccion titulo="Productos vendidos">
            {porProducto.length === 0 && <Vacio />}
            {porProducto.map(([prod, x]) => (
              <Fila key={prod} a={prod} b={`${x.count} unidad${x.count === 1 ? '' : 'es'}`} c={formatearPrecio(x.monto)} />
            ))}
          </Seccion>

          {periodo !== 'dia' && (
            <Seccion titulo="Por día">
              {porDia.length === 0 && <Vacio />}
              {porDia.map(([f, x]) => (
                <Fila key={f}
                  a={new Date(f + 'T00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  b={`${x.count} corte${x.count === 1 ? '' : 's'}`} c={formatearPrecio(x.monto)} />
              ))}
            </Seccion>
          )}

          <Seccion titulo="Detalle de cada corte">
            {turnos.length === 0 && <Vacio />}
            {turnos.map(t => (
              <Fila key={t.id}
                a={`${new Date(t.fecha + 'T00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })} ${String(t.hora).slice(0, 5)} · ${t.cliente_nombre}`}
                b={t.servicio} c={formatearPrecio(t.precio)} />
            ))}
          </Seccion>
        </>
      )}
    </div>
  )
}

function agrupar(turnos, clave) {
  const m = {}
  for (const t of turnos) {
    const k = clave(t)
    m[k] = m[k] || { count: 0, monto: 0 }
    m[k].count++
    m[k].monto += t.precio
  }
  return Object.entries(m).sort((a, b) => (typeof a[0] === 'string' && a[0].includes('-') ? a[0].localeCompare(b[0]) : b[1].monto - a[1].monto))
}

function agruparProductos(consumos) {
  const m = {}
  for (const c of consumos) {
    m[c.producto_nombre] = m[c.producto_nombre] || { count: 0, monto: 0 }
    m[c.producto_nombre].count += c.cantidad
    m[c.producto_nombre].monto += c.precio * c.cantidad
  }
  return Object.entries(m).sort((a, b) => b[1].monto - a[1].monto)
}

function Tarjeta({ titulo, valor }) {
  return (
    <div className="rounded-xl border border-linea bg-white p-4 dark:border-navy-border dark:bg-navy-card">
      <p className="text-[0.7rem] uppercase tracking-wide text-tinta-suave dark:text-navy-soft">{titulo}</p>
      <p className="mt-1 font-display text-[1.6rem] text-azul dark:text-navy-text">{valor}</p>
    </div>
  )
}
function Seccion({ titulo, children }) {
  return (
    <div className="mt-5">
      <h2 className="mb-1.5 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">{titulo}</h2>
      <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">{children}</div>
    </div>
  )
}
function Fila({ a, b, c }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-linea/60 px-3 py-2 text-[0.85rem] last:border-0 dark:border-navy-border/60">
      <span className="min-w-0 flex-1 truncate text-azul dark:text-navy-text">{a}</span>
      <span className="whitespace-nowrap text-tinta-suave dark:text-navy-soft">{b}</span>
      <span className="whitespace-nowrap font-semibold text-azul dark:text-navy-text">{c}</span>
    </div>
  )
}
function Vacio() {
  return <div className="px-3 py-6 text-center text-[0.85rem] text-tinta-suave dark:text-navy-soft">Sin cortes completados en este período.</div>
}
