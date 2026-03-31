"use client";

import { MapPin, Navigation } from "lucide-react";

export default function MapView() {
  return (
    <div className="relative w-full h-[320px] bg-[#eef5fb] rounded-[32px] overflow-hidden border-[1.5px] border-white shadow-xl shadow-[#3d7ab5]/5 group">
       {/* Background Grid Pattern (Simulating Map) */}
       <div className="absolute inset-0 bg-[radial-gradient(circle,#b7e4cd_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 group-hover:scale-110 transition-transform duration-1000"></div>
       <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-105 transition-transform duration-700"></div>
       
       {/* Central Viewport Marker */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-ping absolute opacity-50"></div>
          <div className="w-6 h-6 bg-[#3d7ab5] rounded-full border-2 border-white shadow-lg relative z-10"></div>
          <div className="mt-2.5 bg-white px-3.5 py-1.5 rounded-xl border border-gray-100 shadow-sm text-[10px] font-extrabold text-[#3d7ab5] uppercase tracking-widest relative z-10 transition-all group-hover:-translate-y-1">
             Your Location
          </div>
       </div>

       {/* Nearby Pins (Fixed Mockup) */}
       {[
         { top: '30%', left: '20%', label: 'Painter', icon: '🎨' },
         { top: '65%', left: '75%', label: 'Cleaner', icon: '👩‍🍳' },
         { top: '25%', left: '80%', label: 'Carpenter', icon: '🔨' },
         { top: '70%', left: '35%', label: 'Security', icon: '🛡️' },
       ].map((pin, i) => (
         <div key={i} className="absolute flex items-center gap-2 group/pin cursor-pointer transition-all" style={{ top: pin.top, left: pin.left }}>
            <div className="w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center text-sm border border-gray-50 group-hover/pin:scale-125 transition-transform">
               {pin.icon}
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-extrabold text-[#6b7f93] uppercase tracking-wider opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
               Available: {pin.label}
            </div>
         </div>
       ))}

       {/* Map UI Overlay */}
       <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className="flex gap-2">
             <div className="bg-white p-2 rounded-xl border border-gray-50 shadow-md text-[#3d7ab5] hover:bg-[#3d7ab5] hover:text-white transition-all cursor-pointer">
                <Navigation className="w-5 h-5" />
             </div>
             <div className="bg-white px-4 py-2 rounded-xl border border-gray-50 shadow-md text-xs font-bold text-[#6b7f93]">
                Radius: <span className="text-[#3d7ab5]">5km</span>
             </div>
          </div>
          <div className="bg-[#3d7ab5] text-white p-[8px_20px] rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-white hover:text-[#3d7ab5] transition-all border border-[#3d7ab5]">
             Refresh View
          </div>
       </div>
       
       <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-[8px_16px] rounded-xl border border-white shadow-sm flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#3d7ab5]">
          <MapPin className="w-3.5 h-3.5" /> Live Worker Tracking Active
       </div>
    </div>
  );
}
