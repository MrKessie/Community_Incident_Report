import React from 'react';

const colorStyles = {
  blue: {
    iconBg: 'bg-brand-soft',
    iconText: 'text-slate-950',
    subText: 'text-brand dark:text-brand-soft',
    circleBg: 'bg-brand-soft',
  },
  amber: {
    iconBg: 'bg-brand-soft',
    iconText: 'text-slate-950',
    subText: 'text-brand dark:text-brand-soft',
    circleBg: 'bg-brand-soft',
  },
  purple: {
    iconBg: 'bg-brand-soft',
    iconText: 'text-slate-950',
    subText: 'text-brand dark:text-brand-soft',
    circleBg: 'bg-brand-soft',
  },
  rose: {
    iconBg: 'bg-brand-soft',
    iconText: 'text-slate-950',
    subText: 'text-brand dark:text-brand-soft',
    circleBg: 'bg-brand-soft',
  },
  emerald: {
    iconBg: 'bg-brand-soft',
    iconText: 'text-slate-950',
    subText: 'text-brand dark:text-brand-soft',
    circleBg: 'bg-brand-soft',
  },
  indigo: {
    iconBg: 'bg-brand-soft',
    iconText: 'text-slate-950',
    subText: 'text-brand dark:text-brand-soft',
    circleBg: 'bg-brand-soft',
  },
};

export default function StatCard({ value, label, sub, icon: Icon, color = 'blue' }) {
  const theme = colorStyles[color] || colorStyles.blue;

  return (
    <div className="relative overflow-hidden rounded-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3.5 z-10 relative">
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} ${theme.iconText}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{value}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          {sub && <span className={`text-[11px] font-semibold ${theme.subText} block mt-0.5`}>{sub}</span>}
        </div>
      </div>
      <div className={`absolute -top-3.5 -right-3.5 w-16 h-16 rounded-full opacity-20 pointer-events-none ${theme.circleBg}`} />
    </div>
  );
}
