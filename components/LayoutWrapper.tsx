"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import SupabaseListener from "@/components/SupabaseListener";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const noLayoutRoutes = ["/login", "/signup", "/"];
  const isNoLayout = noLayoutRoutes.includes(pathname);

  if (isNoLayout) {
    return (
      <div className={inter.className}>
        <SupabaseListener />
        {children}
      </div>
    );
  }

  return (
    <div className={`flex flex-col lg:flex-row bg-[#fdfdfd] min-h-screen ${inter.className}`}>
      <SupabaseListener />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden pb-16 lg:pb-0">
        <Navbar />
        <main className="flex-1 p-0 transition-all duration-300">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
