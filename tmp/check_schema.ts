import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  // Use postgrest RPC to get columns for 'jobs'
  const { data, error } = await supabase.rpc('get_table_columns', { t_name: 'jobs' })
  if (error) {
    // If RPC doesn't exist, try a SELECT * query and see what keys we get
    console.log("No RPC, using SELECT * limit 1")
    const { data: selectData, error: selectError } = await supabase.from('jobs').select('*').limit(1)
    if (selectError) {
      console.error(selectError)
    } else {
      console.log('Columns in JOBS:', Object.keys(selectData[0] || {}))
    }
  } else {
    console.log('Columns from RPC JOBS:', data)
  }
}

test()
