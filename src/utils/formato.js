// $6.000 a partir de 6000
export function formatearPrecio(pesos) {
  return '$' + Number(pesos || 0).toLocaleString('es-AR')
}
