import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Shield, User, FileText, Image as ImageIcon, CheckCircle2, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '../common/StatusBadge';
import SeverityBadge from '../common/SeverityBadge';
import { formatDateTime, getMediaUrl } from '../../utils/formatters';
import IncidentMap from './IncidentMap';
import ImageViewer from '../common/ImageViewer';
import IncidentForm from './IncidentForm';
import { incidentsApi } from '../../api/incidents';

export default function IncidentDetailPanel({ incident }) {
  const [currentIncident, setCurrentIncident] = useState(incident);
  const [activeImage, setActiveImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentIncident(incident);
  }, [incident]);

  const targetIncident = currentIncident || incident;
  const statusSteps = ['submitted', 'under_review', 'verified', 'assigned', 'in_progress', 'resolved', 'closed'];
  const currentStepIndex = statusSteps.indexOf(targetIncident.status);

  const handleUpdateSubmit = async (payload) => {
    try {
      const res = await incidentsApi.updateIncident(targetIncident.id, payload);
      const updated = res.data?.incident || res.data?.data || { ...targetIncident, ...payload };
      toast.success('Incident report updated successfully!');
      setCurrentIncident((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update incident report';
      toast.error(errMsg);
    }
  };

  if (isEditing && targetIncident.status === 'submitted') {
    return (
      <div className="space-y-4 animate-in fade-in">
        <IncidentForm
          initialData={targetIncident}
          isEditMode={true}
          onSubmit={handleUpdateSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Incident Header Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-sm font-bold text-emerald-600 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-xl">
            {targetIncident.reference_number}
          </span>
          <div className="flex items-center space-x-2">
            <SeverityBadge severity={targetIncident.severity} />
            <StatusBadge status={targetIncident.status} />
            
            {targetIncident.status === 'submitted' && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition cursor-pointer ml-2"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Incident</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">{targetIncident.title}</h1>

        {/* Step-by-Step Progress Journey Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Lifecycle Progress Journey</p>
          <div className="grid grid-cols-7 gap-1">
            {statusSteps.map((st, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={st} className="flex flex-col items-center">
                  <div
                    className={`w-full h-2 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 animate-pulse'
                        : isDone
                        ? 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  ></div>
                  <span className={`text-[9px] font-bold mt-1.5 capitalize text-center ${isCurrent ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {st.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Report Details</h3>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {incident.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Reported At: <strong className="text-slate-900 dark:text-white">{formatDateTime(incident.reported_at || incident.created_at)}</strong></span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4 text-purple-500" />
            <span>Reporter: <strong className="text-slate-900 dark:text-white">{incident.is_anonymous ? 'Anonymous Citizen' : incident.reporter?.name || 'Community Member'}</strong></span>
          </div>
        </div>
      </div>

      {/* Media Evidence Gallery */}
      {incident.media && incident.media.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Evidence Photos & Attachments</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {incident.media.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveImage(m.file_path)}
                className="cursor-pointer group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-28 flex items-center justify-center"
              >
                {m.file_type === 'image' ? (
                  <img src={m.file_path} alt={m.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
            ))}
          </div>
          <ImageViewer src={activeImage} isOpen={!!activeImage} onClose={() => setActiveImage(null)} />
        </div>
      )}

      {/* Mini Location Map */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Incident Location: {targetIncident.address}</span>
        </h3>
        <IncidentMap position={{ lat: targetIncident.latitude || 5.6037, lng: targetIncident.longitude || -0.1870 }} height="240px" />
      </div>
    </div>
  );
}
