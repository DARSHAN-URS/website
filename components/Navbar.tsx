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
            <Link href="/" className="flex items-center gap-2 group">
              <svg className="w-10 h-7 transition-transform group-hover:scale-110" viewBox="0 0 100 60" fill="none">
                <path d="M10 45C10 45 25 10 50 10C75 10 90 45 90 45L75 55C75 55 65 30 50 30C35 30 25 55 25 55L10 45Z" fill="white" stroke="#3d7ab5" strokeWidth="6" strokeLinejoin="round"/>
                <path d="M45 30L50 42L55 30" stroke="#3d7ab5" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              <span className="font-serif text-xl font-extrabold text-[#3d7ab5]">Laborgro</span>
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
            <button className="w-11 h-11 bg-white border border-[#dde9f3] rounded-2xl flex items-center justify-center text-[#6b7f93] hover:text-[#3d7ab5] hover:bg-[#eef5fb] transition-all relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <Link href="/profile" className="w-11 h-11 bg-white border border-[#dde9f3] rounded-2xl flex items-center justify-center text-[#1a2533] hover:bg-[#eef5fb] transition-all cursor-pointer">
               <UserIcon className="w-5 h-5" />
            </Link>
         </div>
      </div>
    </nav>
  );
}
