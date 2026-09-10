import { useState, useEffect } from 'react'
import { panelService } from '../../services/panelService'
import { useAuth } from '../../context/AuthContext'

const INPUT = 'rounded-lg border-[1.5px] border-linea bg-white px-3 py-2 text-base dark:border-navy-border dark:bg-navy dark:text-navy-text'

export default function Empleados() {
  const { crearEmpleado, usuario } = useAuth()
  const [perfiles, setPerfiles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [msg, setMsg] = useState(null)
  const [creando, setCreando] = useState(false)

  async function cargar() {
    setCargando(true)
    try { setPerfiles(await panelService.getPerfiles()) } catch { setPerfiles([]) }
    setCargando(false)
  }
  useEffect(() => { cargar() }, [])

  async function crear(e) {
    e.preventDefault()
    setMsg(null); setCreando(true)
    const { error } = await crearEmpleado(form)
    setCreando(false)
    if (error) {
      setMsg({ tipo: 'error', txt: error })
    } else {
      setMsg({ tipo: 'ok', txt: `${form.nombre} ya puede ingresar con su email y contraseña.` })
      setForm({ nombre: '', email: '', password: '' })
      cargar()
    }
  }

  const cambiarRol = async (p, rol) => { try { await panelService.setRol(p.id, rol); cargar() } catch (e) { alert(e.message) } }
  const toggleActivo = async p => { try { await panelService.setActivo(p.id, !p.activo); cargar() } catch (e) { alert(e.message) } }

  const equipo = perfiles.filter(p => p.rol !== 'cliente')
  const clientes = perfiles.filter(p => p.rol === 'cliente')

  return (
    <div>
      <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Empleados</h1>

      <form onSubmit={crear} className="mt-4 grid gap-2.5 rounded-xl border border-linea bg-white p-4 dark:border-navy-border dark:bg-navy-card sm:grid-cols-3">
        <input required placeholder="Nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className={INPUT} />
        <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={INPUT} />
        <input required type="password" minLength={6} placeholder="Contraseña (mín. 6)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={INPUT} />
        <button disabled={creando} className="btn-primary btn-small justify-center sm:col-span-3">
          {creando ? 'Creando...' : 'Crear empleado'}
        </button>
        {msg && (
          <p className={`text-[0.82rem] font-semibold sm:col-span-3 ${msg.tipo === 'error' ? 'text-rojo' : 'text-green-600 dark:text-green-400'}`}>
            {msg.txt}
          </p>
        )}
      </form>

      {cargando ? (
        <p className="loading-note">Cargando...</p>
      ) : (
        <>
          <h2 className="mb-2 mt-6 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">Equipo</h2>
          <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
            {equipo.length === 0 && <Vacio txt="Todavía no hay empleados cargados." />}
            {equipo.map(p => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-linea/60 px-3 py-2.5 text-[0.85rem] last:border-0 dark:border-navy-border/60">
                <div className="min-w-0">
                  <span className={`font-semibold text-azul dark:text-navy-text ${!p.activo ? 'line-through opacity-60' : ''}`}>{p.nombre}</span>
                  <span className="block text-[0.75rem] text-tinta-suave dark:text-navy-soft">{p.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <select value={p.rol} onChange={e => cambiarRol(p, e.target.value)} disabled={p.id === usuario.id}
                    className="rounded-md border border-linea bg-white px-2 py-1 text-[0.8rem] disabled:opacity-50 dark:border-navy-border dark:bg-navy dark:text-navy-text">
                    <option value="empleado">Empleado</option>
                    <option value="admin">Admin</option>
                    <option value="cliente">Cliente</option>
                  </select>
                  <button onClick={() => toggleActivo(p)} disabled={p.id === usuario.id}
                    className="rounded-md border border-linea px-2 py-1 text-[0.8rem] text-tinta-suave disabled:opacity-50 dark:border-navy-border dark:text-navy-soft">
                    {p.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mb-2 mt-6 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">
            Clientes con cuenta ({clientes.length})
          </h2>
          <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
            {clientes.length === 0 && <Vacio txt="Ningún cliente se registró todavía." />}
            {clientes.slice(0, 100).map(p => (
              <div key={p.id} className="flex items-center justify-between gap-2 border-b border-linea/60 px-3 py-2 text-[0.85rem] last:border-0 dark:border-navy-border/60">
                <div className="min-w-0">
                  <span className="text-azul dark:text-navy-text">{p.nombre}</span>
                  <span className="block text-[0.72rem] text-tinta-suave dark:text-navy-soft">{p.email}</span>
                </div>
                <button onClick={() => cambiarRol(p, 'empleado')} className="whitespace-nowrap text-[0.78rem] font-semibold text-rojo">
                  Hacer empleado
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Vacio({ txt }) {
  return <div className="px-3 py-6 text-center text-[0.85rem] text-tinta-suave dark:text-navy-soft">{txt}</div>
}
