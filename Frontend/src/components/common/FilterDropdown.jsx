import React from 'react';
import { Filter } from 'lucide-react';
import CustomReactSelect from './CustomReactSelect';

export default function FilterDropdown({ label, value, options = [], onChange }) {
  const formattedOptions = [
    { value: '', label: label || 'All Options' },
    ...options.map((opt) => ({
      value: opt.id !== undefined ? String(opt.id) : (opt.value !== undefined ? String(opt.value) : String(opt)),
      label: opt.name || opt.label || String(opt),
    })),
  ];

  return (
    <div className="flex items-center space-x-2 min-w-[160px]">
      <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <div className="flex-1">
        <CustomReactSelect
          options={formattedOptions}
          value={value}
          onChange={onChange}
          placeholder={label}
          size="sm"
        />
      </div>
    </div>
  );
}
