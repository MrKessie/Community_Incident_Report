import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  ShieldAlert,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Map,
  ChevronDown,
  Clock,
  PhoneCall,
  LayoutDashboard,
  User,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const { user, isAuthenticated, logout, switchDemoRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = user?.role || user?.roles?.[0] || 'reporter';

  const roleConfigs = {
    super_admin: { label: 'Super Admin', portal: '/admin', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    admin: { label: 'Administrator', portal: '/admin', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    response_team: { label: 'Response Unit', portal: '/team', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    reporter: { label: 'Community Reporter', portal: '/dashboard', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  };

  const currentRoleConfig = roleConfigs[currentRole] || roleConfigs.reporter;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {toggleSidebar && isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 p-0.5 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-slate-950">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">CIRS 3</span>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">Emergency Network</span>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/map" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            <Map className="w-3.5 h-3.5 text-emerald-400" />
            Live Map
          </Link>
          <Link to="/track" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Track Status
          </Link>
          <Link to="/emergency-contacts" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            Hotlines
          </Link>
        </nav>

        {/* Right: Primary Action & User Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Primary Action Button */}
          <Link
            to="/incidents/new"
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 rounded-xl transition shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Hazard</span>
          </Link>

          <div className="h-5 w-px bg-slate-800 mx-0.5" />

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border transition-all cursor-pointer ${
                  userDropdownOpen
                    ? 'bg-slate-800 border-slate-700 ring-2 ring-emerald-500/20'
                    : 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  
                  {/* User identity Header */}
                  <div className="px-4 py-3 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currentRoleConfig.badge}`}>
                        {currentRoleConfig.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {user?.email || `${currentRole}@community.com`}
                    </p>
                  </div>

                  {/* Portal Navigation Links */}
                  <div className="py-1">
                    <Link
                      to={currentRoleConfig.portal}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                      <span>Go to Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>
                  </div>

                  {/* Demo Role Switcher */}
                  <div className="border-t border-slate-800 my-1 pt-1">
                    <div className="px-4 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Switch Role View</span>
                    </div>
                    <div className="px-2 space-y-0.5">
                      <button
                        onClick={() => { switchDemoRole('super_admin'); setUserDropdownOpen(false); navigate('/admin'); }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                          currentRole === 'super_admin'
                            ? 'bg-purple-950/40 text-purple-300 font-bold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>Super Admin</span>
                        {currentRole === 'super_admin' && <CheckCircle className="w-3.5 h-3.5 text-purple-400" />}
                      </button>
                      <button
                        onClick={() => { switchDemoRole('admin'); setUserDropdownOpen(false); navigate('/admin'); }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                          currentRole === 'admin'
                            ? 'bg-blue-950/40 text-blue-300 font-bold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>Administrator</span>
                        {currentRole === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                      <button
                        onClick={() => { switchDemoRole('response_team'); setUserDropdownOpen(false); navigate('/team'); }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                          currentRole === 'response_team'
                            ? 'bg-amber-950/40 text-amber-300 font-bold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>Response Unit</span>
                        {currentRole === 'response_team' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                      <button
                        onClick={() => { switchDemoRole('reporter'); setUserDropdownOpen(false); navigate('/dashboard'); }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer transition ${
                          currentRole === 'reporter'
                            ? 'bg-emerald-950/40 text-emerald-300 font-bold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>Community Reporter</span>
                        {currentRole === 'reporter' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Sign Out Action */}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2 cursor-pointer transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>
              )}
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
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-md shadow-emerald-600/30"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 p-4 space-y-3">
          <Link
            to="/incidents/new"
            className="flex items-center justify-center space-x-2 w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Hazard</span>
          </Link>
          <div className="space-y-1 pt-2">
            <Link to="/" className="block text-slate-300 hover:text-white py-2 text-xs font-semibold">
              Home
            </Link>
            <Link to="/map" className="block text-slate-300 hover:text-white py-2 text-xs font-semibold">
              Live Map
            </Link>
            <Link to="/track" className="block text-slate-300 hover:text-white py-2 text-xs font-semibold">
              Track Status
            </Link>
            <Link to="/emergency-contacts" className="block text-slate-300 hover:text-white py-2 text-xs font-semibold">
              Hotlines & Directory
            </Link>
          </div>
          {isAuthenticated ? (
            <div className="border-t border-slate-800 pt-3 space-y-2">
              <Link to={currentRoleConfig.portal} className="block text-emerald-400 py-1.5 text-xs font-bold">
                Dashboard ({currentRoleConfig.label})
              </Link>
              <Link to="/profile" className="block text-slate-300 py-1.5 text-xs font-semibold">
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-rose-400 py-2 text-xs font-semibold flex items-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" className="w-full text-center bg-slate-800 text-slate-200 py-2 rounded-xl text-xs font-semibold">
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
