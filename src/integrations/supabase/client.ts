
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL o Anon Key mancanti!')
}

export const supabase = createClient(
  'https://ndujofangdmnwmmsfxwt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kdWpvZmFuZ2RtbndtbXNmeHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3Mjc3OTEsImV4cCI6MjA1NTMwMzc5MX0._P_BYFSU0MZAtv4Vu5sSQMPzY0hVjiu_awFd8eaNHUk'
)
