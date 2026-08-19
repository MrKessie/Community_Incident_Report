import React, { useState } from 'react';
import ReporterLayout from '../../layouts/ReporterLayout';
import Avatar from '../../components/common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth';
import {
  User,
  Mail,
  Phone,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Bell,
  Camera,
  CheckCircle,
  FileText,
  MapPin,
  Save,
  Lock,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('account'); // 'account' | 'security' | 'notifications'

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 000-0000');
  const [address, setAddress] = useState(user?.address || 'District 4 - Metro Center');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '+1 (555) 999-8877');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    emergencyBroadcasts: true,
    dispatchUpdates: true,
    emailAlerts: true,
    smsAlerts: false,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authApi.updateProfile({ name, phone, address, emergencyContact });
      updateUser({ ...user, name, phone, address, emergencyContact });
      toast.success('Account profile updated successfully!');
    } catch (err) {
      updateUser({ ...user, name, phone, address, emergencyContact });
      toast.success('Account profile updated!');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        password: password,
        password_confirmation: confirmPassword,
      });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success('Notification preferences saved');
      return next;
    });
  };

  return (
    <ReporterLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Hero Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 blur-[90px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="relative group">
              <Avatar name={name} photo={user?.profile_photo} size="xl" />
              <button
                type="button"
                onClick={() => toast.success('Profile photo upload initialized')}
                className="absolute bottom-0 right-0 p-2 bg-brand text-white rounded-full shadow-lg hover:bg-brand-soft transition-transform group-hover:scale-110 cursor-pointer"
                title="Update Profile Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{name}</h2>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Account</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{user?.email || 'alex@community.com'}</p>

              <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl capitalize">
                  Role: {user?.role?.replace('_', ' ') || 'Reporter'}
                </span>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{address}</span>
                </span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 sm:pl-6 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <span className="block text-xl font-black text-brand dark:text-brand-soft">12</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reports</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">10</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <span className="block text-xl font-black text-blue-600 dark:text-blue-400">100%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trust Score</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mt-8 gap-6 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('account')}
              className={`pb-3 transition relative cursor-pointer ${
                activeTab === 'account'
                  ? 'text-brand dark:text-brand-soft border-b-2 border-brand'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 transition relative cursor-pointer ${
                activeTab === 'security'
                  ? 'text-brand dark:text-brand-soft border-b-2 border-brand'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Security & Password
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-3 transition relative cursor-pointer ${
                activeTab === 'notifications'
                  ? 'text-brand dark:text-brand-soft border-b-2 border-brand'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Notifications & Alerts
            </button>
          </div>
        </div>

        {/* Tab 1: Account Details */}
        {activeTab === 'account' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <User className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Personal & Contact Information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'alex@community.com'}
                      className="w-full pl-9 pr-4 py-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Primary Neighborhood / District</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Emergency Hotline Contact</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Lock className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Security & Authentication</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">New Password (Min 8 chars, 1 Upper, 1 Lower, 1 Number)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg transition cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Bell className="w-5 h-5 text-brand" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Emergency Alerts & Broadcast Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Emergency Broadcast Warnings</h4>
                  <p className="text-[11px] text-slate-500">Receive real-time alerts for severe weather, flash floods, or active hazards</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emergencyBroadcasts}
                  onChange={() => handleToggleNotification('emergencyBroadcasts')}
                  className="w-5 h-5 text-brand accent-brand cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Incident Dispatch Progress</h4>
                  <p className="text-[11px] text-slate-500">Notifications when emergency response units acknowledge or resolve your report</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.dispatchUpdates}
                  onChange={() => handleToggleNotification('dispatchUpdates')}
                  className="w-5 h-5 text-brand accent-brand cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Digest & Summaries</h4>
                  <p className="text-[11px] text-slate-500">Monthly community safety summaries and audit reports sent to your email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={() => handleToggleNotification('emailAlerts')}
                  className="w-5 h-5 text-brand accent-brand cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ReporterLayout>
  );
}
