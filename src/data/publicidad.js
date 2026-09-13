// Espacios publicitarios de negocios del barrio. Un slot con `activo: true`
// se muestra como banner; si no hay ninguno activo para ese `slot`, se
// muestra una tarjeta invitando a anunciar (ver AdSlot.jsx).
//
// Hoy hay un solo espacio fijo, justo debajo del hero (slot="hero", ver
// Home.jsx). Para cargar un sponsor real ahí, copiá este formato:
// {
//   slot: 'hero',
//   activo: true,
//   nombre: 'Kiosco Don Pepe',
//   imagen: '/ads/don-pepe.jpg',   // poné el archivo en /public/ads/
//   link: 'https://wa.me/54911...',
// }
export const ESPACIOS_PUBLICITARIOS = [
  {
    slot: 'hero',
    activo: true, // mock para ver cómo se ve un sponsor real — sacar cuando haya uno de verdad
    nombre: 'Pizzería Don Mario',
    imagen: '/ads/mock-pizzeria-don-mario.svg',
    link: 'https://wa.me/5493511234567',
  },
]
