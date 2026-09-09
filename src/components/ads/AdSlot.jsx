import { Megaphone } from 'lucide-react'
import { ESPACIOS_PUBLICITARIOS } from '../../data/publicidad'
import { WHATSAPP_NUMBER, WHATSAPP_MENSAJE_PUBLICIDAD } from '../../config/contact'

// Banner publicitario con marco propio, bien diferenciado del contenido de
// la peluquería (fondo + borde dorado, etiqueta "Publicidad" siempre
// visible) — pensado como espacio fijo, no mezclado entre secciones.
// Si hay un sponsor cargado para este `slot` en src/data/publicidad.js se
// muestra su banner; si no, una invitación a anunciar (el espacio nunca se
// ve "roto" ni vacío).
export default function AdSlot({ slot }) {
  const espacio = ESPACIOS_PUBLICITARIOS.find(e => e.slot === slot && e.activo)

  return (
    <div className="border-y-2 border-dorado/40 bg-panel px-5 py-4 dark:bg-navy-card sm:px-6 sm:py-5">
      <div className="mx-auto max-w-[1080px]">
        <p className="mb-2.5 text-center text-[0.68rem] font-bold uppercase tracking-[0.18em] text-tinta-suave dark:text-navy-soft sm:text-left">
          Publicidad
        </p>
        {espacio ? (
          <a
            href={espacio.link}
            target="_blank"
            rel="noopener sponsored"
            className="block overflow-hidden rounded-xl border border-linea dark:border-navy-border"
          >
            <img src={espacio.imagen} alt={espacio.nombre} className="h-auto w-full object-cover" />
          </a>
        ) : (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MENSAJE_PUBLICIDAD)}`}
            target="_blank"
            rel="noopener"
            className="flex flex-col items-center gap-2 rounded-xl border-[1.5px] border-dashed border-dorado/60 bg-hueso px-6 py-6 text-center
                       text-tinta-suave transition-colors hover:border-rojo hover:text-rojo dark:bg-navy dark:text-navy-soft sm:flex-row sm:justify-center sm:gap-3 sm:py-5"
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
