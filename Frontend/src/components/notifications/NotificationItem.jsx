import React from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const isRead = !!notification.read_at;

  return (
    <div
      className={`p-4 rounded-2xl border transition flex items-start justify-between space-x-3 ${
        isRead
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 shadow-sm'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-xl mt-0.5 ${isRead ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-blue-600 text-white shadow-md'}`}>
          <Bell className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
            {notification.data?.message || 'New notification update.'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            {formatRelativeTime(notification.created_at)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {!isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            title="Mark as read"
            className="p-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          title="Delete notification"
          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
