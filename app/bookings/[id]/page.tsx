"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  ArrowLeft,
  ShieldCheck,
  Phone,
} from "lucide-react";
import Link from "next/link";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useUserStore();

  useEffect(() => {
    async function fetchBookingDetails() {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*, worker:employees(*), customer:employers(*)")
        .eq("id", params.id)
        .single();

      if (data) setBooking(data);
      if (error) console.error("Details fetch error:", error.message);
      setLoading(false);
    }

    if (params.id) fetchBookingDetails();
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  if (!booking) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold">Booking not found</h2>
      <Link href="/bookings" className="text-[#3d7ab5] mt-4 block underline">Back to Bookings</Link>
    </div>
  );

  const isPending = booking.status === 'pending';
  const isCompleted = booking.status === 'completed';
  const isAccepted = booking.status === 'accepted';
  
  const person = role === 'employer' ? booking.worker : booking.customer;
  const personName = role === 'employer' ? person?.full_name : person?.company_name || 'Customer';

  const updateStatus = async (newStatus: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id);
    
    if (!error) {
      setBooking({ ...booking, status: newStatus });
    } else {
      alert("Error updating status: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <button 
           onClick={() => router.back()}
           className="flex items-center gap-2 text-[#6b7f93] font-bold text-xs uppercase tracking-widest mb-8 hover:text-[#3d7ab5] transition-all"
        >
           <ArrowLeft className="w-4 h-4" /> Back to History
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left: Main Details */}
           <div className="lg:col-span-2 space-y-8">
              {/* Status Header */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-10 overflow-hidden relative shadow-sm">
                 <div className="absolute top-0 right-0 p-8">
                    <div className={`px-4 py-2 rounded-full font-extrabold uppercase text-[10px] tracking-[2px] flex items-center gap-2 ${isPending ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-[#e6f7ee] text-[#1a8c4e] border border-[#b7e4cd]'}`}>
                       {isPending ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                       {booking.status}
                    </div>
                 </div>
                 
                 <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif mb-2">Booking Detailed View</h1>
                 <p className="text-[#6b7f93] font-bold text-[10px] uppercase tracking-[3px] mb-8">Ref: #{booking.booking_ref}</p>

                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">
                          <Calendar className="w-4 h-4" /> Service Date
                       </div>
                       <p className="text-lg font-bold text-[#1a2533]">{booking.booking_date || 'Not set'}</p>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">
                          <Clock className="w-4 h-4" /> Arrival Time Slot
                       </div>
                       <p className="text-lg font-bold text-[#1a2533]">{booking.time_slot || 'Flexible'}</p>
                    </div>
                 </div>
              </div>

              {/* Location Detail */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-10 shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-[#eef5fb] flex items-center justify-center">
                       <MapPin className="w-5 h-5 text-[#3d7ab5]" />
                    </div>
                    <div>
                       <h3 className="font-bold text-[#1a2533]">Job Location</h3>
                       <p className="text-xs font-bold text-[#6b7f93] uppercase tracking-widest">Detailed Address</p>
                    </div>
                 </div>
                 <div className="bg-[#f8fafd] border border-[#eef5fb] p-6 rounded-2xl">
                    <p className="text-[#1a2533] font-medium leading-relaxed">{booking.address || 'Address not provided during booking.'}</p>
                 </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-10 shadow-sm relative overflow-hidden">
                 <h3 className="text-xl font-bold text-[#1a2533] mb-8">Financial Summary</h3>
                 <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm font-medium text-[#6b7f93]">
                       <span>Standard Service Rate</span>
                       <span className="font-bold text-[#1a2533]">₹{booking.total_amount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-[#6b7f93]">
                       <span>Platform Convenience Fee</span>
                       <span className="font-bold text-[#1a8c4e]">Included</span>
                    </div>
                    <div className="h-px bg-gray-50"></div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-extrabold text-[#1a2533] uppercase tracking-widest">Total Amount</span>
                       <span className="text-2xl font-extrabold text-[#3d7ab5] font-serif tracking-tight">₹{booking.total_amount}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Profile Card */}
           <div className="space-y-8">
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm text-center">
                 <div className="relative mx-auto w-24 h-24 mb-6">
                    <div className="w-full h-full rounded-[28px] bg-[#f8fafd] border-2 border-white shadow-lg flex items-center justify-center text-4xl">
                       {person?.avatar_url || (role === 'employer' ? "👨🏾‍🔧" : "👤")}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-100 rounded-xl shadow-md flex items-center justify-center text-[#1a8c4e]">
                       <ShieldCheck className="w-5 h-5 fill-current" />
                    </div>
                 </div>
                 
                 <h2 className="text-xl font-extrabold text-[#1a2533] mb-1">{personName}</h2>
                 <p className="text-[#6b7f93] font-bold text-[10px] uppercase tracking-widest mb-6">{role === 'employer' ? (person?.category || 'Professional Provider') : 'Employer'}</p>

                 <div className="flex items-center justify-center gap-6 mb-8 border-y border-gray-50 py-4">
                    <div>
                       <p className="text-[#1a2533] font-extrabold">{person?.rating || '4.8'}</p>
                       <p className="text-[9px] font-bold text-[#6b7f93] uppercase tracking-wider">Rating</p>
                    </div>
                    <div className="w-px h-6 bg-gray-100"></div>
                    <div>
                       <p className="text-[#1a2533] font-extrabold">{person?.total_jobs || (role === 'employer' ? '120+' : '5+')}</p>
                       <p className="text-[9px] font-bold text-[#6b7f93] uppercase tracking-wider">{role === 'employer' ? 'Jobs' : 'Posted'}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <button 
                      onClick={() => router.push(`/messages?user_id=${role === 'employer' ? booking.worker_id : booking.customer_id}`)}
                      className="w-full bg-[#3d7ab5] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#2c5f8a] transition-all shadow-lg shadow-[#3d7ab5]/20"
                    >
                       <MessageSquare className="w-4 h-4" /> Message {role === 'employer' ? 'Worker' : 'Customer'}
                    </button>
                    {role === 'worker' && isPending && (
                      <button 
                        onClick={() => updateStatus('accepted')}
                        className="w-full bg-[#1a8c4e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#157340] transition-all shadow-lg shadow-[#1a8c4e]/20"
                      >
                         <CheckCircle2 className="w-4 h-4" /> Accept Job
                      </button>
                    )}
                    {role === 'worker' && isAccepted && (
                      <button 
                        onClick={() => updateStatus('completed')}
                        className="w-full bg-[#1a8c4e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#157340] transition-all shadow-lg shadow-[#1a8c4e]/20"
                      >
                         <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                      </button>
                    )}
                    {(isPending || isAccepted) && (
                      <button 
                        onClick={() => updateStatus('cancelled')}
                        className="w-full bg-white border border-red-100 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                      >
                        <AlertCircle className="w-4 h-4" /> Cancel Booking
                      </button>
                    )}
                 </div>
              </div>

              {/* Safety Card */}
              <div className="bg-[#eef5fb] rounded-[32px] p-8 border border-[#c8dff0]">
                 <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-[#1a8c4e]" />
                    <h4 className="font-extrabold text-[#1a2533] text-sm uppercase tracking-wider">Safety First</h4>
                 </div>
                 <p className="text-xs text-[#6b7f93] font-medium leading-relaxed">Your professional is background-verified. Always pay through the app for dispute protection and service guarantees.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
