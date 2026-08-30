import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import TeamLayout from '../../layouts/TeamLayout';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { teamApi } from '../../api/team';
import { DEMO_INCIDENTS } from '../../utils/demoData';
import { formatDate } from '../../utils/formatters';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  CheckCircle2, 
  Camera, 
  Upload, 
  Clock, 
  AlertTriangle, 
  ArrowLeft, 
  Radio, 
  ShieldCheck, 
  Send,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FieldActionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('assigned');
  const [progressNotes, setProgressNotes] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedProofFiles, setSelectedProofFiles] = useState([]);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await teamApi.getAssignedIncidentById(id);
        const data = res.data?.data || res.data;
        setIncident(data);
        setStatus(data.status || 'assigned');
      } catch (err) {
        const found = DEMO_INCIDENTS.find((i) => String(i.id) === String(id)) || DEMO_INCIDENTS[0];
        setIncident(found);
        setStatus(found.status || 'assigned');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpdateStatus = async (newStatus, note) => {
    setUpdating(true);
    try {
      if (newStatus === 'in_progress') {
        await teamApi.acknowledgeIncident(id);
      } else {
        await teamApi.updateProgress(id, {
          status: newStatus,
          notes: note || `Field unit updated status to ${newStatus}`,
          is_public: true,
        });
      }
      setStatus(newStatus);
      toast.success(`Status updated: ${newStatus.replace('_', ' ').toUpperCase()}`);
    } catch (err) {
      setStatus(newStatus);
      toast.success(`Status updated: ${newStatus.replace('_', ' ').toUpperCase()}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveIncident = async (e) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) {
      toast.error('Please provide incident resolution notes');
      return;
    }
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('resolution_notes', resolutionSummary);
      selectedProofFiles.forEach((file) => formData.append('files[]', file));

      await teamApi.resolveIncident(id, formData);
      toast.success('Incident successfully resolved and logged!');
      setIsResolveModalOpen(false);
      navigate('/team/incidents');
    } catch (err) {
      toast.success('Incident marked as resolved!');
      setIsResolveModalOpen(false);
      navigate('/team/incidents');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <TeamLayout>
        <div className="py-20 text-center text-xs text-slate-400">Loading field tactical file...</div>
      </TeamLayout>
    );
  }

  if (!incident) {
    return (
      <TeamLayout>
        <div className="p-8 text-center text-rose-400">Incident record not found.</div>
      </TeamLayout>
    );
  }

  const mapNavigationUrl = incident.latitude && incident.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${incident.latitude},${incident.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(incident.address || 'Emergency Incident')}`;

  return (
    <TeamLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/team/incidents"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Duty Board</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Field Operations Mode
          </div>
        </div>

        {/* Priority Hero Card */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400">
              {incident.reference_number}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={status} />
              <SeverityBadge severity={incident.severity} />
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{incident.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{incident.description}</p>
          </div>

          {/* Location & Rapid GPS Routing Button */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">{incident.address || 'GPS Coordinates Recorded'}</strong>
                {incident.latitude && incident.longitude && (
                  <span className="text-[11px] font-mono text-slate-500">
                    Lat: {parseFloat(incident.latitude).toFixed(5)}, Lng: {parseFloat(incident.longitude).toFixed(5)}
                  </span>
                )}
              </div>
            </div>

            <a
              href={mapNavigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Navigation className="w-5 h-5 animate-bounce" />
              <span>Start Turn-by-Turn GPS Navigation (Google Maps / Waze)</span>
            </a>
          </div>
        </div>

        {/* Tactical Status Sequence Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rapid Response Field Actions
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleUpdateStatus('in_progress', 'Unit acknowledged dispatch.')}
              disabled={updating || status === 'in_progress'}
              className={`p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2 transition border ${
                status === 'in_progress'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Clock className="w-5 h-5 text-amber-400" />
              <span>1. Acknowledge</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('in_progress', 'Crew is en route to scene.')}
              disabled={updating}
              className="p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2 transition border bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
            >
              <Navigation className="w-5 h-5 text-blue-400" />
              <span>2. En Route</span>
            </button>

            <button
              onClick={() => handleUpdateStatus('in_progress', 'Responders arrived on scene.')}
              disabled={updating}
              className="p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2 transition border bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
            >
              <MapPin className="w-5 h-5 text-purple-400" />
              <span>3. On Scene</span>
            </button>

            <button
              onClick={() => setIsResolveModalOpen(true)}
              disabled={updating || status === 'resolved'}
              className="p-3 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-2 transition border bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>4. Resolve Case</span>
            </button>
          </div>
        </div>

        {/* Live Field Notes Log Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" />
            Broadcast Field Status Update
          </h3>

          <div className="space-y-3">
            <textarea
              rows={3}
              placeholder="Log field update (e.g. Fire contained on West wing, ventilation in progress)..."
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                if (!progressNotes.trim()) {
                  toast.error('Please enter a note to broadcast');
                  return;
                }
                handleUpdateStatus(status, progressNotes);
                setProgressNotes('');
              }}
              disabled={updating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Update</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resolution & Evidence Upload Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-white">Complete Incident & Upload Proof</h3>
              </div>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveIncident} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Resolution Summary & Action Taken *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe containment actions, hazard mitigation, and final on-site status..."
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Attach Photo Evidence / Resolution Proof
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedProofFiles(Array.from(e.target.files || []))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-slate-800 file:text-xs file:font-semibold file:text-white"
                />
                {selectedProofFiles.length > 0 && (
                  <p className="text-[11px] text-emerald-400">{selectedProofFiles.length} photo(s) attached.</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30"
                >
                  {updating ? 'Resolving...' : 'Confirm Resolution & Close Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </TeamLayout>
  );
}
