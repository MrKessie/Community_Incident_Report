export const DEMO_CATEGORIES = [
  { id: 1, name: 'Fire', description: 'Structure fires, bushfires, electrical fires, and smoke hazard alerts.', icon: 'Flame', color: '#ef4444' },
  { id: 2, name: 'Theft / Robbery', description: 'Burglary, armed robbery, vehicle theft, and petty larceny.', icon: 'ShieldAlert', color: '#f97316' },
  { id: 3, name: 'Road Accident', description: 'Vehicular collisions, traffic blockages, pedestrian accidents.', icon: 'Car', color: '#eab308' },
  { id: 4, name: 'Flood / Water', description: 'Rising floodwaters, drainage overflow, water supply burst.', icon: 'Droplets', color: '#3b82f6' },
  { id: 5, name: 'Medical Emergency', description: 'Health distress, collapsed individuals, urgent medical assistance needed.', icon: 'Activity', color: '#ec4899' },
  { id: 6, name: 'Violence / Assault', description: 'Physical brawls, domestic altercations, public safety threats.', icon: 'AlertTriangle', color: '#dc2626' },
  { id: 7, name: 'Infrastructure Damage', description: 'Potholes, fallen power lines, broken streetlights, bridge damage.', icon: 'Hammer', color: '#8b5cf6' },
  { id: 8, name: 'Environmental Hazard', description: 'Chemical spills, illegal dumping, toxic fumes, gas leaks.', icon: 'Trees', color: '#10b981' },
  { id: 9, name: 'Missing Person', description: 'Lost children, elderly individuals, missing community members.', icon: 'UserCheck', color: '#6366f1' },
  { id: 10, name: 'Vandalism', description: 'Graffiti, destruction of public or private property.', icon: 'EyeOff', color: '#64748b' },
  { id: 11, name: 'Other', description: 'General community concerns and uncategorized incidents.', icon: 'HelpCircle', color: '#94a3b8' },
];

export const DEMO_TEAMS = [
  { id: 1, name: 'Metro Fire Rescue', description: 'First responder fire suppression and heavy rescue operational unit.', type: 'Fire', is_active: true, members_count: 8 },
  { id: 2, name: 'Police Rapid Response Unit', description: 'Law enforcement rapid dispatch and crime incident management.', type: 'Police', is_active: true, members_count: 12 },
  { id: 3, name: 'Emergency Medical Services', description: 'Paramedic and emergency ambulance rescue services.', type: 'Medical', is_active: true, members_count: 10 },
  { id: 4, name: 'Disaster & Flood Relief Squad', description: 'Specialized water rescue, evacuation, and environmental mitigation unit.', type: 'Flood', is_active: true, members_count: 6 },
];

