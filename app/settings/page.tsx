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
  Languages,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, setUser, role, setRole, language: storeLanguage, setLanguage: setStoreLanguage } = useUserStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initCheck() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      
      // Fetch current settings from DB
      const table = role === 'employer' ? 'employers' : 'employees';
      const { data, error } = await supabase
        .from(table)
        .select("language, notifications_enabled")
        .eq("id", session.user.id)
        .single();
      
      if (data) {
        if (data.language) {
          setLanguage(data.language === 'HI' ? 'हिन्दी' : 'English');
          setStoreLanguage(data.language);
        }
        if (data.notifications_enabled !== undefined) setNotifications(data.notifications_enabled);
      }
    }
    initCheck();
  }, [router, role, setStoreLanguage]);

  const updateSetting = async (key: string, value: any) => {
    const table = role === 'employer' ? 'employers' : 'employees';
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from(table)
      .update({ [key]: value })
      .eq("id", session.user.id);
    
    if (error) {
      console.warn(`Could not update ${key} in DB (column might not exist):`, error.message);
    }
  };

  const toggleNotifications = async () => {
    const newVal = !notifications;
    setNotifications(newVal);
    await updateSetting('notifications_enabled', newVal);
  };

  const toggleLanguage = async () => {
    const isCurrentlyEnglish = language === "English";
    const newDisplay = isCurrentlyEnglish ? "हिन्दी" : "English";
    const newCode = isCurrentlyEnglish ? "HI" : "EN";
    
    setLanguage(newDisplay);
    setStoreLanguage(newCode);
    await updateSetting('language', newCode);
  };

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setRole(null as any);
      setUser(null);
      router.replace('/login');
    } else {
      alert("Error logging out: " + error.message);
    }
    setLoading(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Password reset email sent to " + user.email);
    }
  };

  const settingsItems = [
    { 
      group: "Account Security", 
      icon: Lock, 
      color: "#3d7ab5", 
      items: [
        { name: "Reset Password", action: handlePasswordReset },
        { name: "Two-Factor Auth", note: "Coming Soon" },
        { name: "Session History" }
      ] 
    },
    { 
      group: "Preferences", 
      icon: Globe, 
      color: "#1a8c4e", 
      items: [
        { name: `Language: ${language}`, action: toggleLanguage },
        { name: `Push Notifications: ${notifications ? 'On' : 'Off'}`, action: toggleNotifications },
      ] 
    },
    { 
      group: "Billing & Subscriptions", 
      icon: CreditCard, 
      color: "#e07b39", 
      items: [
        { name: "Active Subscription", note: "Free Tier" },
        { name: "Transaction History" },
      ] 
    },
    { 
      group: "Help & Legal", 
      icon: ShieldCheck, 
      color: "#6b7f93", 
      items: [
        { name: "Terms and Conditions", action: () => router.push('/terms') },
        { name: "Privacy Policy", action: () => router.push('/privacy') },
        { name: "Support: laborgrow@gmail.com", action: () => window.location.href = 'mailto:laborgrow@gmail.com' },
      ] 
    },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/profile" className="flex items-center gap-2 text-[#3d7ab5] font-bold text-sm mb-4 hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Profile
            </Link>
            <h1 className="text-3xl font-extrabold text-[#1a2533] font-serif mb-2">System Settings</h1>
            <p className="text-[#6b7f93] font-medium">Control your privacy, preferences, and account security</p>
          </div>
          
          <button 
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" /> {loading ? "Signing out..." : "Sign Out"}
          </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Main Settings Panel */}
           <div className="lg:col-span-2 space-y-6">
              {settingsItems.map((group, idx) => {
                const Icon = group.icon;
                return (
                  <div key={idx} className="bg-white border border-[#dde9f3] rounded-[32px] p-8 shadow-sm">
                     <h3 className="text-sm font-extrabold text-[#1a2533] uppercase tracking-widest flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                        <div className={`p-2 rounded-xl text-white`} style={{ backgroundColor: group.color }}>
                           <Icon className="w-4 h-4" />
                        </div>
                        {group.group}
                     </h3>
                     <div className="space-y-2">
                        {group.items.map((item: any, i) => (
                          <div 
                            key={i} 
                            onClick={item.action}
                            className={`flex justify-between items-center group p-[12px_16px] rounded-xl transition-all ${item.action ? 'cursor-pointer hover:bg-[#eef5fb]' : 'opacity-70'}`}
                          >
                             <div className="flex flex-col">
                                <span className={`text-[14px] font-bold ${item.action ? 'text-[#1a2533] group-hover:text-[#3d7ab5]' : 'text-[#6b7f93]'}`}>{item.name}</span>
                                {item.note && <span className="text-[10px] text-[#6b7f93] font-medium uppercase tracking-wider">{item.note}</span>}
                             </div>
                             {item.action && <ChevronRight className="w-4 h-4 text-[#6b7f93] group-hover:translate-x-1 transition-all" />}
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
                 <p className="text-[11px] text-[#6b7f93] font-bold uppercase tracking-wider mb-6">Device: {typeof window !== 'undefined' ? navigator.platform : 'Unknown'}</p>
                 <button className="w-full bg-white text-[#3d7ab5] border border-[#c8dff0] py-4 rounded-2xl font-bold hover:bg-[#3d7ab5] hover:text-white transition-all shadow-sm">
                    View full history
                 </button>
              </div>

              <div className="bg-white border border-[#dde9f3] rounded-[32px] p-8">
                 <h4 className="text-xs font-extrabold text-[#1a2533] uppercase tracking-widest mb-5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1a8c4e]" /> Privacy Status
                 </h4>
                 <div className="p-4 bg-[#f8fafd] rounded-2xl border border-dashed border-[#dde9f3]">
                    <p className="text-[11px] text-[#6b7f93] font-medium leading-relaxed">
                       Your data is encrypted and stored securely on our cloud infrastructure. We never share your contact details without your explicit consent.
                    </p>
                 </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-[32px] p-8 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-red-500 shadow-sm border border-red-100">
                    <Trash2 className="w-5 h-5" />
                 </div>
                 <h4 className="text-[11px] font-extrabold text-red-500 uppercase tracking-widest mb-4">Danger Zone</h4>
                 <button className="w-full bg-red-500 text-white py-3.5 rounded-2xl font-bold text-xs hover:bg-red-600 transition-all shadow-md">
                    Delete Account
                 </button>
              </div>
           </div>
      </div>
    </div>
  );
}

