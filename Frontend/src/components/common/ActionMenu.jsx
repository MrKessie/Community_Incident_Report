import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

export default function ActionMenu({ items = [], align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
        title="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1`}
        >
          {items.map((item, idx) => {
            const baseClass = `w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center space-x-2.5 transition ${
              item.danger
                ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`;

            if (item.to) {
              return (
                <Link
                  key={idx}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={baseClass}
                >
                  {item.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                }}
                className={baseClass}
              >
                {item.icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
