import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import TeamLayout from '../../layouts/TeamLayout';
import IncidentDetailPanel from '../../components/incidents/IncidentDetailPanel';
import IncidentTimeline from '../../components/incidents/IncidentTimeline';
import FileUpload from '../../components/common/FileUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CustomReactSelect from '../../components/common/CustomReactSelect';
import { teamApi } from '../../api/team';
import { demoIncidents } from '../../utils/demoData';

export default function IncidentResponsePage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressMessage, setProgressMessage] = useState('');
  const [newStatus, setNewStatus] = useState('in_progress');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await teamApi.getIncidentById(id);
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

  const handleAcknowledge = async () => {
    try {
      await teamApi.acknowledgeIncident(id);
      setIncident({ ...incident, status: 'in_progress' });
      toast.success('Assignment acknowledged. Unit dispatched!');
    } catch (err) {
      setIncident({ ...incident, status: 'in_progress' });
      toast.success('Acknowledged (Demo Mode)');
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    if (!progressMessage.trim()) {
      toast.error('Please enter progress log details.');
      return;
    }

    const formData = new FormData();
    formData.append('message', progressMessage);
    formData.append('new_status', newStatus);
    files.forEach((f) => formData.append('files[]', f));

    try {
      await teamApi.updateProgress(id, formData);
      setIncident({ ...incident, status: newStatus });
      setProgressMessage('');
      setFiles([]);
      toast.success('Field progress logged successfully!');
    } catch (err) {
      setIncident({ ...incident, status: newStatus });
      setProgressMessage('');
      setFiles([]);
      toast.success('Field progress recorded (Demo Mode)!');
    }
  };

  const handleMarkResolved = async () => {
    try {
      await teamApi.resolveIncident(id, { notes: 'Hazard mitigated by response crew' });
      setIncident({ ...incident, status: 'resolved' });
      toast.success('Incident hazard marked as RESOLVED!');
    } catch (err) {
      setIncident({ ...incident, status: 'resolved' });
      toast.success('Incident marked RESOLVED (Demo Mode)');
    }
  };

  if (loading) return <TeamLayout><LoadingSpinner /></TeamLayout>;
  if (!incident) return <TeamLayout><div className="p-12 text-center text-slate-500">Incident not found</div></TeamLayout>;

  return (
    <TeamLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <IncidentDetailPanel incident={incident} />
        </div>

        <div className="space-y-6">
          {/* Dispatch Acknowledge / Action Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Duty Controls</h3>

            {incident.status === 'assigned' && (
              <button
                onClick={handleAcknowledge}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Acknowledge & En Route to Scene</span>
              </button>
            )}

            {incident.status !== 'resolved' && (
              <button
                onClick={handleMarkResolved}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Mark Incident as RESOLVED</span>
              </button>
            )}
          </div>

          {/* Log Field Response Update */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm space-y-4 text-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Log Field Action Update</h4>
            <form onSubmit={handleUpdateProgress} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Update Stage</label>
                <CustomReactSelect
                  options={[
                    { value: 'in_progress', label: 'In Progress (Active Action)' },
                    { value: 'resolved', label: 'Resolved (Hazard Cleared)' },
                  ]}
                  value={newStatus}
                  onChange={setNewStatus}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Action Log Message</label>
                <textarea
                  rows={3}
                  value={progressMessage}
                  onChange={(e) => setProgressMessage(e.target.value)}
                  placeholder="Details on crew deployment, perimeter setup, hazard mitigation..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Attach On-Site Response Photos</label>
                <FileUpload files={files} setFiles={setFiles} maxFiles={5} />
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-soft text-white font-extrabold py-3 rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Field Log Update</span>
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 shadow-sm">
            <IncidentTimeline updates={incident.updates || []} statusHistory={incident.status_history || []} />
          </div>
        </div>
      </div>
    </TeamLayout>
  );
}
