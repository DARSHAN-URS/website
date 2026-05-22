const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("--- Testing Read Employees ---")
  const { data, error } = await supabase.from('employees').select('id, full_name').limit(5)
  if (data) {
    console.log(`  SUCCESS: Found ${data.length} employees`)
    data.forEach(e => console.log(`  - ${e.full_name} (${e.id})`))
  } else {
    console.log(`  ERROR: ${error.message}`)
  }
}

test()
