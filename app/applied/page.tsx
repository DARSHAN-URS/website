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
    <div className="p-4 md:p-10 max-w-6xl mx-auto min-h-screen">
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2533] font-serif tracking-tight mb-2 uppercase">Applied Jobs</h1>
          <p className="text-sm md:text-base text-[#6b7f93] font-medium max-w-md">Keep track of all your active job applications and their current status.</p>
        </div>
        
        {applications.length > 0 && (
          <Link href="/dashboard" className="bg-[#eef5fb] text-[#3d7ab5] px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 border border-[#c8dff0] hover:bg-[#3d7ab5] hover:text-white transition-all shadow-sm w-full md:w-auto">
            Browse More Jobs <Search className="w-4 h-4" />
          </Link>
        )}
      </header>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#eef5fb] rounded-full flex items-center justify-center text-4xl md:text-6xl mb-8 animate-pulse">💼</div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#1a2533] mb-3">No applications yet</h2>
            <p className="text-xs md:text-sm text-[#6b7f93] font-medium max-w-xs mx-auto mb-10 leading-relaxed uppercase tracking-widest font-bold">Start your journey today. Apply for verified jobs near you.</p>
            <Link href="/dashboard" className="bg-[#3d7ab5] text-white p-[14px_40px] md:p-[16px_48px] rounded-2xl font-bold text-base md:text-lg shadow-xl shadow-[#3d7ab5]/20 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto">
                Find Jobs Now
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {applications.map((app) => {
            const style = getStatusStyle(app.status);
            return (
              <div key={app.id} className="bg-white border border-[#dde9f3] rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full border-l-4 border-l-[#3d7ab5]">
                {/* Header: Job Info & Status */}
                <div className="flex items-start justify-between mb-6 md:mb-8 gap-4">
                   <div className="flex items-center gap-3 md:gap-4 flex-1">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[22px] bg-[#f8fafd] flex items-center justify-center text-xl md:text-3xl shadow-inner border border-[#eef5fb] shrink-0">
                         <Briefcase className="w-5 h-5 md:w-7 md:h-7" />
                      </div>
                      <div className="min-w-0">
                         <h3 className="font-extrabold text-[#1a2533] text-base md:text-lg mb-1 leading-tight truncate">{app.job?.title || 'Job Title'}</h3>
                         <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[8px] md:text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">{app.job?.category_name || 'General Help'}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <div className={`flex items-center gap-1.5 ${style.text} ${style.bg} ${style.border} border px-3 py-1.5 rounded-full font-extrabold uppercase text-[8px] md:text-[9px] tracking-widest w-fit mb-6`}>
                   {style.icon} {style.label}
                </div>

                <div className="h-px bg-gray-50 w-full mb-6 md:mb-8"></div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-8">
                   <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest truncate">
                         <MapPin className="w-2.5 h-2.5 text-[#3d7ab5]" /> Location
                      </div>
                      <div className="text-[11px] md:text-[13px] font-bold text-[#1a2533] truncate">{app.job?.job_city || 'Noida'}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest truncate">
                         <Calendar className="w-2.5 h-2.5 text-[#3d7ab5]" /> Date
                      </div>
                      <div className="text-[11px] md:text-[13px] font-bold text-[#1a2533] truncate">{new Date(app.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                   </div>
                   <div className="space-y-1 pl-4 md:pl-6 border-l border-[#dde9f3]">
                      <div className="flex items-center gap-1 text-[8px] md:text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest truncate">
                         <DollarSign className="w-2.5 h-2.5 text-[#1a8c4e]" /> Budget
                      </div>
                      <div className="text-[11px] md:text-[13px] font-bold text-[#1a8c4e] truncate">₹{app.job?.salary_min || 0}</div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto">
                   <button className="flex-1 bg-white border border-[#dde9f3] text-[#1a2533] py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2">
                      View
                   </button>
                   {(app.status === 'hired' || app.status === 'accepted') && (
                     <button className="flex-[2] bg-[#3d7ab5] text-white py-2.5 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm hover:bg-[#2c5f8a] shadow-lg shadow-[#3d7ab5]/10 flex items-center justify-center gap-2">
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
