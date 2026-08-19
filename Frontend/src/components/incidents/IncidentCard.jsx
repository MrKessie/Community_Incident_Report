import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ShieldAlert, ArrowRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import { formatDate } from '../../utils/formatters';
import { truncateText } from '../../utils/helpers';

export default function IncidentCard({ incident, linkPrefix = '/incidents' }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
            {incident.reference_number}
          </span>
          <div className="flex items-center space-x-2">
            <SeverityBadge severity={incident.severity} />
            <StatusBadge status={incident.status} />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
          {incident.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {truncateText(incident.description, 90)}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
            <span>{incident.category?.name || 'Emergency'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(incident.reported_at || incident.created_at)}</span>
          </span>
          {incident.address && (
            <span className="flex items-center space-x-1 truncate max-w-[180px]">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="truncate">{incident.address}</span>
            </span>
          )}
        </div>
      </div>

      <div className="pt-2">
        <Link
          to={`${linkPrefix}/${incident.id}`}
          className="w-full inline-flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-semibold py-2 rounded-xl transition"
        >
          <span>View Incident Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
