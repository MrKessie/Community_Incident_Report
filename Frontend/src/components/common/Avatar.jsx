import React from 'react';
import { getInitials } from '../../utils/helpers';

export default function Avatar({ name, photo, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
  };

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-slate-700 shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-brand flex items-center justify-center font-bold text-white shadow-sm border border-teal-500/30`}
    >
      {getInitials(name)}
    </div>
  );
}
