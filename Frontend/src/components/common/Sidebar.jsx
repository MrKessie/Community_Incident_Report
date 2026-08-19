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
  Shield,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export default function Sidebar({ mode = 'admin' }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/incidents', label: 'Master Incident Queue', icon: ShieldAlert },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/teams', label: 'Response Units', icon: Users2 },
    { to: '/admin/categories', label: 'Taxonomy Categories', icon: Layers },
    { to: '/admin/announcements', label: 'Alert Broadcasts', icon: Megaphone },
    { to: '/admin/analytics', label: 'Analytics Hub', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: FileText },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  const teamLinks = [
    { to: '/team/dashboard', label: 'Team Dashboard', icon: LayoutDashboard },
    { to: '/team/incidents', label: 'Assigned Dispatches', icon: ShieldAlert },
  ];

  const links = mode === 'admin' ? adminLinks : teamLinks;

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="py-6 px-3 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
              title={!sidebarOpen ? link.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
