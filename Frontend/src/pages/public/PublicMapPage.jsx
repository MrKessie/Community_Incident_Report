import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/common/Footer';
import IncidentMap from '../../components/maps/IncidentMap';
import StatusBadge from '../../components/common/StatusBadge';
import SeverityBadge from '../../components/common/SeverityBadge';
import { mapApi } from '../../api/map';
import { DEMO_INCIDENTS, DEMO_CATEGORIES } from '../../utils/demoData';
import { formatDate } from '../../utils/formatters';
import { 
  MapPin, 
  Filter, 
  Navigation, 
  Radio, 
  Layers, 
  ChevronRight, 
  AlertTriangle,
  Flame,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicMapPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    async function load() {
      try {
        const res = await mapApi.getPublicMapIncidents();
        const data = res.data?.data || res.data || [];
        setIncidents(data.length > 0 ? data : DEMO_INCIDENTS);
      } catch (err) {
        setIncidents(DEMO_INCIDENTS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGeolocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapCenter([latitude, longitude]);
        setMapZoom(14);
        toast.success('Map centered on your current GPS location');
      },
      (err) => {
        toast.error('Could not retrieve your GPS location');
      }
    );
  };

  const filteredIncidents = incidents.filter((inc) => {
    const matchesCategory = selectedCategory === 'all' || String(inc.category_id) === String(selectedCategory);
    const matchesSeverity = selectedSeverity === 'all' || inc.severity === selectedSeverity;
    const matchesSearch = !searchQuery || 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.address && inc.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inc.reference_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSeverity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl backdrop-blur">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-500" />
                Live Community Spatial Radar
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Public Hazard & Emergency Incident Map
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time active community emergency reports and verified response dispatches. Citizen identity is protected.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleGeolocateMe}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-indigo-400" />
                <span>Locate Near Me</span>
              </button>

              <Link
                to="/incidents/new"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Report Incident Here</span>
              </Link>
            </div>
          </div>

          {/* Filters Strip */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by title, address, or ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Categories ({DEMO_CATEGORIES.length})</option>
                {DEMO_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{filteredIncidents.length}</strong> active hazards on radar
            </div>
          </div>

          {/* Map & List Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map (2 cols) */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl relative overflow-hidden">
              <IncidentMap
                incidents={filteredIncidents}
                height="580px"
                center={mapCenter}
                zoom={mapZoom}
              />
            </div>

            {/* Side List (1 col) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col h-[605px]">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Incident Feed ({filteredIncidents.length})
                </h3>
              </div>

              <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                {filteredIncidents.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500">
                    No active incidents match the chosen filters.
                  </div>
                ) : (
                  filteredIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 transition space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">{inc.reference_number}</span>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={inc.status} />
                          <SeverityBadge severity={inc.severity} />
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition leading-tight">
                        {inc.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {inc.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 truncate max-w-[140px]">{inc.address || 'Address logged'}</span>
                        <Link
                          to={`/track/${encodeURIComponent(inc.reference_number || inc.id)}`}
                          className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 shrink-0"
                        >
                          <span>Track</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
