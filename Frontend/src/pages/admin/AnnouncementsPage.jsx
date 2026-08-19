import React, { useState } from 'react';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const alertTypeOptions = [
  { value: 'info', label: 'Info (Blue)' },
  { value: 'warning', label: 'Warning (Amber)' },
  { value: 'danger', label: 'Danger (Red Critical)' },
  { value: 'success', label: 'Success (Green Notice)' },
];
import { Plus, Megaphone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import { demoAnnouncements } from '../../utils/demoData';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(demoAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('warning');

  const handleCreate = (e) => {
    e.preventDefault();
    if (title && message) {
      setAnnouncements([...announcements, { id: Date.now(), title, message, type, is_active: true }]);
      setTitle('');
      setMessage('');
      setModalOpen(false);
      toast.success('Emergency announcement broadcasted!');
    }
  };

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast.success('Announcement deleted');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Community Alert Broadcasts"
          description="Publish emergency alerts and public notices displayed on the landing page banner and user dashboards"
          action={
            <button onClick={() => setModalOpen(true)} className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-xl">
              <Plus className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{a.title}</h4>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {a.type}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{a.message}</p>
              <div className="flex justify-end pt-2">
                <button onClick={() => handleDelete(a.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">New Broadcast Notice</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. FLASH FLOOD WARNING: Main District" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Message</label>
                  <textarea rows={3} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Alert details and safety instructions..." className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Alert Severity Type</label>
                  <CustomReactSelect
                    options={alertTypeOptions}
                    value={type}
                    onChange={setType}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-brand hover:bg-brand-soft text-white font-bold rounded-xl">Broadcast Now</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
