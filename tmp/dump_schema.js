const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const { data, error } = await supabase.from('employees').select('*').limit(1)
  if (data && data.length > 0) {
    const fs = require('fs')
    fs.writeFileSync('tmp_schema.txt', Object.keys(data[0]).join('\n'))
    console.log('Columns written to tmp_schema.txt')
  } else if (error) {
     console.error(error)
  }
}

test()
