import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Activity, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Car, 
  Droplets, 
  HeartPulse, 
  Building2,
  Search,
  PhoneCall,
  Radio,
  FileText,
  Clock
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/common/Footer';
import AnnouncementBanner from '../../components/common/AnnouncementBanner';

export default function LandingPage() {
  const navigate = useNavigate();
  const [trackRef, setTrackRef] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackRef.trim()) {
      navigate(`/track/${encodeURIComponent(trackRef.trim())}`);
    }
  };

  const stats = [
    { label: 'Total Incidents Logged', value: '1,420+', icon: Shield, color: 'text-indigo-400' },
    { label: 'Verified & Resolved', value: '1,280+', icon: CheckCircle, color: 'text-emerald-400' },
    { label: 'Active Response Units', value: '4 Specialized Teams', icon: Activity, color: 'text-amber-400' },
    { label: 'Avg Emergency Dispatch', value: '< 4.5 Mins', icon: Clock, color: 'text-rose-400' },
  ];

  const categories = [
    { name: 'Fire / Explosion', icon: Flame, color: 'text-rose-500', count: '120+ cases' },
    { name: 'Theft / Robbery', icon: ShieldAlert, color: 'text-orange-500', count: '310+ cases' },
    { name: 'Road Accidents', icon: Car, color: 'text-amber-500', count: '450+ cases' },
    { name: 'Flood & Water', icon: Droplets, color: 'text-blue-500', count: '85+ cases' },
    { name: 'Medical Emergency', icon: HeartPulse, color: 'text-pink-500', count: '290+ cases' },
    { name: 'Infrastructure Damage', icon: Building2, color: 'text-purple-500', count: '140+ cases' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Navbar />
        <AnnouncementBanner />

        {/* Emergency Speed Dial Strip */}
        <div className="bg-rose-950/40 border-b border-rose-500/20 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              Immediate Life-Threatening Emergency?
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <a href="tel:911" className="font-mono font-bold text-white bg-rose-600/60 hover:bg-rose-600 px-2.5 py-0.5 rounded-lg transition">
              Dial 911 (Police / Fire / EMS)
            </a>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <Link to="/emergency-contacts" className="text-rose-300 hover:text-white underline font-semibold">
              View Emergency Hotline Directory & Guidelines →
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3 animate-ping text-indigo-400" />
              <span>Real-Time Municipal Dispatch Network Active</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Report Community Hazards.{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
                Mobilize Responders.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering citizens to report emergency hazards, coordinate with first responders in real time, and monitor verification and resolution workflows.
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/incidents/new"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
              >
                <span>Report an Incident</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/map"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-sm rounded-2xl transition flex items-center justify-center space-x-2 shadow-lg"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Live Hazard Radar Map</span>
              </Link>
            </div>

            {/* Hero Quick Incident Lookup Bar */}
            <div className="pt-8 max-w-md mx-auto">
              <form onSubmit={handleTrackSubmit} className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-2xl backdrop-blur">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Track Report (e.g. INC-2026-00001)"
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold transition cursor-pointer"
                >
                  Track
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Stats Counters */}
        <section className="border-y border-slate-800/80 bg-slate-900/60 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-4 space-y-2">
                  <Icon className={`w-8 h-8 ${s.color} mx-auto`} />
                  <h3 className="text-3xl font-black text-white">{s.value}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-white">How CIR System 3 Works</h2>
            <p className="text-xs text-slate-400">Three streamlined steps to mobilize emergency first responders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 text-center hover:border-indigo-500 transition shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl font-black mx-auto">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Submit Incident Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide incident details, attach evidence photos, and pinpoint GPS coordinates. Anonymous reporting is fully supported.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 text-center hover:border-indigo-500 transition shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl font-black mx-auto">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Verification & Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emergency dispatchers verify incoming tickets and route specialized units (Fire Rescue, Police Command, EMS Trauma) to the scene.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4 text-center hover:border-indigo-500 transition shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl font-black mx-auto">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Real-Time Tracking & Proof</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Follow live response milestones, read public field updates, view verified resolution proof, and rate emergency service quality.
              </p>
            </div>
          </div>
        </section>

        {/* Taxonomy Categories Section */}
        <section className="py-16 bg-slate-900/40 border-t border-slate-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Incident Taxonomy & Routing</h2>
            <p className="text-xs text-slate-400">Classifications for fast routing to specialized emergency crews</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-3 hover:border-slate-700 transition shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto">
                    <Icon className={`w-6 h-6 ${c.color}`} />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                  <span className="text-[10px] text-slate-400 block font-mono">{c.count}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
