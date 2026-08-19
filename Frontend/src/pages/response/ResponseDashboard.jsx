import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import UpdateStatusModal from '../../components/modals/UpdateStatusModal';
import { useIncidentStore } from '../../store/useIncidentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDate } from '../../utils/formatters';
import { Radio, Flame, CheckCircle2, Clock, MapPin, Phone, User, CheckSquare } from 'lucide-react';

export default function ResponseDashboard() {
  const { user } = useAuthStore();
  const { incidents } = useIncidentStore();

  const [statusModalInc, setStatusModalInc] = useState(null);

  // Filter assigned incidents for response team
  const assignedIncidents = incidents.filter((i) => i.active_assignment || ['assigned', 'in_progress'].includes(i.status));

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-none bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Response Unit Dispatch Board</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                Field Response Team
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Active emergency dispatches and operational field updates</p>
          </div>
        </div>

        {/* Assigned Incidents List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Assigned Emergency Tasks</h2>

          <div className="space-y-4">
            {assignedIncidents.map((inc) => (
              <div
                key={inc.id}
                className="p-6 rounded-none bg-slate-900 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{inc.reference_number}</span>
                    <StatusBadge status={inc.status} />
                    <SeverityBadge severity={inc.severity} />
                  </div>
                  <span className="text-xs text-slate-400">Assigned: {formatDate(inc.assigned_at || inc.reported_at)}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{inc.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Location: {inc.address || 'Geotagged Pin Location'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-300">
                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      Reporter:{' '}
                      {inc.is_anonymous ? 'Anonymous Citizen' : `${inc.reporter?.name || 'Citizen'} (${inc.reporter?.phone || 'No Phone'})`}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Unit: {inc.active_assignment?.team?.name || 'Metro Emergency Unit'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStatusModalInc(inc)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-4 h-4" /> Post Field Update / Change Status
                    </button>

                    <Link
                      to={`/incidents/${inc.id}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
                    >
                      Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {statusModalInc && <UpdateStatusModal incident={statusModalInc} onClose={() => setStatusModalInc(null)} />}
      </div>
    </Layout>
  );
}
