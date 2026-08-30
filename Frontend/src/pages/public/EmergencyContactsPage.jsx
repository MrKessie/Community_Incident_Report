import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/common/Footer';
import { 
  PhoneCall, 
  Flame, 
  ShieldAlert, 
  HeartPulse, 
  Droplets, 
  AlertTriangle, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

const EMERGENCY_HOTLINES = [
  {
    title: 'National Emergency Dispatch',
    number: '911',
    agency: 'Central Emergency Dispatch Service',
    description: 'Immediate dispatch for life-threatening police, fire, and trauma emergencies.',
    color: 'bg-rose-500',
    borderColor: 'border-rose-500/30',
    textColor: 'text-rose-400',
    bgBadge: 'bg-rose-500/10',
    icon: PhoneCall,
  },
  {
    title: 'Metro Fire & Rescue Dept',
    number: '101',
    agency: 'Fire Suppression & HazMat Unit',
    description: 'Active structure fires, chemical spills, vehicle extractions, and rescue.',
    color: 'bg-orange-500',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    bgBadge: 'bg-orange-500/10',
    icon: Flame,
  },
  {
    title: 'Emergency Medical Services (EMS)',
    number: '102',
    agency: 'Paramedic & Trauma Ambulance',
    description: 'Critical injury, cardiac arrest, respiratory distress, and stroke response.',
    color: 'bg-pink-500',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    bgBadge: 'bg-pink-500/10',
    icon: HeartPulse,
  },
  {
    title: 'Police Rapid Response Command',
    number: '100',
    agency: 'City Police Department',
    description: 'Active crimes, armed violence, burglary, and immediate public safety hazards.',
    color: 'bg-blue-500',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    bgBadge: 'bg-blue-500/10',
    icon: ShieldAlert,
  },
  {
    title: 'Flood & Disaster Relief Bureau',
    number: '+1 (800) 555-FLOOD',
    agency: 'National Disaster Management Agency',
    description: 'Severe weather evacuation, rising river levels, storm surges, and shelter operations.',
    color: 'bg-cyan-500',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    bgBadge: 'bg-cyan-500/10',
    icon: Droplets,
  },
  {
    title: 'Toxic Hazards & Poison Center',
    number: '+1 (800) 222-1222',
    agency: 'National Poison Control System',
    description: 'Immediate guidance on chemical exposure, toxic gas leaks, and poisonings.',
    color: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/10',
    icon: LifeBuoy,
  },
];

const SAFETY_GUIDES = [
  {
    category: 'Fire Safety',
    title: 'Structure Fire & Smoke Inhalation Protocol',
    icon: Flame,
    color: 'text-rose-400',
    steps: [
      'Crawl low under smoke towards the nearest unobstructed exit.',
      'Feel closed doors with the back of your hand; do NOT open if the handle is hot.',
      'Once outside, do NOT go back inside for belongings under any circumstances.',
      'Alert neighbors and call 911 immediately once at a safe distance.',
    ],
  },
  {
    category: 'Severe Flooding',
    title: 'Flash Flood & Rising Water Emergency',
    icon: Droplets,
    color: 'text-blue-400',
    steps: [
      'Turn Around, Don’t Drown: Never walk, swim, or drive through flooded roads.',
      'Disconnect electrical appliances and turn off main power if water enters your home safely.',
      'Move to the highest ground or floor immediately. Avoid enclosed attics without roof exits.',
      'Monitor CIR System announcements and local weather broadcast alerts.',
    ],
  },
  {
    category: 'Medical First Aid',
    title: 'Cardiac Arrest & Severe Bleeding First Response',
    icon: HeartPulse,
    color: 'text-pink-400',
    steps: [
      'Call emergency ambulance (911 / 102) immediately and place on speaker.',
      'For severe bleeding, apply firm, direct pressure with a clean cloth without letting go.',
      'If unresponsive and not breathing, begin hands-only CPR (100-120 beats per min to the center of the chest).',
      'Locate nearest Automated External Defibrillator (AED) if in a public facility.',
    ],
  },
  {
    category: 'Public Safety',
    title: 'Active Danger & Physical Violence Security',
    icon: ShieldAlert,
    color: 'text-amber-400',
    steps: [
      'RUN: Evacuate if a safe path exists. Leave your belongings behind.',
      'HIDE: If you cannot run, lock and barricade the door, turn off lights, and silence phones.',
      'FIGHT: As an absolute last resort when your life is in imminent danger, act with aggression.',
      'Provide clear location details and suspect descriptions to law enforcement dispatch.',
    ],
  },
];

export default function EmergencyContactsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredGuides = SAFETY_GUIDES.filter((guide) => {
    const matchesCategory = selectedCategory === 'All' || guide.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !search || 
      guide.title.toLowerCase().includes(search.toLowerCase()) ||
      guide.category.toLowerCase().includes(search.toLowerCase()) ||
      guide.steps.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            <PhoneCall className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            Immediate Public Safety Hotline Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Emergency Hotlines & Safety Protocols
          </h1>
          <p className="text-sm text-slate-400">
            Direct 1-tap connections to certified municipal first responders and essential life-saving emergency survival procedures.
          </p>
        </div>

        {/* Hotlines Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-500" />
              Direct Emergency Speed Dials
            </h2>
            <span className="text-xs text-slate-500">Available 24 Hours / 7 Days</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EMERGENCY_HOTLINES.map((hotline) => {
              const Icon = hotline.icon;
              return (
                <div
                  key={hotline.title}
                  className={`bg-slate-900/80 border ${hotline.borderColor} rounded-3xl p-6 shadow-xl backdrop-blur flex flex-col justify-between space-y-4 hover:border-slate-700 transition`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-2xl ${hotline.bgBadge} ${hotline.textColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {hotline.agency}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">{hotline.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{hotline.description}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${hotline.number.replace(/[^0-9+]/g, '')}`}
                    className={`w-full py-3 px-4 rounded-2xl ${hotline.color} hover:opacity-90 text-white font-mono font-black text-base flex items-center justify-center gap-2 shadow-lg transition duration-200 cursor-pointer`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call {hotline.number}</span>
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Safety Guidelines Section */}
        <section className="space-y-6 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                Disaster & Hazard Safety Guidelines
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Standard operating procedures verified by civil protection services.
              </p>
            </div>

            {/* Filter tags */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Fire', 'Flood', 'Medical', 'Safety'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search emergency guides (e.g. CPR, Evacuation, Flood)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Guides Accordion / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <div
                  key={guide.title}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${guide.color}`} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {guide.category}
                      </span>
                      <h3 className="text-base font-extrabold text-white">{guide.title}</h3>
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-slate-800/80">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom Report CTA */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-black text-white">Witnessing an Active Incident?</h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto">
            Log the location, upload photos, and dispatch municipal services immediately through our secure community portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/incidents/new"
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition"
            >
              Report Incident Now
            </Link>
            <Link
              to="/map"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              View Active Hazard Map
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
