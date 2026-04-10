'use client';

import React from 'react';
import { RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useBookings } from '@/hooks/admin-hooks';

export default function BookingsPage() {
  const { data: bookings, isLoading } = useBookings();

  const mockBookings = [
    { id: 'BK-5231', client: 'Grace Hopper', worker: 'Alan Turing', status: 'Scheduled', time: '2024-03-15 10:00 AM', price: '$85.00' },
    { id: 'BK-5232', client: 'Ada Lovelace', worker: 'Charles Babbage', status: 'Completed', time: '2024-03-14 02:30 PM', price: '$120.00' },
    { id: 'BK-5233', client: 'John von Neumann', worker: 'Pending', status: 'Processing', time: '2024-03-16 09:00 AM', price: '$95.00' },
  ];

  const columns = [
    { header: 'Booking ID', accessor: 'id' },
    { header: 'Client', accessor: 'client' },
    { header: 'Worker', accessor: 'worker' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
    { header: 'Time', accessor: 'time' },
    { header: 'Price', accessor: 'price' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
          <button className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="Reassign Worker">
            <RefreshCw className="w-4 h-4" />
          </button>
          {row.status !== 'Completed' && (
            <>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel Booking">
                <XCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Force Complete">
                <CheckCircle className="w-4 h-4" />
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
        <h1 className="text-2xl font-bold text-blue-dark">Booking Management</h1>
        <p className="text-muted">Monitor and control marketplace service transactions.</p>
      </div>

      <DataTable 
        columns={columns} 
        data={bookings || mockBookings} 
        isLoading={isLoading} 
      />
    </div>
  );
}
