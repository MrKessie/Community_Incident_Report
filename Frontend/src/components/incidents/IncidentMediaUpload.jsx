import React, { useState } from 'react';
import FileUpload from '../common/FileUpload';
import { UploadCloud } from 'lucide-react';

export default function IncidentMediaUpload({ onUpload }) {
  const [files, setFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0) {
      onUpload(files);
      setFiles([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileUpload files={files} setFiles={setFiles} />
      {files.length > 0 && (
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center space-x-2 bg-brand hover:bg-brand-soft text-white text-xs font-semibold py-2.5 rounded-xl shadow-md transition"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload {files.length} Selected File(s)</span>
        </button>
      )}
    </form>
  );
}
