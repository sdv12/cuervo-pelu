// Config de Supabase — se completa cuando se conecte el backend real
// (ver src/services/bookingService.js, que hoy usa datos mock).
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const SUPABASE_CONFIGURADO = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
