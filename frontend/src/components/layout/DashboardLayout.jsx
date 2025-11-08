import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="flex pt-6">
        <Sidebar />
        <div className="flex-1">
          <main className="py-6">
            <div className="app-container">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
