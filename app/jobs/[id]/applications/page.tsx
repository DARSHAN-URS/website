"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  User, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  MapPin, 
  Star,
  ArrowLeft,
  Search,
  Users
} from "lucide-react";
import Link from "next/link";

export default function JobApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (jobData) setJob(jobData);

      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select("*, worker:employees(*)")
        .eq("job_id", params.id)
        .order("created_at", { ascending: false });

      if (appsData) setApplications(appsData);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    setUpdatingId(appId);
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", appId);

    if (!error) {
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      alert(`Application ${newStatus}!`);
    } else {
      alert("Error updating status: " + error.message);
    }
    setUpdatingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted': return <span className="bg-[#e6f7ee] text-[#1a8c4e] px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-[#b7e4cd]">Accepted</span>;
      case 'rejected': return <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-red-100">Rejected</span>;
      default: return <span className="bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-gray-100">Pending</span>;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto min-h-screen">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-sm font-bold text-[#6b7f93] hover:text-[#3d7ab5] transition-all">
        <ArrowLeft className="w-4 h-4" /> Back to My Jobs
      </button>

      <header className="mb-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2533] font-serif mb-2">Review Applications</h1>
        <p className="text-[#6b7f93] font-medium flex items-center gap-2">
          Candidates for: <span className="text-[#3d7ab5] font-bold">{job?.title}</span>
        </p>
      </header>

      {applications.length === 0 ? (
        <div className="bg-white border border-dashed border-[#dde9f3] rounded-[32px] p-20 text-center">
           <Users className="w-16 h-16 text-[#dde9f3] mx-auto mb-6" />
           <h3 className="text-xl font-bold text-[#1a2533]">No candidates yet</h3>
           <p className="text-sm text-[#6b7f93] mt-2 max-w-xs mx-auto font-medium">Be patient! Your job post is active and verified professionals will reach out soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-[#dde9f3] rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-[#3d7ab5]">
              <div className="flex-1 flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#f8fafd] flex items-center justify-center text-2xl border border-[#dde9f3] shrink-0">
                  {app.worker?.avatar_url || "👨🏾‍🔧"}
                </div>
                <div className="min-w-0">
                   <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-[#1a2533] text-lg truncate">{app.worker?.full_name || 'Anonymous candidate'}</h3>
                      {getStatusBadge(app.status)}
                   </div>
                   <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] font-bold text-[#6b7f93]">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#3d7ab5]" /> {app.worker?.city || 'Noida'}</span>
                      <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-orange-400 fill-current" /> {app.worker?.rating || '4.8'}</span>
                      <span className="text-[#3d7ab5]">₹{app.worker?.hourly_rate || 150}/hr</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:pl-6 border-[#f0f4f8]">
                 <button 
                   onClick={() => router.push(`/messages?user_id=${app.worker_id}`)}
                   className="p-3 bg-[#eef5fb] text-[#3d7ab5] rounded-xl hover:bg-[#d9e8f5] transition-all"
                   title="Chat with candidate"
                 >
                   <MessageSquare className="w-5 h-5" />
                 </button>
                 {app.status === 'pending' && (
                   <>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'accepted')}
                        disabled={!!updatingId}
                        className="flex-1 md:flex-none px-6 py-3 bg-[#1a8c4e] text-white rounded-xl text-xs font-bold hover:bg-[#15733f] transition-all"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        disabled={!!updatingId}
                        className="flex-1 md:flex-none px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50"
                      >
                        Reject
                      </button>
                   </>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
