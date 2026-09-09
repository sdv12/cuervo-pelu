export default function BrandLogo({ className = 'h-9 w-9' }) {
  return (
    <img
      src="/logo-cuervo.webp"
      alt="Cuervo Peluquería"
      className={`rounded-full object-cover object-top ring-1 ring-linea dark:ring-navy-border ${className}`}
    />
  )
}
