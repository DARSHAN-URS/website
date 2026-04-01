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
        <Link href="/" className="flex items-center gap-2 mb-8">
          <svg className="w-8 h-8" viewBox="0 0 80 80" fill="none">
            <path d="M16 36 Q20 18 40 16 Q60 18 64 36 Q58 50 40 52 Q22 50 16 36Z" fill="#3d7ab5"/>
          </svg>
          <span className="font-serif text-xl font-extrabold text-[#3d7ab5]">Laborgro</span>
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
