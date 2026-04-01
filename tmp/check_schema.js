const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("--- Table: employers ---")
  const { data, error } = await supabase.from('employers').select('*').limit(1)
  if (data && data.length > 0) {
    Object.keys(data[0]).forEach(k => console.log(`  COLUMN: ${k}`))
  } else if (error) {
    console.log(`  ERROR: ${error.message}`)
  } else {
    console.log(`  NO DATA`)
  }
}

test()