export const DEMO_INCIDENTS = [
  {
    id: 1,
    reference_number: 'INC-2026-00001',
    title: 'Commercial Warehouse Fire on 5th Avenue',
    description: 'Heavy black smoke billowing from industrial warehouse roof. Fire spread rapidly to adjacent storage bays.',
    category_id: 1,
    category: { id: 1, name: 'Fire', color: '#ef4444', icon: 'Flame' },
    reporter_id: 2,
    reporter: { id: 2, name: 'Alex Morgan', email: 'citizen.alex@cir.org', phone: '+15550000010' },
    is_anonymous: false,
    severity: 'critical',
    status: 'in_progress',
    latitude: 40.712776,
    longitude: -74.005974,
    address: '542 5th Avenue, Industrial District',
    incident_date: '2026-08-08T20:14:00Z',
    reported_at: '2026-08-08T20:20:00Z',
    assigned_at: '2026-08-08T21:00:00Z',
    admin_notes: 'Priority 1 response. 3 fire tenders dispatched.',
    active_assignment: {
      id: 1,
      team_id: 1,
      team: { id: 1, name: 'Metro Fire Rescue', type: 'Fire' },
      assigned_at: '2026-08-08T21:00:00Z',
    },
    media: [
      { id: 1, file_path: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80', file_name: 'fire_smoke_view.jpg', file_type: 'image' }
    ],
    updates: [
      { id: 1, update_type: 'status_change', previous_status: 'assigned', new_status: 'in_progress', message: 'Fire Response Crew on scene. Water cannons deployed on North structure.', is_public: true, created_at: '2026-08-08T21:30:00Z', updater: { name: 'Captain David Vance' } },
    ],
    status_histories: [
      { id: 1, previous_status: 'submitted', new_status: 'verified', reason: 'Verified by dispatcher via 911 cross-reference.', created_at: '2026-08-08T20:45:00Z', changed_by: { name: 'Commander Sarah Jenkins' } },
      { id: 2, previous_status: 'verified', new_status: 'assigned', reason: 'Assigned to Metro Fire Rescue unit.', created_at: '2026-08-08T21:00:00Z', changed_by: { name: 'Commander Sarah Jenkins' } },
      { id: 3, previous_status: 'assigned', new_status: 'in_progress', reason: 'Team arrived on scene.', created_at: '2026-08-08T21:30:00Z', changed_by: { name: 'Captain David Vance' } },
    ]
  },
  {
    id: 2,
    reference_number: 'INC-2026-00002',
    title: 'Multi-Vehicle Collision on Highway 101',
    description: 'Two sedans and a delivery truck collision blocking south lanes. Minor injuries reported.',
    category_id: 3,
    category: { id: 3, name: 'Road Accident', color: '#eab308', icon: 'Car' },
    reporter_id: 3,
    reporter: { id: 3, name: 'Taylor Swift', email: 'citizen.taylor@cir.org', phone: '+15550000011' },
    is_anonymous: false,
    severity: 'high',
    status: 'resolved',
    latitude: 40.730610,
    longitude: -73.935242,
    address: 'Highway 101 Exit 14, Queens',
    incident_date: '2026-08-07T14:30:00Z',
    reported_at: '2026-08-07T14:35:00Z',
    assigned_at: '2026-08-07T15:00:00Z',
    resolved_at: '2026-08-07T18:00:00Z',
    admin_notes: 'Tow trucks cleared debris. Paramedics treated victims on scene.',
    active_assignment: {
      id: 2,
      team_id: 2,
      team: { id: 2, name: 'Police Rapid Response Unit', type: 'Police' },
      assigned_at: '2026-08-07T15:00:00Z',
    },
    media: [
      { id: 2, file_path: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80', file_name: 'accident_scene.jpg', file_type: 'image' }
    ],
    feedback: {
      id: 1,
      was_resolved: true,
      rating: 5,
      comment: 'The police and ambulance arrived within 10 minutes! Excellent emergency response.',
      submitted_at: '2026-08-07T19:00:00Z'
    },
    updates: [
      { id: 2, update_type: 'status_change', previous_status: 'in_progress', new_status: 'resolved', message: 'Traffic lanes cleared and victims transferred safely to city clinic.', is_public: true, created_at: '2026-08-07T18:00:00Z', updater: { name: 'Inspector Marcus Reed' } }
    ],
    status_histories: [
      { id: 4, previous_status: 'in_progress', new_status: 'resolved', reason: 'Incident site cleared.', created_at: '2026-08-07T18:00:00Z', changed_by: { name: 'Inspector Marcus Reed' } }
    ]
  },
  {
    id: 3,
    reference_number: 'INC-2026-00003',
    title: 'Bicycle Theft & Vandalism at Central Park South',
    description: 'Cut security lock found near public bike rack. Security camera footage available from shop across street.',
    category_id: 2,
    category: { id: 2, name: 'Theft / Robbery', color: '#f97316', icon: 'ShieldAlert' },
    reporter_id: null,
    is_anonymous: true,
    severity: 'low',
    status: 'under_review',
    latitude: 40.7648,
    longitude: -73.9744,
    address: 'Central Park South Entrance',
    incident_date: '2026-08-08T18:00:00Z',
    reported_at: '2026-08-08T18:10:00Z',
    updates: [],
    status_histories: []
  },
  {
    id: 4,
    reference_number: 'INC-2026-00004',
    title: 'Heat Exhaustion at Public Plaza',
    description: 'Elderly citizen experienced dizziness and fainting due to excessive heat outdoors.',
    category_id: 5,
    category: { id: 5, name: 'Medical Emergency', color: '#ec4899', icon: 'Activity' },
    reporter_id: 2,
    reporter: { id: 2, name: 'Alex Morgan', email: 'citizen.alex@cir.org', phone: '+15550000010' },
    is_anonymous: false,
    severity: 'medium',
    status: 'verified',
    latitude: 40.758896,
    longitude: -73.985130,
    address: 'Times Square Plaza Center',
    incident_date: '2026-08-08T22:00:00Z',
    reported_at: '2026-08-08T22:05:00Z',
    updates: [],
    status_histories: []
  },
  {
    id: 5,
    reference_number: 'INC-2026-00005',
    title: 'Flash Flood Accumulation on River Road',
    description: 'Drainage blockage causing 2 feet of water on major roadway. Two cars stalled.',
    category_id: 4,
    category: { id: 4, name: 'Flood / Water', color: '#3b82f6', icon: 'Droplets' },
    reporter_id: 3,
    reporter: { id: 3, name: 'Taylor Swift', email: 'citizen.taylor@cir.org', phone: '+15550000011' },
    is_anonymous: false,
    severity: 'high',
    status: 'assigned',
    latitude: 40.7829,
    longitude: -73.9654,
    address: 'River Road & 86th Street',
    incident_date: '2026-08-08T21:00:00Z',
    reported_at: '2026-08-08T21:10:00Z',
    assigned_at: '2026-08-08T22:00:00Z',
    active_assignment: {
      id: 3,
      team_id: 4,
      team: { id: 4, name: 'Disaster & Flood Relief Squad', type: 'Flood' },
      assigned_at: '2026-08-08T22:00:00Z',
    },
    updates: [],
    status_histories: []
  }
];

export const DEMO_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Severe Weather Advisory - Heavy Flash Flooding Warning',
    message: 'The National Weather Service has issued a flash flood warning for low-lying coastal areas. Stay vigilant and report any rising waters immediately.',
    type: 'warning',
    is_active: true,
    created_at: '2026-08-08T12:00:00Z'
  },
  {
    id: 2,
    title: 'System Maintenance & New Emergency Hotline Integration',
    message: 'Our dispatch systems have been upgraded for faster emergency response routing.',
    type: 'info',
    is_active: true,
    created_at: '2026-08-08T08:00:00Z'
  }
];

