const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('--- BOOKINGS COLUMNS ---')
  const { data, error } = await supabase.from('bookings').select('*').limit(1)
  if (data && data.length > 0) {
    Object.keys(data[0]).forEach(k => console.log('  ' + k))
    console.log('DATA:', JSON.stringify(data[0], null, 2))
  } else if (error) {
    console.error(error)
  } else {
    console.log('No bookings found')
  }
}

test()
