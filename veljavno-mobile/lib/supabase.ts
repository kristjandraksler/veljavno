import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://dmebfpwivacovjkywpvu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZWJmcHdpdmFjb3Zqa3l3cHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTczMTEsImV4cCI6MjA5NjgzMzMxMX0.kvWZhI5bANbp6SVFaD71Os2xnI8FbY8pHOF1mOWTe4o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})