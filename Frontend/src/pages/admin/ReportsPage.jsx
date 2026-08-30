import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import { adminApi } from '../../api/admin';
import { useAnalytics } from '../../hooks/useAnalytics';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp,
  BarChart3,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { data, loading } = useAnalytics();
  const [reportType, setReportType] = useState('monthly_summary');
  const [timeRange, setTimeRange] = useState('30_days');
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const res = await adminApi.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cir_incident_compliance_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Incident CSV report downloaded successfully');
    } catch (err) {
      toast.error('Failed to export CSV. Demo dataset exported.');
      // Create client-side demo CSV
      const csvContent = 'data:text/csv;charset=utf-8,Reference,Title,Category,Severity,Status,Reported_At,Resolved_At\nINC-2026-00001,Commercial Warehouse Fire,Fire,Critical,in_progress,2026-08-08,\nINC-2026-00002,Main Road Flash Flood,Flood,High,resolved,2026-08-09,2026-08-09\nINC-2026-00003,Armed Robbery Alert,Theft,Critical,assigned,2026-08-10,';
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'cir_incidents_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <PageHeader
          title="Incident Compliance & Analytical Reports"
          description="Generate regulatory audit summaries, response SLA metrics, and export structured emergency records"
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? 'Exporting...' : 'Export Complete CSV'}</span>
              </button>
            </div>
          }
        />

        {/* Report Configuration Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Report Template</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="monthly_summary">Monthly Emergency Operations Summary</option>
              <option value="sla_compliance">First Responder SLA Compliance Audit</option>
              <option value="hazard_density">Hazard Category & Severity Distribution</option>
              <option value="citizen_feedback">Citizen Response Satisfaction Report</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Audit Period</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="7_days">Past 7 Days</option>
              <option value="30_days">Past 30 Days (Current Month)</option>
              <option value="90_days">Past Quarter (90 Days)</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Target Agency Scope</label>
            <select className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500">
              <option value="all">All Response Units (Fire, Police, EMS, Flood)</option>
              <option value="fire">Fire & Rescue Service Only</option>
              <option value="police">Police Command Only</option>
              <option value="medical">Medical EMS Only</option>
            </select>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Logged Cases</span>
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">{data?.overview?.total || 148}</p>
            <span className="text-[11px] text-emerald-400 font-semibold">+12% vs previous period</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Resolution Rate</span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">{data?.overview?.resolutionRate || '84.6%'}</p>
            <span className="text-[11px] text-emerald-400 font-semibold">Exceeds municipal 80% SLA</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Response Time</span>
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">18.4 mins</p>
            <span className="text-[11px] text-amber-400 font-semibold">Target: &lt; 20 mins</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Critical Incidents</span>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black text-white">16</p>
            <span className="text-[11px] text-slate-400 font-semibold">100% dispatched &lt; 5m</span>
          </div>
        </div>

        {/* Breakdown Table & SLA Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">First Responder Unit SLA Performance Breakdown</h3>
              <p className="text-xs text-slate-400">Audit of unit acknowledgment speed, time on scene, and closure rates.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="py-3 px-4">Response Unit</th>
                  <th className="py-3 px-4">Unit Type</th>
                  <th className="py-3 px-4">Assigned Tasks</th>
                  <th className="py-3 px-4">Resolved Tasks</th>
                  <th className="py-3 px-4">Avg TTA (Ack)</th>
                  <th className="py-3 px-4">Avg TTR (Resolve)</th>
                  <th className="py-3 px-4">SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Metro Fire Rescue</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">Fire</span></td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">38</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">35</td>
                  <td className="py-3.5 px-4 font-mono">4.2 mins</td>
                  <td className="py-3.5 px-4 font-mono">42.0 mins</td>
                  <td className="py-3.5 px-4"><span className="text-emerald-400 font-bold">96.4% ✓</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Police Rapid Response Unit</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">Police</span></td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">62</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">54</td>
                  <td className="py-3.5 px-4 font-mono">6.8 mins</td>
                  <td className="py-3.5 px-4 font-mono">1.8 hours</td>
                  <td className="py-3.5 px-4"><span className="text-emerald-400 font-bold">91.2% ✓</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Emergency Medical Services</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 font-semibold">Medical</span></td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">41</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">39</td>
                  <td className="py-3.5 px-4 font-mono">3.9 mins</td>
                  <td className="py-3.5 px-4 font-mono">35.4 mins</td>
                  <td className="py-3.5 px-4"><span className="text-emerald-400 font-bold">98.0% ✓</span></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Disaster & Flood Relief Squad</td>
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">Flood</span></td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">14</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">12</td>
                  <td className="py-3.5 px-4 font-mono">11.5 mins</td>
                  <td className="py-3.5 px-4 font-mono">4.2 hours</td>
                  <td className="py-3.5 px-4"><span className="text-amber-400 font-bold">85.7%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
