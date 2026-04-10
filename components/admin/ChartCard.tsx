import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
      <h3 className="text-lg font-bold text-blue-dark mb-6">{title}</h3>
      <div className="h-[300px] w-full">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
