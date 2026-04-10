const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bixrgczukyudjoprsjyp.supabase.co"
const supabaseKey = "sb_publishable_oqeIi7MymSXHWuiCNgs6mA_pyNbnvSy"
const supabase = createClient(supabaseUrl, supabaseKey)

const workers = [
  {
    full_name: "Rahul Sharma",
    email: "rahul.painter@example.com",
    phone: "9876543210",
    city: "Noida",
    is_available: true,
    work_details: "Professional wall painting and wood polishing with 5 years experience.",
    skills: ["Painting", "Polish"],
    hourly_rate: 250,
    category: "painter",
    rating: 4.8,
    avatar_url: "https://images.unsplash.com/photo-1540560041133-6494b30c337d?w=300",
    lat: 28.5355,
    lng: 77.3910
  },
  {
    full_name: "Amit Kumar",
    email: "amit.elec@example.com",
    phone: "9876543211",
    city: "Delhi",
    is_available: true,
    work_details: "Expert electrician specializing in house wiring and AC repair.",
    skills: ["Wiring", "AC"],
    hourly_rate: 400,
    category: "electrician",
    rating: 4.9,
    avatar_url: "https://images.unsplash.com/photo-1544717297-fa154daaf76d?w=300",
    lat: 28.6139,
    lng: 77.2090
  },
  {
    full_name: "Suresh Singh",
    email: "suresh.driver@example.com",
    phone: "9876543212",
    city: "Noida",
    is_available: true,
    work_details: "Experienced driver with 10 years experience in heavy vehicles.",
    skills: ["Driving"],
    hourly_rate: 350,
    category: "driver",
    rating: 4.7,
    avatar_url: "https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=300",
    lat: 28.5700,
    lng: 77.3200
  },
  {
    full_name: "Preeti Mishra",
    email: "preeti.clean@example.com",
    phone: "9876543213",
    city: "Gurgaon",
    is_available: true,
    work_details: "Deep cleaning services for kitchens and home furniture.",
    skills: ["Cleaning"],
    hourly_rate: 200,
    category: "cleaner",
    rating: 4.6,
    avatar_url: "https://images.unsplash.com/photo-1563237023-b1e970526dcb?w=300",
    lat: 28.4595,
    lng: 77.0266
  },
  {
    full_name: "Vikash Yadhav",
    email: "vikash.plumb@example.com",
    phone: "9876543214",
    city: "Noida",
    is_available: true,
    work_details: "Lead plumber for pipeline and bathroom fixture installations.",
    skills: ["Plumbing"],
    hourly_rate: 300,
    category: "plumber",
    rating: 4.8,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    lat: 28.5355,
    lng: 77.3910
  }
]

async function seed() {
  console.log("Seeding workers (using simple insert)...")
  for (const worker of workers) {
    const { data: existing, error: findError } = await supabase.from('employees').select('id').eq('email', worker.email)
    
    if (existing && existing.length > 0) {
      console.log(`${worker.full_name} exists, skipping.`)
      continue
    }

    const { error } = await supabase
      .from('employees')
      .insert(worker)
    
    if (error) {
      console.error(`Error adding ${worker.full_name}:`, error.message)
    } else {
      console.log(`Successfully added ${worker.full_name}`)
    }
  }
  console.log("Done seeding!")
}

seed()
