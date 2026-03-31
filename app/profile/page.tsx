"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
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
  ShieldCheck
} from "lucide-react";

export default function ProfilePage() {
  const { role, user } = useUserStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    /* 
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
      }
    }
    */
    // Mocking profile for UI demo
    setProfile({
      full_name: "Sunil Agarwal",
      email: "sunil@example.com",
      phone: "+91 9876543210",
      location: "Noida, Sector 62",
      bio: "Looking for quality workers to help with home renovation project.",
      role: 'employer',
      rating: 4.9,
      jobs_posted: 12
    });
    setFullName("Sunil Agarwal");
    setPhone("+91 9876543210");
    setBio("Looking for quality workers to help with home renovation project.");
    setLoading(false);
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    /*
    const { error } = await supabase.from('profiles').upsert({
       id: user.id,
       full_name: fullName,
       phone: phone,
       bio: bio,
       updated_at: new Date()
    });
    if (error) alert(error.message);
    else {
      setIsEditing(false);
      fetchProfile();
    }
    */
    setIsEditing(false);
    setLoading(false);
  }

  if (loading && !profile) return (
    <div className="flex bg-[#fdfdfd] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
      </main>
    </div>
  );

  return (
    <div className="flex bg-[#fdfdfd] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-0">
        {/* Header Hero Section */}
        <div className="h-[280px] bg-gradient-to-br from-[#3d7ab5] to-[#2c5f8a] relative">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#ffffff10_0%,transparent_60%)]"></div>
           <div className="absolute top-10 left-10 text-white">
              <h1 className="text-3xl font-extrabold font-serif mb-2">Account Profile</h1>
              <div className="flex items-center gap-3 text-[10px] font-extrabold tracking-widest uppercase text-white/70">
                 <ShieldCheck className="w-3.5 h-3.5" /> Identity Verified Account
              </div>
           </div>
           
           <div className="absolute bottom-[-60px] left-10 flex items-end gap-6">
              <div className="relative group">
                 <div className="w-32 h-32 rounded-[32px] bg-white border-4 border-[#fdfdfd] shadow-2xl flex items-center justify-center text-4xl overflow-hidden">
                    {profile?.avatar_url ? <img src={profile.avatar_url} /> : "👨‍💼"}
                 </div>
                 <button className="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-lg rounded-xl border border-gray-100 flex items-center justify-center text-[#3d7ab5] hover:bg-[#3d7ab5] hover:text-white transition-all">
                    <Camera className="w-5 h-5" />
                 </button>
              </div>
              <div className="pb-4">
                 <h2 className="text-2xl font-bold text-[#1a2533] mb-1">{profile?.full_name}</h2>
                 <p className="text-[#6b7f93] font-bold text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#3d7ab5]" /> Noida, Sector 62, India
                 </p>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="px-10 mt-[100px] mb-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-extrabold text-[#6b7f93] tracking-widest uppercase ml-1">Bio & Introduction</label>
                       {isEditing ? (
                         <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-[#eef5fb] rounded-xl px-4 py-3 text-sm font-bold border-none outline-none focus:ring-2 focus:ring-[#3d7ab5]/10 resize-none"></textarea>
                       ) : (
                         <div className="bg-[#f8fafd] rounded-xl px-4 py-4 text-sm font-medium leading-relaxed text-[#6b7f93]">{profile?.bio}</div>
                       )}
                    </div>

                    {isEditing && (
                      <button type="submit" className="bg-[#3d7ab5] text-white p-[14px_32px] rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#3d7ab5]/20 hover:scale-[1.02] transition-all">
                        <Save className="w-5 h-5" /> Save Changes
                      </button>
                    )}
                 </form>
              </section>

              <div className="bg-[#eef5fb] border border-[#c8dff0] rounded-[32px] p-8 flex items-center justify-between group cursor-pointer hover:bg-[#3d7ab5] transition-all duration-300">
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
              </div>
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

              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                 <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#1a2533] mb-6 flex items-center gap-2 border-b border-[#f0f4f8] pb-4">
                    <Globe className="w-4 h-4 text-[#3d7ab5]" /> Active Region
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <MapPin className="w-4 h-4 text-[#3d7ab5] shrink-0" />
                       <span className="text-sm font-bold text-[#6b7f93]">Sector 62, Noida</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Mail className="w-4 h-4 text-[#3d7ab5] shrink-0" />
                       <span className="text-sm font-bold text-[#6b7f93]">sunil@example.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Briefcase className="w-4 h-4 text-[#3d7ab5] shrink-0" />
                       <span className="text-sm font-bold text-[#6b7f93]">Business Owner</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
