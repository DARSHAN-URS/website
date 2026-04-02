"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Camera, 
  Save, 
  ArrowRight, 
  Star,
  Globe,
  Settings as SettingsIcon,
  ShieldCheck,
  ArrowLeft,
  Navigation
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { role, setRole, user } = useUserStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [hourlyRate, setHourlyRate] = useState(150);
  const [category, setCategory] = useState("General Professional");
  const [isAvailable, setIsAvailable] = useState(true);
  const [detecting, setDetecting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No profile session: Redirecting to login...");
        router.replace('/login');
        return;
      }
      fetchProfile();
    }
    initCheck();
  }, [user, router]);

  async function fetchProfile() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Try fetching from employees first
      let { data, error } = await supabase.from('employees').select('*').eq('id', session.user.id).maybeSingle();
      let detectedRole = 'employee';

      // If not in employees, try employers
      if (!data) {
        const { data: empData } = await supabase.from('employers').select('*').eq('id', session.user.id).maybeSingle();
        if (empData) {
          data = empData;
          detectedRole = 'employer';
          if (!role) setRole('employer');
        }
      } else {
        if (!role) setRole('worker');
      }

      if (data) {
        const mappedName = data.full_name || data.company_name || "";
        setProfile({
          ...data,
          full_name: mappedName,
          role: detectedRole
        });
        setFullName(mappedName);
        setPhone(data.phone || "");
        setBio(data.work_details || "");
        setCity(data.city || "");
        setSkills(data.skills || []);
        setHourlyRate(data.hourly_rate || 0);
        setCategory(data.category || "General Professional");
        setIsAvailable(data.is_available ?? true);
      } else {
        setProfile({ email: session.user.email, full_name: "New Profile" });
      }
    }
    setLoading(false);
  }

  async function handleDetectLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const detectedCity = data.address.city || data.address.town || data.address.suburb || data.address.state || "Unknown";
        setCity(detectedCity);
      } catch (err) {
        console.error(err);
      } finally {
        setDetecting(false);
      }
    }, () => setDetecting(false));
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const table = role === 'employer' ? 'employers' : 'employees';
    const updates: any = { id: session.user.id };

    if (role === 'employer') {
        updates.company_name = fullName;
    } else {
        updates.full_name = fullName;
        updates.phone = phone;
        updates.work_details = bio;
        updates.city = city;
        updates.skills = skills;
        updates.is_available = isAvailable;
    }

    const { error } = await supabase.from(table).upsert(updates);

    if (error) {
      console.error("Update error:", error.message);
      alert("Error updating profile: " + error.message);
    } else {
      setIsEditing(false);
      await fetchProfile();
    }
    setLoading(false);
  }

  if (loading && !profile) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  return (
    <>
        {/* Modern Header Hero Section */}
        <div className="h-[320px] bg-[#1a2533] relative overflow-hidden">
           {/* Abstract Decorative Background */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#3d7ab5] to-[#2c5f8a] opacity-90"></div>
           <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-[#3d7ab5]/30 rounded-full blur-2xl"></div>
           
           <div className="px-12 py-12 text-white relative z-10 h-full flex flex-col justify-start">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                 <h1 className="text-4xl font-extrabold font-serif tracking-tight">Account Profile</h1>
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-extrabold tracking-[0.2em] uppercase text-white/80 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full border border-white/20">
                 <ShieldCheck className="w-4 h-4 text-white" /> Identity Verified Account
              </div>
           </div>
           
           {/* Integrated Profile Info Card (Inside Hero) */}
           <div className="absolute bottom-8 left-12 flex items-center gap-8 z-20">
              <div className="relative group">
                 <div className="w-36 h-36 rounded-[40px] bg-white p-1.5 shadow-2xl ring-4 ring-white/10">
                    <div className="w-full h-full rounded-[34px] bg-[#f8fafd] flex items-center justify-center text-5xl overflow-hidden border border-[#dde9f3]">
                       {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : "👨‍💼"}
                    </div>
                 </div>
                 <button className="absolute bottom-1 right-1 w-11 h-11 bg-white shadow-xl rounded-2xl border border-gray-100 flex items-center justify-center text-[#3d7ab5] hover:bg-[#3d7ab5] hover:text-white transition-all scale-100 hover:scale-110 active:scale-95 z-30">
                    <Camera className="w-5 h-5" />
                 </button>
              </div>
              <div className="pb-2 drop-shadow-md">
                 <h2 className="text-3xl font-extrabold text-white mb-2 drop-shadow-sm">{profile?.full_name}</h2>
                 <p className="text-white/80 font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-white/50" /> {profile?.city || 'No Location Set'}
                 </p>
                 {role !== 'employer' && (
                    <div className="flex items-center gap-2 mt-4 overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-1 pr-3 w-fit shadow-xl hover:scale-105 transition-all group">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isAvailable ? 'bg-[#1a8c4e]' : 'bg-red-500'} transition-all shadow-lg shadow-black/20 group-hover:rotate-12`}>
                          <ShieldCheck className="w-4 h-4 text-white" />
                       </div>
                       <div className="flex-1 px-1">
                          <span className="text-[9px] font-black uppercase tracking-[2px] text-white/60 block leading-none mb-1">Status</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none whitespace-nowrap">
                             {isAvailable ? "Available Now" : "Currently Busy"}
                          </span>
                       </div>
                       <button 
                         onClick={async () => {
                            const newVal = !isAvailable;
                            setIsAvailable(newVal);
                            const { data: { session } } = await supabase.auth.getSession();
                            if(session) await supabase.from('employees').update({ is_available: newVal }).eq('id', session.user.id);
                         }}
                         className={`w-11 h-6 rounded-full relative transition-all border-2 shadow-inner ${isAvailable ? 'bg-[#1a8c4e] border-[#1a8c4e]' : 'bg-white/10 border-white/30'}`}
                       >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-md ${isAvailable ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="px-12 mt-12 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Left Content (Main Area) */}
           <div className="lg:col-span-2 space-y-10">
              <section className="bg-white border border-[#dde9f3] rounded-[32px] p-10 shadow-sm relative overflow-hidden group">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#1a2533] flex items-center gap-3">
                       <UserIcon className="w-5 h-5 text-[#3d7ab5]" /> Profile Details
                    </h3>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[#3d7ab5] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#eef5fb] p-[8px_16px] rounded-xl transition-all"
                    >
                       {isEditing ? "Discard Changes" : "Edit Details"}
                    </button>
                 </div>

                 <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Full Name</label>
                          {isEditing ? (
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-[#eef5fb] rounded-xl px-4 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#3d7ab5]/10" />
                          ) : (
                            <div className="bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2533]">{profile?.full_name}</div>
                          )}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Primary Email</label>
                          <div className="bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold text-[#6b7f93] opacity-60 flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-[#1a8c4e]" /> {profile?.email}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Phone Number</label>
                          {isEditing ? (
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#eef5fb] rounded-xl px-4 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#3d7ab5]/10" />
                          ) : (
                            <div className="bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2533]">{profile?.phone}</div>
                          )}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Platform Role</label>
                          <div className="bg-[#eef5fb] text-[#3d7ab5] rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-widest">{role}</div>
                       </div>
                       {role !== 'employer' && (
                         <>
                            <div className="space-y-2">
                               <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Work Category</label>
                               {isEditing ? (
                                 <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#f8fafd] border border-[#dde9f3] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3d7ab5] transition-all" />
                               ) : (
                                 <div className="bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2533]">{profile?.category || 'General Professional'}</div>
                               )}
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Daily Wage (₹)</label>
                               {isEditing ? (
                                 <input type="number" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} className="w-full bg-[#f8fafd] border border-[#dde9f3] rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#3d7ab5] transition-all" />
                               ) : (
                                 <div className="bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2533]">₹{profile?.hourly_rate || '499'}/day</div>
                               )}
                            </div>
                         </>
                       )}
                       <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Current City / Location</label>
                          {isEditing ? (
                             <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d7ab5] z-10" />
                                <input 
                                  type="text" 
                                  value={city} 
                                  onChange={e => setCity(e.target.value)} 
                                  className="w-full bg-[#eef5fb] rounded-xl pl-10 pr-40 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#3d7ab5]/10" 
                                  placeholder="e.g. Noida, India"
                                />
                                <button 
                                  type="button"
                                  onClick={handleDetectLocation}
                                  disabled={detecting}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#3d7ab5] text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg border border-[#dde9f3] hover:bg-[#3d7ab5] hover:text-white transition-all flex items-center gap-1.5"
                                >
                                   {detecting ? (
                                      <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
                                   ) : (
                                      <Navigation className="w-3 h-3" />
                                   )}
                                   {detecting ? "Locating..." : "Use My Location"}
                                </button>
                             </div>
                          ) : (
                            <div className="bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2533] flex items-center gap-2">
                               <MapPin className="w-4 h-4 text-[#3d7ab5]" /> {profile?.city || 'Not Specified'}
                            </div>
                          )}
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Bio & Introduction</label>
                       {isEditing ? (
                         <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-[#eef5fb] rounded-xl px-4 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#3d7ab5]/10 resize-none"></textarea>
                       ) : (
                         <div className="bg-[#f8fafd] rounded-xl px-4 py-4 text-sm font-medium leading-relaxed text-[#6b7f93]">{profile?.work_details}</div>
                       )}
                    </div>

                    {role !== 'employer' && (
                       <div className="space-y-4 pt-4 border-t border-gray-50">
                          <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Professional Skills & Expertise</label>
                          <div className="flex flex-wrap gap-2 mb-4">
                             {skills.map((skill, index) => (
                                <div key={index} className="bg-[#eef5fb] text-[#3d7ab5] px-4 py-2 rounded-xl text-xs font-bold border border-[#c8dff0] flex items-center gap-2 group transition-all hover:bg-[#3d7ab5] hover:text-white">
                                   {skill}
                                   {isEditing && (
                                     <button 
                                       type="button"
                                       onClick={() => {
                                          const updated = skills.filter((_, i) => i !== index);
                                          setSkills(updated);
                                       }}
                                       className="w-4 h-4 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20"
                                     >
                                       ×
                                     </button>
                                   )}
                                </div>
                             ))}
                             {skills.length === 0 && !isEditing && (
                                <span className="text-sm text-[#6b7f93] italic">No specific skills listed yet.</span>
                             )}
                          </div>
                          
                          {isEditing && (
                             <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  value={newSkill}
                                  onChange={e => setNewSkill(e.target.value)}
                                  onKeyDown={e => {
                                     if(e.key === 'Enter') {
                                        e.preventDefault();
                                        if(newSkill.trim()) {
                                           setSkills([...skills, newSkill.trim()]);
                                           setNewSkill("");
                                        }
                                     }
                                  }}
                                  placeholder="Add skill (e.g. Masonry, Plumbing)" 
                                  className="flex-1 bg-[#f8fafd] rounded-xl px-4 py-3 text-sm font-bold border-[#dde9f3] border outline-none focus:border-[#3d7ab5] transition-all" 
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                     if(newSkill.trim()) {
                                        setSkills([...skills, newSkill.trim()]);
                                        setNewSkill("");
                                     }
                                  }}
                                  className="bg-[#3d7ab5] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2c5f8a] transition-all shadow-md"
                                >
                                   Add
                                </button>
                             </div>
                          )}
                       </div>
                    )}

                    {isEditing && (
                      <button type="submit" className="bg-[#3d7ab5] text-white p-[14px_32px] rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#3d7ab5]/20 hover:scale-[1.02] transition-all">
                        <Save className="w-5 h-5" /> Save Changes
                      </button>
                    )}
                 </form>
              </section>

              <Link href="/settings" className="bg-[#eef5fb] border border-[#c8dff0] rounded-[32px] p-8 flex items-center justify-between group cursor-pointer hover:bg-[#3d7ab5] transition-all duration-300">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#3d7ab5] group-hover:scale-110 transition-transform">
                        <SettingsIcon className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-[#3d7ab5] group-hover:text-white transition-all">Account Settings</h4>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] group-hover:text-white/60 transition-all">Manage security & preferences</p>
                     </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-[#3d7ab5] group-hover:text-white group-hover:translate-x-2 transition-all" />
              </Link>
           </div>

           {/* Right Content (Sidebar Info) */}
           <div className="space-y-8">
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                 <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1a2533] mb-6 flex items-center gap-2 border-b border-[#f0f4f8] pb-4">
                    <Star className="w-4 h-4 text-[#f5a623]" /> Statistics
                 </h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#fdf0e8] p-4 rounded-2xl">
                       <div className="text-2xl font-extrabold text-[#e07b39] mb-1">{profile?.rating}</div>
                       <div className="text-[9px] font-bold uppercase tracking-widest text-[#e07b39]/70">Avg Rating</div>
                    </div>
                    <div className="bg-[#eef5fb] p-4 rounded-2xl">
                       <div className="text-2xl font-extrabold text-[#3d7ab5] mb-1">{profile?.jobs_posted}</div>
                       <div className="text-[9px] font-bold uppercase tracking-widest text-[#3d7ab5]/70">Jobs Posted</div>
                    </div>
                 </div>
              </div>


           </div>
        </div>
    </>
  );
}
