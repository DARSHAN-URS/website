const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('employees').select('*').limit(1)
  if (data && data.length > 0) {
    console.log('COLUMNS:')
    Object.keys(data[0]).forEach(k => console.log('  ' + k))
  } else if (error) {
    console.error(error)
  }
}

test()
