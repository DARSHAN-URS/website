"use client";

import { useUserStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { MapPin, Search, Filter, Briefcase, User as UserIcon } from "lucide-react";

export default function Dashboard() {
  const { role } = useUserStore();
  const router = useRouter();
  const [workers, setWorkers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCheck() {
      // 1. Client-side session verification as requested
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
          console.log("No client-side session found: Redirecting to login...");
          router.replace('/login');
          return;
      }
      
      // 2. Data fetching logic
      await fetchData();
    }
    
    async function fetchData() {
      // Prevent fetching if client isn't fully initialized with ENV variables
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
         setLoading(false);
         return;
      }
      
      setLoading(true);
      try {
        if (role === 'employer') {
          const { data } = await supabase.from('employees').select('*').limit(6);
          if (data) setWorkers(data);
        } else {
          const { data } = await supabase.from('jobs').select('*').limit(6);
          if (data) setJobs(data);
        }
      } catch (e) {
        console.error("Fetch error", e);
      }
      setLoading(false);
    }
    
    initCheck();
  }, [role, router]);

  return (
    <div className="flex bg-[#fdfdfd] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 mt-6 lg:mt-0">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif">
              {role === 'employer' ? "Find Skilled Workers" : "Available Jobs"}
            </h1>
            <p className="text-[#6b7f93] font-medium mt-1">Noida, Uttar Pradesh · 📍 5km Radius</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#dde9f3] rounded-2xl p-1.5 flex shadow-sm">
               <div className="flex items-center gap-2.5 px-4 py-2 border-r border-[#dde9f3]">
                  <Search className="w-4 h-4 text-[#3d7ab5]" />
                  <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm font-medium w-48"/>
               </div>
               <button className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 rounded-xl transition-all">
                  <Filter className="w-4 h-4 text-[#6b7f93]" />
                  <span className="text-sm font-bold text-[#6b7f93]">Filters</span>
               </button>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {role === 'employer' ? (
              workers.length > 0 ? (
                workers.map((worker) => (
                  <div key={worker.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden border-b-4 border-b-[#3d7ab5]">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-full bg-[#eef5fb] flex items-center justify-center text-xl shadow-inner group-hover:bg-[#3d7ab5] group-hover:text-white transition-colors duration-300 shrink-0">
                        👨‍🎨
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1a2533] truncate">{worker.full_name || 'Anonymous Worker'}</h3>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#6b7f93] mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>0.8km away · Noida</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-extrabold text-[#3d7ab5] text-lg">₹499/day</div>
                        <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#1a8c4e] flex items-center gap-1 justify-end mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1a8c4e]"></span> Available
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-6 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0]">Verified</span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0]">Painter</span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0]">Eng/Hi</span>
                    </div>
                    <button className="w-full bg-[#3d7ab5] text-white py-3 rounded-2xl font-bold transition-all hover:bg-[#2c5f8a] hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-lg">
                      Hire Ajay Pawar
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center opacity-40 italic font-medium">No nearby workers found yet.</div>
              )
            ) : (
              jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group border-l-4 border-l-[#3d7ab5]">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-[#1a2533] text-lg mb-1">{job.title || 'Untitled Job'}</h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-[#6b7f93]">
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>Full Time · Urgency: Immeditate</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif font-extrabold text-[#3d7ab5] text-xl">₹{job.price}</div>
                          <div className="text-[10px] uppercase font-extrabold text-[#6b7f93] mt-1">per day</div>
                        </div>
                    </div>
                    <p className="text-sm text-[#6b7f93] line-clamp-2 mb-6 font-medium bg-[#fcfcfd] p-3 rounded-xl border border-dashed border-[#dde9f3]">
                        {job.description || "Need a skilled worker to handle renovation work at a residential property."}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#f0f4f8]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#eef5fb] flex items-center justify-center text-xs shrink-0"><UserIcon className="w-4 h-4 text-[#3d7ab5]" /></div>
                          <span className="text-[11px] font-bold text-[#6b7f93]">Verified Employer</span>
                        </div>
                        <button className="bg-[#3d7ab5] text-white p-[10px_22px] rounded-xl font-bold text-xs hover:bg-[#2c5f8a] transition-all">Apply Now</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center opacity-40 italic font-medium">No available jobs at the moment.</div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}
