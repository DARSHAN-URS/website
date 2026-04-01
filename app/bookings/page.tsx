"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Star,
  ChevronRight,
  ArrowRight,
  CreditCard,
  XCircle,
  History
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
  const { user } = useUserStore();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Join with employees table to get worker name/avatar
    const { data, error } = await supabase
      .from("bookings")
      .select("*, worker:employees(*)")
      .eq("customer_id", session.user.id)
      .order("created_at", { ascending: false });

    if (data) setBookings(data);
    if (error) console.error("Bookings fetch error:", error.message);
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { 
          bg: 'bg-[#e6f7ee]', 
          text: 'text-[#1a8c4e]', 
          border: 'border-[#b7e4cd]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      case 'pending':
        return { 
          bg: 'bg-[#fff3e0]', 
          text: 'text-[#e07b39]', 
          border: 'border-[#fddcb4]',
          icon: <Clock className="w-3.5 h-3.5" />
        };
      case 'cancelled':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-500', 
          border: 'border-red-100',
          icon: <XCircle className="w-3.5 h-3.5" />
        };
      default:
        return { 
          bg: 'bg-[#eef5fb]', 
          text: 'text-[#3d7ab5]', 
          border: 'border-[#c8dff0]',
          icon: <AlertCircle className="w-3.5 h-3.5" />
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
          <h1 className="text-4xl font-extrabold text-[#1a2533] font-serif tracking-tight mb-2">My Bookings</h1>
          <p className="text-[#6b7f93] font-medium max-w-md">Track all your service requests and manage ongoing work with nearby professionals.</p>
        </div>
        
        {bookings.length > 0 && (
          <Link href="/search" className="bg-[#eef5fb] text-[#3d7ab5] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 border border-[#c8dff0] hover:bg-[#3d7ab5] hover:text-white transition-all shadow-sm">
            Find New Workers <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </header>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-32 h-32 bg-[#eef5fb] rounded-full flex items-center justify-center text-6xl mb-8 animate-bounce">📅</div>
            <h2 className="text-2xl font-extrabold text-[#1a2533] mb-3">No bookings yet</h2>
            <p className="text-[#6b7f93] font-medium max-w-xs mx-auto mb-10 leading-relaxed uppercase text-[10px] tracking-widest font-bold">Experience the best doorstep services. Your first booking is only a tap away.</p>
            <Link href="/search" className="bg-[#3d7ab5] text-white p-[16px_48px] rounded-2xl font-bold text-lg shadow-xl shadow-[#3d7ab5]/20 hover:scale-[1.02] active:scale-95 transition-all">
                Find Workers Now
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bookings.map((booking) => {
            const style = getStatusStyle(booking.status);
            return (
              <div key={booking.id} className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
                {/* Header: User & Status */}
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[22px] bg-[#f8fafd] flex items-center justify-center text-3xl shadow-inner border border-[#eef5fb] group-hover:scale-110 transition-transform duration-300">
                         {booking.worker?.avatar_url || "👨🏾‍🔧"}
                      </div>
                      <div>
                         <h3 className="font-extrabold text-[#1a2533] text-lg mb-1 leading-none">{booking.worker?.full_name || 'Service Professional'}</h3>
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">{booking.worker?.category || 'General Help'}</span>
                            <span className="text-[10px] font-bold text-[#6b7f93] bg-[#f8fafd] px-2 py-0.5 rounded-full border border-gray-50 uppercase tracking-widest">REF: {booking.booking_ref}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1.5 ${style.text} ${style.bg} ${style.border} border px-3 py-1.5 rounded-full font-extrabold uppercase text-[9px] tracking-widest`}>
                         {style.icon} {booking.status}
                      </div>
                   </div>
                </div>

                <div className="h-px bg-gray-50 w-full mb-8"></div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest">
                         <Calendar className="w-3 h-3 text-[#3d7ab5]" /> Date
                      </div>
                      <div className="text-[13px] font-bold text-[#1a2533]">{booking.booking_date}</div>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest">
                         <Clock className="w-3 h-3 text-[#3d7ab5]" /> Time Slot
                      </div>
                      <div className="text-[13px] font-bold text-[#1a2533]">{booking.time_slot}</div>
                   </div>
                   <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#6b7f93] uppercase tracking-widest">
                         <CreditCard className="w-3 h-3 text-[#3d7ab5]" /> Amount
                      </div>
                      <div className="text-[13px] font-bold text-[#1a2533]">₹{booking.total_amount}</div>
                   </div>
                </div>

                {/* Address & Service Type */}
                <div className="bg-[#f8fafd] rounded-2xl p-4 border border-[#eef5fb] mb-8">
                   <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#3d7ab5] shrink-0 mt-0.5" />
                      <div>
                         <span className="text-[10px] font-extrabold text-[#6b7f93] uppercase tracking-widest block mb-0.5">Service Location</span>
                         <p className="text-xs font-bold text-[#1a2533] line-clamp-1">{booking.address || 'Your current registered address'}</p>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-auto">
                   <button 
                     onClick={() => router.push(`/messages?user_id=${booking.worker_id}`)}
                     className="flex-1 bg-white border border-[#dde9f3] text-[#1a2533] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#eef5fb] transition-all"
                   >
                      <MessageSquare className="w-4 h-4 text-[#3d7ab5]" /> Chat
                   </button>
                   {booking.status === 'completed' ? (
                      <button className="flex-[2] bg-white border-2 border-[#1a8c4e] text-[#1a8c4e] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e6f7ee] transition-all">
                         <Star className="w-4 h-4" /> Rate Service
                      </button>
                   ) : (
                      <Link 
                        href={`/bookings/${booking.id}`}
                        className="flex-[2] bg-[#3d7ab5] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center hover:bg-[#2c5f8a] transition-all shadow-lg shadow-[#3d7ab5]/10"
                      >
                         View Details
                      </Link>
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


