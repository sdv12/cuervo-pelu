import { createContext, useContext, useCallback, useReducer, useEffect } from 'react'
import bookingService, { sembrarTurnoDemo, CUALQUIERA } from '../services/bookingService'
import { getProximosDiasHabiles } from '../utils/businessDays'

const BookingContext = createContext()

const initialState = {
  step: 1,
  service: null,
  price: null,
  barberoId: CUALQUIERA, // preferencia de quién atiende
  staff: [],
  staffCargando: true,
  servicios: [],
  serviciosCargando: true,
  day: null,       // label para mostrar (DD/MM/YYYY)
  dayIso: null,    // clave de base de datos (YYYY-MM-DD)
  dayDate: null,
  time: null,
  horariosOcupados: null, // null = todavía no se consultó
  loadingHorarios: false,
  cuposRestantes: null, // null = calculando
  saving: false,
  cancelando: false,
  saveError: null, // 'ocupado' si el slot se tomó justo antes de confirmar
  confirmado: null, // { nombre, telefono, whatsappUrl, barbero, cancelado } tras confirmar
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, service: action.service, price: action.price }
    case 'GO_TO_STEP':
      return { ...state, step: action.step }
    case 'SET_STAFF':
      return { ...state, staff: action.staff, staffCargando: false }
    case 'SET_SERVICIOS':
      return { ...state, servicios: action.servicios, serviciosCargando: false }
    case 'SELECT_BARBERO':
      // cambiar de barbero invalida los horarios ya consultados para ese día
      return { ...state, barberoId: action.barberoId, horariosOcupados: null, time: null }
    case 'SELECT_DAY_START':
      return { ...state, day: action.day, dayIso: action.dayIso, dayDate: action.dayDate, horariosOcupados: null, loadingHorarios: true, time: null }
    case 'SELECT_DAY_RESULT':
      if (action.dayIso !== state.dayIso || action.barberoId !== state.barberoId) return state // cambió el día o el barbero mientras esperábamos
      return { ...state, horariosOcupados: action.horarios, loadingHorarios: false }
    case 'SELECT_TIME':
      return { ...state, time: action.time }
    case 'SET_CUPOS':
      return { ...state, cuposRestantes: action.cupos }
    case 'SAVE_START':
      return { ...state, saving: true, saveError: null }
    case 'SAVE_DONE':
      return { ...state, saving: false, confirmado: action.confirmado }
    case 'SAVE_ERROR':
      return { ...state, saving: false, saveError: action.motivo }
    case 'CANCEL_START':
      return { ...state, cancelando: true }
    case 'CANCEL_DONE':
      return { ...state, cancelando: false, confirmado: { ...state.confirmado, cancelado: true } }
    case 'RESET':
      return {
        ...initialState,
        staff: state.staff, staffCargando: false,
        servicios: state.servicios, serviciosCargando: false,
        cuposRestantes: state.cuposRestantes,
      }
    default:
      return state
  }
}

// Los días hábiles se calculan una sola vez por carga de página. Si no hay
// Supabase configurado, sembramos un par de turnos de ejemplo (mock) para
// ver el bloqueo de horarios funcionando.
const diasHabiles = getProximosDiasHabiles(7)
sembrarTurnoDemo(diasHabiles[0]?.iso, '11:00')
sembrarTurnoDemo(diasHabiles[1]?.iso, '17:30')

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    bookingService.getStaff().then(staff => dispatch({ type: 'SET_STAFF', staff }))
    bookingService.getServicios().then(servicios => dispatch({ type: 'SET_SERVICIOS', servicios }))
  }, [])

  const seleccionarServicio = useCallback((service, price) => {
    dispatch({ type: 'SET_SERVICE', service, price })
  }, [])

  const irAPaso = useCallback(step => dispatch({ type: 'GO_TO_STEP', step }), [])

  const seleccionarBarbero = useCallback(barberoId => dispatch({ type: 'SELECT_BARBERO', barberoId }), [])

  const seleccionarDia = useCallback(async ({ label, iso, fecha }) => {
    dispatch({ type: 'SELECT_DAY_START', day: label, dayIso: iso, dayDate: fecha })
    const horarios = await bookingService.getHorariosOcupados(iso, state.barberoId)
    dispatch({ type: 'SELECT_DAY_RESULT', dayIso: iso, barberoId: state.barberoId, horarios })
  }, [state.barberoId])

  const seleccionarHora = useCallback(time => dispatch({ type: 'SELECT_TIME', time }), [])

  const actualizarCupos = useCallback(async () => {
    dispatch({ type: 'SET_CUPOS', cupos: null })
    const cupos = await bookingService.getCuposRestantesSemana()
    dispatch({ type: 'SET_CUPOS', cupos })
  }, [])

  const confirmarTurno = useCallback(async ({ nombre, telefono, whatsappUrl }) => {
    dispatch({ type: 'SAVE_START' })
    let res
    try {
      res = await bookingService.guardarTurno({
        fecha: state.dayIso, hora: state.time, servicio: state.service,
        precio: state.price, nombre, telefono, barberoId: state.barberoId,
      })
    } catch {
      res = { ok: false, motivo: 'error' }
    }
    if (!res.ok) {
      dispatch({ type: 'SAVE_ERROR', motivo: res.motivo })
      return
    }
    dispatch({ type: 'SAVE_DONE', confirmado: { nombre, telefono, whatsappUrl, barbero: res.barbero } })
    actualizarCupos()
  }, [state.dayIso, state.time, state.service, state.price, state.barberoId, actualizarCupos])

  const cancelarTurno = useCallback(async () => {
    dispatch({ type: 'CANCEL_START' })
    await bookingService.cancelarTurno({
      fecha: state.dayIso, hora: state.time, telefono: state.confirmado?.telefono,
    })
    dispatch({ type: 'CANCEL_DONE' })
    actualizarCupos()
  }, [state.dayIso, state.time, state.confirmado, actualizarCupos])

  const reiniciar = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = {
    state, diasHabiles,
    seleccionarServicio, irAPaso, seleccionarBarbero, seleccionarDia, seleccionarHora,
    actualizarCupos, confirmarTurno, cancelarTurno, reiniciar,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => useContext(BookingContext)
