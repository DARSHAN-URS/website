const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  for (const table of ['employees', 'employers']) {
    console.log(`--- Table: ${table} ---`)
    const { data, error } = await supabase.from(table).select('*').limit(1)
    if (data && data.length > 0) {
      console.log(`Columns in ${table.toUpperCase()}:`, Object.keys(data[0] || {}).join(', '))
    } else if (error) {
      console.log(`  ERROR: ${error.message}`)
    } else {
      console.log(`  NO DATA or table empty`)
    }
  }
}

test()
