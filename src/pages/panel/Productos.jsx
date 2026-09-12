import { useState, useEffect } from 'react'
import { panelService } from '../../services/panelService'
import { useAuth } from '../../context/AuthContext'
import { formatearPrecio } from '../../utils/formato'

const INPUT = 'rounded-lg border-[1.5px] border-linea bg-white px-3 py-2 text-base dark:border-navy-border dark:bg-navy dark:text-navy-text'

export default function Productos() {
  const { esAdmin } = useAuth()
  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    setCargando(true)
    try {
      const [p, s] = await Promise.all([panelService.getProductosAdmin(), panelService.getServiciosAdmin()])
      setProductos(p); setServicios(s)
    } catch { setProductos([]); setServicios([]) }
    setCargando(false)
  }
  useEffect(() => { cargar() }, [])

  return (
    <div>
      <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Productos</h1>

      {cargando ? (
        <p className="loading-note">Cargando...</p>
      ) : (
        <>
          <VentaRapida productos={productos.filter(p => p.activo)} onVendido={cargar} />
          {esAdmin && (
            <>
              <PreciosServicios servicios={servicios} onCambio={cargar} />
              <PreciosProductos productos={productos} onCambio={cargar} />
            </>
          )}
        </>
      )}
    </div>
  )
}

function VentaRapida({ productos, onVendido }) {
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [clienteNombre, setClienteNombre] = useState('')
  const [msg, setMsg] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!productoId && productos.length) setProductoId(productos[0].id)
  }, [productos, productoId])

  async function vender(e) {
    e.preventDefault()
    const producto = productos.find(p => p.id === productoId)
    if (!producto) return
    setMsg(null); setGuardando(true)
    try {
      await panelService.registrarConsumo({
        productoId: producto.id, productoNombre: producto.nombre, precio: producto.precio,
        cantidad: Number(cantidad) || 1, clienteNombre: clienteNombre.trim(),
      })
      setMsg({ tipo: 'ok', txt: 'Venta registrada.' })
      setCantidad(1); setClienteNombre('')
      onVendido()
    } catch (e) {
      setMsg({ tipo: 'error', txt: e.message })
    }
    setGuardando(false)
  }

  return (
    <form onSubmit={vender} className="mt-4 grid gap-2.5 rounded-xl border border-linea bg-white p-4 dark:border-navy-border dark:bg-navy-card sm:grid-cols-4">
      <h2 className="text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft sm:col-span-4">
        Registrar venta
      </h2>
      {productos.length === 0 ? (
        <p className="text-[0.85rem] text-tinta-suave dark:text-navy-soft sm:col-span-4">No hay productos activos para vender.</p>
      ) : (
        <>
          <select value={productoId} onChange={e => setProductoId(e.target.value)} className={`${INPUT} sm:col-span-2`}>
            {productos.map(p => (
              <option key={p.id} value={p.id}>{p.nombre} — {formatearPrecio(p.precio)}</option>
            ))}
          </select>
          <input type="number" min={1} value={cantidad} onChange={e => setCantidad(e.target.value)} className={INPUT} placeholder="Cantidad" />
          <input value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} className={INPUT} placeholder="Cliente (opcional)" />
          <button disabled={guardando} className="btn-primary btn-small justify-center sm:col-span-4">
            {guardando ? 'Guardando...' : 'Registrar venta'}
          </button>
        </>
      )}
      {msg && (
        <p className={`text-[0.82rem] font-semibold sm:col-span-4 ${msg.tipo === 'error' ? 'text-rojo' : 'text-green-600 dark:text-green-400'}`}>
          {msg.txt}
        </p>
      )}
    </form>
  )
}

function PreciosServicios({ servicios, onCambio }) {
  return (
    <>
      <h2 className="mb-2 mt-6 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">Precios de cortes</h2>
      <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
        {servicios.map(s => (
          <FilaPrecio
            key={s.id} nombre={s.nombre} precio={s.precio} activo={s.activo}
            onPrecio={p => panelService.setPrecioServicio(s.id, p).then(onCambio)}
            onActivo={() => panelService.setActivoServicio(s.id, !s.activo).then(onCambio)}
          />
        ))}
      </div>
    </>
  )
}

function PreciosProductos({ productos, onCambio }) {
  return (
    <>
      <h2 className="mb-2 mt-6 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">Precios de productos</h2>
      <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
        {productos.map(p => (
          <FilaPrecio
            key={p.id} nombre={p.nombre} precio={p.precio} activo={p.activo}
            onPrecio={precio => panelService.setPrecioProducto(p.id, precio).then(onCambio)}
            onActivo={() => panelService.setActivoProducto(p.id, !p.activo).then(onCambio)}
          />
        ))}
      </div>
    </>
  )
}

function FilaPrecio({ nombre, precio, activo, onPrecio, onActivo }) {
  const [valor, setValor] = useState(precio)
  const [guardando, setGuardando] = useState(false)
  useEffect(() => { setValor(precio) }, [precio])

  async function guardar() {
    const nuevo = Number(valor)
    if (!nuevo || nuevo === precio) return
    setGuardando(true)
    try { await onPrecio(nuevo) } catch (e) { alert(e.message) }
    setGuardando(false)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-linea/60 px-3 py-2.5 text-[0.85rem] last:border-0 dark:border-navy-border/60">
      <span className={`min-w-0 flex-1 font-semibold text-azul dark:text-navy-text ${!activo ? 'line-through opacity-60' : ''}`}>{nombre}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-tinta-suave dark:text-navy-soft">$</span>
        <input
          type="number" value={valor} onChange={e => setValor(e.target.value)} onBlur={guardar}
          className="w-24 rounded-md border border-linea bg-white px-2 py-1 text-[0.85rem] dark:border-navy-border dark:bg-navy dark:text-navy-text"
        />
        {guardando && <span className="text-[0.72rem] text-tinta-suave dark:text-navy-soft">...</span>}
        <button onClick={onActivo} className="rounded-md border border-linea px-2 py-1 text-[0.8rem] text-tinta-suave dark:border-navy-border dark:text-navy-soft">
          {activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>
  )
}
