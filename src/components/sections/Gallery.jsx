import { ESTILOS } from '../../data/estilos'
import BarberProfile from './BarberProfile'

export default function Gallery() {
  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[72px]" id="estilos">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 max-w-[56ch]">
          <h2 className="text-[clamp(1.9rem,3.4vw,2.5rem)] uppercase text-azul dark:text-navy-text">Estilos que hacemos</h2>
          <p className="mt-2.5 text-tinta-suave dark:text-navy-soft">
            Una muestra de lo que sale de la silla — reemplazá los íconos por fotos reales de tus cortes apenas puedas.
          </p>
        </div>
        <p className="-mt-4.5 mb-6.5 text-[0.85rem] italic text-tinta-suave dark:text-navy-soft">
          Ilustraciones de referencia, no fotos.
        </p>
        <div className="flex gap-3.5 overflow-x-auto pb-2.5">
          {ESTILOS.map(estilo => (
            <div key={estilo.nombre} className="w-[190px] flex-shrink-0 rounded-[10px] border border-linea bg-panel p-4.5 dark:border-navy-border dark:bg-navy-card">
              <svg viewBox="0 0 100 70" fill="none" stroke={estilo.color} strokeWidth="2" className="h-[70px] w-full">
                <path d={estilo.path} strokeDasharray={estilo.dashed ? '3 3' : undefined} />
                {estilo.extra && <path d={estilo.extra.d} stroke={estilo.extra.stroke} />}
              </svg>
              <h3 className="mt-2.5 text-[0.98rem] normal-case text-azul dark:text-navy-text">{estilo.nombre}</h3>
              <span className="text-[0.82rem] text-tinta-suave dark:text-navy-soft">{estilo.descripcion}</span>
            </div>
          ))}
        </div>

        <BarberProfile />
      </div>
    </section>
  )
}
