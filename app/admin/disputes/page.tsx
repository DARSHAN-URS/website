'use client';

import React from 'react';
import { UserPlus, CheckCircle, ArrowUpCircle } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useDisputes } from '@/hooks/admin-hooks';

export default function DisputesPage() {
  const { data: disputes, isLoading } = useDisputes();

  const mockDisputes = [
    { id: 'DIS-101', booking: 'BK-5231', reportedBy: 'Grace Hopper', status: 'Pending', priority: 'High', date: '2024-03-12' },
    { id: 'DIS-102', booking: 'BK-4890', reportedBy: 'Worker: John Smith', status: 'Processing', priority: 'Medium', date: '2024-03-11' },
    { id: 'DIS-103', booking: 'BK-9912', reportedBy: 'Bill Gates', status: 'Resolved', priority: 'Low', date: '2024-03-10' },
  ];

  const columns = [
    { header: 'Dispute ID', accessor: 'id' },
    { header: 'Booking ID', accessor: 'booking' },
    { header: 'Reported By', accessor: 'reportedBy' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
    { 
      header: 'Priority', 
      accessor: 'priority',
      render: (priority: string) => <StatusBadge status={priority} />
    },
    { header: 'Created Date', accessor: 'date' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' && (
            <button className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="Assign">
              <UserPlus className="w-4 h-4" />
            </button>
          )}
          {row.status !== 'Resolved' && (
             <>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Resolve">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-orange hover:bg-orange-bg rounded-lg transition-colors" title="Escalate">
                <ArrowUpCircle className="w-4 h-4" />
              </button>
             </>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-dark">Disputes Center</h1>
        <p className="text-muted">Resolve conflicts between clients and workers.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={disputes || mockDisputes} 
        isLoading={isLoading} 
      />
    </div>
  );
}
