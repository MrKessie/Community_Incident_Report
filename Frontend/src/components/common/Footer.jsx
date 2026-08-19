import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          <div className="space-y-3">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">CIRS Portal</span>
            </Link>
            <p className="leading-relaxed">
              Empowering communities with real-time incident reporting, authority dispatch tracking, and emergency response.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-slate-900 dark:hover:text-white">Home</Link></li>
              <li><Link to="/map" className="hover:text-slate-900 dark:hover:text-white">Public Heatmap</Link></li>
              <li><Link to="/report-anonymous" className="hover:text-slate-900 dark:hover:text-white">Anonymous Report</Link></li>
              <li><Link to="/login" className="hover:text-slate-900 dark:hover:text-white">Portal Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Emergency Units</h4>
            <ul className="space-y-2">
              <li><span>Fire & Rescue Squad</span></li>
              <li><span>Police Crime Prevention</span></li>
              <li><span>Emergency Paramedics</span></li>
              <li><span>Flood & Environmental Relief</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Contact & Support</h4>
            <p className="space-y-1">
              <span className="block">Hotline: 911 / 311</span>
              <span className="block">Dispatch Desk: +1 (800) 555-CIRS</span>
              <span className="block font-mono">support@communityincident.org</span>
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Community Incident Reporting System. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
