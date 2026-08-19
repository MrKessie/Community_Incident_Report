import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReporterLayout from '../../layouts/ReporterLayout';
import IncidentDetailPanel from '../../components/incidents/IncidentDetailPanel';
import IncidentTimeline from '../../components/incidents/IncidentTimeline';
import FeedbackForm from '../../components/incidents/FeedbackForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { incidentsApi } from '../../api/incidents';
import { demoIncidents } from '../../utils/demoData';

export default function IncidentDetailPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await incidentsApi.getIncidentById(id);
        setIncident(res.data.data || res.data);
      } catch (err) {
        const found = demoIncidents.find((i) => String(i.id) === String(id)) || demoIncidents[0];
        setIncident(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleFeedback = async (feedbackData) => {
    try {
      await incidentsApi.submitFeedback(id, feedbackData);
    } catch (err) {
      // Demo feedback recorder
    }
  };

  if (loading) return <ReporterLayout><LoadingSpinner /></ReporterLayout>;
  if (!incident) return <ReporterLayout><div className="p-12 text-center text-slate-500">Incident not found.</div></ReporterLayout>;

  return (
    <ReporterLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <IncidentDetailPanel incident={incident} />

          {/* Feedback Form trigger when resolved/closed */}
          {['resolved', 'closed'].includes(incident.status) && (
            <FeedbackForm onSubmitFeedback={handleFeedback} />
          )}
        </div>

        <div className="space-y-6">
          {/* Assigned Response Team Info Card */}
          {incident.active_assignment?.team && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md border border-indigo-800 space-y-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Assigned Emergency Crew</span>
              <h3 className="text-lg font-extrabold">{incident.active_assignment.team.name}</h3>
              <p className="text-xs text-slate-300">Unit Type: {incident.active_assignment.team.type}</p>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <IncidentTimeline updates={incident.updates || []} statusHistory={incident.status_history || []} />
          </div>
        </div>
      </div>
    </ReporterLayout>
  );
}