export const DEMO_USERS = [
  { id: 1, name: 'System Super Admin', email: 'superadmin@community.com', role: 'super_admin', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Commander Sarah Jenkins', email: 'admin@community.com', role: 'admin', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 3, name: 'Captain David Vance', email: 'fire.captain@cir.org', role: 'response_team', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: 4, name: 'Alex Morgan', email: 'citizen.alex@cir.org', role: 'reporter', is_active: true, created_at: '2026-01-01T00:00:00Z' },
];

export const DEMO_AUDIT_LOGS = [
  { id: 1, action: 'user_logged_in', user: { name: 'Commander Sarah Jenkins' }, ip_address: '127.0.0.1', user_agent: 'Mozilla/5.0 (Windows NT 10.0)', created_at: '2026-08-08T22:30:00Z' },
  { id: 2, action: 'incident_assigned', user: { name: 'Commander Sarah Jenkins' }, ip_address: '127.0.0.1', user_agent: 'Mozilla/5.0 (Windows NT 10.0)', created_at: '2026-08-08T22:00:00Z' },
  { id: 3, action: 'incident_created', user: { name: 'Alex Morgan' }, ip_address: '192.168.1.45', user_agent: 'Mozilla/5.0 (iPhone)', created_at: '2026-08-08T20:20:00Z' },
  { id: 4, action: 'user_registered', user: { name: 'Taylor Swift' }, ip_address: '192.168.1.88', user_agent: 'Mozilla/5.0 (Macintosh)', created_at: '2026-08-07T12:00:00Z' },
];

// Compatibility exports
export const demoIncidents = DEMO_INCIDENTS;
export const demoTeams = DEMO_TEAMS;
export const demoUsers = DEMO_USERS;
export const demoCategories = DEMO_CATEGORIES;
export const demoAnnouncements = DEMO_ANNOUNCEMENTS;
export const demoAuditLogs = DEMO_AUDIT_LOGS;

export const initialIncidents = DEMO_INCIDENTS;
export const initialTeams = DEMO_TEAMS;
export const initialCategories = DEMO_CATEGORIES;
export const initialAnnouncements = DEMO_ANNOUNCEMENTS;
export const initialAuditLogs = DEMO_AUDIT_LOGS;
