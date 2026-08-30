import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Map,
  ShieldCheck,
  Users,
  Grid,
  Megaphone,
  BarChart3,
  ClipboardList,
  Flame,
  Radio,
  Download,
  PhoneCall,
  Clock,
  Settings
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuthStore();
  const role = user?.role || user?.roles?.[0] || 'reporter';

  const getRoleNav = () => {
    if (role === 'admin' || role === 'super_admin') {
      return [
        { label: 'Control Center', path: '/admin', icon: LayoutDashboard },
        { label: 'Live Tactical Radar', path: '/admin/dispatch', icon: Radio },
        { label: 'Incident Management', path: '/admin/incidents', icon: ShieldCheck },
        { label: 'Response Teams', path: '/admin/teams', icon: Users },
        { label: 'Categories', path: '/admin/categories', icon: Grid },
        { label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
        { label: 'Analytics Hub', path: '/admin/analytics', icon: BarChart3 },
        { label: 'Compliance Reports', path: '/admin/reports', icon: Download },
        { label: 'Audit Trail Logs', path: '/admin/audit-logs', icon: ClipboardList },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    } else if (role === 'response_team') {
      return [
        { label: 'Dispatch Task Board', path: '/team', icon: Radio },
        { label: 'Assigned Duties', path: '/team/incidents', icon: ShieldCheck },
        { label: 'Live Incident Map', path: '/map', icon: Map },
        { label: 'Emergency Directory', path: '/emergency-contacts', icon: PhoneCall },
      ];
    } else {
      return [
        { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Reports', path: '/incidents', icon: FileText },
        { label: 'Report Incident', path: '/incidents/new', icon: PlusCircle },
        { label: 'Track Reference', path: '/track', icon: Clock },
        { label: 'Public Incident Map', path: '/map', icon: Map },
        { label: 'Emergency Hotlines', path: '/emergency-contacts', icon: PhoneCall },
      ];
    }
  };

  const navItems = getRoleNav();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-900/95 p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between gap-4">
          <div className="space-y-6">
            
            {/* Role Header Badge */}
            <div className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Portal</p>
                <h3 className="text-xs font-bold text-white capitalize">{role.replace('_', ' ')}</h3>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Navigation Menu
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin' || item.path === '/dashboard' || item.path === '/team'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[10px] text-slate-500 text-center">
            Community Incident System 3.0
          </div>
        </div>
      </aside>
    </>
  );
}
