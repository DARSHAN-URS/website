'use client';

import React from 'react';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'alert', title: 'System Latency High', message: 'API response times are exceeding 500ms in some regions.', time: '10m ago' },
    { id: 2, type: 'info', title: 'New Worker Signup', message: '15 new workers signed up in the last hour.', time: '45m ago' },
    { id: 3, type: 'success', title: 'Backup Successful', message: 'Daily database backup completed successfully.', time: '2h ago' },
    { id: 4, type: 'warning', title: 'Payment Delay', message: 'Some payout transactions are taking longer than usual.', time: '5h ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green" />;
      default: return <Info className="w-5 h-5 text-blue" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-orange-bg border-orange/20';
      case 'success': return 'bg-green-pale border-green-light';
      default: return 'bg-blue-pale border-blue-light';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Admin Notifications</h1>
        <p className="text-muted">Stay updated with system events and administrative alerts.</p>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className={`p-5 rounded-2xl border ${getBg(n.type)} flex gap-4 transition-transform hover:scale-[1.01]`}>
            <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
              {getIcon(n.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-blue-dark">{n.title}</h3>
                <span className="text-xs font-medium text-muted">{n.time}</span>
              </div>
              <p className="text-sm text-blue-dark/80 leading-relaxed">{n.message}</p>
              <div className="mt-4 flex gap-3">
                <button className="text-xs font-bold text-blue hover:underline">Mark as Read</button>
                <button className="text-xs font-bold text-muted hover:underline">Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
