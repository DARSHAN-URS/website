import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'active':
      case 'healthy':
      case 'completed':
      case 'resolved':
        return 'bg-green-pale text-green border-green-light';
      case 'pending':
      case 'processing':
      case 'scheduled':
        return 'bg-blue-pale text-blue border-blue-light';
      case 'rejected':
      case 'suspended':
      case 'error':
      case 'cancelled':
      case 'down':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'high':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'medium':
        return 'bg-orange-bg text-orange border-orange/20';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

export default StatusBadge;
