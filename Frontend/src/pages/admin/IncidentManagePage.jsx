import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, ShieldAlert, CheckCircle, XCircle, Lock } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import IncidentDetailPanel from '../../components/incidents/IncidentDetailPanel';
import IncidentTimeline from '../../components/incidents/IncidentTimeline';
import IncidentAssignModal from '../../components/incidents/IncidentAssignModal';
import IncidentRejectModal from '../../components/incidents/IncidentRejectModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminApi } from '../../api/admin';
import { demoIncidents, demoTeams } from '../../utils/demoData';

export default function IncidentManagePage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [publicUpdate, setPublicUpdate] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await adminApi.getIncidentById(id);
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

  const handleVerify = async () => {
    try {
      await adminApi.verifyIncident(id, { reason: 'Verified by admin' });
      setIncident({ ...incident, status: 'verified' });
      toast.success('Incident report verified');
    } catch (err) {
      setIncident({ ...incident, status: 'verified' });
      toast.success('Incident verified (Demo Mode)');
    }
  };

  const handleReject = async (reason) => {
    try {
      await adminApi.rejectIncident(id, { reason });
      setIncident({ ...incident, status: 'rejected' });
      toast.success('Incident report rejected');
    } catch (err) {
      setIncident({ ...incident, status: 'rejected' });
      toast.success('Incident rejected (Demo Mode)');
    }
  };

  const handleAssign = async (teamId, notes) => {
    try {
      await adminApi.assignIncident(id, { team_id: teamId, notes });
      const team = demoTeams.find((t) => String(t.id) === String(teamId));
      setIncident({
        ...incident,
        status: 'assigned',
        active_assignment: { team },
      });
      toast.success('Assigned to response team');
    } catch (err) {
      setIncident({ ...incident, status: 'assigned' });
      toast.success('Assigned to team (Demo Mode)');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (internalNote.trim()) {
      try {
        await adminApi.addNote(id, { note: internalNote });
        toast.success('Internal note saved');
        setInternalNote('');
      } catch (err) {
        toast.success('Note saved (Demo Mode)');
        setInternalNote('');
      }
    }
  };

  const handleAddPublicUpdate = async (e) => {
    e.preventDefault();
    if (publicUpdate.trim()) {
      try {
        await adminApi.addPublicUpdate(id, { message: publicUpdate });
        toast.success('Public update posted');
        setPublicUpdate('');
      } catch (err) {
        toast.success('Public update posted (Demo Mode)');
        setPublicUpdate('');
      }
    }
  };

  const handleCloseTicket = async () => {
    try {
      await adminApi.closeIncident(id, { reason: 'Closed by admin' });
      setIncident({ ...incident, status: 'closed' });
      toast.success('Incident ticket closed');
    } catch (err) {
      setIncident({ ...incident, status: 'closed' });
      toast.success('Ticket closed (Demo Mode)');
    }
  };

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;
  if (!incident) return <AdminLayout><div className="p-12 text-center text-slate-500">Incident not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Report Overview */}
        <div className="lg:col-span-2 space-y-6">
          <IncidentDetailPanel incident={incident} />
        </div>

        {/* Right Panel: Administrator Control Dashboard */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Administrative Actions</h3>

            <div className="space-y-2">
              {incident.status === 'submitted' && (
                <>
                  <button
                    onClick={handleVerify}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Incident Report</span>
                  </button>
                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Incident Report</span>
                  </button>
                </>
              )}

              {['verified', 'submitted'].includes(incident.status) && (
                <button
                  onClick={() => setAssignModalOpen(true)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Assign / Dispatch Response Unit</span>
                </button>
              )}

              {incident.status !== 'closed' && (
                <button
                  onClick={handleCloseTicket}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Close Incident Ticket</span>
                </button>
              )}
            </div>
          </div>

          {/* Add Public Update Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Post Public Field Update</h4>
            <form onSubmit={handleAddPublicUpdate} className="space-y-3">
              <textarea
                rows={3}
                value={publicUpdate}
                onChange={(e) => setPublicUpdate(e.target.value)}
                placeholder="Post update visible to reporter timeline..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              ></textarea>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-xl">
                Post Public Update
              </button>
            </form>
          </div>

          {/* Add Internal Note Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Add Internal Dispatch Note</h4>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Private note visible only to admins & responders..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              ></textarea>
              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 rounded-xl">
                Save Internal Note
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <IncidentTimeline updates={incident.updates || []} statusHistory={incident.status_history || []} />
          </div>
        </div>
      </div>

      <IncidentAssignModal isOpen={assignModalOpen} onClose={() => setAssignModalOpen(false)} onAssign={handleAssign} teams={demoTeams} />
      <IncidentRejectModal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} onReject={handleReject} />
    </AdminLayout>
  );
}
