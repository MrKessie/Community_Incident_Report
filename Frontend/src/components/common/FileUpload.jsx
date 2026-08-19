import React, { useState } from 'react';
import { UploadCloud, X, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatFileSize } from '../../utils/formatters';

export default function FileUpload({ files, setFiles, maxFiles = 10 }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles) => {
    const validFiles = [];
    Array.from(newFiles).forEach((file) => {
      if (files.length + validFiles.length >= maxFiles) {
        toast.error(`Maximum limit of ${maxFiles} files reached.`);
        return;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (file.type.startsWith('image/') && sizeMB > 5) {
        toast.error(`Image ${file.name} exceeds max size of 5MB.`);
      } else if (file.type.startsWith('video/') && sizeMB > 50) {
        toast.error(`Video ${file.name} exceeds max size of 50MB.`);
      } else if (sizeMB > 10) {
        toast.error(`Document ${file.name} exceeds max size of 10MB.`);
      } else {
        validFiles.push(file);
      }
    });

    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/50'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input" className="cursor-pointer block space-y-2">
          <UploadCloud className="w-10 h-10 text-blue-500 mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Drag & drop site photos, video, or documents here
          </p>
          <p className="text-[11px] text-slate-500">
            Supports JPG, PNG, WEBP (max 5MB), MP4 (max 50MB), PDF/DOC (max 10MB)
          </p>
        </label>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="relative group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-center space-x-2 shadow-sm"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                <p className="text-[10px] text-slate-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-rose-500 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
