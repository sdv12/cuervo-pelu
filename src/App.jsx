import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import RutaProtegida from './components/auth/RutaProtegida'

const Ingresar = lazy(() => import('./pages/Ingresar'))
const Panel = lazy(() => import('./pages/panel/Panel'))

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hueso dark:bg-navy">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-linea border-t-rojo" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Cargando />}>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/ingresar" element={<Ingresar />} />
        <Route
          path="/panel"
          element={
            <RutaProtegida>
              <Panel />
            </RutaProtegida>
          }
        />
      </Routes>
    </Suspense>
  )
}
