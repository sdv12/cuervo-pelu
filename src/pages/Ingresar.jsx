import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BrandLogo from '../components/layout/BrandLogo'

export default function Ingresar() {
  const { disponible, usuario, ingresar, registrarCliente } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo] = useState('ingreso') // 'ingreso' | 'registro'
  const [form, setForm] = useState({ email: '', password: '', nombre: '', telefono: '' })
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (usuario) navigate('/panel', { replace: true })
  }, [usuario, navigate])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(null); setOk(null); setEnviando(true)
    if (modo === 'ingreso') {
      const err = await ingresar(form.email, form.password)
      setEnviando(false)
      if (err) setError('Email o contraseña incorrectos.')
      else navigate('/panel', { replace: true })
    } else {
      if (!form.nombre.trim()) { setEnviando(false); setError('Poné tu nombre.'); return }
      const err = await registrarCliente(form)
      setEnviando(false)
      if (err) setError(err)
      else setOk('Cuenta creada. Si no entrás directo, revisá tu email para confirmarla.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-hueso px-5 py-12 dark:bg-navy">
      <Link to="/" className="mb-6 flex items-center gap-2.5 no-underline">
        <BrandLogo className="h-9 w-9" />
        <span className="font-display text-[1.15rem] font-semibold text-azul dark:text-navy-text">Cuervo Peluquería</span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-linea bg-white p-6 shadow-sm dark:border-navy-border dark:bg-navy-card sm:p-8">
        <div className="mb-5 flex gap-1 rounded-lg bg-panel p-1 dark:bg-navy">
          {['ingreso', 'registro'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setModo(m); setError(null); setOk(null) }}
              className={`flex-1 rounded-md py-2 text-[0.85rem] font-semibold capitalize transition-colors
                ${modo === m ? 'bg-rojo text-white' : 'text-tinta-suave dark:text-navy-soft'}`}
            >
              {m === 'ingreso' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        {!disponible && (
          <p className="mb-4 rounded-lg bg-rojo/10 px-3 py-2 text-[0.82rem] font-semibold text-rojo">
            El login todavía no está configurado (falta Supabase).
          </p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-3">
          {modo === 'registro' && (
            <>
              <Campo label="Nombre" value={form.nombre} onChange={set('nombre')} />
              <Campo label="Teléfono (opcional)" type="tel" value={form.telefono} onChange={set('telefono')} />
            </>
          )}
          <Campo label="Email" type="email" value={form.email} onChange={set('email')} required />
          <Campo label="Contraseña" type="password" value={form.password} onChange={set('password')} required />

          {error && <p className="rounded-lg bg-rojo/10 px-3 py-2 text-[0.82rem] font-semibold text-rojo">{error}</p>}
          {ok && <p className="rounded-lg bg-green-500/10 px-3 py-2 text-[0.82rem] font-semibold text-green-700 dark:text-green-400">{ok}</p>}

          <button type="submit" disabled={enviando || !disponible} className="btn-primary mt-1 w-full justify-center">
            {enviando ? 'Un momento...' : modo === 'ingreso' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-4 text-center text-[0.8rem] text-tinta-suave dark:text-navy-soft">
          {modo === 'ingreso'
            ? 'Los empleados y el admin entran por acá.'
            : 'Con cuenta ves tu historial de turnos y tu tarjeta de fidelidad. Reservar no necesita cuenta.'}
        </p>
      </div>

      <Link to="/" className="mt-6 text-[0.85rem] font-semibold text-rojo underline-offset-2 hover:underline">
        ← Volver al inicio
      </Link>
    </div>
  )
}

function Campo({ label, type = 'text', ...props }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.8rem] font-semibold text-tinta-suave dark:text-navy-soft">{label}</span>
      <input
        type={type}
        {...props}
        className="rounded-lg border-[1.5px] border-linea bg-white px-3.5 py-2.5 text-base focus:border-rojo
                   dark:border-navy-border dark:bg-navy dark:text-navy-text"
      />
    </label>
  )
}
