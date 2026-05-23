import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con los tuyos de Supabase
const SUPABASE_URL = 'https://unqdlgycxhtlehdvpqec.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_pEMcMrbhDL_7cOCpaSxKeA_9t0nLLTJ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
