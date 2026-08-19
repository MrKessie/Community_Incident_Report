import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import ActionMenu from '../common/ActionMenu';
import DataTable from '../common/DataTable';

export default function CategoryTable({ categories = [], onEdit, onDelete }) {
  const columns = [
    {
      key: 'name',
      header: 'Category Name',
      render: (c) => (
        <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <span className="text-base">{c.icon || '⚠️'}</span>
          <span>{c.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (c) => <span className="text-slate-500 max-w-xs truncate block">{c.description || 'No description'}</span>,
    },
    {
      key: 'incidents_count',
      header: 'Incident Count',
      render: (c) => <span className="font-mono font-bold text-blue-600">{c.incidents_count || 0}</span>,
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (c) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.is_active !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          {c.is_active !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (c) => (
        <ActionMenu
          items={[
            {
              label: 'Edit Category',
              icon: <Edit className="w-3.5 h-3.5" />,
              onClick: () => onEdit(c),
            },
            {
              label: 'Delete Category',
              icon: <Trash2 className="w-3.5 h-3.5" />,
              danger: true,
              onClick: () => onDelete(c.id),
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
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} category(ies)?`)) {
          selectedIds.forEach((id) => onDelete(id));
          clearSelection();
        }
      },
    },
  ];

  return (
    <DataTable
      title="Incident Categories Taxonomy"
      description="System incident classifications for reporting and routing"
      columns={columns}
      data={categories}
      emptyMessage="No categories found"
      pageSize={8}
      selectable={true}
      bulkActions={bulkActions}
    />
  );
}
