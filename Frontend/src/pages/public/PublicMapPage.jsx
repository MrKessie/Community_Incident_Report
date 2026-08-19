import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import IncidentMapView from '../../components/map/IncidentMapView';
import { mapApi } from '../../api/map';
import { demoIncidents } from '../../utils/demoData';

export default function PublicMapPage() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await mapApi.getPublicMapIncidents();
        setIncidents(res.data || []);
      } catch (err) {
        setIncidents(demoIncidents);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between font-sans transition-colors">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Public Incident Heatmap & Live Map</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time active community emergency reports and verified response dispatches. Reporter identity is strictly hidden.
              </p>
            </div>
          </div>

          <IncidentMapView incidents={incidents} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
