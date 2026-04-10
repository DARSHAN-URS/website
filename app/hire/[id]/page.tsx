"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Navigation,
  DollarSign,
  ShieldCheck,
  Star
} from "lucide-react";
import Link from "next/link";

export default function HireWorkerPage() {
  const params = useParams();
  const router = useRouter();
  const [worker, setWorker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("B-42, Sector 18, Noida, UP 201301");
  const [isLocating, setIsLocating] = useState(false);

  const timeSlots = [
    "07:00 AM", "09:00 AM", "10:00 AM", "11:30 AM",
    "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"
  ];

  useEffect(() => {
    async function fetchWorker() {
      if (!params || !params.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", params.id)
        .single();

      if (data) setWorker(data);
      if (error) console.error("Worker fetch error:", error.message);
      setLoading(false);
    }

    if (params?.id) fetchWorker();
  }, [params?.id]);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        } catch (err) {
          console.error("Location fetch error:", err);
        } finally {
          setIsLocating(false);
        }
      }, () => {
        setIsLocating(false);
        alert("Permission denied or location unavailable.");
      });
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedTime) {
      alert("Please select a time slot.");
      return;
    }

    setSubmitting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const bookingRef = `LBG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const totalAmount = (worker?.hourly_rate || 150) * 4 + 50; // Rate * 4hrs + fee

    const { error } = await supabase.from('bookings').insert([
      {
        customer_id: session.user.id,
        worker_id: worker.id,
        status: 'pending',
        booking_ref: bookingRef,
        total_amount: totalAmount,
        booking_date: selectedDate,
        time_slot: selectedTime,
        address: address
      }
    ]);

    if (!error) {
      router.push("/bookings");
    } else {
      alert("Booking failed: " + error.message);
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  if (!worker) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold">Worker not found</h2>
      <Link href="/search" className="text-[#3d7ab5] mt-4 block underline">Back to Search</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafd] p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
           <h1 className="text-4xl font-extrabold text-[#1a2533] font-serif mb-2">Book Your Expert</h1>
           <p className="text-[#6b7f93] font-medium">Complete the details below to schedule your professional service.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Form Section */}
           <div className="lg:col-span-2 space-y-8">
              {/* Date & Time Selection */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                 <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-[#eef5fb] flex items-center justify-center">
                       <Calendar className="w-5 h-5 text-[#3d7ab5]" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#1a2533]">Schedule Preference</h2>
                 </div>

                 <div className="space-y-8">
                    <div>
                       <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-4">Choose Date</label>
                       <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                          {[0,1,2,3,4,5,6].map(i => {
                             const d = new Date();
                             d.setDate(d.getDate() + i);
                             const dateStr = d.toISOString().split('T')[0];
                             const isSelected = selectedDate === dateStr;
                             return (
                                <button 
                                   key={i}
                                   onClick={() => setSelectedDate(dateStr)}
                                   className={`flex-shrink-0 w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-[#3d7ab5] bg-[#eef5fb]' : 'border-gray-50 bg-[#fdfdfd] hover:border-[#3d7ab5]/30'}`}
                                >
                                   <span className={`text-[10px] font-extrabold uppercase mb-1 ${isSelected ? 'text-[#3d7ab5]' : 'text-[#6b7f93]'}`}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                   <span className={`text-2xl font-black ${isSelected ? 'text-[#3d7ab5]' : 'text-[#1a2533]'}`}>{d.getDate()}</span>
                                </button>
                             );
                          })}
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-4">Available Time Slots</label>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {timeSlots.map(slot => (
                             <button 
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-4 rounded-xl font-bold text-sm border-2 transition-all ${selectedTime === slot ? 'border-[#3d7ab5] bg-[#3d7ab5] text-white shadow-lg shadow-[#3d7ab5]/20' : 'border-gray-50 bg-[#fdfdfd] text-[#6b7f93] hover:border-[#3d7ab5]/30'}`}
                             >
                                {slot}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Address Section */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                 <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-[#eef5fb] flex items-center justify-center">
                       <MapPin className="w-5 h-5 text-[#3d7ab5]" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#1a2533]">Job Location</h2>
                 </div>

                 <div className="relative">
                    <textarea 
                       value={address}
                       onChange={(e) => setAddress(e.target.value)}
                       className="w-full bg-[#f8fafd] border border-[#eef5fb] rounded-2xl p-6 text-[#1a2533] font-medium outline-none focus:border-[#3d7ab5] transition-all min-h-[120px]"
                       placeholder="Enter full job location address..."
                    />
                    <button 
                       onClick={handleUseMyLocation}
                       disabled={isLocating}
                       className="mt-4 flex items-center gap-2 text-[11px] font-extrabold text-[#3d7ab5] uppercase tracking-widest hover:underline disabled:opacity-50"
                    >
                       <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} /> {isLocating ? "Detecting..." : "Use My Current Location"}
                    </button>
                 </div>
              </div>
           </div>

           {/* Sidebar: Summary */}
           <div className="space-y-8">
              {/* Worker Card */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                 <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-6">Service Provider</label>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-[22px] bg-[#f8fafd] flex items-center justify-center text-3xl border border-[#eef5fb]">
                       {worker.avatar_url || "👨🏾‍🔧"}
                    </div>
                    <div>
                       <h3 className="font-extrabold text-[#1a2533]">{worker.full_name}</h3>
                       <p className="text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">{worker.category}</p>
                       <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-orange-400 fill-current" />
                          <span className="text-[11px] font-bold text-[#6b7f93]">{worker.rating || '4.8'}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-[#f8fafd] rounded-2xl p-6 border border-[#eef5fb]">
                    <div className="flex justify-between items-baseline">
                       <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#6b7f93]">Daily Wage</span>
                       <span className="text-2xl font-extrabold text-[#3d7ab5] font-serif">₹{worker.hourly_rate * 8 || 1500}</span>
                    </div>
                    <div className="h-px bg-[#dde9f3] my-4"></div>
                    <div className="flex justify-between items-baseline">
                       <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#1a2533]">Final Booking Total</span>
                       <span className="text-3xl font-extrabold text-[#1a2533] font-serif">₹{worker.hourly_rate * 4 + 50}</span>
                    </div>
                    <p className="text-[9px] text-[#6b7f93] font-bold uppercase mt-2 tracking-wider">*Includes platform convenience fee</p>
                 </div>
              </div>

              {/* Security Banner */}
              <div className="bg-[#e6f7ee] border border-[#b7e4cd] rounded-3xl p-6 flex items-start gap-4">
                 <ShieldCheck className="w-6 h-6 text-[#1a8c4e] shrink-0" />
                 <div>
                    <h4 className="font-extrabold text-[#1a8c4e] text-xs uppercase tracking-wider mb-1">Guaranteed Service</h4>
                    <p className="text-[10px] text-[#1a8c4e]/80 font-medium">Your payment is protected under our premium escrow guarantee.</p>
                 </div>
              </div>

              {/* Confirm Button */}
              <button 
                 onClick={handleConfirmBooking}
                 disabled={submitting}
                 className="w-full bg-[#3d7ab5] text-white py-5 rounded-[22px] font-extrabold text-lg shadow-xl shadow-[#3d7ab5]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                 {submitting ? "Booking..." : "Confirm Booking →"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
