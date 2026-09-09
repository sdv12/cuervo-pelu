import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

function temaInicial() {
  const guardado = localStorage.getItem('theme')
  if (guardado) return guardado
  const hora = new Date().getHours()
  return hora >= 19 || hora < 7 ? 'dark' : 'light' // modo noche automático fuera de horario
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.body.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
