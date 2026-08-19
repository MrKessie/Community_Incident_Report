import React from 'react';
import { ShieldAlert, Users, Edit, Trash2, UserCheck } from 'lucide-react';
import ActionMenu from '../common/ActionMenu';

export default function TeamTable({ teams = [], onEdit, onDelete, onAssignLeader }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((t) => (
        <div key={t.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</h4>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t.type} Unit</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${t.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {t.is_active ? 'Active' : 'Inactive'}
              </span>
              <ActionMenu
                items={[
                  {
                    label: 'Edit Team',
                    icon: <Edit className="w-3.5 h-3.5" />,
                    onClick: () => onEdit(t),
                  },
                  {
                    label: 'Delete Team',
                    icon: <Trash2 className="w-3.5 h-3.5" />,
                    danger: true,
                    onClick: () => onDelete(t.id),
                  },
                ]}
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">{t.description || 'Dedicated emergency response crew.'}</p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5" />
              <span>{t.users?.length || t.members?.length || 0} Members</span>
            </span>
            <span>Leader: <strong className="text-slate-900 dark:text-white">{t.members?.find((m) => m.is_leader)?.user?.name || 'Unassigned'}</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
}
