import React from 'react';
import { CheckCircle, Clock, ShieldCheck, Truck, AlertCircle, MessageSquare } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export default function IncidentTimeline({ updates = [], statusHistory = [] }) {
  const allEvents = [
    ...updates.map((u) => ({
      id: `up-${u.id}`,
      type: 'update',
      date: u.created_at,
      title: u.message,
      user: u.updater?.name || 'Dispatcher / System',
      isPublic: u.is_public,
    })),
    ...statusHistory.map((s) => ({
      id: `sh-${s.id}`,
      type: 'status',
      date: s.created_at,
      title: `Status changed from ${s.previous_status} to ${s.new_status}`,
      user: s.changedBy?.name || 'Authority Dispatch',
      isPublic: true,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getIcon = (type) => {
    if (type === 'status') return <ShieldCheck className="w-4 h-4 text-blue-500" />;
    return <MessageSquare className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        Incident Audit & Response Timeline
      </h3>

      {allEvents.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No timeline updates recorded yet.</p>
      ) : (
        <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
          {allEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              {/* Timeline Marker Bullet */}
              <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500 flex items-center justify-center shadow-sm">
                {getIcon(evt.type)}
              </div>

              <div className={`p-4 rounded-2xl border transition ${
                evt.isPublic
                  ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">{evt.user}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{formatDateTime(evt.date)}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{evt.title}</p>
                {!evt.isPublic && (
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                    Internal Note Only
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
