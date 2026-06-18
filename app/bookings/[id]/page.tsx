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
  Star,
} from "lucide-react";
import Link from "next/link";
import { bookingApi, reviewApi } from "@/lib/api";

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { role } = useUserStore();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchBookingDetails() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        const data = await bookingApi.getBookingDetail(params.id as string, session.access_token);
        if (data) {
          setBooking(data);
        } else {
          console.warn("No booking data returned from API");
        }
      } catch (err: any) {
        console.error("Details fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) fetchBookingDetails();
  }, [params.id, router]);

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
  // Handle worker nested user object vs customer flat object
  const personName = role === 'employer' ? person?.user?.name : person?.name || 'Customer';
  const avatar = role === 'employer' ? person?.user?.profile_pic_url : person?.avatar_url;

  const updateStatus = async (newStatus: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      const updated = await bookingApi.updateBookingStatus(booking.id, newStatus, session.access_token);
      if (updated) {
        setBooking(updated);
      }
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  const submitReview = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setIsSubmittingReview(true);
    try {
      await reviewApi.createReview({
        worker_id: booking.worker.id,
        rating,
        comment
      }, session.access_token);
      alert("Thank you for your review!");
      setShowReviewModal(false);
    } catch (err: any) {
      alert("Error submitting review: " + err.message);
    } finally {
      setIsSubmittingReview(false);
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
                    <div className="w-full h-full rounded-[28px] bg-[#f8fafd] border-2 border-white shadow-lg flex items-center justify-center text-4xl overflow-hidden">
                       {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : (role === 'employer' ? "👨🏾‍🔧" : "👤")}
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
                      onClick={() => router.push(`/messages?user_id=${role === 'employer' ? (booking.worker?.id || booking.worker_id) : booking.customer_id}`)}
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
                    {role === 'worker' && isAccepted && (
                      <button 
                        onClick={() => updateStatus('completed')}
                        className="w-full bg-[#1a8c4e] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#157340] transition-all shadow-lg shadow-[#1a8c4e]/20"
                      >
                         <CheckCircle2 className="w-4 h-4" /> Mark as Completed
                      </button>
                    )}
                    {role === 'employer' && isCompleted && (
                      <button 
                        onClick={() => setShowReviewModal(true)}
                        className="w-full bg-[#f59e0b] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#d97706] transition-all shadow-lg shadow-[#f59e0b]/20"
                      >
                         <Star className="w-4 h-4 fill-current" /> Leave a Review
                      </button>
                    )}
                 </div>

                 {/* Additional Worker Info for Employer */}
                 {role === 'employer' && booking.worker && (
                   <div className="mt-8 pt-8 border-t border-gray-50 text-left space-y-6">
                      <div>
                         <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] mb-2">About Expert</h4>
                         <p className="text-xs text-[#1a2533] font-medium leading-relaxed line-clamp-4">
                            {booking.worker.work_details || booking.worker.bio || "Verified professional ready to serve."}
                         </p>
                      </div>
                      {booking.worker.skills && (
                        <div>
                           <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#6b7f93] mb-3">Skills</h4>
                           <div className="flex flex-wrap gap-1.5">
                              {(Array.isArray(booking.worker.skills) ? booking.worker.skills : booking.worker.skills.split(',')).map((skill: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-[#f0f7ff] text-[#3d7ab5] text-[9px] font-bold rounded-lg border border-[#c8dff0]">
                                  {typeof skill === 'string' ? skill : skill.skill_name}
                                </span>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 )}
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

      {showReviewModal && (
        <div className="fixed inset-0 bg-[#1a2533]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-extrabold text-[#1a2533] mb-2 font-serif tracking-tight">Rate {personName}</h3>
            <p className="text-[#6b7f93] text-sm mb-6 font-medium">How was your experience with this professional?</p>
            
            <div className="flex justify-center gap-3 mb-8 bg-[#f8fafd] py-6 rounded-2xl border border-[#dde9f3]">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transform transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${rating >= star ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-[#c8dff0]'}`} 
                  />
                </button>
              ))}
            </div>

            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment (optional)..."
              className="w-full bg-white border-2 border-[#dde9f3] rounded-2xl p-5 text-sm focus:outline-none focus:border-[#3d7ab5] focus:ring-4 focus:ring-[#3d7ab5]/10 mb-8 min-h-[120px] resize-y transition-all placeholder:text-[#94a3b8] font-medium"
            ></textarea>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-white border-2 border-[#dde9f3] text-[#6b7f93] font-bold py-4 rounded-2xl hover:bg-[#f8fafd] hover:text-[#1a2533] hover:border-[#c8dff0] transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={submitReview}
                disabled={isSubmittingReview}
                className="flex-1 bg-[#3d7ab5] text-white font-bold py-4 rounded-2xl hover:bg-[#2c5f8a] transition-all shadow-lg shadow-[#3d7ab5]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmittingReview ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
     </div>
   );
 }
