const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("--- Checking work_details field ---")
  const { data, error } = await supabase.from('employees').select('id, work_details').limit(5)
  if (data) {
    data.forEach(e => {
      console.log(`ID: ${e.id}`)
      console.log(`Type: ${typeof e.work_details}`)
      console.log(`Value: ${JSON.stringify(e.work_details)}`)
    })
  } else {
    console.log(`ERROR: ${error.message}`)
  }
}

test()
