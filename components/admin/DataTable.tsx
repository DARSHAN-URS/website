import React from 'react';

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white rounded-2xl border border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-pale/50 border-b border-border">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-blue-pale/20 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-sm text-blue-dark">
                      {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-muted">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
