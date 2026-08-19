import React from 'react';

export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action && <div className="mt-4 md:mt-0">{action}</div>}
    </div>
  );
}
