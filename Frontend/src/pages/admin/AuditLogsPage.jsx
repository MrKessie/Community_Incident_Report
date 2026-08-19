import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import AuditLogTable from '../../components/admin/AuditLogTable';
import SearchInput from '../../components/common/SearchInput';
import { demoAuditLogs } from '../../utils/demoData';

export default function AuditLogsPage() {
  const [logs] = useState(demoAuditLogs);
  const [search, setSearch] = useState('');

  const filtered = logs.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.action.toLowerCase().includes(q) || l.user?.name?.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Security Audit Trail Logs"
          description="Immutable security audit trail logging mutating requests, user authorizations, and IP addresses"
        />

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search log action or user..." />
        </div>

        <AuditLogTable logs={filtered} />
      </div>
    </AdminLayout>
  );
}
