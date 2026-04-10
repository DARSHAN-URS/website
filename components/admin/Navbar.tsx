'use client';

import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-muted hover:bg-blue-pale rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text" 
            placeholder="Search bookings, users, or dispatch..." 
            className="w-full bg-blue-pale/50 border border-transparent focus:border-blue/30 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 text-muted hover:bg-blue-pale rounded-xl relative transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-blue-dark">Admin Officer</p>
            <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-blue-light rounded-xl flex items-center justify-center text-blue">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
