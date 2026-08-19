import React from 'react';
import SearchInput from '../common/SearchInput';
import FilterDropdown from '../common/FilterDropdown';
import { INCIDENT_STATUSES, SEVERITY_LEVELS } from '../../utils/constants';

export default function IncidentFilters({ filters, onFilterChange, categories = [] }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
      <SearchInput
        value={filters.search || ''}
        onChange={(val) => onFilterChange({ search: val })}
        placeholder="Search title, reference #..."
      />

      <FilterDropdown
        label="All Statuses"
        value={filters.status || ''}
        options={INCIDENT_STATUSES}
        onChange={(val) => onFilterChange({ status: val })}
      />

      <FilterDropdown
        label="All Severities"
        value={filters.severity || ''}
        options={SEVERITY_LEVELS}
        onChange={(val) => onFilterChange({ severity: val })}
      />

      {categories.length > 0 && (
        <FilterDropdown
          label="All Categories"
          value={filters.category_id || ''}
          options={categories}
          onChange={(val) => onFilterChange({ category_id: val })}
        />
      )}
    </div>
  );
}
