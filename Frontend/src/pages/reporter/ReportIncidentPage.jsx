import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReporterLayout from '../../layouts/ReporterLayout';
import IncidentForm from '../../components/incidents/IncidentForm';
import { incidentsApi } from '../../api/incidents';

export default function ReportIncidentPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (key === 'files') {
        payload.files.forEach((file) => formData.append('files[]', file));
      } else if (key === 'is_anonymous') {
        formData.append('is_anonymous', payload.is_anonymous ? '1' : '0');
      } else {
        formData.append(key, payload[key]);
      }
    });

    try {
      const res = await incidentsApi.createIncident(formData);
      toast.success('Incident report submitted successfully!');
      const incidentId = res.data?.incident?.id || res.data?.id;
      if (incidentId) {
        navigate(`/incidents/${incidentId}`);
      } else {
        navigate('/incidents');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit incident report. Please try again.';
      toast.error(errMsg);
    }
  };

  return (
    <ReporterLayout>
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Report a Community Incident</h1>
          <p className="text-xs text-slate-500">
            Provide details, pinpoint the location, and attach evidence photos to alert local authorities.
          </p>
        </div>

        <IncidentForm onSubmit={handleSubmit} isAnonymousMode={false} />
      </div>
    </ReporterLayout>
  );
}
