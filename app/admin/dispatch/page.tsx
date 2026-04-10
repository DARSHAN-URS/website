'use client';

import React from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

export default function DispatchPage() {
  const mockDispatch = [
    { id: 'DSP-001', area: 'Downtown', activeWorkers: 12, pendingJobs: 5, status: 'Healthy' },
    { id: 'DSP-002', area: 'North Side', activeWorkers: 8, pendingJobs: 2, status: 'Healthy' },
    { id: 'DSP-003', area: 'West End', activeWorkers: 15, pendingJobs: 12, status: 'Processing' },
  ];

  const columns = [
    { header: 'Dispatch Hub', accessor: 'id' },
    { header: 'Service Area', accessor: 'area' },
    { header: 'Active Workers', accessor: 'activeWorkers' },
    { header: 'Pending Jobs', accessor: 'pendingJobs' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Dispatch Control</h1>
        <p className="text-muted">Manage real-time worker deployment and area status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-blue-pale text-blue rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted font-medium">Total Active Dispatch</p>
            <p className="text-2xl font-bold text-blue-dark">35 Teams</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border flex items-center gap-4">
          <div className="p-3 bg-green-pale text-green rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted font-medium">Service Coverage</p>
            <p className="text-2xl font-bold text-blue-dark">94.2%</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={mockDispatch} />
    </div>
  );
}
