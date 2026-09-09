import BrandLogo from './BrandLogo'
import { INSTAGRAM_URL } from '../../config/contact'

export default function Footer() {
  return (
    <footer className="bg-azul py-9 text-navy-soft">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="h-8 w-8 ring-navy-border" />
          <span className="font-display font-semibold text-white">Cuervo Peluquería</span>
        </div>
        <div className="flex gap-5 text-[0.88rem]">
          <a href="#servicios" className="text-navy-soft no-underline hover:text-white">Servicios</a>
          <a href="#turnos" className="text-navy-soft no-underline hover:text-white">Turnos</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="text-navy-soft no-underline hover:text-white">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  )
}
