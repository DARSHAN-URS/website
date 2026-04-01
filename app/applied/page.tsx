"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ArrowRight,
  Search,
  DollarSign,
  Calendar,
  Building
} from "lucide-react";
import Link from "next/link";

export default function AppliedPage() {
  const { user } = useUserStore();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Join with jobs table to get job details
    const { data, error } = await supabase
      .from("applications")
      .select("*, job:jobs(*)")
      .eq("worker_id", session.user.id)
      .order("created_at", { ascending: false });

    if (data) setApplications(data);
    if (error) console.error("Applications fetch error:", error.message);
    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'hired':
      case 'accepted':
        return { 
          bg: 'bg-[#e6f7ee]', 
          text: 'text-[#1a8c4e]', 
          border: 'border-[#b7e4cd]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Selected'
        };
      case 'rejected':
      case 'not_selected':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-500', 
          border: 'border-red-100',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'Not Selected'
        };
      default:
        return { 
          bg: 'bg-[#fff3e0]', 
          text: 'text-[#e07b39]', 
          border: 'border-[#fddcb4]',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: 'Under Review'
        };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#1a2533] font-serif tracking-tight mb-2">Applied Jobs</h1>
          <p className="text-[#6b7f93] font-medium max-w-md">Keep track of all your active job applications and their current status.</p>
        </div>
        
        {applications.length > 0 && (
          <Link href="/search" className="bg-[#eef5fb] text-[#3d7ab5] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-[#c8dff0] hover:bg-[#3d7ab5] hover:text-white transition-all shadow-sm">
            Browse More Jobs <Search className="w-4 h-4" />
          </Link>
        )}
      </header>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-32 h-32 bg-[#eef5fb] rounded-full flex items-center justify-center text-6xl mb-8 animate-pulse">💼</div>
            <h2 className="text-2xl font-extrabold text-[#1a2533] mb-3">No applications yet</h2>
            <p className="text-[#6b7f93] font-medium max-w-xs mx-auto mb-10 leading-relaxed uppercase text-[10px] tracking-widest font-bold">Start your journey today. Apply for verified jobs near you.</p>
            <Link href="/search" className="bg-[#3d7ab5] text-white p-[16px_48px] rounded-2xl font-bold text-lg shadow-xl shadow-[#3d7ab5]/20 hover:scale-[1.02] active:scale-95 transition-all">
                Find Jobs Now
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {applications.map((app) => {
            const style = getStatusStyle(app.status);
            return (
              <div key={app.id} className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
                {/* Header: Job Info & Status */}
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[22px] bg-[#f8fafd] flex items-center justify-center text-3xl shadow-inner border border-[#eef5fb] group-hover:bg-[#3d7ab5] group-hover:text-white transition-all duration-300">
                         <Briefcase className="w-7 h-7" />
                      </div>
                      <div>
                         <h3 className="font-extrabold text-[#1a2533] text-lg mb-1 leading-none">{app.job?.title || 'Job Title'}</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">{app.job?.category_name || 'General Help'}</span>
                            <span className="text-[10px] font-bold text-[#6b7f93] bg-[#f8fafd] px-2 py-0.5 rounded-full border border-gray-50 uppercase tracking-widest">ID: {String(app.id).slice(0, 8)}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 ${style.text} ${style.bg} ${style.border} border px-3 py-1.5 rounded-full font-extrabold uppercase text-[9px] tracking-widest`}>
                         {style.icon} {style.label}
                      </div>
                   </div>
                </div>

                <div className="h-px bg-gray-50 w-full mb-8"></div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest">
                         <MapPin className="w-3 h-3 text-[#3d7ab5]" /> Location
                      </div>
                      <div className="text-[13px] font-bold text-[#1a2533]">{app.job?.job_city || 'Noida'}</div>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest">
                         <Calendar className="w-3 h-3 text-[#3d7ab5]" /> Applied On
                      </div>
                      <div className="text-[13px] font-bold text-[#1a2533]">{new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                   </div>
                   <div className="space-y-1.5 border-l border-[#dde9f3] pl-6">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest">
                         <DollarSign className="w-3 h-3 text-[#1a8c4e]" /> Salary
                      </div>
                      <div className="text-[13px] font-bold text-[#1a2533]">₹{app.job?.salary_min || 0}</div>
                   </div>
                </div>

                {/* Requirements / Meta */}
                <div className="bg-[#f8fafd] rounded-2xl p-4 border border-[#eef5fb] mb-8">
                   <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#3d7ab5] shrink-0 mt-0.5" />
                      <div>
                         <span className="text-[10px] font-extrabold text-[#6b7f93] uppercase tracking-widest block mb-0.5">Job Timing</span>
                         <p className="text-xs font-bold text-[#1a2533] line-clamp-1">{app.job?.job_time || 'Standard Shift (8-9 hours)'}</p>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto">
                   <button className="flex-1 bg-white border border-[#dde9f3] text-[#1a2533] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#eef5fb] transition-all">
                      View Details
                   </button>
                   {(app.status === 'hired' || app.status === 'accepted') && (
                     <button className="flex-[2] bg-[#3d7ab5] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#2c5f8a] transition-all shadow-lg shadow-[#3d7ab5]/10 flex items-center justify-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                     </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


