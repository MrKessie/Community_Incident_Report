import React, { useState } from 'react';
import IncidentMap from '../incidents/IncidentMap';
import FilterDropdown from '../common/FilterDropdown';
import SearchInput from '../common/SearchInput';
import { INCIDENT_STATUSES, SEVERITY_LEVELS } from '../../utils/constants';

export default function IncidentMapView({ incidents = [] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter && inc.status !== statusFilter) return false;
    if (severityFilter && inc.severity !== severityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        inc.title?.toLowerCase().includes(q) ||
        inc.reference_number?.toLowerCase().includes(q) ||
        inc.address?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Map Filter Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search map location, title..." />
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown label="All Statuses" value={statusFilter} options={INCIDENT_STATUSES} onChange={setStatusFilter} />
          <FilterDropdown label="All Severities" value={severityFilter} options={SEVERITY_LEVELS} onChange={setSeverityFilter} />
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800">
        <IncidentMap incidents={filteredIncidents} height="600px" />

        {/* Severity Color Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-xs text-white shadow-xl space-y-1.5">
          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-1">Severity Legend</p>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span>Low</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span>Medium</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span><span>High</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span><span>Critical</span></div>
        </div>
      </div>
    </div>
  );
}
