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
import { useUserStore } from "@/lib/store";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const { role, setRole, logout } = useUserStore();
  const router = useRouter();

  const hireNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Posted Jobs", icon: Briefcase, path: "/jobs" },
    { name: "Bookings", icon: Calendar, path: "/bookings" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  const workNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Search", icon: Search, path: "/jobs" },
    { name: "Applied", icon: CheckCircle, path: "/applied" },
    { name: "Profile", icon: User, path: "/profile" },
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
        <Link href="/" className="flex flex-col items-center gap-1 mb-8 group">
          <div className="relative">
            <svg className="w-12 h-8 transition-transform group-hover:scale-110" viewBox="0 0 100 60" fill="none">
              <path d="M10 45C10 45 25 10 50 10C75 10 90 45 90 45L75 55C75 55 65 30 50 30C35 30 25 55 25 55L10 45Z" fill="white" stroke="#3d7ab5" strokeWidth="6" strokeLinejoin="round"/>
              <path d="M45 30L50 42L55 30" stroke="#3d7ab5" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="52" r="2" fill="#3d7ab5"/>
            </svg>
          </div>
          <span className="font-serif text-2xl font-extrabold text-[#3d7ab5] tracking-tight">Laborgro</span>
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
