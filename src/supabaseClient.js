import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://unqdlgycxhtlehdvpqec.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_pEMcMrbhDL_7cOCpaSxKeA_9t0nLLTJ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
