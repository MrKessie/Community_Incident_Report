import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  CheckCircle,
  Sun,
  Moon,
  PlusCircle,
  LayoutDashboard,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, isAuthenticated, role, setRole, logout } = useAuth();
  const { theme, toggleTheme } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

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

  const roleConfigs = {
    super_admin: { label: 'Super Admin', portal: '/admin', badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    admin: { label: 'System Admin', portal: '/admin', badge: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    response_team: { label: 'Response Unit', portal: '/team', badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    reporter: { label: 'Community Reporter', portal: '/dashboard', badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  };

  const currentRoleConfig = roleConfigs[role] || roleConfigs.reporter;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-brand-soft flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                CIRS
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-brand dark:text-brand-soft ml-2 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/50">
                Community Safety
              </span>
            </div>
          </Link>

          {/* Clean Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/map" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Live Map
            </Link>
            <Link to="/track" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Track Status
            </Link>
            <Link to="/emergency-contacts" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Hotlines
            </Link>
          </nav>

          {/* Right Controls - Grouped & Clean */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Primary Action: Report Hazard */}
            <Link
              to="/incidents/new"
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-white" />
              <span>Report Hazard</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Notification Bell */}
            {isAuthenticated && <NotificationBell />}

            {/* Consolidated User Menu / Account Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-2 p-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                    userDropdownOpen
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    
                    {/* User Identity Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentRoleConfig.badge}`}>
                          {currentRoleConfig.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user?.email || `${role}@community.com`}
                      </p>
                    </div>

                    {/* Quick Portal Navigation Links */}
                    <div className="py-1">
                      <Link
                        to={currentRoleConfig.portal}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Go to Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    {/* Role Switcher Section for Testing/Demo */}
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                      <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Switch Role View</span>
                      </div>
                      <div className="px-2 space-y-0.5">
                        <button
                          onClick={() => handleRoleSwitch('super_admin')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                            role === 'super_admin'
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>Super Admin</span>
                          {role === 'super_admin' && <CheckCircle className="w-3.5 h-3.5 text-purple-600" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('admin')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                            role === 'admin'
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>Administrator</span>
                          {role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('response_team')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                            role === 'response_team'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>Response Unit</span>
                          {role === 'response_team' && <CheckCircle className="w-3.5 h-3.5 text-amber-600" />}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('reporter')}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                            role === 'reporter'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span>Community Reporter</span>
                          {role === 'reporter' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      </div>
                    </div>

                    {/* Sign Out Action */}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center space-x-2 cursor-pointer transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold px-3 py-2 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition"
                >
                  Register
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Controls */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/incidents/new"
            className="flex items-center justify-center space-x-2 w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Hazard</span>
          </Link>
          <div className="space-y-1 pt-2">
            <Link to="/" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-xs font-semibold">
              Home
            </Link>
            <Link to="/map" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-xs font-semibold">
              Live Map
            </Link>
            <Link to="/track" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-xs font-semibold">
              Track Status
            </Link>
            <Link to="/emergency-contacts" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-2 text-xs font-semibold">
              Hotlines & Directory
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
              <Link to={currentRoleConfig.portal} className="block text-emerald-600 dark:text-emerald-400 py-1.5 text-xs font-bold">
                Dashboard ({currentRoleConfig.label})
              </Link>
              <Link to="/profile" className="block text-slate-700 dark:text-slate-300 py-1.5 text-xs font-semibold">
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-rose-600 dark:text-rose-400 py-2 text-xs font-semibold flex items-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" className="w-full text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-2 rounded-xl text-xs font-semibold">
                Sign In
              </Link>
              <Link to="/register" className="w-full text-center bg-emerald-600 text-white py-2 rounded-xl text-xs font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
