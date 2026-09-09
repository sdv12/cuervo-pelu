import { Megaphone } from 'lucide-react'
import { ESPACIOS_PUBLICITARIOS } from '../../data/publicidad'
import { WHATSAPP_NUMBER, WHATSAPP_MENSAJE_PUBLICIDAD } from '../../config/contact'

// Franja de publicidad angosta, pensada para no competir con la reserva de
// turno. Si hay un sponsor cargado para este `slot` en src/data/publicidad.js
// se muestra su banner; si no, una invitación a anunciar (así el espacio
// nunca se ve "roto" ni vacío).
export default function AdSlot({ slot }) {
  const espacio = ESPACIOS_PUBLICITARIOS.find(e => e.slot === slot && e.activo)

  return (
    <div className="bg-panel px-5 py-6 dark:bg-navy sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1080px]">
        {espacio ? (
          <a
            href={espacio.link}
            target="_blank"
            rel="noopener sponsored"
            className="relative block overflow-hidden rounded-xl border border-linea dark:border-navy-border"
          >
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-white">
              Publicidad
            </span>
            <img src={espacio.imagen} alt={espacio.nombre} className="h-auto w-full object-cover" />
          </a>
        ) : (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MENSAJE_PUBLICIDAD)}`}
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center gap-2 rounded-xl border-[1.5px] border-dashed border-linea px-6 py-6 text-center
                       text-tinta-suave transition-colors hover:border-rojo hover:text-rojo dark:border-navy-border dark:text-navy-soft sm:flex-row sm:justify-center sm:gap-3 sm:py-5"
          >
            <Megaphone size={18} className="flex-shrink-0" />
            <span className="text-[0.9rem] font-medium">
              Este espacio está disponible — <span className="underline underline-offset-2">anunciá tu negocio acá</span>
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
