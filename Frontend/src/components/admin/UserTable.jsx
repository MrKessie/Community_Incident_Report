import React from 'react';
import { UserCheck, UserX, Trash2 } from 'lucide-react';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/formatters';
import ActionMenu from '../common/ActionMenu';
import CustomReactSelect from '../common/CustomReactSelect';
import DataTable from '../common/DataTable';

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'response_team', label: 'Response Team' },
  { value: 'reporter', label: 'Reporter' },
];

export default function UserTable({ users = [], onRoleChange, onToggleActive, onDeleteUser }) {
  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u) => (
        <div className="flex items-center space-x-3">
          <Avatar name={u.name} photo={u.profile_photo} size="sm" />
          <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email & Phone',
      render: (u) => (
        <div>
          <p className="font-mono text-slate-700 dark:text-slate-300">{u.email}</p>
          <p className="text-[10px] text-slate-400">{u.phone || 'No phone'}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      className: 'min-w-[130px]',
      render: (u) => (
        <CustomReactSelect
          options={roleOptions}
          value={u.role || u.roles?.[0] || 'reporter'}
          onChange={(val) => onRoleChange(u.id, val)}
          size="sm"
        />
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (u) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
            u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}
        >
          {u.is_active ? 'Active' : 'Deactivated'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined Date',
      render: (u) => <span className="text-slate-500 font-mono">{formatDate(u.created_at)}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (u) => (
        <ActionMenu
          items={[
            {
              label: u.is_active ? 'Deactivate Account' : 'Activate Account',
              icon: u.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />,
              onClick: () => onToggleActive(u.id),
            },
            {
              label: 'Delete User',
              icon: <Trash2 className="w-3.5 h-3.5" />,
              danger: true,
              onClick: () => onDeleteUser(u.id),
            },
          ]}
        />
      ),
    },
  ];

  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      danger: true,
      onClick: (selectedIds, selectedObjects, clearSelection) => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} user(s)?`)) {
          selectedIds.forEach((id) => onDeleteUser(id));
          clearSelection();
        }
      },
    },
    {
      label: 'Toggle Active Status',
      icon: UserCheck,
      onClick: (selectedIds, selectedObjects, clearSelection) => {
        selectedIds.forEach((id) => onToggleActive(id));
        clearSelection();
      },
    },
  ];

  return (
    <DataTable
      title="System User Directory"
      description="Manage accounts, user roles, and access status"
      columns={columns}
      data={users}
      emptyMessage="No registered users found"
      pageSize={8}
      selectable={true}
      bulkActions={bulkActions}
    />
  );
}
