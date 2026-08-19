import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AnnouncementBanner from '../components/common/AnnouncementBanner';

export default function ReporterLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between font-sans">
      <div>
        <Navbar />
        <AnnouncementBanner />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
