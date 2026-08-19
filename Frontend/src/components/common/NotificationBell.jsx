import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/formatters';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-extrabold text-white flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3 text-xs cursor-pointer hover:bg-slate-800/80 transition ${
                    !notif.read_at ? 'bg-slate-800/40 border-l-2 border-blue-500' : ''
                  }`}
                >
                  <p className="font-medium text-slate-200">{notif.data?.message || 'New notification'}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {formatRelativeTime(notif.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-800 text-center">
            <Link
              to="/notifications"
              onClick={() => setDropdownOpen(false)}
              className="text-xs text-blue-400 font-semibold hover:text-blue-300 block py-1"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
