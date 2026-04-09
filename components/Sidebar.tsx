"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Settings,
  LogOut,
  Calendar,
  CheckCircle,
  Search
} from "lucide-react";
import Logo from "./Logo";
import { useUserStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";

export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, logout, language } = useUserStore();
  const router = useRouter();

  const t = translations[language as keyof typeof translations] || translations.EN;

  const hireNavItems = [
    { name: t.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.search, icon: Search, path: "/search" },
    { name: t.jobs, icon: Briefcase, path: "/jobs" },
    { name: t.bookings, icon: Calendar, path: "/bookings" },
    { name: t.profile, icon: User, path: "/profile" },
    { name: t.settings, icon: Settings, path: "/settings" },
  ];

  const workNavItems = [
    { name: t.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.search, icon: Search, path: "/jobs" },
    { name: t.applied, icon: CheckCircle, path: "/applied" },
    { name: t.settings, icon: Settings, path: "/settings" },
    { name: t.profile, icon: User, path: "/profile" },
  ];

  const navItems = role === 'employer' ? hireNavItems : workNavItems;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push("/");
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-[#dde9f3] flex flex-col fixed left-0 top-0 z-[100]">
      <div className="p-6">
        <Link href="/" className="mb-8 block">
          <Logo size="lg" />
        </Link>

        <div className="mb-6 p-1.5 bg-[#eef5fb] rounded-xl flex">
          <button 
            onClick={() => setRole('employer')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'employer' ? 'bg-[#3d7ab5] text-white shadow-sm' : 'text-[#6b7f93] hover:bg-white/50'}`}
          >
            Hire
          </button>
          <button 
            onClick={() => setRole('worker')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${role === 'worker' ? 'bg-[#3d7ab5] text-white shadow-sm' : 'text-[#6b7f93] hover:bg-white/50'}`}
          >
            Work
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive ? 'bg-[#eef5fb] text-[#3d7ab5]' : 'text-[#6b7f93] hover:bg-gray-50'}`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#dde9f3]">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition-all w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
