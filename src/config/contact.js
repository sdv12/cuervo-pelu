// ---- CONFIG: reemplazá estos valores por los reales del negocio ----
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493512473790'
export const INSTAGRAM_URL = 'https://www.instagram.com/elcuervopeluqueria/'
export const DIRECCION = 'Ovidio Lagos 221, Córdoba, Argentina 5000'
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DIRECCION)}`
export const CUPOS_PROMO_SEMANALES = 4 // techo semanal de turnos con descuento de bienvenida
export const WHATSAPP_MENSAJE_GENERICO = 'Hola! Quiero consultar sobre un turno en Cuervo Peluquería.'
export const WHATSAPP_MENSAJE_PUBLICIDAD = 'Hola! Quiero averiguar sobre anunciar mi negocio en la página de Cuervo Peluquería.'
