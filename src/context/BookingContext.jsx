import { createContext, useContext, useCallback, useReducer } from 'react'
import bookingService, { sembrarTurnoDemo } from '../services/bookingService'
import { getProximosDiasHabiles } from '../utils/businessDays'

const BookingContext = createContext()

const initialState = {
  step: 1,
  service: null,
  price: null,
  day: null,
  dayDate: null,
  time: null,
  horariosOcupados: null, // null = todavía no se consultó
  loadingHorarios: false,
  cuposRestantes: null, // null = calculando
  saving: false,
  confirmado: null, // { whatsappUrl, icsUrl } tras confirmar
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, service: action.service, price: action.price }
    case 'GO_TO_STEP':
      return { ...state, step: action.step }
    case 'SELECT_DAY_START':
      return { ...state, day: action.day, dayDate: action.dayDate, horariosOcupados: null, loadingHorarios: true, time: null }
    case 'SELECT_DAY_RESULT':
      if (action.day !== state.day) return state // el usuario ya eligió otro día
      return { ...state, horariosOcupados: action.horarios, loadingHorarios: false }
    case 'SELECT_TIME':
      return { ...state, time: action.time }
    case 'SET_CUPOS':
      return { ...state, cuposRestantes: action.cupos }
    case 'SAVE_START':
      return { ...state, saving: true }
    case 'SAVE_DONE':
      return { ...state, saving: false, confirmado: action.confirmado }
    case 'RESET':
      return { ...initialState, cuposRestantes: state.cuposRestantes }
    default:
      return state
  }
}

// Los mismos días hábiles se calculan una sola vez por carga de página,
// y sembramos un par de turnos de ejemplo (ver bookingService) para poder
// probar el bloqueo de horarios sin backend todavía.
const diasHabiles = getProximosDiasHabiles(6)
sembrarTurnoDemo(diasHabiles[0]?.label, '11:20')
sembrarTurnoDemo(diasHabiles[1]?.label, '16:20')

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const seleccionarServicio = useCallback((service, price) => {
    dispatch({ type: 'SET_SERVICE', service, price })
  }, [])

  const irAPaso = useCallback(step => dispatch({ type: 'GO_TO_STEP', step }), [])

  const seleccionarDia = useCallback(async (day, dayDate) => {
    dispatch({ type: 'SELECT_DAY_START', day, dayDate })
    const horarios = await bookingService.getHorariosOcupados(day)
    dispatch({ type: 'SELECT_DAY_RESULT', day, horarios })
  }, [])

  const seleccionarHora = useCallback(time => dispatch({ type: 'SELECT_TIME', time }), [])

  const actualizarCupos = useCallback(async () => {
    dispatch({ type: 'SET_CUPOS', cupos: null })
    const cupos = await bookingService.getCuposRestantesSemana()
    dispatch({ type: 'SET_CUPOS', cupos })
  }, [])

  const confirmarTurno = useCallback(async ({ nombre, telefono, whatsappUrl }) => {
    dispatch({ type: 'SAVE_START' })
    await bookingService.guardarTurno({
      fecha: state.day, hora: state.time, servicio: state.service,
      precio: state.price, nombre, telefono,
    })
    dispatch({ type: 'SAVE_DONE', confirmado: { nombre, telefono, whatsappUrl } })
    actualizarCupos()
  }, [state.day, state.time, state.service, state.price, actualizarCupos])

  const reiniciar = useCallback(() => dispatch({ type: 'RESET' }), [])

  const value = {
    state, diasHabiles,
    seleccionarServicio, irAPaso, seleccionarDia, seleccionarHora,
    actualizarCupos, confirmarTurno, reiniciar,
  }

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => useContext(BookingContext)
