"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  User, 
  Settings,
  Search,
  CheckCircle,
  Calendar
} from "lucide-react";
import { useUserStore } from "@/lib/store";

export default function BottomNav() {
  const pathname = usePathname();
  const { role } = useUserStore();

  const hireNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Jobs", icon: Briefcase, path: "/jobs" },
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

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#dde9f3] flex items-center justify-around py-3 px-2 z-[90] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-[#3d7ab5]' : 'text-[#6b7f93]'}`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
