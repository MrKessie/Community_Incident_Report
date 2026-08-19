import React from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { useUIStore } from '../store/uiStore';

export default function TeamLayout({ children }) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors">
      <Navbar />
      <Sidebar mode="team" />
      <main
        className={`transition-all duration-300 pt-6 px-4 sm:px-8 pb-16 min-h-[calc(100vh-4rem)] ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
