import React, { useState } from 'react';
import CustomReactSelect from '../../components/common/CustomReactSelect';

const severityOptions = [
  { value: 'low', label: 'Low - Minor issue' },
  { value: 'medium', label: 'Medium - Moderate concern' },
  { value: 'high', label: 'High - Urgent response needed' },
  { value: 'critical', label: 'Critical - Life safety emergency' },
];
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import IncidentMap from '../../components/maps/IncidentMap';
import { useIncidentStore } from '../../store/useIncidentStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, MapPin, Upload, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(15, 'Description must be at least 15 characters'),
  category_id: z.string().min(1, 'Please select an incident category'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  incident_date: z.string().min(1, 'Please select incident date & time'),
  address: z.string().optional(),
  is_anonymous: z.boolean().default(false),
});

export default function ReportIncidentPage() {
  const { categories, createIncident } = useIncidentStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState({ lat: 40.7128, lng: -74.0060 });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      severity: 'medium',
      incident_date: new Date().toISOString().slice(0, 16),
      is_anonymous: false,
    },
  });

  const isAnonymous = watch('is_anonymous');

  const handleLocationSelect = (lat, lng) => {
    setSelectedLocation({ lat, lng });
    toast.success(`Location set to Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArr]);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);
      formData.append('severity', data.severity);
      formData.append('incident_date', data.incident_date);
      formData.append('address', data.address || '');
      formData.append('is_anonymous', data.is_anonymous ? '1' : '0');
      formData.append('latitude', selectedLocation.lat);
      formData.append('longitude', selectedLocation.lng);

      selectedFiles.forEach((file) => {
        formData.append('files[]', file);
      });

      const newInc = await createIncident(formData);
      toast.success(`Incident reported successfully! Reference: ${newInc.reference_number || 'Submitted'}`);
      if (newInc?.id) {
        navigate(`/incidents/${newInc.id}`);
      } else {
        navigate('/incidents');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit incident report. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            Official Emergency Report Portal
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Report a Community Incident</h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Provide accurate details, select location on the interactive map, and attach photos to dispatch response teams quickly.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Main Info Card */}
          <div className="p-6 rounded-none bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rose-400 border-b border-slate-800 pb-3">
              1. Incident Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Incident Title *</label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g., Commercial Warehouse Fire on 5th Avenue"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
                {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category *</label>
                <CustomReactSelect
                  options={[
                    { value: '', label: '-- Select Category --' },
                    ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
                  ]}
                  value={watch('category_id')}
                  onChange={(val) => setValue('category_id', val, { shouldValidate: true })}
                  placeholder="-- Select Category --"
                />
                {errors.category_id && <p className="text-xs text-rose-400">{errors.category_id.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Severity Level *</label>
                <CustomReactSelect
                  options={severityOptions}
                  value={watch('severity')}
                  onChange={(val) => setValue('severity', val, { shouldValidate: true })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Incident Date & Time *</label>
                <input
                  type="datetime-local"
                  {...register('incident_date')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
                {errors.incident_date && <p className="text-xs text-rose-400">{errors.incident_date.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Street Address / Landmark</label>
                <input
                  type="text"
                  {...register('address')}
                  placeholder="e.g., Near 542 5th Avenue, Metro District"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Detailed Description *</label>
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Provide comprehensive details about what happened, immediate hazards, vehicle descriptions, or individuals involved..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 leading-relaxed"
                />
                {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Interactive Map Location Card */}
          <div className="p-6 rounded-none bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-emerald-400 border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>2. Geotag Location Pin</span>
              <span className="text-xs font-normal text-slate-400">Click on map to position pin</span>
            </h3>

            <IncidentMap
              interactivePicker={true}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              height="350px"
            />
          </div>

          {/* Media Attachments & Anonymous Options */}
          <div className="p-6 rounded-none bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3">
              3. Evidence Photos & Privacy
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Upload Media Evidence (Photos / Video / Files)</label>
              <div className="border-2 border-dashed border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/60">
                <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-rose-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-300">Click to select files or drag & drop</p>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, MP4, PDF up to 10MB per file</p>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-2">
                      <span>{file.name}</span>
                      <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-rose-400 hover:text-rose-300">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Anonymous Reporter Toggle */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserX className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Report Anonymously</h4>
                  <p className="text-[11px] text-slate-400">Hide your user identity from public view and dispatch logs.</p>
                </div>
              </div>
              <input
                type="checkbox"
                {...register('is_anonymous')}
                className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-rose-600 focus:ring-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isSubmitting ? 'Submitting Official Report...' : 'Submit Emergency Incident Report'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
