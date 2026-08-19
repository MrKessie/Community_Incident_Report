import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, Menu, X, User, LogOut, ChevronDown, CheckCircle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, role, setRole, logout } = useAuth();
  const { theme, toggleTheme } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setUserDropdownOpen(false);
    if (newRole === 'admin' || newRole === 'super_admin') navigate('/admin');
    else if (newRole === 'response_team') navigate('/team');
    else navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                CIRS
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-brand dark:text-brand-soft ml-2 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/50">
                Community Safety
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors">
              Home
            </Link>
            <Link to="/map" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors">
              Public Map
            </Link>
            <Link to="/report-anonymous" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors">
              Report Incident
            </Link>

            {isAuthenticated && (
              <>
                {(role === 'admin' || role === 'super_admin') && (
                  <Link to="/admin" className="text-blue-600 dark:text-blue-400 font-semibold text-sm transition-colors">
                    Admin Portal
                  </Link>
                )}
                {role === 'response_team' && (
                  <Link to="/team" className="text-amber-600 dark:text-amber-400 font-semibold text-sm transition-colors">
                    Response Dispatch
                  </Link>
                )}
                {role === 'reporter' && (
                  <Link to="/dashboard" className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm transition-colors">
                    My Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-3">

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
            
            {/* Interactive Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="capitalize">{role?.replace('_', ' ') || 'Guest'} Mode</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Switch Testing Role:
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('super_admin')}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${role === 'super_admin' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Super Admin</span>
                    {role === 'super_admin' && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${role === 'admin' ? 'text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Administrator</span>
                    {role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('response_team')}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${role === 'response_team' ? 'text-amber-600 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Response Unit</span>
                    {role === 'response_team' && <CheckCircle className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('reporter')}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${role === 'reporter' ? 'text-emerald-600 font-bold' : 'text-slate-700 dark:text-slate-200'}`}
                  >
                    <span>Community Reporter</span>
                    {role === 'reporter' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition"
                  title="My Profile & Settings"
                >
                  <User className="w-3.5 h-3.5 text-brand" />
                  {/* <span>My Profile</span> */}
                </Link>
                <Link
                  to="/incidents/new"
                  className="bg-brand hover:bg-brand-soft text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition"
                >
                  + Report Incident
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold px-3 py-2">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand hover:bg-brand-soft text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-sm">
            Home
          </Link>
          <Link to="/map" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-sm">
            Public Map
          </Link>
          <Link to="/report-anonymous" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-sm">
            Report Incident
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block text-slate-700 dark:text-slate-200 py-2 text-sm font-semibold">
                My Profile
              </Link>
              <Link to="/dashboard" className="block text-blue-600 dark:text-blue-400 py-2 text-sm font-semibold">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-rose-600 dark:text-rose-400 py-2 text-sm font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" className="w-full text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2 rounded-lg text-sm">
                Sign In
              </Link>
              <Link to="/register" className="w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
