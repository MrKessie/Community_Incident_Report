import React from 'react';
import { useAnnouncementStore } from '../../store/useAnnouncementStore';
import { AlertTriangle, Info, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function AnnouncementBanner() {
  const { announcements } = useAnnouncementStore();
  const [dismissed, setDismissed] = React.useState({});

  const activeAnnouncements = announcements.filter(a => a.is_active && !dismissed[a.id]);

  if (activeAnnouncements.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'danger': return <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      default: return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  const getStyle = (type) => {
    switch (type) {
      case 'warning': return 'bg-amber-950/60 border-amber-500/40 text-amber-200';
      case 'danger': return 'bg-rose-950/60 border-rose-500/40 text-rose-200';
      case 'success': return 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200';
      default: return 'bg-blue-950/60 border-blue-500/40 text-blue-200';
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {activeAnnouncements.map((ann) => (
        <div
          key={ann.id}
          className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-lg ${getStyle(ann.type)}`}
        >
          <div className="flex items-start gap-3">
            {getIcon(ann.type)}
            <div>
              <h4 className="text-sm font-semibold tracking-wide">{ann.title}</h4>
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{ann.message}</p>
            </div>
          </div>
          <button
            onClick={() => setDismissed((prev) => ({ ...prev, [ann.id]: true }))}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
