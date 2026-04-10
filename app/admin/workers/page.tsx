'use client';

import React from 'react';
import { Search, Filter, CheckCircle, XCircle, Ban, Eye } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useWorkers } from '@/hooks/admin-hooks';

export default function WorkersPage() {
  const { data: workers, isLoading } = useWorkers();

  const mockWorkers = [
    { id: 'WRK-001', name: 'Alex Thompson', phone: '+1 234 567 8901', status: 'Approved', rating: 4.8, active_jobs: 2 },
    { id: 'WRK-002', name: 'Sarah Miller', phone: '+1 234 567 8902', status: 'Pending', rating: 4.5, active_jobs: 0 },
    { id: 'WRK-003', name: 'David Wilson', phone: '+1 234 567 8903', status: 'Rejected', rating: 0, active_jobs: 0 },
  ];

  const columns = [
    { header: 'Worker Name', accessor: 'name' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Verification Status', 
      accessor: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
    { 
      header: 'Rating', 
      accessor: 'rating',
      render: (rating: number) => (
        <div className="flex items-center gap-1">
          <span className="font-bold text-blue-dark">{rating}</span>
          <span className="text-orange">★</span>
        </div>
      )
    },
    { header: 'Active Jobs', accessor: 'active_jobs' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' && (
            <>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Suspend">
            <Ban className="w-4 h-4" />
          </button>
          <button className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="View Profile">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">Worker Management</h1>
          <p className="text-muted">Approve, monitor, and manage skilled labor partners.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search workers..." 
              className="bg-white border border-border focus:border-blue/30 rounded-xl py-2 pl-10 pr-4 outline-none transition-all text-sm w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-muted hover:bg-blue-pale transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={workers || mockWorkers} 
        isLoading={isLoading} 
      />
    </div>
  );
}
