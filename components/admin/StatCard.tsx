import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-blue-pale rounded-xl">
          <Icon className="w-6 h-6 text-blue" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend.isUp ? 'text-green' : 'text-red-500'}`}>
            {trend.isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-muted text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-blue-dark">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
