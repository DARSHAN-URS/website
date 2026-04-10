'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Legend
} from 'recharts';
import ChartCard from '@/components/admin/ChartCard';
import StatCard from '@/components/admin/StatCard';
import { DollarSign, TrendingUp, XCircle, Award } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 16500 },
  { month: 'May', revenue: 21000 },
  { month: 'Jun', revenue: 25000 },
];

const performanceData = [
  { name: 'Cleaning', efficiency: 95, satisfaction: 98 },
  { name: 'Electrical', efficiency: 88, satisfaction: 94 },
  { name: 'Plumbing', efficiency: 92, satisfaction: 90 },
  { name: 'Carpentry', efficiency: 85, satisfaction: 95 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Analytics & Insights</h1>
        <p className="text-muted">Deep dive into platform growth and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Daily Bookings" value="142" icon={TrendingUp} trend={{ value: 8, isUp: true }} />
        <StatCard title="Monthly Revenue" value="$42,500" icon={DollarSign} trend={{ value: 12, isUp: true }} />
        <StatCard title="Cancellation Rate" value="2.4%" icon={XCircle} trend={{ value: 0.5, isUp: false }} />
        <StatCard title="Avg. Worker Rating" value="4.7" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Revenue Trend (Last 6 Months)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde9f3" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#1a8c4e" strokeWidth={3} dot={{ fill: '#1a8c4e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Worker Performance by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde9f3" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7f93', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f0f7ff'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="efficiency" name="Efficiency %" fill="#3d7ab5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="satisfaction" name="Satisfaction %" fill="#1a8c4e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
