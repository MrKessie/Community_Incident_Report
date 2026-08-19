import React from 'react';
import Select from 'react-select';
import { useUIStore } from '../../store/uiStore';

export default function CustomReactSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  isSearchable = false,
  isDisabled = false,
  className = '',
  size = 'md',
  ...props
}) {
  const currentTheme = useUIStore((state) => state.theme);
  const isDark = currentTheme === 'dark';

  // Map value string/number to matching option object
  const selectedOption =
    options.find((opt) => String(opt.value) === String(value)) ||
    (value && typeof value === 'object' ? value : null);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: state.isFocused
        ? '#3b82f6'
        : isDark
        ? '#334155'
        : '#cbd5e1',
      borderRadius: '0px',
      minHeight: size === 'sm' ? '32px' : '38px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: '600',
      color: isDark ? '#f8fafc' : '#0f172a',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: '0px',
      borderWidth: '1px',
      boxShadow: isDark
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
        ? isDark
          ? '#1e293b'
          : '#f1f5f9'
        : 'transparent',
      color: state.isSelected
        ? '#ffffff'
        : isDark
        ? '#e2e8f0'
        : '#0f172a',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: '600',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#2563eb',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? '#e2e8f0' : '#0f172a',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontWeight: '600',
    }),
    input: (base) => ({
      ...base,
      color: isDark ? '#e2e8f0' : '#0f172a',
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? '#94a3b8' : '#64748b',
      fontSize: size === 'sm' ? '11px' : '12px',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: isDark ? '#94a3b8' : '#64748b',
      padding: '4px',
      '&:hover': {
        color: isDark ? '#f8fafc' : '#0f172a',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),
  };

  return (
    <div className={`custom-react-select-wrapper ${className}`}>
      <Select
        options={options}
        value={selectedOption}
        onChange={(selected) => onChange(selected ? selected.value : '')}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        styles={customStyles}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        menuPosition="fixed"
        menuPlacement="auto"
        {...props}
      />
    </div>
  );
}
