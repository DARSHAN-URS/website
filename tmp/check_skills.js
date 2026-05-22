const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("--- Checking skills field ---")
  const { data, error } = await supabase.from('employees').select('id, skills').limit(5)
  if (data) {
    data.forEach(e => {
      console.log(`ID: ${e.id}`)
      console.log(`Skills Type: ${typeof e.skills}`)
      console.log(`Skills Value: ${JSON.stringify(e.skills)}`)
    })
  } else {
    console.log(`ERROR: ${error.message}`)
  }
}

test()
