import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, MapPin, CheckCircle, Activity, ArrowRight, Flame, ShieldAlert, Car, Droplets, HeartPulse, Building2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import AnnouncementBanner from '../../components/common/AnnouncementBanner';

export default function LandingPage() {
  const stats = [
    { label: 'Total Incidents Reported', value: '1,420+', icon: Shield },
    { label: 'Incidents Resolved', value: '1,280+', icon: CheckCircle },
    { label: 'Response Units Active', value: '4 Teams', icon: Activity },
    { label: 'Categories Covered', value: '11 Types', icon: AlertTriangle },
  ];

  const categories = [
    { name: 'Fire / Explosion', icon: Flame, count: '120+ cases' },
    { name: 'Theft / Robbery', icon: ShieldAlert, count: '310+ cases' },
    { name: 'Road Accidents', icon: Car, count: '450+ cases' },
    { name: 'Flood & Water', icon: Droplets, count: '85+ cases' },
    { name: 'Medical Emergency', icon: HeartPulse, count: '290+ cases' },
    { name: 'Infrastructure Damage', icon: Building2, count: '140+ cases' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans flex flex-col justify-between transition-colors">
      <div>
        <Navbar />
        <AnnouncementBanner />

        {/* Hero Section */}
        <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand/10 blur-[130px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/60 text-brand dark:text-brand-soft text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>24/7 Community Dispatch Active</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Report Incidents.{' '}
              <span className="text-brand dark:text-brand-soft">
                Protect Your Community.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering citizens to report hazards, track authority dispatches in real time, and ensure swift emergency responses across every neighborhood.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/incidents/new"
                className="w-full sm:w-auto px-8 py-4 bg-brand hover:bg-brand-soft text-white font-extrabold text-sm rounded-2xl shadow-xl transition flex items-center justify-center space-x-2"
              >
                <span>Report an Incident</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/map"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm rounded-2xl transition flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>View Live Incident Map</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Counters */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="p-4 space-y-2">
                  <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto" />
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</h3>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works (3 Steps) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How CIRS Works</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Three simple steps to mobilize community emergency dispatchers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 text-center hover:border-blue-500 transition shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report an Incident</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit details, photos, and drop a location pin on the map. Anonymous reporting is fully supported.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 text-center hover:border-blue-500 transition shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Authorities are Notified</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Administrators review and verify reports immediately, dispatching specialized response teams (Fire, Police, EMS).
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 text-center hover:border-blue-500 transition shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold mx-auto">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Track Your Incident</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive live status updates on your progress timeline from dispatch to resolution.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-900 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Incident Taxonomy</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Classifications for fast routing to specialized units</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-4 text-center space-y-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-icon-bg flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6 text-brand" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.name}</h4>
                  <span className="text-[10px] text-slate-500 block font-mono">{c.count}</span>
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
