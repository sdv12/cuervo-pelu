// Lo que se puede disfrutar en el local mientras esperás o te cortás.
// icono: clave mapeada a un componente lucide-react en Amenidades.jsx
// gratis: true muestra la insignia "Gratis". Si es false, el precio se
// consulta en vivo (productoId) para reflejar los cambios del panel.
export const AMENIDADES = [
  { id: 'ps5', icono: 'gamepad', titulo: 'PlayStation 5', descripcion: 'FIFA, Fortnite y más mientras esperás.', gratis: true },
  { id: 'futbol', icono: 'tv', titulo: 'Fútbol en pantalla', descripcion: 'No te perdés ni un partido.', gratis: true },
  { id: 'bebida', icono: 'bebida', titulo: 'Birra o Coca bien fría', descripcion: 'La botellita, para acompañar.', gratis: false, productoId: 'bebida' },
  { id: 'nueces', icono: 'nueces', titulo: 'Nueces confitadas', descripcion: 'El picoteo de siempre.', gratis: false, productoId: 'nueces' },
]
