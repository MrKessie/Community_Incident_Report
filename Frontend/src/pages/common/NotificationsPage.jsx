import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Inbox, ArrowRight, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuthStore } from '../../store/authStore';
import AdminLayout from '../../layouts/AdminLayout';
import TeamLayout from '../../layouts/TeamLayout';
import ReporterLayout from '../../layouts/ReporterLayout';
import PageHeader from '../../components/common/PageHeader';
import { formatDateTime } from '../../utils/formatters';

function NotificationsContent() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const { user } = useAuthStore();

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read_at;
    if (filter === 'read') return !!n.read_at;
    return true;
  });

  const getIncidentLink = (n) => {
    const incidentId = n.data?.incident_id || n.incident_id || n.id;
    const role = user?.role;
    if (role === 'admin' || role === 'super_admin') {
      return `/admin/incidents/${incidentId}`;
    } else if (role === 'response_team') {
      return `/team/incidents/${incidentId}`;
    }
    return `/incidents/${incidentId}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        description="View and manage real-time alerts, incident dispatches, and status updates"
        action={
          unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-none shadow-md transition cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { key: 'all', label: 'All Notifications', count: notifications.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'read', label: 'Read', count: notifications.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-none transition flex items-center space-x-2 cursor-pointer ${
              filter === tab.key
                ? 'bg-brand text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-mono ${
              filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const isUnread = !notif.read_at;
            const message = notif.data?.message || notif.message || 'Notification update received';

            return (
              <div
                key={notif.id}
                className={`p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none shadow-sm ${
                  isUnread
                    ? 'bg-teal-50/60 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-icon-bg flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="w-5 h-5 text-brand" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{message}</p>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0"></span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateTime(notif.created_at)}</span>
                      </span>
                      {notif.type && (
                        <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px]">
                          {notif.type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                  {isUnread && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs font-semibold text-brand hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}

                  <Link
                    to={getIncidentLink(notif)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-brand dark:hover:text-brand-soft bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-none transition"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-12 text-center text-slate-400 space-y-3 shadow-sm">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">No Notifications Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have any {filter !== 'all' ? filter : ''} notifications at this time.
          </p>
        </div>
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const role = user?.role;

  if (role === 'admin' || role === 'super_admin') {
    return (
      <AdminLayout>
        <NotificationsContent />
      </AdminLayout>
    );
  }

  if (role === 'response_team') {
    return (
      <TeamLayout>
        <NotificationsContent />
      </TeamLayout>
    );
  }

  return (
    <ReporterLayout>
      <NotificationsContent />
    </ReporterLayout>
  );
}
