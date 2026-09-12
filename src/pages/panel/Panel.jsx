import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../../components/layout/BrandLogo'
import ThemeToggle from '../../components/layout/ThemeToggle'
import Agenda from './Agenda'
import Reportes from './Reportes'
import Empleados from './Empleados'
import Productos from './Productos'
import Actividad from './Actividad'
import MiTarjeta from './MiTarjeta'

export default function Panel() {
  const { perfil, rol, esStaff, esAdmin, salir } = useAuth()

  const tabs = esStaff
    ? [
        { id: 'agenda', label: 'Agenda', Comp: Agenda },
        { id: 'reportes', label: 'Reportes', Comp: Reportes },
        { id: 'productos', label: 'Productos', Comp: Productos },
        ...(esAdmin ? [{ id: 'empleados', label: 'Empleados', Comp: Empleados }] : []),
        ...(esAdmin ? [{ id: 'actividad', label: 'Actividad', Comp: Actividad }] : []),
      ]
    : [{ id: 'tarjeta', label: 'Mi tarjeta', Comp: MiTarjeta }]

  const [tab, setTab] = useState(tabs[0].id)
  const Activa = tabs.find(t => t.id === tab)?.Comp || tabs[0].Comp

  return (
    <div className="min-h-screen bg-hueso dark:bg-navy">
      <header className="sticky top-0 z-40 border-b border-linea bg-hueso/90 backdrop-blur-sm dark:border-navy-border dark:bg-navy/90">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-3.5">
          <Link to="/" className="flex min-w-0 items-center gap-2 no-underline sm:gap-2.5">
            <BrandLogo className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10" />
            <span className="hidden truncate font-display text-[1.15rem] font-semibold tracking-wide text-azul dark:text-navy-text sm:inline">
              Cuervo Peluquería
            </span>
          </Link>
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-6">
            <span className="hidden text-[0.95rem] font-medium text-tinta-suave dark:text-navy-soft sm:inline">
              {perfil?.nombre} · <span className="capitalize">{rol}</span>
            </span>
            <button onClick={salir} className="btn-ghost btn-small">
              <LogOut size={15} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
          <ThemeToggle />
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
