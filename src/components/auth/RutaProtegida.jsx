import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RutaProtegida({ children, soloAdmin = false }) {
  const { disponible, cargando, usuario, rol } = useAuth()

  if (!disponible) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="mb-2 text-xl uppercase text-azul dark:text-navy-text">Panel no disponible</h1>
        <p className="text-tinta-suave dark:text-navy-soft">
          Falta configurar Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).
        </p>
        <a href="/" className="mt-4 inline-block text-rojo underline">Volver al inicio</a>
      </div>
    )
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hueso dark:bg-navy">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-linea border-t-rojo" />
      </div>
    )
  }

  if (!usuario) return <Navigate to="/ingresar" replace />

  if (soloAdmin && rol !== 'admin') {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center">
        <h1 className="mb-2 text-xl uppercase text-azul dark:text-navy-text">Sin permiso</h1>
        <p className="text-tinta-suave dark:text-navy-soft">Esta sección es solo para administradores.</p>
      </div>
    )
  }

  return children
}
