import { useState, useEffect } from 'react'
import { Download, Share, PlusSquare, MoreVertical, Smartphone } from 'lucide-react'

// Guarda el evento de instalación nativo de Chrome/Android apenas el
// navegador lo dispara (antes de que el componente se monte).
let promptGuardado = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
    promptGuardado = e
  })
}

function esIOS() {
  return typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export default function InstalarApp() {
  const [puedeInstalar, setPuedeInstalar] = useState(false)
  const [tab, setTab] = useState(esIOS() ? 'ios' : 'android')
  const [instalada, setInstalada] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) { setInstalada(true); return }
    const avisar = () => setPuedeInstalar(true)
    if (promptGuardado) setPuedeInstalar(true)
    window.addEventListener('beforeinstallprompt', avisar)
    return () => window.removeEventListener('beforeinstallprompt', avisar)
  }, [])

  async function instalar() {
    if (!promptGuardado) return
    promptGuardado.prompt()
    await promptGuardado.userChoice
    promptGuardado = null
    setPuedeInstalar(false)
  }

  if (instalada) return null

  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[70px]" id="instalar">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-7 max-w-[56ch]">
          <span className="tag-canchera">Sin tienda de apps</span>
          <h2 className="mt-3 text-[clamp(1.7rem,6vw,2.2rem)] uppercase text-azul dark:text-navy-text">
            Llevate Cuervo a tu pantalla de inicio
          </h2>
          <p className="mt-2.5 text-[1.02rem] text-tinta-suave dark:text-navy-soft">
            Se instala en 10 segundos y abre como una app, sin ocupar espacio de verdad.
          </p>
        </div>

        {puedeInstalar && (
          <button
            type="button"
            onClick={instalar}
            className="btn-primary mb-6 w-full justify-center sm:w-auto"
          >
            <Download size={18} /> Instalar ahora
          </button>
        )}

        <div role="tablist" className="mb-5 inline-flex flex-col gap-2 rounded-2xl bg-panel p-1.5 sm:flex-row dark:bg-navy-card">
          <button type="button" role="tab" aria-selected={tab === 'ios'} onClick={() => setTab('ios')}
            className={`min-h-[48px] rounded-xl px-6 py-2.5 text-[0.98rem] font-semibold transition-colors
              ${tab === 'ios' ? 'bg-azul text-hueso dark:bg-navy-text dark:text-navy' : 'text-tinta-suave dark:text-navy-soft'}`}>
            iPhone (iOS)
          </button>
          <button type="button" role="tab" aria-selected={tab === 'android'} onClick={() => setTab('android')}
            className={`min-h-[48px] rounded-xl px-6 py-2.5 text-[0.98rem] font-semibold transition-colors
              ${tab === 'android' ? 'bg-azul text-hueso dark:bg-navy-text dark:text-navy' : 'text-tinta-suave dark:text-navy-soft'}`}>
            Android
          </button>
        </div>

        {tab === 'ios' ? (
          <ol className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <PasoInstalacion n={1} icono={Share} texto="Abrí cuervo-pelu.netlify.app en Safari y tocá el ícono de Compartir (el cuadradito con la flecha hacia arriba)." />
            <PasoInstalacion n={2} icono={PlusSquare} texto={'Elegí "Agregar a la pantalla de inicio".'} />
            <PasoInstalacion n={3} icono={Smartphone} texto={'Confirmá tocando "Agregar". Ya tenés a Cuervo como un ícono más, igual que cualquier app.'} />
          </ol>
        ) : (
          <ol className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <PasoInstalacion n={1} icono={MoreVertical} texto="Abrí cuervo-pelu.netlify.app en Chrome y tocá los tres puntitos de arriba a la derecha." />
            <PasoInstalacion n={2} icono={Download} texto={'Elegí "Instalar app" (o "Agregar a pantalla de inicio").'} />
            <PasoInstalacion n={3} icono={Smartphone} texto="Confirmá y listo — o si ves el botón de arriba, tocalo directamente y te ahorrás estos pasos." />
          </ol>
        )}
      </div>
    </section>
  )
}

function PasoInstalacion({ n, icono: Icono, texto }) {
  return (
    <li className="flex w-[80vw] max-w-[300px] flex-shrink-0 snap-start flex-col gap-2.5 rounded-xl border border-linea bg-white p-4.5 dark:border-navy-border dark:bg-navy-card sm:w-auto sm:max-w-none">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rojo text-[0.9rem] font-bold text-white">{n}</span>
        <Icono size={20} className="text-rojo" />
      </div>
      <p className="text-[0.92rem] text-tinta-suave dark:text-navy-soft">{texto}</p>
    </li>
  )
}
