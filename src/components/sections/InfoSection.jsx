import { MessageCircle, Instagram } from 'lucide-react'
import { WHATSAPP_NUMBER, INSTAGRAM_URL } from '../../config/contact'

export default function InfoSection() {
  return (
    <section className="px-5 py-14 sm:px-6 sm:py-[70px]">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-3.5 text-[1.1rem] uppercase text-azul dark:text-navy-text">Horarios</h3>
          <div className="flex justify-between border-b border-linea py-2.5 text-[0.95rem] dark:border-navy-border">
            <span className="text-tinta-suave dark:text-navy-soft">Martes a viernes</span><span>10:00–13:00 y 17:00–20:00</span>
          </div>
          <div className="flex justify-between border-b border-linea py-2.5 text-[0.95rem] dark:border-navy-border">
            <span className="text-tinta-suave dark:text-navy-soft">Sábados</span><span>9:00 — 20:00</span>
          </div>
          <div className="flex justify-between border-b border-linea py-2.5 text-[0.95rem] dark:border-navy-border">
            <span className="text-tinta-suave dark:text-navy-soft">Domingos y lunes</span><span>Cerrado</span>
          </div>
          <p className="mt-3.5 text-[0.85rem] italic text-tinta-suave dark:text-navy-soft">
            Y cerrado también los días que el Ciclón juega de local, obvio.
          </p>
        </div>
        <div>
          <h3 className="mb-3.5 text-[1.1rem] uppercase text-azul dark:text-navy-text">Contacto directo</h3>
          <p className="text-tinta-suave dark:text-navy-soft">
            ¿Preferís preguntar antes de reservar? Escribinos directo por WhatsApp o seguinos en Instagram.
          </p>
          <div className="mt-3 flex flex-col gap-2.5">
            <a
              className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-rojo no-underline dark:text-navy-accent"
              target="_blank" rel="noopener"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
            >
              <MessageCircle size={16} />
              Escribir por WhatsApp
            </a>
            <a
              className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-rojo no-underline dark:text-navy-accent"
              target="_blank" rel="noopener"
              href={INSTAGRAM_URL}
            >
              <Instagram size={16} />
              @elcuervopeluqueria
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
