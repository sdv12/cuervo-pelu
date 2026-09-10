import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import BrandLogo from './BrandLogo'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../context/AuthContext'

export default function Nav() {
  const { disponible, usuario } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-linea bg-hueso/90 backdrop-blur-sm
                        dark:border-navy-border dark:bg-navy/90">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-3.5">
        <a href="#top" className="flex min-w-0 items-center gap-2 no-underline sm:gap-2.5">
          <BrandLogo className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10" />
          <span className="hidden truncate font-display text-[1.15rem] font-semibold tracking-wide text-azul dark:text-navy-text sm:inline">
            Cuervo Peluquería
          </span>
        </a>
        <nav className="flex flex-shrink-0 items-center gap-3 sm:gap-6">
          <a href="#servicios" className="hidden text-[0.95rem] font-medium text-tinta-suave hover:text-rojo dark:text-navy-soft sm:inline">
            Servicios
          </a>
          <a href="#por-que" className="hidden text-[0.95rem] font-medium text-tinta-suave hover:text-rojo dark:text-navy-soft sm:inline">
            Por qué nosotros
          </a>
          <a href="#turnos" className="whitespace-nowrap rounded-md bg-rojo px-3.5 py-2 text-[0.82rem] font-semibold text-white hover:bg-rojo-2 sm:px-[18px] sm:py-2.5 sm:text-[0.9rem]">
            Reservar turno
          </a>
          {disponible && (
            <Link
              to={usuario ? '/panel' : '/ingresar'}
              aria-label={usuario ? 'Ir al panel' : 'Ingresar'}
              className="flex items-center gap-1.5 text-[0.85rem] font-medium text-tinta-suave hover:text-rojo dark:text-navy-soft"
            >
              <UserRound size={17} />
              <span className="hidden sm:inline">{usuario ? 'Panel' : 'Ingresar'}</span>
            </Link>
          )}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
