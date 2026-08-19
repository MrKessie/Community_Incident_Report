import React from 'react';
import { X } from 'lucide-react';

export default function ImageViewer({ src, alt, isOpen, onClose }) {
  if (!isOpen || !src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-slate-300 p-2 rounded-full bg-slate-900/60"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={src}
        alt={alt || 'Evidence photo'}
        className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl border border-slate-700"
      />
    </div>
  );
}
