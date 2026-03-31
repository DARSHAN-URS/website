"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  created_at: string;
  user_id: string;
  status: "open" | "closed";
}

export default function JobsPage() {
  const { role, user } = useUserStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New Job Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Painting");

  const router = useRouter();

  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No jobs session: Redirecting to login...");
        router.replace('/login');
        return;
      }
      fetchJobs();
    }
    initCheck();
  }, [role, router]);

  async function fetchJobs() {
    setLoading(true);
    let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });
    
    // If employer, show their own jobs; if worker, show all open jobs
    /* 
    if (role === 'employer' && user?.id) {
       query = query.eq('user_id', user.id);
    } else {
       query = query.eq('status', 'open');
    }
    */
    
    const { data, error } = await query;
    if (data) setJobs(data);
    setLoading(false);
  }

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Please log in first");

    const newJob = {
      title,
      description,
      price: parseFloat(price),
      location,
      category,
      user_id: session.user.id,
      status: "open",
    };

    const { error } = await supabase.from("jobs").insert([newJob]);
    if (error) {
      alert(error.message);
    } else {
      setShowModal(false);
      fetchJobs();
      // Reset form
      setTitle(""); setDescription(""); setPrice(""); setLocation("");
    }
  }

  async function handleDeleteJob(id: string) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchJobs();
  }

  return (
    <div className="flex bg-[#fdfdfd] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 mt-6 lg:mt-0">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif">
               {role === 'employer' ? "Manage Your Jobs" : "Available Opportunities"}
            </h1>
            <p className="text-[#6b7f93] font-medium mt-1">
               {role === 'employer' ? "Post and track your active listings" : "Find work that matches your skills"}
            </p>
          </div>
          
          {role === 'employer' && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#3d7ab5] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-[#2c5f8a] transition-all"
            >
              <Plus className="w-5 h-5" />
              Post a Job
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.length === 0 ? (
              <div className="bg-white border border-dashed border-[#dde9f3] rounded-3xl p-20 text-center">
                 <AlertCircle className="w-12 h-12 text-[#6b7f93] mx-auto mb-4 opacity-20" />
                 <h3 className="text-xl font-bold text-[#1a2533]">No jobs found</h3>
                 <p className="text-[#6b7f93] mt-2">Try adjusting your filters or post a new request.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-[#3d7ab5]">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0] uppercase tracking-wider">{job.category}</span>
                       <span className="text-[10px] font-bold text-[#6b7f93] uppercase tracking-widest bg-gray-50 px-2.5 py-0.5 rounded-full">ID: {job.id.slice(0, 8)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1a2533] mb-2">{job.title}</h3>
                    <p className="text-sm text-[#6b7f93] font-medium line-clamp-2 max-w-2xl mb-4 leading-relaxed">{job.description}</p>
                    <div className="flex items-center gap-6 text-xs font-bold text-[#6b7f93]">
                       <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#3d7ab5]" /> {job.location || 'Anywhere'}</div>
                       <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#3d7ab5]" /> Just Now</div>
                       <div className="flex items-center gap-1.5 text-[#1a8c4e]"><CheckCircle2 className="w-3.5 h-3.5" /> Verified Listing</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 pl-6 border-l border-[#f0f4f8]">
                    <div className="text-right">
                       <div className="text-[11px] font-extrabold text-[#6b7f93] uppercase tracking-widest mb-1">Budget</div>
                       <div className="font-serif font-extrabold text-[#3d7ab5] text-2xl">₹{job.price}</div>
                    </div>
                    {role === 'employer' ? (
                       <div className="flex gap-2">
                          <button className="p-3 rounded-xl bg-gray-50 border border-[#dde9f3] text-[#6b7f93] hover:bg-gray-100 transition-all"><Edit3 className="w-5 h-5" /></button>
                          <button onClick={() => handleDeleteJob(job.id)} className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 transition-all"><Trash2 className="w-5 h-5" /></button>
                       </div>
                    ) : (
                       <button className="bg-[#3d7ab5] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-[#2c5f8a] transition-all active:scale-95">Apply for Job</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* POST JOB MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1a2533]/40 backdrop-blur-sm p-6 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-2xl p-10 shadow-2xl animate-[fadeUp_0.4s_ease_both]">
               <h2 className="text-2xl font-extrabold text-[#1a2533] font-serif mb-2">Create New Job Post</h2>
               <p className="text-[#6b7f93] font-medium mb-8">Reach thousands of verified skilled workers nearby.</p>
               
               <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#1a2533] mb-2 ml-1">Job Title</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm" placeholder="e.g. Need Painter for 2BHK Apartment"/>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1a2533] mb-2 ml-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm appearance-none bg-white">
                      <option>Painting</option>
                      <option>Plumbing</option>
                      <option>Carpentry</option>
                      <option>Electrician</option>
                      <option>Cleaning</option>
                      <option>Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1a2533] mb-2 ml-1">Budget (₹)</label>
                    <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm" placeholder="e.g. 1500"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#1a2533] mb-2 ml-1">Location</label>
                    <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm" placeholder="e.g. Sector 62, Noida"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#1a2533] mb-2 ml-1">Description</label>
                    <textarea rows={4} required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm resize-none" placeholder="Provide details about the job, requirements, and timing..."></textarea>
                  </div>
                  
                  <div className="md:col-span-2 flex gap-4 mt-4">
                    <button type="submit" className="flex-1 bg-[#3d7ab5] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#2c5f8a] transition-all active:scale-95">Confirm & Post Job</button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-2xl border border-[#dde9f3] font-bold text-[#6b7f93] hover:bg-gray-50 transition-all">Cancel</button>
                  </div>
               </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
