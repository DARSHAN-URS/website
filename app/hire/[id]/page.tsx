"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  User,
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
import { bookingApi } from "@/lib/api";

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
  const [hours, setHours] = useState(8); // Default to full day
  const [isFullDay, setIsFullDay] = useState(true);

  const timeSlots = [
    "07:00 AM", "09:00 AM", "10:00 AM", "11:30 AM",
    "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"
  ];

  useEffect(() => {
    async function fetchWorker() {
      // Robust param check
      const workerId = params?.id;
      if (!workerId) {
        console.warn("No worker ID provided in URL params");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching worker with ID: ${workerId}`);
        const { data, error: fetchError } = await supabase
          .from("employees")
          .select("*")
          .eq("id", workerId)
          .maybeSingle();

        if (fetchError) {
          console.error("Supabase fetch error:", fetchError.message);
          setError(`Database error: ${fetchError.message}`);
        } else if (!data) {
          console.warn(`No worker found in 'employees' table for ID: ${workerId}`);
          
          // Optional: Check if user exists in 'users' but not 'employees'
          const { data: userData } = await supabase.auth.getUser();
          console.log("Current session user:", userData?.user?.id);
          
          setError("Worker not found in the marketplace database.");
        } else {
          console.log("Successfully fetched worker data:", data.full_name);
          setWorker(data);
        }
      } catch (err: any) {
        console.error("Unexpected fetch error:", err);
        setError("An unexpected error occurred while fetching worker details.");
      } finally {
        setLoading(false);
      }
    }

    fetchWorker();
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
    if (!session || !session.access_token) {
      router.push("/login");
      return;
    }

    try {
      const bookingData = {
        worker_id: worker.id,
        category_id: worker.category_id || 1, // Defaulting to 1 if not provided
        booking_date: selectedDate,
        time_slot: selectedTime,
        hours: hours,
        address: address
      };

      await bookingApi.createBooking(bookingData, session.access_token);
      router.push("/bookings");
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Booking failed: " + (err.response?.data?.detail || err.message || "Unknown error"));
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#fdfdfd]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3d7ab5]"></div>
    </div>
  );

  if (!worker) return (
    <div className="p-12 text-center h-screen flex flex-col items-center justify-center">
       <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
          <AlertCircle className="w-10 h-10" />
       </div>
       <h2 className="text-3xl font-extrabold text-[#1a2533] font-serif mb-2">{error || "Worker not found"}</h2>
       <p className="text-[#6b7f93] font-medium max-w-sm mb-8">We couldn't locate the profile you're looking for. It may have been moved or the ID might be invalid.</p>
       <Link href="/search" className="bg-[#3d7ab5] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#3d7ab5]/20 hover:scale-105 transition-all">
          Back to Marketplace
       </Link>
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

              {/* Work Duration Section */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                 <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-[#eef5fb] flex items-center justify-center">
                       <Clock className="w-5 h-5 text-[#3d7ab5]" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#1a2533]">Work Duration</h2>
                 </div>

                 <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                       <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-4">Choose Duration</label>
                       <div className="flex gap-3">
                          <button 
                            onClick={() => { setIsFullDay(true); setHours(8); }}
                            className={`flex-1 py-4 rounded-xl font-bold text-sm border-2 transition-all ${isFullDay ? 'border-[#3d7ab5] bg-[#eef5fb] text-[#3d7ab5]' : 'border-gray-50 bg-[#fdfdfd] text-[#6b7f93] hover:border-[#3d7ab5]/30'}`}
                          >
                             Full Day (8 hrs)
                          </button>
                          <button 
                            onClick={() => setIsFullDay(false)}
                            className={`flex-1 py-4 rounded-xl font-bold text-sm border-2 transition-all ${!isFullDay ? 'border-[#3d7ab5] bg-[#eef5fb] text-[#3d7ab5]' : 'border-gray-50 bg-[#fdfdfd] text-[#6b7f93] hover:border-[#3d7ab5]/30'}`}
                          >
                             Custom Hours
                          </button>
                       </div>
                    </div>

                    {!isFullDay && (
                       <div className="flex-1 animate-[fadeUp_0.3s_ease_both]">
                          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] block mb-4">Number of Hours</label>
                          <div className="flex items-center gap-4">
                             <input 
                               type="range" 
                               min="1" 
                               max="12" 
                               value={hours} 
                               onChange={(e) => setHours(parseInt(e.target.value))}
                               className="flex-1 accent-[#3d7ab5]"
                             />
                             <span className="w-12 h-12 rounded-xl bg-[#3d7ab5] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#3d7ab5]/20">
                                {hours}
                             </span>
                          </div>
                          <p className="text-[10px] text-[#6b7f93] font-bold mt-2 italic">*Maximum 12 hours allowed for single booking</p>
                       </div>
                    )}
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

              {/* About Section */}
              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-10 h-10 rounded-2xl bg-[#eef5fb] flex items-center justify-center">
                        <User className="w-5 h-5 text-[#3d7ab5]" />
                     </div>
                     <h2 className="text-xl font-extrabold text-[#1a2533]">About the Expert</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] mb-3">Work Experience & Bio</h4>
                      <p className="text-[#1a2533] font-medium leading-relaxed">
                        {worker.work_details || "No detailed work description provided yet. This worker is verified and ready for service."}
                      </p>
                    </div>
                    
                    {worker.skills && (
                      <div>
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] mb-3">Specialized Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {worker.skills.split(',').map((skill: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-[#f0f7ff] text-[#3d7ab5] text-xs font-bold rounded-xl border border-[#c8dff0]">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <div className="flex justify-between items-baseline mb-2">
                       <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#6b7f93]">Base Rate</span>
                       <span className="text-sm font-bold text-[#1a2533]">₹{worker.hourly_rate || 150}/hr</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-4">
                       <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#6b7f93]">Duration</span>
                       <span className="text-sm font-bold text-[#1a2533]">{hours} Hours</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                       <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#6b7f93]">Total Wage</span>
                       <span className="text-2xl font-extrabold text-[#3d7ab5] font-serif">₹{worker.hourly_rate * hours || 0}</span>
                    </div>
                    <div className="h-px bg-[#dde9f3] my-4"></div>
                    <div className="flex justify-between items-baseline">
                       <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#1a2533]">Final Amount</span>
                       <span className="text-3xl font-extrabold text-[#1a2533] font-serif">₹{worker.hourly_rate * hours + 50}</span>
                    </div>
                    <p className="text-[9px] text-[#6b7f93] font-bold uppercase mt-2 tracking-wider">*Includes ₹50 platform convenience fee</p>
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
