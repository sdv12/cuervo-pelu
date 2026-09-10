import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/supabase'
import { createClient } from '@supabase/supabase-js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)

  const cargarPerfil = useCallback(async userId => {
    if (!userId) { setPerfil(null); return }
    const { data } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle()
    setPerfil(data || null)
  }, [])

  useEffect(() => {
    if (!supabase) { setCargando(false); return }
    let vivo = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!vivo) return
      setSession(data.session)
      await cargarPerfil(data.session?.user?.id)
      setCargando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s)
      await cargarPerfil(s?.user?.id)
    })
    return () => { vivo = false; sub.subscription.unsubscribe() }
  }, [cargarPerfil])

  const ingresar = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    return error?.message || null
  }, [])

  const registrarCliente = useCallback(async ({ email, password, nombre, telefono }) => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { data: { nombre: nombre.trim(), telefono: telefono?.trim() || null } },
    })
    return error?.message || null
  }, [])

  // El admin crea empleados usando un cliente Supabase "de un solo uso" que no
  // toca la sesión actual (persistSession:false) — así no lo desloguea.
  const crearEmpleado = useCallback(async ({ email, password, nombre }) => {
    const tmp = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await tmp.auth.signUp({
      email: email.trim(), password, options: { data: { nombre: nombre.trim() } },
    })
    if (error) return { error: error.message }
    const nuevoId = data.user?.id
    if (!nuevoId) return { error: 'No se pudo crear el usuario.' }
    const { error: e2 } = await supabase.from('perfiles')
      .update({ rol: 'empleado', nombre: nombre.trim(), activo: true })
      .eq('id', nuevoId)
    return { error: e2?.message || null }
  }, [])

  const salir = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    setPerfil(null)
  }, [])

  const value = {
    disponible: !!supabase,
    cargando,
    usuario: session?.user || null,
    perfil,
    rol: perfil?.rol || null,
    esStaff: perfil?.rol === 'admin' || perfil?.rol === 'empleado',
    esAdmin: perfil?.rol === 'admin',
    ingresar, registrarCliente, crearEmpleado, salir,
    refrescarPerfil: () => cargarPerfil(session?.user?.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
