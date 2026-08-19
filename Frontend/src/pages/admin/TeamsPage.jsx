import React, { useState } from 'react';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const teamTypeOptions = [
  { value: 'Fire', label: 'Fire / Explosion' },
  { value: 'Police', label: 'Police / Security' },
  { value: 'Medical', label: 'EMS / Medical' },
  { value: 'Flood', label: 'Flood / Rescue' },
];
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import TeamTable from '../../components/admin/TeamTable';
import { demoTeams } from '../../utils/demoData';

export default function TeamsPage() {
  const [teams, setTeams] = useState(demoTeams);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamType, setNewTeamType] = useState('Fire');
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (newTeamName) {
      const created = {
        id: Date.now(),
        name: newTeamName,
        type: newTeamType,
        is_active: true,
        description: 'New response team unit.',
        members: [],
      };
      setTeams([...teams, created]);
      setNewTeamName('');
      setModalOpen(false);
      toast.success('Response team unit created!');
    }
  };

  const handleDeleteTeam = (id) => {
    setTeams(teams.filter((t) => t.id !== id));
    toast.success('Team deleted');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Emergency Response Units"
          description="Manage specialized crews (Fire, Police, Medical, Flood) for emergency incident dispatches"
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Response Team</span>
            </button>
          }
        />

        <TeamTable teams={teams} onEdit={() => {}} onDelete={handleDeleteTeam} />

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Response Unit</h3>
              <form onSubmit={handleCreateTeam} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Team Name</label>
                  <input
                    type="text"
                    required
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. Hazardous Spill Rapid Response"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Unit Type</label>
                  <CustomReactSelect
                    options={teamTypeOptions}
                    value={newTeamType}
                    onChange={setNewTeamType}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-500">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-brand hover:bg-brand-soft text-white font-bold rounded-xl">Create Unit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
