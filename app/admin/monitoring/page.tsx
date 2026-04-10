'use client';

import React from 'react';
import { Activity, Server, Database, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useHealth } from '@/hooks/admin-hooks';
import StatusBadge from '@/components/admin/StatusBadge';

export default function MonitoringPage() {
  const { data: health, isLoading } = useHealth();

  const mockServices = [
    { name: 'API Gateway', status: 'Healthy', latency: '45ms', uptime: '99.9%' },
    { name: 'Worker Registry Service', status: 'Healthy', latency: '12ms', uptime: '99.99%' },
    { name: 'Booking Engine', status: 'Healthy', latency: '28ms', uptime: '99.95%' },
    { name: 'Payment Processor', status: 'Healthy', latency: '120ms', uptime: '100%' },
    { name: 'Notification Service', status: 'Degraded', latency: '1500ms', uptime: '98.5%' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">System Monitoring</h1>
          <p className="text-muted">Real-time health pulse of the Laborgro infrastructure.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-pale text-green rounded-full border border-green-light">
          <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-pale rounded-xl text-blue">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Avg. API Latency</p>
              <p className="text-2xl font-bold text-blue-dark">32ms</p>
            </div>
          </div>
          <div className="w-full bg-blue-pale/30 h-2 rounded-full overflow-hidden">
            <div className="bg-blue h-full w-[85%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-pale rounded-xl text-green">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Request Success Rate</p>
              <p className="text-2xl font-bold text-blue-dark">99.98%</p>
            </div>
          </div>
          <div className="w-full bg-green-pale/30 h-2 rounded-full overflow-hidden">
            <div className="bg-green h-full w-[99.9%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium">Error Rate (24h)</p>
              <p className="text-2xl font-bold text-blue-dark">0.02%</p>
            </div>
          </div>
          <div className="w-full bg-red-50 h-2 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full w-[2%]"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-dark">Service Infrastructure</h3>
          <button className="flex items-center gap-2 text-blue text-sm font-semibold hover:underline">
            <Globe className="w-4 h-4" />
            View Network Topology
          </button>
        </div>
        <div className="divide-y divide-border">
          {mockServices.map((service, idx) => (
            <div key={idx} className="p-6 flex items-center justify-between hover:bg-blue-pale/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${service.status === 'Healthy' ? 'bg-green-pale text-green' : 'bg-red-50 text-red-600'}`}>
                  {service.status === 'Healthy' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-dark">{service.name}</p>
                  <p className="text-xs text-muted">Latency: {service.latency} • Uptime: {service.uptime}</p>
                </div>
              </div>
              <StatusBadge status={service.status} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
        <h3 className="text-lg font-bold text-blue-dark mb-6">Active Alerts</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">
              <strong>Critical:</strong> Notification service latency exceeds 1s in US-EAST-1 region. Investigating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
