import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import DataTable from '../common/DataTable';

export default function AuditLogTable({ logs = [] }) {
  const columns = [
    {
      key: 'created_at',
      header: 'Timestamp',
      render: (log) => <span className="text-slate-500 font-mono">{formatDateTime(log.created_at)}</span>,
    },
    {
      key: 'user',
      header: 'User',
      render: (log) => <span className="font-bold text-slate-900 dark:text-white">{log.user?.name || 'System / Guest'}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (log) => <span className="text-blue-600 dark:text-blue-400 font-bold">{log.action}</span>,
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      render: (log) => <span className="text-slate-500 font-mono">{log.ip_address || '127.0.0.1'}</span>,
    },
    {
      key: 'user_agent',
      header: 'User Agent',
      render: (log) => <span className="text-[10px] text-slate-400 max-w-xs truncate block">{log.user_agent || 'Client App'}</span>,
    },
  ];

  return (
    <DataTable
      title="System Audit & Activity Logs"
      description="Immutable activity trail for security, actions, and authentication events"
      columns={columns}
      data={logs}
      emptyMessage="No audit logs recorded"
      pageSize={10}
    />
  );
}
