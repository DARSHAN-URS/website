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
  AlertCircle,
  Navigation,
  Users
} from "lucide-react";
import Link from "next/link";
import { translations } from "@/lib/translations";

interface Job {
  id: string;
  title: string;
  description: string;
  category_id: number;
  salary_min: number;
  job_city: string;
  created_at: string;
  employer_id: string;
  status: "open" | "closed";
  price?: number;
  location?: string;
}

export default function JobsPage() {
  const { role, user, setUser, language } = useUserStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);
  
  const t = translations[language as keyof typeof translations] || translations.EN;

  // New Job Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Painting");

  const router = useRouter();

  async function fetchJobs(customUserId?: string) {
    setLoading(true);
    let query = supabase.from("jobs").select("*").order("created_at", { ascending: false });
    
    const { role: currentRole, user: currentUser } = useUserStore.getState();
    const activeUserId = customUserId || currentUser?.id;

    if (currentRole === 'employer' && activeUserId) {
       query = query.eq('employer_id', activeUserId);
    } else {
       query = query.eq('status', 'open');
    }
    
    const { data, error } = await query;
    if (data) setJobs(data);
    if (error) console.error("Jobs fetch error:", error.message);
    setLoading(false);
  }

  async function fetchAppliedJobs() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("applications")
      .select("job_id")
      .eq("worker_id", session.user.id);

    if (data) {
      setAppliedJobIds(new Set(data.map(app => app.job_id)));
    }
  }

  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      
      setUser(session.user);
      fetchJobs(session.user.id);
      fetchAppliedJobs();
    }
    
    initCheck();
  }, [role, router, setUser]);

  const [detecting, setDetecting] = useState(false);

  async function handleDetectLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const city = data.address.city || data.address.town || data.address.suburb || data.address.state || "Unknown Location";
        setLocation(city);
      } catch (err) {
        console.error("Location detection failed", err);
      } finally {
        setDetecting(false);
      }
    }, (err) => {
      setDetecting(false);
      alert("Please enable location permissions.");
    });
  }

  async function handlePostJob(e: React.FormEvent) {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Please log in first");

    const newJob = {
      title,
      description,
      salary_min: parseFloat(price),
      salary_max: parseFloat(price),
      job_city: location,
      category_id: 1,
      employer_id: session.user.id,
      status: "open",
    };

    const { error } = await supabase.from("jobs").insert([newJob]);
    if (error) {
      alert("Error posting job: " + error.message);
    } else {
      setShowModal(false);
      await fetchJobs();
      setTitle(""); setDescription(""); setPrice(""); setLocation("");
    }
  }

  async function handleDeleteJob(id: string) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) alert(error.message);
    else await fetchJobs();
  }

  async function handleApplyJob(jobId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Please log in first");
    
    if (role !== 'worker') {
      return alert("Only workers can apply for jobs.");
    }

    setApplyingId(jobId);
    const { error } = await supabase.from("applications").insert([
      { job_id: jobId, worker_id: session.user.id, status: "pending" }
    ]);

    if (error) {
      alert("Error applying: " + error.message);
    } else {
      alert("Application submitted successfully!");
      setAppliedJobIds(prev => new Set([...Array.from(prev), jobId]));
    }
    setApplyingId(null);
  }

  return (
    <div className="p-4 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2533] font-serif uppercase">
               {role === 'employer' ? t.manage_jobs : t.available_jobs}
            </h1>
            <p className="text-sm md:text-base text-[#6b7f93] font-medium mt-1">
               {role === 'employer' ? "Post and track your active listings" : t.jobs_near_you}
            </p>
          </div>
          
          {role === 'employer' && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-[#3d7ab5] text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#2c5f8a] transition-all w-full md:w-auto"
            >
              <Plus className="w-5 h-5" />
              {t.post_job}
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {jobs.length === 0 ? (
              <div className="bg-white border border-dashed border-[#dde9f3] rounded-3xl p-10 md:p-20 text-center">
                 <AlertCircle className="w-12 h-12 text-[#6b7f93] mx-auto mb-4 opacity-20" />
                 <h3 className="text-xl font-bold text-[#1a2533]">No jobs found</h3>
                 <p className="text-sm text-[#6b7f93] mt-2">Try adjusting your filters or post a new request.</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-[#3d7ab5]">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0] uppercase tracking-wider">{job.category_id === 1 ? "Painting" : "General"}</span>
                       {role === 'employer' && (
                         <Link href={`/jobs/${job.id}/applications`} className="flex items-center gap-1.5 bg-[#eef5fb] text-[#3d7ab5] px-2 py-1 rounded-md border border-[#c8dff0] text-[10px] font-bold">
                           <Users className="w-3 h-3" /> {t.applicants_btn}
                         </Link>
                       )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-[#1a2533] mb-2">{job.title}</h3>
                    <p className="text-xs md:text-sm text-[#6b7f93] font-medium line-clamp-2 max-w-2xl mb-4 leading-relaxed">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-bold text-[#6b7f93]">
                       <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#3d7ab5]" /> {job.job_city || 'Anywhere'}</div>
                       <div className="flex items-center gap-1.5 text-[#1a8c4e]"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-[#f0f4f8] pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                       <div className="text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest mb-1">{t.budget}</div>
                       <div className="font-serif font-extrabold text-[#3d7ab5] text-xl md:text-2xl">₹{job.salary_min}</div>
                    </div>
                    {role === 'employer' ? (
                       <div className="flex gap-2">
                          <button onClick={() => router.push(`/jobs/${job.id}/applications`)} className="px-6 py-2.5 rounded-xl bg-[#eef5fb] text-[#3d7ab5] font-bold text-xs border border-[#c8dff0] hover:bg-[#d9e8f5]">{t.applicants_btn}</button>
                          <button className="p-2.5 rounded-xl bg-gray-50 border border-[#dde9f3] text-[#6b7f93]"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteJob(job.id)} className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    ) : (
                       <button 
                         onClick={() => handleApplyJob(job.id)}
                         disabled={appliedJobIds.has(job.id) || applyingId === job.id}
                         className={`px-6 md:px-8 py-3 rounded-xl font-bold text-xs transition-all ${
                           appliedJobIds.has(job.id) 
                             ? "bg-gray-100 text-[#1a8c4e]" 
                             : "bg-[#3d7ab5] text-white hover:bg-[#2c5f8a]"
                         }`}
                       >
                         {appliedJobIds.has(job.id) ? t.applied_btn : t.apply_now}
                       </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* POST JOB MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1a2533]/40 backdrop-blur-sm p-4 md:p-6 overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-2xl p-6 md:p-10 shadow-2xl">
               <h2 className="text-xl md:text-2xl font-extrabold text-[#1a2533] font-serif mb-6">{t.post_job}</h2>
               <form onSubmit={handlePostJob} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#6b7f93] uppercase mb-2 ml-1">{t.job_title}</label>
                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm" placeholder="e.g. Need Painter for 2BHK"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#6b7f93] uppercase mb-2 ml-1">{t.budget} (₹)</label>
                      <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm" placeholder="1500"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#6b7f93] uppercase mb-2 ml-1">{t.location}</label>
                      <div className="relative">
                        <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm" placeholder="City"/>
                        <button type="button" onClick={handleDetectLocation} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#3d7ab5]"><Navigation className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6b7f93] uppercase mb-2 ml-1">{t.description}</label>
                    <textarea rows={4} required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] font-medium text-sm resize-none" placeholder="Provide job details..."></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-[#3d7ab5] text-white py-4 rounded-2xl font-bold shadow-lg">{t.post_job}</button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-2xl border border-[#dde9f3] font-bold text-[#6b7f93]">{t.cancel}</button>
                  </div>
               </form>
            </div>
          </div>
        )}
    </div>
  );
}
