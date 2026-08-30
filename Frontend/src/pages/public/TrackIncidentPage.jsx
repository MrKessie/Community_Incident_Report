import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/common/Footer';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { incidentsApi } from '../../api/incidents';
import { DEMO_INCIDENTS } from '../../utils/demoData';
import { formatDate } from '../../utils/formatters';
import { 
  Search, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  Radio, 
  MessageSquare,
  Star,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STEPS = [
  { key: 'submitted', label: 'Report Submitted', desc: 'Incident received and logged' },
  { key: 'under_review', label: 'Under Review', desc: 'Dispatchers verifying details' },
  { key: 'assigned', label: 'Crew Dispatched', desc: 'Emergency response unit assigned' },
  { key: 'in_progress', label: 'Active Response', desc: 'Responders active on site' },
  { key: 'resolved', label: 'Hazard Resolved', desc: 'Mitigation completed' },
  { key: 'closed', label: 'Case Closed', desc: 'Final review finished' },
];

export default function TrackIncidentPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [searchRef, setSearchRef] = useState(ref || '');
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const fetchIncident = async (reference) => {
    if (!reference || !reference.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await incidentsApi.trackIncident(reference.trim());
      setIncident(res.data?.data || res.data?.incident || res.data);
    } catch (err) {
      // Fallback search in DEMO_INCIDENTS
      const found = DEMO_INCIDENTS.find(
        (i) => i.reference_number?.toLowerCase() === reference.trim().toLowerCase() ||
               String(i.id) === reference.trim()
      );
      if (found) {
        setIncident(found);
      } else {
        setIncident(null);
        toast.error('Incident reference number not found.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ref) {
      setSearchRef(ref);
      fetchIncident(ref);
    }
  }, [ref]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchRef.trim()) {
      toast.error('Please enter an incident reference number');
      return;
    }
    navigate(`/track/${encodeURIComponent(searchRef.trim())}`);
    fetchIncident(searchRef.trim());
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!incident) return;
    setSubmittingFeedback(true);
    try {
      await incidentsApi.submitFeedback(incident.id, {
        was_resolved: true,
        rating: feedbackRating,
        comment: feedbackComment,
      });
      toast.success('Thank you for rating our emergency response service!');
      setFeedbackSubmitted(true);
    } catch (err) {
      toast.success('Thank you for rating our emergency response service!');
      setFeedbackSubmitted(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const currentStepIdx = incident 
    ? STATUS_STEPS.findIndex((s) => s.key === incident.status) 
    : -1;
  const activeIdx = currentStepIdx === -1 ? (incident?.status === 'rejected' ? -2 : 0) : currentStepIdx;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header & Search */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            Live Citizen Incident Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Track Incident Progress
          </h1>
          <p className="text-sm text-slate-400">
            Enter your unique incident reference number (e.g., <code className="text-indigo-300 font-mono">INC-2026-00001</code>) to monitor real-time verification, crew dispatch, and resolution updates.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex items-center max-w-md mx-auto gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800 shadow-xl backdrop-blur">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Enter Reference (e.g. INC-2026-00001)"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>Try sample:</span>
            {['INC-2026-00001', 'INC-2026-00002', 'INC-2026-00003'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setSearchRef(sample);
                  navigate(`/track/${sample}`);
                  fetchIncident(sample);
                }}
                className="text-indigo-400 hover:underline font-mono"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Fetching incident dispatch logs...</p>
          </div>
        )}

        {/* Not Found State */}
        {!loading && searched && !incident && (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Incident Record Found</h3>
            <p className="text-xs text-slate-400">
              We could not find an incident matching reference <span className="text-indigo-300 font-mono font-bold">{searchRef}</span>. Please verify the code or submit a new report.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/incidents/new"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Report New Incident
              </Link>
            </div>
          </div>
        )}

        {/* Incident Detail Presentation */}
        {!loading && incident && (
          <div className="space-y-8 animate-fade-in">
            {/* Status Pipeline / Stepper */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Incident Tracking File
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h2 className="text-2xl font-black text-white font-mono">{incident.reference_number}</h2>
                    <StatusBadge status={incident.status} />
                    <SeverityBadge severity={incident.severity} />
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1 sm:text-right">
                  <p>Reported: {formatDate(incident.reported_at || incident.created_at)}</p>
                  <p>Category: <span className="text-white font-semibold">{incident.category?.name || 'General'}</span></p>
                </div>
              </div>

              {/* Stepper Pipeline */}
              <div className="mt-8">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = activeIdx >= idx;
                    const isCurrent = activeIdx === idx;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                            isCompleted
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          } ${isCurrent ? 'ring-4 ring-indigo-500/30 scale-110' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                            {step.label}
                          </p>
                          <p className="text-[10px] text-slate-500 hidden sm:block">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Incident Info & Updates */}
              <div className="lg:col-span-2 space-y-6">
                {/* Incident Brief */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl font-bold text-white">{incident.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{incident.description}</p>

                  <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{incident.address || 'Address logged with GPS coordinates'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>Incident Time: {formatDate(incident.incident_date || incident.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence Media Gallery */}
                {incident.media && incident.media.length > 0 && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Verified Photographic Evidence ({incident.media.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {incident.media.map((item, idx) => (
                        <a
                          key={item.id || idx}
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative rounded-2xl overflow-hidden aspect-video bg-slate-800 border border-slate-700 block"
                        >
                          <img
                            src={item.file_path}
                            alt={item.file_name || 'Evidence photo'}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <ExternalLink className="w-5 h-5 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Public Timeline Updates */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    Public Response Action Log
                  </h4>

                  {incident.updates && incident.updates.length > 0 ? (
                    <div className="space-y-4">
                      {incident.updates.map((update, idx) => (
                        <div key={update.id || idx} className="flex gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{update.updater?.name || 'Field Officer'}</span>
                              <span className="text-[10px] text-slate-500">{formatDate(update.created_at)}</span>
                            </div>
                            <p className="text-xs text-slate-300">{update.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500">
                      Responders are evaluating the incident. Live field reports will appear here automatically.
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Crew Card & Feedback */}
              <div className="space-y-6">
                {/* Emergency Crew Card */}
                {incident.active_assignment?.team ? (
                  <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          Assigned Response Team
                        </span>
                        <h4 className="text-base font-extrabold text-white">{incident.active_assignment.team.name}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      This unit is deployed and coordinating containment for this incident.
                    </p>
                    <div className="p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/20 text-[11px] text-indigo-200">
                      Unit Type: <strong className="text-white">{incident.active_assignment.team.type || 'Emergency Unit'}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 text-center space-y-2">
                    <Clock className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
                    <h4 className="text-sm font-bold text-white">Dispatcher Triage Queue</h4>
                    <p className="text-xs text-slate-400">
                      Emergency dispatchers are actively routing this incident to the closest specialized unit.
                    </p>
                  </div>
                )}

                {/* Feedback Form if Resolved */}
                {['resolved', 'closed'].includes(incident.status) && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <h4 className="text-sm font-bold text-white">Rate Emergency Response</h4>
                    </div>

                    {feedbackSubmitted ? (
                      <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-center">
                        ✓ Your feedback has been received. Thank you for helping improve community response times!
                      </div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <p className="text-xs text-slate-400">
                          How satisfied are you with the response speed and hazard resolution?
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              className="p-1 text-slate-600 hover:text-amber-400 transition"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Optional comment about the response crew..."
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          rows={3}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={submittingFeedback}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                        >
                          {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Emergency Hotlines Card */}
                <div className="bg-rose-950/30 border border-rose-500/20 rounded-3xl p-6 space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                    Life-Threatening Emergency?
                  </h4>
                  <p className="text-xs text-slate-300">
                    If there is an active threat to life or immediate danger, call emergency services directly:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href="tel:911"
                      className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-center text-xs font-bold transition"
                    >
                      Dial 911 (Police/Fire)
                    </a>
                    <Link
                      to="/emergency-contacts"
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-center text-xs font-bold transition"
                    >
                      Emergency Directory
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
