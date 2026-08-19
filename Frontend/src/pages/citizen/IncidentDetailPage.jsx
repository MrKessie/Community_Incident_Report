import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import IncidentMap from '../../components/maps/IncidentMap';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { useIncidentStore } from '../../store/useIncidentStore';
import { formatDate, getMediaUrl } from '../../utils/formatters';
import { ShieldAlert, MapPin, Clock, Users, Star, Send, ArrowLeft, CheckCircle2, FileText, Radio, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WORKFLOW_STEPS = ['submitted', 'under_review', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'];

export default function IncidentDetailPage() {
  const { id } = useParams();
  const { incidents, submitFeedback } = useIncidentStore();

  const incident = incidents.find((i) => String(i.id) === String(id)) || incidents[0];

  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  if (!incident) {
    return (
      <Layout showSidebar={false}>
        <div className="p-12 text-center text-slate-400 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
          <Link to="/" className="inline-block px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold">
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStepIndex = WORKFLOW_STEPS.indexOf(incident.status);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await submitFeedback(incident.id, {
        was_resolved: true,
        rating,
        comment: feedbackComment,
      });
      toast.success('Thank you for rating our emergency response service!');
    } catch (err) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Incidents
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">{incident.reference_number}</span>
            <StatusBadge status={incident.status} />
            <SeverityBadge severity={incident.severity} />
          </div>
        </div>

        {/* Workflow Progress Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Response Lifecycle Progress</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-rose-600/20 border-rose-500 text-rose-400 font-bold shadow-lg shadow-rose-950/40'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider">{step.replace('_', ' ')}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Details + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Details & Updates */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title & Description Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-rose-400 border border-slate-700">
                    {incident.category?.name || 'General Category'}
                  </span>
                  <h1 className="text-2xl font-black text-white mt-2 leading-tight">{incident.title}</h1>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{incident.description}</p>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Incident Date</span>
                  <span className="text-slate-200 font-semibold">{formatDate(incident.incident_date)}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-500">Reporter Status</span>
                  <span className="text-slate-200 font-semibold">
                    {incident.is_anonymous ? 'Anonymous Citizen Report' : incident.reporter?.name || 'Registered Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            {incident.media && incident.media.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Evidence Media</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {incident.media.map((item) => {
                    const mediaSrc = getMediaUrl(item.file_path);
                    return (
                      <a key={item.id} href={mediaSrc} target="_blank" rel="noreferrer" className="group rounded-xl overflow-hidden border border-slate-800 block">
                        <img src={mediaSrc} alt={item.file_name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Public Updates Timeline */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" /> Response Dispatch Timeline Log
              </h3>

              {(!incident.updates || incident.updates.length === 0) ? (
                <p className="text-xs text-slate-500 italic">No field updates posted yet. Team dispatch in progress.</p>
              ) : (
                <div className="space-y-4 relative pl-4 border-l-2 border-slate-800">
                  {incident.updates.map((upd) => (
                    <div key={upd.id} className="relative space-y-1">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-slate-900" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{upd.updater?.name || 'Dispatch Control'}</span>
                        <span className="text-[10px] text-slate-500">{formatDate(upd.created_at)}</span>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                        {upd.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reporter Feedback Section */}
            {['resolved', 'closed'].includes(incident.status) && (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl border-t-4 border-t-emerald-500">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Community Service Feedback
                </h3>

                {incident.feedback ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(incident.feedback.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-slate-300 ml-2">({incident.feedback.rating}/5 Stars)</span>
                    </div>
                    {incident.feedback.comment && (
                      <p className="text-xs text-slate-300 italic">"{incident.feedback.comment}"</p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <p className="text-xs text-slate-400">Please rate the efficiency and timeliness of the emergency response team:</p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={2}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Optional feedback comment on the resolution..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingFeedback}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Feedback
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Right Col: Map & Assigned Team */}
          <div className="space-y-6">
            
            {/* Map Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Geotagged Location
              </h3>
              <p className="text-xs text-slate-300 font-semibold">{incident.address || 'Reported Pin Coordinates'}</p>
              <IncidentMap incidents={[incident]} center={[parseFloat(incident.latitude || 40.7128), parseFloat(incident.longitude || -74.0060)]} height="280px" />
            </div>

            {/* Active Response Team Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Assigned Response Unit
              </h3>

              {incident.active_assignment ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-white">{incident.active_assignment.team?.name || 'Assigned Response Unit'}</h4>
                  <p className="text-xs text-slate-400">Dispatched at: {formatDate(incident.active_assignment.assigned_at)}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 italic">
                  No response team assigned yet. Incident is pending review by dispatch center.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
