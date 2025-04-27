'use client';

import Sidebar from '@/components/layout/Sidebar';

export default function SidebarLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
} 