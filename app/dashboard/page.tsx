"use client";

import { useUserStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { MapPin, Search, Filter, Briefcase, User as UserIcon, ChevronRight, Navigation, Mic, Languages } from "lucide-react";
import { translations, languages } from "@/lib/translations";

export default function Dashboard() {
  const { role, setUser, language, setLanguage } = useUserStore();
  const router = useRouter();
  const [workers, setWorkers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const t = translations[language as keyof typeof translations] || translations.EN;

  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      setUser(session.user);
      await fetchData();
    }
    
    async function fetchData() {
      setLoading(true);
      try {
        if (role === 'employer') {
          const { data, error } = await supabase.from('employees').select('*').limit(6);
          if (data) setWorkers(data);
          if (error) console.error("Worker fetch error:", error);
        } else {
          const { data, error } = await supabase.from('jobs').select('*').eq('status', 'open').limit(6);
          if (data) setJobs(data);
          if (error) console.error("Job fetch error:", error);
        }
      } catch (e) {
        console.error("Unexpected fetch error", e);
      }
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
    
    initCheck();
    fetchAppliedJobs();
  }, [role, router, setUser]);

  const handleHire = (worker: any) => {
    router.push(`/hire/${worker.id}`);
  };

  const handleApply = async (job: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/login');

    const { error } = await supabase.from('applications').insert({
      job_id: job.id,
      worker_id: session.user.id,
      status: 'pending'
    });

    if (error) {
      if (error.message.includes('unique')) alert("You have already applied for this job!");
      else alert("Application failed: " + error.message);
    } else {
      alert(`Application submitted for ${job.title}!`);
      setAppliedJobIds(prev => new Set([...Array.from(prev), job.id]));
      router.push('/applied');
    }
  };

  const [currentCity, setCurrentCity] = useState("Noida");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const handleUpdateLocation = (city?: string) => {
    if (city) {
      setCurrentCity(city);
      setShowLocationPicker(false);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const detected = data.address.city || data.address.town || data.address.village;
        if (detected) {
          setCurrentCity(detected);
          setShowLocationPicker(false);
        }
      });
    }
  };

  return (
    <div className="p-4 md:p-10">
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#1a2533] font-serif tracking-tight">
              {role === 'employer' ? t.find_workers : t.available_jobs}
            </h1>
            <p className="text-sm md:text-base text-[#6b7f93] font-medium mt-1">
              {role === 'employer' ? t.verified_pros : t.jobs_near_you}
            </p>
          </div>
          
          <div className="flex gap-3">
             <div className="relative">
                <button onClick={() => setShowLocationPicker(!showLocationPicker)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#dde9f3] bg-white text-xs font-bold text-[#1a2533] hover:border-[#3d7ab5] transition-all">
                  <MapPin className="w-4 h-4 text-[#3d7ab5]" /> {currentCity}
                </button>
                {showLocationPicker && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#dde9f3] rounded-2xl shadow-xl p-4 z-[100]">
                    <button onClick={() => handleUpdateLocation()} className="w-full text-left text-[10px] font-bold text-[#3d7ab5] mb-2 uppercase tracking-widest">{t.detect_location}</button>
                    <div className="space-y-1">
                      {["Noida", "Delhi", "Mumbai"].map(c => (
                        <button key={c} onClick={() => handleUpdateLocation(c)} className="w-full text-left text-xs p-2 hover:bg-gray-50 rounded-lg">{c}</button>
                      ))}
                    </div>
                  </div>
                )}
             </div>
             <div className="relative">
                <button onClick={() => setShowLanguagePicker(!showLanguagePicker)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#dde9f3] bg-white text-xs font-bold text-[#1a2533]">
                  <Languages className="w-4 h-4 text-[#3d7ab5]" /> {language}
                </button>
                {showLanguagePicker && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#dde9f3] rounded-2xl shadow-xl p-4 z-[100]">
                    <div className="space-y-1">
                      {languages.map(l => (
                        <button key={l.code} onClick={() => { setLanguage(l.code); setShowLanguagePicker(false); }} className="w-full text-left text-xs p-2 hover:bg-gray-50 rounded-lg">{l.label}</button>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7f93]" />
            <input type="text" placeholder={role === 'employer' ? t.search_placeholder : t.search_jobs} className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#dde9f3] outline-none focus:border-[#3d7ab5] text-sm font-medium"/>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#dde9f3] rounded-2xl text-sm font-bold text-[#6b7f93] hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {role === 'employer' ? (
            workers.map((worker) => (
              <div key={worker.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all border-b-4 border-b-[#3d7ab5]">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-[#eef5fb] flex items-center justify-center text-xl shrink-0">
                    {worker.avatar_url ? <img src={worker.avatar_url} className="w-full h-full rounded-full object-cover"/> : "👨‍🎨"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1a2533] truncate">{worker.full_name || 'Anonymous Worker'}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#6b7f93]">
                      <MapPin className="w-3 h-3" /> {worker.city || 'Noida'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif font-extrabold text-[#3d7ab5]">₹{worker.hourly_rate || 499}</div>
                    <div className="text-[9px] font-bold text-[#1a8c4e]">Available</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/messages?user_id=${worker.id}`)} className="flex-1 bg-[#eef5fb] text-[#3d7ab5] py-2.5 rounded-xl font-bold text-xs hover:bg-[#d9e8f5] transition-all">{t.chat}</button>
                  <button onClick={() => handleHire(worker)} className="flex-[2] bg-[#3d7ab5] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#2c5f8a] transition-all">{t.hire_now}</button>
                </div>
              </div>
            ))
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-[#3d7ab5]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-[#1a2533] text-base mb-1">{job.title || 'Untitled Job'}</h3>
                      <div className="text-[11px] font-bold text-[#6b7f93] flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.job_city || 'Noida'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-extrabold text-[#3d7ab5] text-lg">₹{job.salary_min || 0}</div>
                    </div>
                </div>
                <p className="text-xs text-[#6b7f93] line-clamp-2 mb-6 font-medium">{job.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => router.push(`/messages?user_id=${job.employer_id}`)} className="flex-1 bg-[#eef5fb] text-[#3d7ab5] py-2.5 rounded-xl font-bold text-xs">{t.chat}</button>
                  <button 
                    onClick={() => handleApply(job)}
                    disabled={appliedJobIds.has(job.id)}
                    className={`flex-[2] py-2.5 rounded-xl font-bold text-xs transition-all ${
                      appliedJobIds.has(job.id) ? "bg-gray-100 text-[#1a8c4e]" : "bg-[#3d7ab5] text-white"
                    }`}
                  >
                    {appliedJobIds.has(job.id) ? t.applied_btn : t.apply_now}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
