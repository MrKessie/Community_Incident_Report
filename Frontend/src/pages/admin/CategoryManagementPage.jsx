import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Grid, Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoryManagementPage() {
  const { categories } = useIncidentStore();

  const [categoryList, setCategoryList] = useState(categories);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#ef4444', icon: 'Flame' });

  const handleAddCategory = (e) => {
    e.preventDefault();
    const created = { id: Date.now(), ...formData, is_active: true };
    setCategoryList((prev) => [...prev, created]);
    toast.success(`Category "${formData.name}" added successfully`);
    setShowModal(false);
    setFormData({ name: '', description: '', color: '#ef4444', icon: 'Flame' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Grid className="w-6 h-6 text-purple-400" /> Incident Categories Manager
            </h1>
            <p className="text-xs text-slate-400 mt-1">Configure incident classification taxonomy, icons, and color themes.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryList.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shadow"
                      style={{ backgroundColor: cat.color || '#3b82f6' }}
                    />
                    <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Icon: {cat.icon || 'Default'}</span>
                <button
                  onClick={() => toast.success(`Editing category ${cat.name}`)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <h3 className="text-base font-bold text-white">Create Incident Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hazardous Spill"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Color Hex</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-xl p-1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Category description and scope..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs text-slate-400 font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl">
                    Save Category
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
