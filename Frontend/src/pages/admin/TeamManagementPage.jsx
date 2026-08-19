import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useIncidentStore } from '../../store/useIncidentStore';
import { Users, Plus, ShieldCheck, UserPlus, Flame, ShieldAlert, Activity, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const unitTypeOptions = [
  { value: 'Fire', label: 'Fire' },
  { value: 'Police', label: 'Police' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Flood', label: 'Flood' },
  { value: 'General', label: 'General Emergency' },
];

export default function TeamManagementPage() {
  const { teams } = useIncidentStore();

  const [teamList, setTeamList] = useState(teams);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', type: 'Fire' });

  const getTeamIcon = (type) => {
    switch (type) {
      case 'Fire': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Police': return <ShieldAlert className="w-5 h-5 text-blue-400" />;
      case 'Medical': return <Activity className="w-5 h-5 text-pink-400" />;
      case 'Flood': return <Droplets className="w-5 h-5 text-cyan-400" />;
      default: return <Users className="w-5 h-5 text-indigo-400" />;
    }
  };

  const handleAddTeam = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      ...newTeam,
      is_active: true,
      members_count: 5,
    };
    setTeamList((prev) => [...prev, created]);
    toast.success(`Response team ${newTeam.name} created!`);
    setShowAddModal(false);
    setNewTeam({ name: '', description: '', type: 'Fire' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" /> Response Teams & Units Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">Configure emergency response teams, unit types, and assigned personnel.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create New Response Team
          </button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamList.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    {getTeamIcon(t.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {t.type} Unit
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{t.description}</p>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <UserPlus className="w-4 h-4 text-indigo-400" />
                  <span>{t.members_count || 4} Registered Members</span>
                </div>

                <button
                  onClick={() => toast.success(`Managing member roster for ${t.name}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200"
                >
                  Manage Roster →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Team Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              <h3 className="text-base font-bold text-white">Create Response Team</h3>
              <form onSubmit={handleAddTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="e.g. Urban Search & Rescue Unit"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unit Type</label>
                  <CustomReactSelect
                    options={unitTypeOptions}
                    value={newTeam.type}
                    onChange={(val) => setNewTeam({ ...newTeam, type: val })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    placeholder="Team operational capabilities and area of responsibility..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs text-slate-400 font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                    Create Team
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
