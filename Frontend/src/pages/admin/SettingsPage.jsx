import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function SettingsPage() {
  const [systemName, setSystemName] = useState('Community Incident Reporting System');
  const [defaultSeverity, setDefaultSeverity] = useState('medium');
  const [escalationHours, setEscalationHours] = useState('1');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('System configuration settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <PageHeader
          title="System Settings & Escalation Controls"
          description="Configure emergency escalation thresholds, email notifications, and portal metadata"
        />

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* General Branding */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">General Branding</h3>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">System Application Title</label>
              <input type="text" value={systemName} onChange={(e) => setSystemName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Default Report Severity</label>
              <CustomReactSelect
                options={severityOptions}
                value={defaultSeverity}
                onChange={setDefaultSeverity}
              />
            </div>
          </div>

          {/* Escalation Scheduler Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Automated Escalation Thresholds</h3>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Unassigned Report Escalation Time (Hours)</label>
              <input type="number" value={escalationHours} onChange={(e) => setEscalationHours(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
              <p className="text-[10px] text-slate-500 mt-1">If a verified report remains unassigned past this threshold, an escalation alert is dispatched to admins.</p>
            </div>
          </div>

          {/* System Toggles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">System Toggles</h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Email Dispatch Notifications</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Send dual mail + database notifications to responders and citizens</span>
              </div>
              <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>
                <span className="font-bold text-rose-600 dark:text-rose-400 block">Maintenance Mode</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Temporarily block public report submissions for system upgrades</span>
              </div>
              <input type="checkbox" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} className="w-4 h-4 text-rose-600 rounded" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-brand hover:bg-brand-soft text-white font-extrabold text-sm rounded-xl shadow-lg transition">
            Save System Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
