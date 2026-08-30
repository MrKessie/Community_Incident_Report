import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import AuditLogTable from '../../components/admin/AuditLogTable';
import SearchInput from '../../components/common/SearchInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminApi } from '../../api/admin';
import { demoAuditLogs } from '../../utils/demoData';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs({ per_page: 50 });
      const data = res.data?.data || res.data;
      setLogs(Array.isArray(data) && data.length > 0 ? data : demoAuditLogs);
    } catch (err) {
      setLogs(demoAuditLogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    const matchesAction = actionFilter === 'all' || l.action.toLowerCase().includes(actionFilter.toLowerCase());
    if (!search) return matchesAction;
    const q = search.toLowerCase();
    const matchesSearch = 
      (l.action && l.action.toLowerCase().includes(q)) || 
      (l.user?.name && l.user.name.toLowerCase().includes(q)) ||
      (l.ip_address && l.ip_address.includes(q)) ||
      (l.description && l.description.toLowerCase().includes(q));
    return matchesAction && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Security & Authorization Audit Trail"
          description="Immutable record of administrative mutations, dispatch actions, role changes, and IP addresses"
          action={
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          }
        />

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[240px]">
            <SearchInput 
              value={search} 
              onChange={setSearch} 
              placeholder="Search by action, user name, IP address..." 
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Actions</option>
              <option value="verify">Verification</option>
              <option value="assign">Dispatch / Assignment</option>
              <option value="status">Status Changes</option>
              <option value="user">User Auth</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner />
            <p className="text-xs text-slate-400 mt-2">Loading security audit trail...</p>
          </div>
        ) : (
          <AuditLogTable logs={filtered} />
        )}
      </div>
    </AdminLayout>
  );
}
