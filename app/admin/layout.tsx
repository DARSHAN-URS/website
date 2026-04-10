import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import Providers from '@/components/admin/Providers';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-blue-pale/30">
        <Sidebar />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 p-8">
            {children}
          </main>
          <footer className="p-8 border-t border-border mt-auto">
            <p className="text-sm text-muted text-center">
              &copy; {new Date().getFullYear()} Laborgro Admin Dashboard. Built for production-grade operations.
            </p>
          </footer>
        </div>
      </div>
    </Providers>
  );
}
