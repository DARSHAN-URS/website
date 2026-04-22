"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "@/components/Sidebar";
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  DollarSign,
  User,
  ArrowLeft,
  Calendar
} from "lucide-react";
import { useUserStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import { applicationApi } from "@/lib/api";
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
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { role, language } = useUserStore();
  const { showToast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  
  const t = translations[language as keyof typeof translations] || translations.EN;

  useEffect(() => {
    async function fetchJob() {
      if (!params?.id) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) {
        setJob(data);
        checkIfApplied(data.id);
      }
      if (error) console.error("Job fetch error:", error.message);
      setLoading(false);
    }

    async function checkIfApplied(jobId: string) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", jobId)
        .eq("worker_id", session.user.id);

      if (data && data.length > 0) setApplied(true);
    }

    fetchJob();
  }, [params?.id]);

  const handleApply = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showToast("Please login to apply", "error");
      router.push("/login");
      return;
    }

    if (role !== 'worker') {
      showToast("Only workers can apply for jobs.", "error");
      return;
    }

    setApplying(true);
    try {
      await applicationApi.applyToJob(job!.id, session.access_token!);
      showToast("Application submitted successfully!", "success");
      setApplied(true);
    } catch (err: any) {
      showToast("Unable to apply. Please make sure you have completed your worker profile.", "error");
    }
    setApplying(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  if (!job) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold">Job not found</h2>
      <button onClick={() => router.back()} className="text-[#3d7ab5] mt-4 flex items-center justify-center gap-2 mx-auto underline">
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafd] p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-[#6b7f93] hover:text-[#3d7ab5] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white border border-[#dde9f3] rounded-[32px] p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#eef5fb] text-[#3d7ab5] border border-[#c8dff0] uppercase tracking-wider">
                  {job.category_id === 1 ? "Painting" : "General"}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-[#e6f7ee] text-[#1a8c4e] border border-[#b7e4cd] uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" /> Verified Listing
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#1a2533] font-serif mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#6b7f93]">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#3d7ab5]" /> {job.job_city || 'Anywhere'}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#3d7ab5]" /> Posted {new Date(job.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="bg-[#f8fafd] p-6 rounded-3xl border border-[#eef5fb] text-center md:text-right min-w-[200px]">
              <div className="text-[10px] font-extrabold text-[#6b7f93] uppercase tracking-[2px] mb-1">Budget</div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#3d7ab5] font-serif">₹{job.salary_min}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-[#1a2533] mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#3d7ab5]" /> Job Description
              </h2>
              <div className="text-[#6b7f93] leading-relaxed whitespace-pre-wrap font-medium">
                {job.description}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-[#eef5fb] p-6 rounded-3xl border border-[#c8dff0]">
                <h3 className="font-bold text-[#1a2533] mb-4 text-sm">Quick Information</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-xs font-bold text-[#6b7f93]">
                    <Clock className="w-4 h-4 text-[#3d7ab5]" /> Full Time / Part Time
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-[#6b7f93]">
                    <CheckCircle2 className="w-4 h-4 text-[#1a8c4e]" /> Immediate Start
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-[#6b7f93]">
                    <MapPin className="w-4 h-4 text-[#3d7ab5]" /> {job.job_city}
                  </li>
                </ul>
              </div>

              {role === 'worker' && (
                <button 
                  onClick={handleApply}
                  disabled={applied || applying}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                    applied 
                      ? "bg-gray-100 text-[#1a8c4e] cursor-default" 
                      : "bg-[#3d7ab5] text-white hover:bg-[#2c5f8a] hover:-translate-y-1"
                  }`}
                >
                  {applied ? t.applied_btn : applying ? "Applying..." : t.apply_now}
                </button>
              )}
              
              <button 
                onClick={() => router.push(`/messages?user_id=${job.employer_id}`)}
                className="w-full py-4 rounded-2xl border-2 border-[#dde9f3] text-[#3d7ab5] font-bold text-sm hover:bg-[#f0f7ff] transition-all"
              >
                Chat with Employer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
