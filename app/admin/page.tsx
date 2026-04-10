'use client';

import React from 'react';
import { 
  ShoppingBag, 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import StatCard from '@/components/admin/StatCard';
import ChartCard from '@/components/admin/ChartCard';
import { useAdminDashboard } from '@/hooks/admin-hooks';

const bookingData = [
  { name: 'Mon', count: 45 },
  { name: 'Tue', count: 52 },
  { name: 'Wed', count: 38 },
  { name: 'Thu', count: 65 },
  { name: 'Fri', count: 48 },
  { name: 'Sat', count: 72 },
  { name: 'Sun', count: 58 },
];

const workerActivity = [
  { name: 'Cleaning', value: 400 },
  { name: 'Carpentry', value: 300 },
  { name: 'Electrical', value: 300 },
  { name: 'Plumbing', value: 200 },
];

const COLORS = ['#3d7ab5', '#1a8c4e', '#e07b39', '#2c5f8a'];

export default function DashboardPage() {
  const { data, isLoading } = useAdminDashboard();

  // For demonstration, since the backend might not have this exact structure yet
  const summary = data?.stats || {
    total_bookings: 124,
    active_workers: 45,
    pending_approvals: 12,
    open_disputes: 3,
    system_status: 'Healthy'
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Dashboard Overview</h1>
        <p className="text-muted">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Bookings" 
          value={summary.total_bookings} 
          icon={ShoppingBag} 
          trend={{ value: 12, isUp: true }} 
        />
        <StatCard 
          title="Active Workers" 
          value={summary.active_workers} 
          icon={Users} 
          trend={{ value: 5, isUp: true }} 
        />
        <StatCard 
          title="Pending Approvals" 
          value={summary.pending_approvals} 
          icon={Clock} 
        />
        <StatCard 
          title="Open Disputes" 
          value={summary.open_disputes} 
          icon={AlertCircle} 
          trend={{ value: 2, isUp: false }} 
        />
        <StatCard 
          title="System Status" 
          value={summary.system_status} 
          icon={CheckCircle2} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Bookings per Day">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={bookingData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3d7ab5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3d7ab5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde9f3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3d7ab5" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Worker Activity by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workerActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde9f3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f0f7ff'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {workerActivity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-blue-dark">Recent Activity</h3>
          <button className="text-blue text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-blue-pale rounded-xl hover:bg-blue-pale/10 transition-colors">
              <div className="h-10 w-10 bg-green-pale rounded-full flex items-center justify-center text-green">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-dark">New Booking Completed</p>
                <p className="text-xs text-muted">Booking #BK-9283 has been marked as completed by Worker John Doe.</p>
              </div>
              <p className="text-xs text-muted whitespace-nowrap">2m ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
