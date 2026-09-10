import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { formatearPrecio } from '../../utils/formato'

const ESTADO_STYLE = {
  confirmado: 'bg-azul/10 text-azul dark:bg-navy-soft/20 dark:text-navy-text',
  completado: 'bg-green-500/15 text-green-700 dark:text-green-400',
  cancelado: 'bg-rojo/10 text-rojo',
}

export default function MiTarjeta() {
  const { usuario, perfil } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [ficha, setFicha] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vivo = true
    async function cargar() {
      const { data: ts } = await supabase.from('turnos').select('*')
        .eq('perfil_id', usuario.id).order('fecha', { ascending: false }).order('hora', { ascending: false })
      let f = null
      if (perfil?.telefono) {
        const { data } = await supabase.rpc('sellos_por_telefono', { tel: perfil.telefono })
        f = data?.[0] || null
      }
      if (vivo) { setTurnos(ts || []); setFicha(f); setCargando(false) }
    }
    cargar()
    return () => { vivo = false }
  }, [usuario.id, perfil?.telefono])

  const cortes = ficha?.cortes_count ?? 0
  const sellos = cortes > 0 && cortes % 5 === 0 ? 5 : cortes % 5

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

      <h2 className="mb-2 mt-6 text-[0.78rem] font-semibold uppercase tracking-wide text-tinta-suave dark:text-navy-soft">Mis turnos</h2>
      <div className="overflow-hidden rounded-xl border border-linea dark:border-navy-border">
        {turnos.length === 0 && (
          <div className="px-3 py-8 text-center text-[0.85rem] text-tinta-suave dark:text-navy-soft">
            Todavía no reservaste ningún turno con esta cuenta.
          </div>
        )}
        {turnos.map(t => (
          <div key={t.id} className="flex items-center justify-between gap-3 border-b border-linea/60 px-3 py-2.5 text-[0.85rem] last:border-0 dark:border-navy-border/60">
            <span className="text-azul dark:text-navy-text">
              {new Date(t.fecha + 'T00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · {String(t.hora).slice(0, 5)}
              <span className="block text-[0.75rem] text-tinta-suave dark:text-navy-soft">{t.servicio} · {formatearPrecio(t.precio)}</span>
            </span>
            <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[0.7rem] font-bold uppercase ${ESTADO_STYLE[t.estado]}`}>
              {t.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
