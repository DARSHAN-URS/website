"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star,
  Settings,
  ShieldCheck,
  Languages,
  LogOut,
  ChevronRight,
  Camera,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";

export default function ProfilePage() {
  const { user, role, setUser, setRole, language } = useUserStore();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  
  const t = translations[language as keyof typeof translations] || translations.EN;

  // Edit state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [workDetails, setWorkDetails] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const userId = session.user.id;

      // Auto-detect: try the current role's table first, then fallback to the other.
      // This handles the case where Zustand role resets to 'employer' on page refresh.
      const primaryTable = role === 'employer' ? 'employers' : 'employees';
      const fallbackTable = role === 'employer' ? 'employees' : 'employers';

      let { data, error } = await supabase
        .from(primaryTable)
        .select("*")
        .eq("id", userId)
        .single();

      if (!data) {
        // Primary table had no row — try the other table
        const { data: fallbackData, error: fallbackError } = await supabase
          .from(fallbackTable)
          .select("*")
          .eq("id", userId)
          .single();

        if (fallbackData) {
          data = fallbackData;
          // Correct the Zustand role so the rest of the page works properly
          const correctRole = fallbackTable === 'employees' ? 'worker' : 'employer';
          setRole(correctRole as 'employer' | 'worker');
        }
      }

      if (data) {
        setProfile(data);
        setFullName(data.full_name || data.company_name || "");
        setPhone(data.phone || "");
        setHourlyRate(data.hourly_rate?.toString() || "");
        setWorkDetails(data.work_details || "");
      } else {
        console.error("Profile not found in either table for user:", userId);
      }

      setLoading(false);
    }
    fetchProfile();
  }, [role, router]);

  const handleUpdate = async () => {
    const table = role === 'employer' ? 'employers' : 'employees';
    const updateData: any = {
      phone: phone,
      updated_at: new Date().toISOString(),
    };

    if (role === 'employer') {
        updateData.company_name = fullName;
    } else {
        updateData.full_name = fullName;
    }

    if (role === 'worker') {
      updateData.hourly_rate = parseFloat(hourlyRate);
      updateData.work_details = workDetails;
    }

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile, ...updateData });
      setEditing(false);
      alert("Profile updated!");
    } else {
      alert("Update failed: " + error.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafd]">
       {/* HERO SECTION */}
       <div className="bg-[#3d7ab5] md:h-64 h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.15),transparent)]"></div>
          <div className="absolute bottom-[-1px] left-0 right-0 h-24 bg-gradient-to-t from-[#f8fafd] to-transparent"></div>
       </div>

       <div className="max-w-5xl mx-auto px-4 md:px-10 -mt-24 md:-mt-32 relative z-10 pb-20">
          <div className="flex flex-col lg:flex-row gap-8">
             
             {/* LEFT COL: Card */}
             <div className="lg:w-1/3">
                <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-xl shadow-[#3d7ab5]/5">
                   <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6 group cursor-pointer">
                      <div className="w-full h-full rounded-[40px] bg-[#eef5fb] border-4 border-white shadow-lg flex items-center justify-center text-5xl overflow-hidden">
                         {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover"/> : "👨🏾‍🔧"}
                      </div>
                      <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#3d7ab5] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
                         <Camera className="w-4 h-4" />
                      </div>
                   </div>

                   <div className="text-center mb-8">
                      <h2 className="text-2xl font-extrabold text-[#1a2533] font-serif mb-1 uppercase tracking-tight">{profile?.full_name || profile?.company_name || 'Anonymous'}</h2>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-[2px]">
                         <Star className="w-3.5 h-3.5 fill-current" /> 4.9 · {role === 'employer' ? 'Premium Employer' : 'Expert Professional'}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <button onClick={() => setEditing(true)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#f8fafd] border border-[#eef5fb] hover:border-[#3d7ab5]/30 transition-all group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#6b7f93] group-hover:text-[#3d7ab5] transition-colors"><Edit2 className="w-4 h-4" /></div>
                            <span className="text-xs font-bold text-[#1a2533]">Edit Account</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-[#dde9f3]" />
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#f8fafd] border border-[#eef5fb] hover:border-[#3d7ab5]/30 transition-all group">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#6b7f93] group-hover:text-[#3d7ab5] transition-colors"><ShieldCheck className="w-4 h-4" /></div>
                            <span className="text-xs font-bold text-[#1a2533]">Security</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-[#dde9f3]" />
                      </button>
                      <div className="h-px bg-[#f0f4f8] my-2"></div>
                      <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 font-bold text-xs hover:bg-red-50 transition-all">
                         <LogOut className="w-4 h-4" /> {t.logout}
                      </button>
                   </div>
                </div>
             </div>

             {/* RIGHT COL: Details */}
             <div className="lg:w-2/3 space-y-6">
                <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 md:p-10 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-extrabold text-[#1a2533] font-serif uppercase tracking-tight">Personal Details</h3>
                      {!editing ? (
                        <button onClick={() => setEditing(true)} className="text-[#3d7ab5] text-xs font-bold uppercase tracking-widest hover:underline">Edit Details</button>
                      ) : (
                        <div className="flex gap-4">
                           <button onClick={handleUpdate} className="bg-[#3d7ab5] text-white px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-[#3d7ab5]/20">Save</button>
                           <button onClick={() => setEditing(false)} className="text-[#6b7f93] text-xs font-bold uppercase tracking-widest">Cancel</button>
                        </div>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block">{role === 'employer' ? 'Company Name' : 'Full Name'}</label>
                         {editing ? (
                           <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-[#f8fafd] border-b-2 border-[#dde9f3] py-2 outline-none focus:border-[#3d7ab5] text-sm font-bold"/>
                         ) : (
                           <div className="flex items-center gap-2.5 text-sm font-bold text-[#1a2533] uppercase"><User className="w-4 h-4 text-[#3d7ab5]" /> {profile?.full_name || profile?.company_name || 'Not provided'}</div>
                         )}
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block">Contact Number</label>
                         {editing ? (
                           <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#f8fafd] border-b-2 border-[#dde9f3] py-2 outline-none focus:border-[#3d7ab5] text-sm font-bold"/>
                         ) : (
                           <div className="flex items-center gap-2.5 text-sm font-bold text-[#1a2533] uppercase"><Phone className="w-4 h-4 text-[#3d7ab5]" /> {profile?.phone || 'Not linked'}</div>
                         )}
                      </div>
                      {role === 'worker' && (
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block">Daily Rate (8 hrs)</label>
                           {editing ? (
                             <input type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="w-full bg-[#f8fafd] border-b-2 border-[#dde9f3] py-2 outline-none focus:border-[#3d7ab5] text-sm font-bold"/>
                           ) : (
                             <div className="flex items-center gap-2.5 text-lg font-black text-[#1a8c4e] uppercase font-serif">₹{profile?.hourly_rate || '0'}</div>
                           )}
                        </div>
                      )}
                   </div>
                </div>

                {role === 'worker' && (
                  <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#eef5fb] rounded-bl-full -z-0 opacity-50"></div>
                     <h3 className="text-xl font-extrabold text-[#1a2533] font-serif mb-8 uppercase tracking-tight relative z-10">Experience & Skills</h3>
                     
                     <div className="space-y-6 relative z-10">
                        <div>
                           <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-3">Work Overview</label>
                           {editing ? (
                              <textarea value={workDetails} onChange={e => setWorkDetails(e.target.value)} className="w-full bg-[#f8fafd] border border-[#dde9f3] rounded-2xl p-4 text-sm font-medium min-h-[120px] outline-none focus:border-[#3d7ab5]"/>
                           ) : (
                              <p className="text-sm font-medium text-[#6b7f93] leading-relaxed italic">{profile?.work_details || 'Describe your expertise and past work experiences here to attract more employers.'}</p>
                           )}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4">
                           {['Painting', 'Piping', 'Electrical', 'Woodwork'].map(skill => (
                              <span key={skill} className="px-5 py-2 rounded-xl bg-white border border-[#dde9f3] text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-[#3d7ab5] transition-all cursor-default">{skill}</span>
                           ))}
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
