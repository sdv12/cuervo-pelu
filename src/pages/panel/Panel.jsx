import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/layout/BrandLogo'
import ThemeToggle from '../../components/layout/ThemeToggle'
import Agenda from './Agenda'
import Reportes from './Reportes'
import Empleados from './Empleados'
import MiTarjeta from './MiTarjeta'

export default function Panel() {
  const { perfil, rol, esStaff, esAdmin, salir } = useAuth()

  const tabs = esStaff
    ? [
        { id: 'agenda', label: 'Agenda', Comp: Agenda },
        { id: 'reportes', label: 'Reportes', Comp: Reportes },
        ...(esAdmin ? [{ id: 'empleados', label: 'Empleados', Comp: Empleados }] : []),
      ]
    : [{ id: 'tarjeta', label: 'Mi tarjeta', Comp: MiTarjeta }]

  const [tab, setTab] = useState(tabs[0].id)
  const Activa = tabs.find(t => t.id === tab)?.Comp || tabs[0].Comp

  return (
    <div className="min-h-screen bg-hueso dark:bg-navy">
      <header className="sticky top-0 z-40 border-b border-linea bg-hueso/95 backdrop-blur dark:border-navy-border dark:bg-navy/95">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <BrandLogo className="h-8 w-8" />
            <span className="hidden font-display text-[1rem] font-semibold text-azul dark:text-navy-text sm:inline">Panel</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-[0.85rem] text-tinta-suave dark:text-navy-soft sm:inline">
              {perfil?.nombre} · <span className="capitalize">{rol}</span>
            </span>
            <button onClick={salir} className="btn-ghost btn-small">
              <LogOut size={15} /> <span className="hidden sm:inline">Salir</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
        {tabs.length > 1 && (
          <div className="mx-auto flex max-w-[1080px] gap-1 overflow-x-auto px-4 sm:px-6">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-[0.85rem] font-semibold transition-colors
                  ${tab === t.id ? 'border-rojo text-rojo' : 'border-transparent text-tinta-suave dark:text-navy-soft'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8">
        <Activa />
      </main>
    </div>
  )
}
