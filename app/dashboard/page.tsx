"use client";

import { useUserStore } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { MapPin, Search, Filter, Briefcase, User as UserIcon, ChevronRight, Navigation, Mic, Languages } from "lucide-react";

export default function Dashboard() {
  const { role, setUser } = useUserStore();
  const router = useRouter();
  const [workers, setWorkers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initCheck() {
      // Task 6: Client-side session verification
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("No client-side session found: Redirecting to login...");
        router.replace('/login');
        return;
      }
      
      // Update store with actual user
      setUser(session.user);
      
      // If session exists, proceed to fetch data
      await fetchData();
    }
    
    async function fetchData() {
      setLoading(true);
      try {
        if (role === 'employer') {
          // Fetch real available workers (employees table)
          const { data, error } = await supabase.from('employees').select('*').limit(6);
          if (data) setWorkers(data);
          if (error) console.error("Worker fetch error:", error);
        } else {
          // Fetch real open jobs
          const { data, error } = await supabase.from('jobs').select('*').eq('status', 'open').limit(6);
          if (data) setJobs(data);
          if (error) console.error("Job fetch error:", error);
        }
      } catch (e) {
        console.error("Unexpected fetch error", e);
      }
      setLoading(false);
    }
    
    initCheck();
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
      router.push('/applied');
    }
  };

  const [currentCity, setCurrentCity] = useState("Noida");
  const [isLocatingHeader, setIsLocatingHeader] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'HI', label: 'हिन्दी' },
    { code: 'MR', label: 'मराठी' },
    { code: 'TA', label: 'தமிழ்' },
    { code: 'TE', label: 'తెలుగు' },
    { code: 'BN', label: 'বাংলা' },
    { code: 'KN', label: 'ಕನ್ನಡ' },
    { code: 'GU', label: 'ગુજરાતી' }
  ];

  const translations = {
    EN: {
      title: role === 'employer' ? "Find Skilled Workers" : "Available Jobs",
      location: "Uttar Pradesh · 5km Radius",
      search: "Search...",
      filters: "Filters",
      available: "Available",
      locTitle: "Set Your Location",
      locDesc: "Find workers or jobs near you",
      useCurrent: "Use My Current Location",
      popular: "POPULAR CITIES"
    },
    HI: {
      title: role === 'employer' ? "कुशल श्रमिक खोजें" : "उपलब्ध नौकरियां",
      location: "उत्तर प्रदेश · 5 किमी दायरा",
      search: "खोजें...",
      filters: "फ़िल्टर",
      available: "उपलब्ध",
      locTitle: "अपना स्थान चुनें",
      locDesc: "अपने आस-पास के श्रमिकों या नौकरियों को खोजें",
      useCurrent: "मेरे वर्तमान स्थान का उपयोग करें",
      popular: "लोकप्रिय शहर"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.EN;

  const handleUpdateLocation = (city?: string) => {
    if (city) {
      setCurrentCity(city);
      setShowLocationPicker(false);
      return;
    }

    setIsLocatingHeader(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.address && (data.address.city || data.address.town || data.address.village)) {
            setCurrentCity(data.address.city || data.address.town || data.address.village);
            setShowLocationPicker(false);
          }
        } catch (err) {
          console.error("Location fetch error:", err);
        } finally {
          setIsLocatingHeader(false);
        }
      }, () => {
        setIsLocatingHeader(false);
        alert("Location access denied.");
      });
    }
  };

  return (
    <div className="p-8 lg:p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif">
          {t.title}
        </h1>
        
        {/* Preference Tabs Section */}
        <div className="flex flex-wrap gap-4 mt-8">
           <div className="relative">
              <button 
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                disabled={isLocatingHeader}
                className={`flex items-center gap-3 px-6 py-4 rounded-[22px] border-2 transition-all ${isLocatingHeader ? 'border-orange-200 bg-orange-50' : 'border-[#dde9f3] bg-white hover:border-[#3d7ab5]/30'}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#eef5fb] flex items-center justify-center shadow-inner">
                   <MapPin className={`w-5 h-5 ${isLocatingHeader ? 'text-orange-500 animate-bounce' : 'text-[#3d7ab5]'}`} />
                </div>
                <div className="text-left">
                   <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-0.5">Location</span>
                   <span className="text-sm font-black text-[#1a2533]">{isLocatingHeader ? "Updating City..." : currentCity}</span>
                </div>
                <div className="ml-4 w-6 h-6 rounded-full bg-[#f8fafd] flex items-center justify-center border border-[#eef5fb]">
                   <ChevronRight className={`w-3 h-3 text-[#3d7ab5] transition-transform ${showLocationPicker ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Enhanced Location Picker Overlay */}
              {showLocationPicker && (
                <div className="absolute top-full left-0 mt-4 w-[340px] bg-white border border-[#dde9f3] rounded-[32px] shadow-2xl p-6 z-50 animate-in fade-in zoom-in duration-200">
                   <h3 className="text-lg font-black text-[#1a2533] mb-1">{t.locTitle}</h3>
                   <p className="text-xs text-[#6b7f93] mb-6 font-medium">{t.locDesc}</p>
                   
                   {/* Manual Entry Text Box */}
                   <div className="relative mb-6 group/locsearch">
                      <input 
                         type="text" 
                         value={currentCity}
                         onChange={(e) => setCurrentCity(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && setShowLocationPicker(false)}
                         placeholder="Enter your city..." 
                         className="w-full bg-[#f8fafd] border border-[#d9e8f5] rounded-xl py-3 px-10 text-sm font-bold text-[#1a2533] outline-none focus:border-[#3d7ab5] transition-all"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d7ab5]" />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-[#3d7ab5] hover:bg-white hover:shadow-sm transition-all" title="Voice Input">
                         <Mic className="w-3.5 h-3.5" />
                      </button>
                   </div>

                   <button 
                      onClick={() => handleUpdateLocation()}
                      disabled={isLocatingHeader}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#eef5fb] border border-[#d9e8f5] hover:bg-[#d9e8f5] transition-all group mb-6"
                   >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                         <Navigation className="w-5 h-5 text-[#3d7ab5]" />
                      </div>
                      <div className="text-left">
                         <div className="text-sm font-black text-[#3d7ab5]">{t.useCurrent}</div>
                         <div className="text-[10px] font-extrabold text-[#6b7f93] uppercase tracking-widest">via GPS Auto-detect</div>
                      </div>
                   </button>

                   <label className="text-[10px] font-extrabold text-[#6b7f93] uppercase tracking-[2px] block mb-4">{t.popular}</label>
                   <div className="grid grid-cols-2 gap-3 mb-2">
                      {["Noida", "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"].map(city => (
                        <button 
                           key={city}
                           onClick={() => handleUpdateLocation(city)}
                           className="flex items-center gap-2 p-3 rounded-xl border border-gray-50 hover:border-[#3d7ab5]/30 hover:bg-[#f8fafd] transition-all group"
                        >
                           <MapPin className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                           <span className="text-xs font-bold text-[#1a2533]">{city}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}
           </div>

            <div className="relative">
               <button 
                 onClick={() => { setShowLanguagePicker(!showLanguagePicker); setShowLocationPicker(false); }}
                 className="flex items-center gap-3 px-6 py-4 rounded-[22px] border-2 border-[#dde9f3] bg-white hover:border-[#3d7ab5]/30 transition-all"
               >
                  <div className="w-10 h-10 rounded-xl bg-[#eef5fb] flex items-center justify-center shadow-inner">
                     <Languages className="w-5 h-5 text-[#3d7ab5]" />
                  </div>
                  <div className="text-left">
                     <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-0.5">Language</span>
                     <span className="text-sm font-black text-[#1a2533]">{languages.find(l => l.code === language)?.label || 'English'}</span>
                  </div>
                  <div className="ml-4 w-6 h-6 rounded-full bg-[#f8fafd] flex items-center justify-center border border-[#eef5fb]">
                     <ChevronRight className={`w-3 h-3 text-[#3d7ab5] transition-transform ${showLanguagePicker ? 'rotate-90' : ''}`} />
                  </div>
               </button>

               {/* Language Picker Overlay */}
               {showLanguagePicker && (
                 <div className="absolute top-full right-0 mt-4 w-[280px] bg-white border border-[#dde9f3] rounded-[32px] shadow-2xl p-6 z-50 animate-in fade-in zoom-in duration-200">
                    <h3 className="text-lg font-black text-[#1a2533] mb-1">Select Language</h3>
                    <p className="text-xs text-[#6b7f93] mb-6 font-medium">Choose your preferred language</p>
                    
                    <div className="grid grid-cols-1 gap-2">
                       {languages.map(lang => (
                         <button 
                            key={lang.code}
                            onClick={() => {
                               setLanguage(lang.code.toUpperCase());
                               setShowLanguagePicker(false);
                            }}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${language === lang.code.toUpperCase() ? 'bg-[#eef5fb] border-[#3d7ab5] shadow-sm' : 'border-gray-50 hover:border-[#3d7ab5]/30 hover:bg-[#f8fafd]'}`}
                         >
                            <span className={`text-sm font-bold ${language === lang.code.toUpperCase() ? 'text-[#3d7ab5]' : 'text-[#1a2533]'}`}>{lang.label}</span>
                            {language === lang.code.toUpperCase() && <div className="w-2 h-2 rounded-full bg-[#3d7ab5]"></div>}
                         </button>
                       ))}
                    </div>
                 </div>
               )}
            </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <p className="text-[#6b7f93] font-medium text-sm">
           {t.location} · 📍 5km Radius
        </p>
        <div className="bg-white border border-[#dde9f3] rounded-2xl p-1.5 flex shadow-sm items-center">
            <div className="flex items-center gap-2.5 px-4 py-2 border-r border-[#dde9f3] flex-1">
                <Search className="w-4 h-4 text-[#3d7ab5]" />
                <input type="text" placeholder={t.search} className="bg-transparent border-none outline-none text-sm font-medium flex-1"/>
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#3d7ab5] hover:bg-[#eef5fb] transition-all" title="Voice Search">
                   <Mic className="w-4 h-4" />
                </button>
            </div>
            <button className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 rounded-xl transition-all">
                <Filter className="w-4 h-4 text-[#6b7f93]" />
                <span className="text-sm font-bold text-[#6b7f93]">{t.filters}</span>
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {role === 'employer' ? (
            workers.length > 0 ? (
              workers.map((worker) => (
                <div key={worker.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden border-b-4 border-b-[#3d7ab5]">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-[#eef5fb] flex items-center justify-center text-xl shadow-inner group-hover:bg-[#3d7ab5] group-hover:text-white transition-colors duration-300 shrink-0">
                      {worker.avatar_url ? <img src={worker.avatar_url} className="w-full h-full rounded-full object-cover"/> : "👨‍🎨"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1a2533] truncate">{worker.full_name || 'Anonymous Worker'}</h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#6b7f93] mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{worker.city || 'Noida'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif font-extrabold text-[#3d7ab5] text-lg">₹{worker.hourly_rate || 499}/d</div>
                      <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#1a8c4e] flex items-center gap-1 justify-end mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1a8c4e]"></span> Available
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mb-6 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0]">{worker.category || 'General'}</span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0]">Verified</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => router.push(`/messages?user_id=${worker.id}`)}
                      className="flex-1 bg-[#eef5fb] text-[#3d7ab5] py-3 rounded-2xl font-bold transition-all hover:bg-[#d9e8f5]"
                    >
                      Chat
                    </button>
                    <button 
                      onClick={() => handleHire(worker)}
                      className="flex-[2] bg-[#3d7ab5] text-white py-3 rounded-2xl font-bold transition-all hover:bg-[#2c5f8a] shadow-md"
                    >
                      Hire Now
                    </button>
                  </div>
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
                            <span>{job.job_city || 'Noida'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif font-extrabold text-[#3d7ab5] text-xl">₹{job.salary_min || 0}</div>
                        <div className="text-[10px] uppercase font-extrabold text-[#6b7f93] mt-1">per day</div>
                      </div>
                  </div>
                  <p className="text-sm text-[#6b7f93] line-clamp-2 mb-6 font-medium bg-[#fcfcfd] p-3 rounded-xl border border-dashed border-[#dde9f3]">
                      {job.description || "Need a skilled worker to handle renovation work."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#f0f4f8]">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#eef5fb] flex items-center justify-center text-xs shrink-0"><UserIcon className="w-4 h-4 text-[#3d7ab5]" /></div>
                        <span className="text-[11px] font-bold text-[#6b7f93]">Verified</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push(`/messages?user_id=${job.employer_id}`)}
                          className="bg-[#eef5fb] text-[#3d7ab5] px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#d9e8f5] transition-all"
                        >
                          Chat
                        </button>
                        <button 
                          onClick={() => handleApply(job)}
                          className="bg-[#3d7ab5] text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-[#2c5f8a] transition-all"
                        >
                          Apply Now
                        </button>
                      </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center opacity-40 italic font-medium">No available jobs at the moment.</div>
            )
          )}
        </div>
      )}
    </div>
  );
}

