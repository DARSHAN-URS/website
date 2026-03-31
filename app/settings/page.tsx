"use client";

import { useUserStore } from "@/lib/store";
import { 
  CreditCard, 
  Trash2, 
  History, 
  MapPin, 
  Lock, 
  Globe, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Bell,
  Languages
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect } from "react";

export default function SettingsPage() {
  const { role } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No settings session: Redirecting to login...");
        router.replace('/login');
        return;
      }
    }
    initCheck();
  }, [router]);

  const settingsItems = [
    { 
      group: "Account Security", 
      icon: Lock, 
      color: "#3d7ab5", 
      items: ["Password Reset", "Two-Factor Auth", "Session History"] 
    },
    { 
      group: "Preferences", 
      icon: Globe, 
      color: "#1a8c4e", 
      items: ["App Language (हिन्दी/EN)", "Notification Push", "Accessibility Settings"] 
    },
    { 
      group: "Billing & Subscriptions", 
      icon: CreditCard, 
      color: "#e07b39", 
      items: ["Active Subscription", "Transaction History", "Invoice Downloads"] 
    },
  ];

  return (
    <div className="flex bg-[#fdfdfd] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-12 mt-6 lg:mt-0">
        <header className="mb-12">
            <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif mb-2">System Settings</h1>
            <p className="text-[#6b7f93] font-medium">Control your privacy, preferences, and account security</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Main Settings Panel */}
           <div className="lg:col-span-2 space-y-6">
              {settingsItems.map((group, idx) => {
                const Icon = group.icon;
                return (
                  <div key={idx} className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm transition-all hover:shadow-md">
                     <h3 className="text-sm font-extrabold text-[#1a2533] uppercase tracking-widest flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <div className={`p-2 rounded-xl text-white`} style={{ backgroundColor: group.color }}>
                           <Icon className="w-4 h-4" />
                        </div>
                        {group.group}
                     </h3>
                     <div className="space-y-2">
                        {group.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-[#eef5fb] p-[10px_16px] rounded-xl transition-all">
                             <span className="text-[14px] font-bold text-[#6b7f93] group-hover:text-[#3d7ab5]">{item}</span>
                             <ChevronRight className="w-4 h-4 text-[#6b7f93] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                     </div>
                  </div>
                );
              })}
           </div>

           {/* Sidebar: Status & Info */}
           <div className="space-y-6">
              <div className="bg-[#eef5fb] border border-[#c8dff0] rounded-[32px] p-8 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 text-[#3d7ab5] shadow-lg shadow-[#3d7ab5]/10">
                    <History className="w-7 h-7" />
                 </div>
                 <h4 className="text-[13px] font-extrabold text-[#3d7ab5] uppercase tracking-widest mb-2">Activity History</h4>
                 <p className="text-[11px] text-[#6b7f93] font-bold uppercase tracking-wider mb-6">Review your logs</p>
                 <button className="w-full bg-white text-[#3d7ab5] border border-[#c8dff0] py-4 rounded-2xl font-bold hover:bg-[#3d7ab5] hover:text-white transition-all shadow-sm">
                    View full history
                 </button>
              </div>

              <div className="bg-[#f0f4f8] rounded-[32px] p-8">
                 <h4 className="text-xs font-extrabold text-[#1a2533] uppercase tracking-widest mb-5 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#3d7ab5]" /> Active Notifications
                 </h4>
                 <div className="space-y-4">
                    {[
                      { msg: 'New worker match nearby', time: '10m ago' },
                      { msg: 'Job post expiring', time: '2h ago' },
                      { msg: 'Payment successful', time: '1d ago' },
                    ].map((n, i) => (
                      <div key={i} className="p-4 bg-white/50 rounded-2xl border border-white/50 flex items-center justify-between text-[11px]">
                         <span className="font-bold text-[#6b7f93] truncate max-w-[120px]">{n.msg}</span>
                         <span className="text-[9px] font-extrabold text-[#3d7ab5] uppercase tracking-widest">{n.time}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-red-500 shadow-sm border border-red-100">
                    <Trash2 className="w-5 h-5" />
                 </div>
                 <h4 className="text-[11px] font-extrabold text-red-500 uppercase tracking-widest mb-6">Danger Zone</h4>
                 <button className="w-full border-2 border-red-200 text-red-500 py-3.5 rounded-2xl font-bold text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                    Deactivate Account
                 </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
