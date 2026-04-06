"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, Briefcase, MessageSquare, CreditCard, ChevronRight, XIcon } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useUserStore } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";

export interface Notification {
  id: string;
  type: 'job_application' | 'booking_update' | 'message' | 'payment';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationCenter() {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      } else if (error && error.code === 'PGRST116') {
         // Gracefully handle if table doesn't exist yet - just show empty
         setNotifications([]);
      }
    };

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel('notifications-live')
      .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications', 
          filter: `user_id=eq.${user.id}` 
      }, (payload) => {
          setNotifications(prev => [payload.new as Notification, ...prev]);
          setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'job_application': return <Briefcase className="w-4 h-4 text-[#3d7ab5]" />;
      case 'booking_update': return <CheckCircle2 className="w-4 h-4 text-[#1a8c4e]" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-[#6b7f93]" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 bg-white border border-[#dde9f3] rounded-2xl flex items-center justify-center text-[#6b7f93] hover:text-[#3d7ab5] hover:bg-[#eef5fb] transition-all relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-[360px] bg-white border border-[#dde9f3] rounded-[32px] shadow-2xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
           <header className="p-6 border-b border-[#f0f4f8] flex items-center justify-between bg-[#fcfdfe]">
              <div>
                 <h3 className="text-lg font-extrabold text-[#1a2533] font-serif">Notifications</h3>
                 <p className="text-[10px] font-bold text-[#6b7f93] uppercase tracking-wider">You have {unreadCount} unread alerts</p>
              </div>
              <button 
                onClick={markAllAsRead} 
                className="text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest hover:underline"
              >
                Mark all read
              </button>
           </header>

           <div className="max-h-[420px] overflow-y-auto bg-white custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                   <div className="w-16 h-16 bg-[#f8fafd] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#eef5fb]">
                      <Bell className="w-8 h-8 text-[#dde9f3]" />
                   </div>
                   <h4 className="text-sm font-bold text-[#1a2533]">All caught up!</h4>
                   <p className="text-xs text-[#6b7f93] mt-1 font-medium">We'll alert you when something important happens.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-5 flex gap-4 hover:bg-[#fcfdfe] transition-colors border-b border-gray-50 group cursor-pointer ${!n.is_read ? 'bg-[#3d7ab5]/5' : ''}`}
                  >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${!n.is_read ? 'bg-white border-[#3d7ab5]/20' : 'bg-[#f8fafd] border-[#eef5fb]'}`}>
                        {getIcon(n.type)}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className={`text-xs uppercase tracking-tight ${!n.is_read ? 'font-black text-[#1a2533]' : 'font-bold text-[#6b7f93]'}`}>{n.title}</h4>
                           <span className="text-[9px] font-bold text-[#6b7f93] whitespace-nowrap">
                              {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                           </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${!n.is_read ? 'font-bold text-[#1a2533]/80' : 'font-medium text-[#6b7f93]'}`}>{n.message}</p>
                     </div>
                  </div>
                ))
              )}
           </div>
           
           <footer className="p-4 bg-[#f8fafd] border-t border-[#eef5fb] text-center">
              <button className="text-[11px] font-extrabold text-[#3d7ab5] uppercase tracking-widest flex items-center justify-center gap-1 mx-auto hover:gap-2 transition-all">
                View All Activity <ChevronRight className="w-3.5 h-3.5" />
              </button>
           </footer>
        </div>
      )}
    </div>
  );
}
