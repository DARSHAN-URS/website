const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("--- Table: employees ---")
  const { data, error } = await supabase.from('employees').select('*').limit(1)
  if (data && data.length > 0) {
    console.log('Columns in EMPLOYEES:', Object.keys(data[0] || {}).join(', '))
  } else if (error) {
    console.log(`  ERROR: ${error.message}`)
  } else {
    console.log(`  NO DATA or table empty`)
  }
}

test()
