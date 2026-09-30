import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER, WHATSAPP_MENSAJE_GENERICO } from '../../config/contact'

// Se oculta mientras el widget de turnos (#turnos) o un banner de
// publicidad (.ad-slot, ya trae su propio link de contacto) están en
// pantalla: ahí ya hay un camino de contacto claro y no queremos dos
// CTAs pisándose.
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const objetivos = [document.getElementById('turnos'), ...document.querySelectorAll('.ad-slot')].filter(Boolean)
    if (!objetivos.length) return
    const interseca = new Set()
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { e.isIntersecting ? interseca.add(e.target) : interseca.delete(e.target) })
        setVisible(interseca.size === 0)
      },
      { threshold: 0.15 }
    )
    objetivos.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MENSAJE_GENERICO)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Escribir por WhatsApp"
      className={`fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full
                  bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <MessageCircle size={26} className="text-white" />
    </a>
  )
}
