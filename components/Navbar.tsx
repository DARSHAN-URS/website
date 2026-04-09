"use client";

import { useUserStore } from "@/lib/store";
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  MapPin,
  Menu
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const { user, role } = useUserStore();
  const pathname = usePathname();

  // Get dynamic title based on path
  const getPageTitle = () => {
    const segment = pathname.split('/')[1];
    if (!segment) return "Home";
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className="bg-white border-b border-[#dde9f3] p-6 lg:px-10 flex items-center justify-between sticky top-0 z-[80] backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
         <div className="lg:hidden flex items-center gap-4 border-r border-[#dde9f3] pr-6">
            <Menu className="w-6 h-6 text-[#1a2533]" />
            <Link href="/" className="block">
              <Logo size="md" />
            </Link>
         </div>
         <div className="hidden md:flex lg:flex-1 items-center gap-3">
            <h1 className="text-2xl font-extrabold text-[#1a2533] font-serif pr-6 border-r border-[#dde9f3]">{getPageTitle()}</h1>
            <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest uppercase text-[#6b7f93] bg-[#eef5fb] px-3 py-1.5 rounded-lg border border-[#c8dff0]">
               <MapPin className="w-3.5 h-3.5 text-[#3d7ab5]" /> Noida, India
            </div>
         </div>
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
         <div className="hidden sm:flex items-center gap-0 bg-[#eef5fb] rounded-2xl border border-[#dde9f3] group focus-within:ring-2 focus-within:ring-[#3d7ab5]/10 focus-within:bg-white transition-all">
            <div className="pl-4 pr-2 text-[#6b7f93]"><Search className="w-4 h-4" /></div>
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none py-3 pr-4 text-sm font-medium w-48 lg:w-64"
            />
         </div>
         
         <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link href="/profile" className="w-11 h-11 bg-white border border-[#dde9f3] rounded-2xl flex items-center justify-center text-[#1a2533] hover:bg-[#eef5fb] transition-all cursor-pointer">
               <UserIcon className="w-5 h-5" />
            </Link>
         </div>
      </div>
    </nav>
  );
}
