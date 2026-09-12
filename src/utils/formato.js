// $6.000 a partir de 6000
export function formatearPrecio(pesos) {
  return '$' + Number(pesos || 0).toLocaleString('es-AR')
}

// Cómo mostrarle al cliente el rol de quién atiende.
export function etiquetaRol(rol) {
  return rol === 'admin' ? 'Dueño' : 'Empleado'
}
