import React, { useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import IncidentForm from '../../components/incidents/IncidentForm';
import { incidentsApi } from '../../api/incidents';

export default function AnonymousReportPage() {
  const [submittedRef, setSubmittedRef] = useState(null);

  const handleSubmit = async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      if (key === 'files') {
        payload.files.forEach((file) => formData.append('files[]', file));
      } else if (key === 'is_anonymous') {
        formData.append('is_anonymous', '1');
      } else {
        formData.append(key, payload[key]);
      }
    });

    try {
      const res = await incidentsApi.createAnonymousIncident(formData);
      setSubmittedRef(res.data?.incident?.reference_number || res.data?.reference_number || 'INC-2026-00999');
      toast.success('Anonymous report submitted successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit anonymous report. Please try again.';
      toast.error(errMsg);
    }
  };

  const copyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      toast.success('Reference number copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between font-sans transition-colors">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full">
              Protected Public Portal
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Anonymous Incident Submission</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No account or login required. Your submission is encrypted and forwarded to emergency authorities without personal identifying data.
            </p>
          </div>

          {submittedRef ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-xl mx-auto text-center space-y-5 animate-in fade-in shadow-md">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Report Successfully Submitted</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please save your unique reference number below to check progress timeline:
              </p>
              <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono text-lg font-black text-blue-600 dark:text-blue-400">
                <span>{submittedRef}</span>
                <button onClick={copyRef} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setSubmittedRef(null)}
                className="w-full py-3 bg-brand hover:bg-brand-soft text-white font-bold text-xs rounded-xl"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <IncidentForm onSubmit={handleSubmit} isAnonymousMode={true} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
