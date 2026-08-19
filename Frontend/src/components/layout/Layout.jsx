import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children, showSidebar = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <div className="flex flex-1">
        {showSidebar && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        
        <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'lg:ml-64' : ''} p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full`}>
          {children}
        </main>
      </div>
    </div>
  );
}
