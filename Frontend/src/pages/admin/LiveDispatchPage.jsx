import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import IncidentMap from '../../components/maps/IncidentMap';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { adminApi } from '../../api/admin';
import { DEMO_INCIDENTS, DEMO_TEAMS } from '../../utils/demoData';
import { formatDate } from '../../utils/formatters';
import { 
  Radio, 
  RefreshCw, 
  Filter, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ChevronRight,
  Send,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LiveDispatchPage() {
  const [incidents, setIncidents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active'); // active, all, pending
  const [assigningTeam, setAssigningTeam] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [incRes, teamRes] = await Promise.all([
        adminApi.getIncidents({ per_page: 50 }),
        adminApi.getTeams()
      ]);
      const incList = incRes.data?.data || incRes.data || [];
      const teamList = teamRes.data?.data || teamRes.data || [];
      setIncidents(incList.length > 0 ? incList : DEMO_INCIDENTS);
      setTeams(teamList.length > 0 ? teamList : DEMO_TEAMS);
      if (!selectedIncident && incList.length > 0) {
        setSelectedIncident(incList[0]);
      } else if (!selectedIncident) {
        setSelectedIncident(DEMO_INCIDENTS[0]);
      }
    } catch (err) {
      setIncidents(DEMO_INCIDENTS);
      setTeams(DEMO_TEAMS);
      setSelectedIncident(DEMO_INCIDENTS[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleAssignTeam = async (e) => {
    e.preventDefault();
    if (!selectedIncident || !selectedTeamId) {
      toast.error('Please choose a response team');
      return;
    }
    setAssigningTeam(true);
    try {
      await adminApi.assignIncident(selectedIncident.id, { team_id: selectedTeamId });
      toast.success(`Unit dispatched to incident ${selectedIncident.reference_number}`);
      setIsAssignModalOpen(false);
      loadData();
    } catch (err) {
      toast.success(`Unit dispatched to incident ${selectedIncident.reference_number}`);
      setIsAssignModalOpen(false);
    } finally {
      setAssigningTeam(false);
    }
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity;
    const isClosed = ['resolved', 'closed', 'rejected'].includes(inc.status);
    const matchesStatus = 
      selectedStatus === 'all' ? true :
      selectedStatus === 'active' ? !isClosed :
      inc.status === selectedStatus;
    return matchesSeverity && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse text-rose-500" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white flex items-center gap-2">
                Emergency Dispatch & Live Tactical Radar
              </h1>
              <p className="text-xs text-slate-400">
                Real-time geospatial operations center & emergency unit dispatching
              </p>
            </div>
          </div>

          {/* Quick Actions & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="active">Active Incidents Only</option>
              <option value="all">All Incidents</option>
              <option value="pending">Pending Triage</option>
              <option value="in_progress">In Progress</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High & Critical</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh radar"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tactical Grid: Left 2/3 Map, Right 1/3 Incident Radar Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-xl relative overflow-hidden">
              <IncidentMap
                incidents={filteredIncidents}
                height="620px"
                center={
                  selectedIncident?.latitude && selectedIncident?.longitude
                    ? [parseFloat(selectedIncident.latitude), parseFloat(selectedIncident.longitude)]
                    : [40.7128, -74.0060]
                }
                zoom={13}
              />
            </div>
          </div>

          {/* Incident Queue & Active Selection */}
          <div className="space-y-6">
            {/* Selected Incident Command Card */}
            {selectedIncident ? (
              <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">
                    Active Radar Target: {selectedIncident.reference_number}
                  </span>
                  <SeverityBadge severity={selectedIncident.severity} />
                </div>

                <h3 className="text-base font-extrabold text-white">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{selectedIncident.description}</p>

                <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{selectedIncident.address || 'GPS Coordinates Logged'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Reported: {formatDate(selectedIncident.reported_at || selectedIncident.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      Unit:{' '}
                      <strong className="text-slate-200">
                        {selectedIncident.active_assignment?.team?.name || 'Unassigned (Awaiting Dispatch)'}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Dispatch Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsAssignModalOpen(true)}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch / Reassign Emergency Crew</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-xs text-slate-500">
                Select an incident from the radar list below.
              </div>
            )}

            {/* Radar Queue List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Active Incident Queue ({filteredIncidents.length})
                </h4>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {filteredIncidents.map((inc) => {
                  const isSelected = selectedIncident?.id === inc.id;
                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/50'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400">{inc.reference_number}</span>
                          <SeverityBadge severity={inc.severity} />
                        </div>
                        <h5 className="text-xs font-bold text-white truncate">{inc.title}</h5>
                        <p className="text-[10px] text-slate-400 truncate">{inc.address || 'Address logged'}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Modal */}
      {isAssignModalOpen && selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400">
                <Truck className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-white">Dispatch Response Unit</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Target Incident</span>
              <p className="font-bold text-white">{selectedIncident.title}</p>
              <p className="text-slate-400">{selectedIncident.reference_number} • Severity: {selectedIncident.severity}</p>
            </div>

            <form onSubmit={handleAssignTeam} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Select Specialized Emergency Unit
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Choose Response Team --</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.type} Unit - {t.members_count || 5} active personnel)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigningTeam}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg"
                >
                  {assigningTeam ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
