import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = 'There are currently no records to display.', action }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {action}
    </div>
  );
}
