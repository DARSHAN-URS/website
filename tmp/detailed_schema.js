const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("--- EMPLOYEES ---")
  const { data, error } = await supabase.from('employees').select('*').limit(10)
  if (data) {
     const allKeys = new Set();
     data.forEach(d => Object.keys(d).forEach(k => allKeys.add(k)));
     console.log('All found keys in EMPLOYEES:', Array.from(allKeys).join(', '))
  } else if (error) {
     console.error(error)
  }

  console.log("--- EMPLOYERS ---")
  const { data: eData } = await supabase.from('employers').select('*').limit(1)
  if (eData && eData.length > 0) {
     console.log('All found keys in EMPLOYERS:', Object.keys(eData[0]).join(', '))
  }
}

test()
