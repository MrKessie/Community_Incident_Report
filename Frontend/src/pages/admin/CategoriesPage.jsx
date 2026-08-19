import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import CategoryTable from '../../components/admin/CategoryTable';
import { demoCategories } from '../../utils/demoData';

export default function CategoriesPage() {
  const [categories, setCategories] = useState(demoCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚠️');

  const handleCreate = (e) => {
    e.preventDefault();
    if (name) {
      setCategories([...categories, { id: Date.now(), name, icon, incidents_count: 0, is_active: true }]);
      setName('');
      setModalOpen(false);
      toast.success('Category added');
    }
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast.success('Category deleted');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Incident Taxonomy & Categories"
          description="Manage incident classification categories used for user submissions and automated dispatch routing"
          action={
            <button onClick={() => setModalOpen(true)} className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-xl">
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          }
        />

        <CategoryTable categories={categories} onEdit={() => {}} onDelete={handleDelete} />

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Incident Category</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Category Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hazardous Chemical Spill" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Emoji Icon</label>
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white" />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-brand hover:bg-brand-soft text-white font-bold rounded-xl">Save Category</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
