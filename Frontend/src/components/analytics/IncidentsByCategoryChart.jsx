import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ABBREVIATIONS = {
  'Fire / Explosion': 'FIRE',
  'Fire': 'FIRE',
  'Theft / Robbery': 'THEFT',
  'Road Accident': 'ROAD',
  'Flood / Water Damage': 'FLOOD',
  'Flood / Water': 'FLOOD',
  'Medical Emergency': 'MED',
  'Violence / Assault': 'VIOL',
  'Infrastructure Damage': 'INFRA',
  'Environmental Hazard': 'ENV',
  'Missing Person': 'MISSING',
  'Vandalism': 'VANDAL',
  'Other': 'OTHER',
};

function getCategoryAbbreviation(name) {
  if (!name) return '';
  if (ABBREVIATIONS[name]) return ABBREVIATIONS[name];
  if (name.includes('/')) return name.split('/')[0].trim().toUpperCase();
  return name.slice(0, 6).toUpperCase();
}

export default function IncidentsByCategoryChart({ data = [] }) {
  const formattedData = (data || []).map((item) => ({
    ...item,
    shortName: getCategoryAbbreviation(item.name),
  }));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Incidents by Category</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <XAxis dataKey="shortName" stroke="#94a3b8" fontSize={10} interval={0} />
            <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
            <Tooltip
              labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
              formatter={(value) => [value, 'Incidents']}
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
