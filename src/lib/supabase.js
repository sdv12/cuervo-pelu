import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIGURADO } from '../config/supabase'

// Si no hay credenciales cargadas (VITE_SUPABASE_*), exportamos null y la
// app sigue funcionando con la capa mock en memoria (ver bookingService.js
// y AuthContext.jsx). Apenas se cargan las env vars, todo pasa a Supabase.
export const supabase = SUPABASE_CONFIGURADO
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

export { SUPABASE_CONFIGURADO }
