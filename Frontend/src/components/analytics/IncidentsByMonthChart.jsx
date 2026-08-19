import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function IncidentsByMonthChart({ data = [] }) {
  const chartData = data;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Incidents Over Time (Monthly Trend)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
            <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
