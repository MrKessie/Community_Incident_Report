export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export const INCIDENT_STATUSES = [
  { id: 'submitted', label: 'Submitted', color: 'bg-slate-500 text-white' },
  { id: 'under_review', label: 'Under Review', color: 'bg-amber-500 text-white' },
  { id: 'verified', label: 'Verified', color: 'bg-blue-600 text-white' },
  { id: 'assigned', label: 'Assigned', color: 'bg-indigo-600 text-white' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-purple-600 text-white' },
  { id: 'resolved', label: 'Resolved', color: 'bg-emerald-600 text-white' },
  { id: 'closed', label: 'Closed', color: 'bg-gray-700 text-white' },
  { id: 'rejected', label: 'Rejected', color: 'bg-rose-600 text-white' },
];

export const SEVERITY_LEVELS = [
  { id: 'low', label: 'Low', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'medium', label: 'Medium', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'high', label: 'High', badge: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'critical', label: 'Critical', badge: 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse' },
];

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  RESPONSE_TEAM: 'response_team',
  REPORTER: 'reporter',
};
