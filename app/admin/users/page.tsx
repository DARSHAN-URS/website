'use client';

import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, ShieldOff, Key } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useUsers } from '@/hooks/admin-hooks';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading } = useUsers();

  const mockUsers = [
    { id: 'USR-001', name: 'John Doe', email: 'john@example.com', role: 'CLIENT', status: 'Active', created_at: '2024-03-10' },
    { id: 'USR-002', name: 'Jane Smith', email: 'jane@example.com', role: 'WORKER', status: 'Pending', created_at: '2024-03-11' },
    { id: 'USR-003', name: 'Mike Johnson', email: 'mike@example.com', role: 'CLIENT', status: 'Suspended', created_at: '2024-03-09' },
  ];

  const columns = [
    { header: 'User ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (status: string) => <StatusBadge status={status} />
    },
    { header: 'Created Date', accessor: 'created_at' },
    { 
      header: 'Actions', 
      accessor: 'id',
      render: (id: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.status === 'Suspended' ? (
            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Reactivate">
              <Shield className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend">
              <ShieldOff className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 text-blue hover:bg-blue-pale rounded-lg transition-colors" title="Reset Password">
            <Key className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-dark">User Management</h1>
          <p className="text-muted">Manage all platform users and their access levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        data={users || mockUsers} 
        isLoading={isLoading} 
      />

      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-muted">Showing 1-10 of 1,240 users</p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-semibold disabled:opacity-50">Previous</button>
          <button className="px-4 py-2 bg-blue text-white rounded-xl text-sm font-semibold">Next</button>
        </div>
      </div>
    </div>
  );
}
