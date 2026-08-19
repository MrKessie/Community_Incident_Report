import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, MapPin, AlertTriangle, FileText, CheckCircle, ArrowLeft, ArrowRight, Flame, ShieldAlert, Car, Droplets, HeartPulse, Building2, Biohazard } from 'lucide-react';
import toast from 'react-hot-toast';
import { reportIncidentSchema } from '../../utils/validators';
import FileUpload from '../common/FileUpload';
import IncidentMap from './IncidentMap';

export default function IncidentForm({ onSubmit, isAnonymousMode = false, initialData = null, isEditMode = false, onCancel = null }) {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [position, setPosition] = useState({
    lat: initialData?.latitude ? parseFloat(initialData.latitude) : 5.6037,
    lng: initialData?.longitude ? parseFloat(initialData.longitude) : -0.1870,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportIncidentSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category_id: String(initialData?.category_id || '1'),
      severity: initialData?.severity || 'medium',
      incident_date: initialData?.incident_date ? initialData.incident_date.slice(0, 16) : new Date().toISOString().slice(0, 16),
      address: initialData?.address || 'Central District, Community Sector 4',
      is_anonymous: initialData ? !!initialData.is_anonymous : isAnonymousMode,
    },
  });

  const formData = watch();

  const categories = [
    { id: '1', name: 'Fire / Explosion', icon: Flame },
    { id: '2', name: 'Theft / Robbery', icon: ShieldAlert },
    { id: '3', name: 'Road Accident', icon: Car },
    { id: '4', name: 'Flood / Water Damage', icon: Droplets },
    { id: '5', name: 'Medical Emergency', icon: HeartPulse },
    { id: '6', name: 'Violence / Assault', icon: AlertTriangle },
    { id: '7', name: 'Infrastructure Damage', icon: Building2 },
    { id: '8', name: 'Environmental Hazard', icon: Biohazard },
  ];

  const handleLocationSelect = (lat, lng, address) => {
    setPosition({ lat, lng });
    if (address) setValue('address', address);
  };

  const handleNextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['title', 'category_id', 'description', 'incident_date'];
    if (step === 2) fieldsToValidate = ['address'];
    if (step === 3) fieldsToValidate = ['severity'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    } else {
      const firstErrKey = Object.keys(errors)[0];
      const errMsg = errors[firstErrKey]?.message || 'Please fill in all required fields properly.';
      toast.error(errMsg);
    }
  };

  const handleFormError = (formErrors) => {
    const firstErrorKey = Object.keys(formErrors)[0];
    const firstErrorMessage = formErrors[firstErrorKey]?.message || 'Please fix validation errors in the form.';
    toast.error(firstErrorMessage);

    if (['title', 'category_id', 'description', 'incident_date'].includes(firstErrorKey)) {
      setStep(1);
    } else if (['address'].includes(firstErrorKey)) {
      setStep(2);
    } else if (['severity'].includes(firstErrorKey)) {
      setStep(3);
    }
  };

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      is_anonymous: Boolean(data.is_anonymous),
      latitude: position.lat,
      longitude: position.lng,
      files,
    };
    onSubmit(payload);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-8">
      {/* Wizard Progress Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Severity & Media' },
          { num: 4, label: 'Review' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className="flex items-center space-x-2 cursor-pointer text-left focus:outline-none"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs transition ${
                step === s.num
                  ? 'bg-brand text-white shadow-md shadow-teal-700/30'
                  : step > s.num
                  ? 'bg-brand-soft text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span className={`hidden sm:inline text-xs font-semibold ${step === s.num ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span>Step 1: Basic Incident Information</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Major water pipe burst flooding 5th avenue"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Incident Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category_id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue('category_id', cat.id)}
                      className={`p-2.5 rounded-none border text-left transition flex items-center space-x-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-brand bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-soft font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-icon-bg flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-brand" />
                      </div>
                      <span className="text-xs truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Full Description *
              </label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Describe what happened, any injuries, hazards, or immediate dangers..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Incident Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('incident_date')}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>Step 2: Pinpoint Location on Map</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Street Address or Landmark
              </label>
              <input
                type="text"
                {...register('address')}
                placeholder="e.g. Corner of 5th Ave & Market St"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Drop Pin on Map (Click to select coordinates)
              </label>
              <IncidentMap
                position={position}
                onLocationSelect={handleLocationSelect}
                isPicker={true}
                height="320px"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Selected GPS Coordinates: <span className="font-mono font-bold">{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Severity & Media */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Step 3: Severity Level & Evidence Photos</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Emergency Severity Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'low', label: 'Low', desc: 'Minor issue / non-urgent', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200' },
                  { id: 'medium', label: 'Medium', desc: 'Requires attention soon', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200' },
                  { id: 'high', label: 'High', desc: 'Urgent response needed', color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200' },
                  { id: 'critical', label: 'Critical', desc: 'Life / Property threat', color: 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold animate-pulse' },
                ].map((sev) => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setValue('severity', sev.id)}
                    className={`p-3 rounded-none border text-left transition cursor-pointer ${
                      formData.severity === sev.id
                        ? `${sev.color} ring-2 ring-brand font-bold shadow-md`
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm uppercase font-bold">{sev.label}</div>
                    <div className="text-[10px] opacity-80 mt-1">{sev.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Upload Evidence Photos / Videos (Recommended)
              </label>
              <FileUpload files={files} setFiles={setFiles} maxFiles={10} />
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Step 4: Review Report Summary</span>
            </h3>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-500">Title:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formData.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-500">Severity:</span>
                <span className="uppercase font-extrabold text-blue-600">{formData.severity}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-500">Address:</span>
                <span className="text-slate-900 dark:text-white">{formData.address}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-500">Attached Files:</span>
                <span className="text-slate-900 dark:text-white">{files.length} file(s) attached</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-1">Description:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {formData.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-900">
              <input
                type="checkbox"
                id="anonymous-toggle"
                checked={watch('is_anonymous')}
                onChange={(e) => setValue('is_anonymous', e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              <label htmlFor="anonymous-toggle" className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                Submit as Anonymous Report (Hides your identity from public records)
              </label>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : null}

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <span>Cancel</span>
              </button>
            )}
          </div>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white text-xs font-extrabold px-8 py-3 rounded-xl shadow-xl transition cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditMode ? 'Update Incident Report' : 'Submit Official Incident Report'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
