import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar a modo noche"
      className="ml-3.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-[1.5px]
                 border-linea text-azul hover:border-rojo
                 dark:border-navy-border dark:text-navy-text"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}
