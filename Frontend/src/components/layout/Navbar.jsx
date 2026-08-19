import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ShieldAlert, LogOut, User, Menu, X, PlusCircle, Map, Layers, ChevronDown, Bell } from 'lucide-react';

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuthStore();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = user?.role || user?.roles?.[0] || 'reporter';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">CIRS</span>
              <span className="text-[10px] font-semibold tracking-wider text-rose-400 uppercase">Incident Response</span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/map" className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <Map className="w-4 h-4 text-emerald-400" />
            Public Map
          </Link>
          <Link to="/report" className="flex items-center gap-1.5 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors font-semibold">
            <PlusCircle className="w-4 h-4" />
            Report Incident
          </Link>
        </nav>

        {/* Right: Role Switcher & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Interactive Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition-all duration-200 shadow-inner"
              title="Click to switch role view for interactive testing"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="capitalize">{currentRole.replace('_', ' ')} Mode</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role View
                </div>
                <button
                  onClick={() => { switchDemoRole('super_admin'); setRoleMenuOpen(false); navigate('/admin'); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Super Admin</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300">System</span>
                </button>
                <button
                  onClick={() => { switchDemoRole('admin'); setRoleMenuOpen(false); navigate('/admin'); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Administrator</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300">Dispatch</span>
                </button>
                <button
                  onClick={() => { switchDemoRole('response_team'); setRoleMenuOpen(false); navigate('/response'); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Response Team Captain</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">Field</span>
                </button>
                <button
                  onClick={() => { switchDemoRole('reporter'); setRoleMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between"
                >
                  <span>Community Member</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">Citizen</span>
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to={currentRole === 'response_team' ? '/response' : currentRole.includes('admin') ? '/admin' : '/dashboard'}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold shadow">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:block text-xs font-medium text-slate-200">{user?.name?.split(' ')[0]}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-md shadow-rose-600/30"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
