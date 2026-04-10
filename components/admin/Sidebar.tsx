'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  HardHat, 
  CalendarCheck, 
  Truck, 
  Bell, 
  AlertTriangle, 
  BarChart3, 
  Activity, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import Logo from '@/components/Logo';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: HardHat, label: 'Workers', href: '/admin/workers' },
  { icon: CalendarCheck, label: 'Bookings', href: '/admin/bookings' },
  { icon: Truck, label: 'Dispatch', href: '/admin/dispatch' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  { icon: AlertTriangle, label: 'Disputes', href: '/admin/disputes' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: Activity, label: 'Monitoring', href: '/admin/monitoring' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-border flex flex-col z-50">
      <div className="p-6">
        <Logo />
        <div className="mt-2 text-[10px] font-bold text-blue tracking-[0.2em] uppercase">Admin Portal</div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-blue text-white shadow-lg shadow-blue/20' 
                  : 'text-muted hover:bg-blue-pale hover:text-blue'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted group-hover:text-blue'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
