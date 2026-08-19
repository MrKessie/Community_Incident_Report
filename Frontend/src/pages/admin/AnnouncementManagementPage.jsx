import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useAnnouncementStore } from '../../store/useAnnouncementStore';
import { Megaphone, Plus, Trash2, AlertTriangle, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatters';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const alertTypeOptions = [
  { value: 'info', label: 'Info - General notice' },
  { value: 'warning', label: 'Warning - Cautionary alert' },
  { value: 'danger', label: 'Danger - Emergency threat' },
  { value: 'success', label: 'Success - All clear / resolution' },
];

export default function AnnouncementManagementPage() {
  const { announcements, createAnnouncement, deleteAnnouncement } = useAnnouncementStore();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'warning' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createAnnouncement(formData);
      toast.success('Emergency announcement broadcasted to all users!');
      setShowModal(false);
      setFormData({ title: '', message: '', type: 'warning' });
    } catch (err) {
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteAnnouncement(id);
    toast.success('Announcement deleted');
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-amber-400" /> Broadcast & Announcements Manager
            </h1>
            <p className="text-xs text-slate-400 mt-1">Broadcast high-priority emergency alerts and community notifications to all users.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Broadcast New Alert
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4 shadow-xl"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ann.type === 'danger' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    ann.type === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    ann.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {ann.type}
                  </span>
                  <span className="text-[11px] text-slate-500">Posted {formatDate(ann.created_at)}</span>
                </div>

                <h3 className="text-base font-bold text-white">{ann.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.message}</p>
              </div>

              <button
                onClick={() => handleDelete(ann.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete alert"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <h3 className="text-base font-bold text-white">Broadcast Emergency Announcement</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Flash Flood Warning for Coastal Zone"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Severity Type</label>
                  <CustomReactSelect
                    options={alertTypeOptions}
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Detailed emergency instructions and safety guidance for community members..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-400 font-semibold">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg"
                  >
                    {isSubmitting ? 'Publishing...' : 'Broadcast Alert'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
