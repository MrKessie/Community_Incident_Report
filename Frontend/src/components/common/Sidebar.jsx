import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Users2,
  Layers,
  Megaphone,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  Download,
  PhoneCall,
  MapPin,
  PlusCircle,
  Clock
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export default function Sidebar({ mode = 'admin' }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/dispatch', label: 'Live Tactical Radar', icon: Radio },
    { to: '/admin/incidents', label: 'Master Incident Queue', icon: ShieldAlert },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/teams', label: 'Response Units', icon: Users2 },
    { to: '/admin/categories', label: 'Taxonomy Categories', icon: Layers },
    { to: '/admin/announcements', label: 'Alert Broadcasts', icon: Megaphone },
    { to: '/admin/analytics', label: 'Analytics Hub', icon: BarChart3 },
    { to: '/admin/reports', label: 'Compliance Reports', icon: Download },
    { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: FileText },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const teamLinks = [
    { to: '/team/dashboard', label: 'Team Dashboard', icon: LayoutDashboard },
    { to: '/team/incidents', label: 'Assigned Dispatches', icon: ShieldAlert },
    { to: '/map', label: 'Live Hazard Map', icon: MapPin },
  ];

  const reporterLinks = [
    { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/incidents', label: 'My Reports', icon: ShieldAlert },
    { to: '/incidents/new', label: 'Report Incident', icon: PlusCircle },
    { to: '/track', label: 'Track Reference', icon: Clock },
    { to: '/map', label: 'Public Map', icon: MapPin },
    { to: '/emergency-contacts', label: 'Emergency Directory', icon: PhoneCall },
  ];

  const links = mode === 'admin' ? adminLinks : mode === 'team' ? teamLinks : reporterLinks;

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="py-6 px-3 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
              title={!sidebarOpen ? link.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
