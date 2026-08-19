import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Inbox, ArrowUp, ArrowDown, ArrowUpDown, Download, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const getSortableValue = (row, key) => {
  if (!row || !key) return '';
  if (key.includes('.')) {
    return key.split('.').reduce((obj, k) => (obj || {})[k], row) || '';
  }
  return row[key] ?? '';
};

export default function DataTable({
  title,
  description,
  columns = [],
  data = [],
  keyField = 'id',
  emptyMessage = 'No records found',
  pageSize = 10,
  pagination = true,
  selectable = true,
  bulkActions = [],
  onSelectionChange,
  className = '',
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('none');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const headerCheckboxRef = useRef(null);

  const handleHeaderClick = (col) => {
    if (col.sortable === false || col.key === 'actions' || col.key === '_select') return;

    if (sortColumn !== col.key) {
      setSortColumn(col.key);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortColumn(null);
      setSortDirection('none');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || sortDirection === 'none') return data;

    return [...data].sort((a, b) => {
      let valA = getSortableValue(a, sortColumn);
      let valB = getSortableValue(b, sortColumn);

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedData = pagination
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData;

  const currentIds = useMemo(() => paginatedData.map((r) => r[keyField]), [paginatedData, keyField]);
  const isAllCurrentSelected = currentIds.length > 0 && currentIds.every((id) => selectedIds.has(id));
  const isSomeCurrentSelected = currentIds.some((id) => selectedIds.has(id)) && !isAllCurrentSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeCurrentSelected;
    }
  }, [isSomeCurrentSelected]);

  const notifySelectionChange = (set) => {
    if (onSelectionChange) {
      const selectedObjects = data.filter((r) => set.has(r[keyField]));
      onSelectionChange(Array.from(set), selectedObjects);
    }
  };

  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllCurrentSelected) {
      currentIds.forEach((id) => next.delete(id));
    } else {
      currentIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
    notifySelectionChange(next);
  };

  const toggleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
    notifySelectionChange(next);
  };

  const clearSelection = () => {
    const next = new Set();
    setSelectedIds(next);
    notifySelectionChange(next);
  };

  const getSelectedObjects = () => {
    return data.filter((r) => selectedIds.has(r[keyField]));
  };

  const handleDefaultExportCSV = () => {
    const selectedList = getSelectedObjects();
    if (selectedList.length === 0) return;

    const exportCols = columns.filter((c) => c.key !== 'actions' && c.header);
    const headers = exportCols.map((c) => c.header);
    const keys = exportCols.map((c) => c.key);

    const csvRows = [
      headers.join(','),
      ...selectedList.map((row) =>
        keys
          .map((k) => {
            let val = getSortableValue(row, k);
            if (typeof val === 'object') val = JSON.stringify(val);
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `table_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${selectedList.length} row(s) to CSV`);
  };

  const handlePrevPage = () => {
    if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1);
  };

  const handleNextPage = () => {
    if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1);
  };

  const selectedCount = selectedIds.size;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none shadow-sm flex flex-col justify-between ${className}`}>
      
      {/* Table Title Header Bar */}
      {(title || description) && (
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-950/50">
          <div>
            {title && <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">{title}</h3>}
            {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
          </div>
        </div>
      )}

      {/* Floating / Sticky Bulk Action Header Banner */}
      {selectable && selectedCount > 0 && (
        <div className="bg-brand/10 dark:bg-brand/20 border-b border-brand/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-extrabold text-brand dark:text-brand-soft flex items-center space-x-1.5">
              <CheckSquare className="w-4 h-4" />
              <span>{selectedCount} row{selectedCount > 1 ? 's' : ''} selected</span>
            </span>
            <button
              onClick={clearSelection}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline font-medium cursor-pointer"
            >
              Clear selection
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {bulkActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => action.onClick(Array.from(selectedIds), getSelectedObjects(), clearSelection)}
                  className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-none shadow-sm transition cursor-pointer ${
                    action.danger
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-brand hover:bg-brand-soft text-white'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-white" />}
                  <span>{action.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleDefaultExportCSV}
              className="inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-none bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white shadow-sm transition cursor-pointer"
              title="Export selected rows as CSV"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
            <tr>
              {selectable && (
                <th className="p-3 w-10 text-center select-none">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    checked={isAllCurrentSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-brand rounded-none border-slate-300 dark:border-slate-700 focus:ring-brand accent-brand cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col, idx) => {
                const isSortable = col.sortable !== false && col.key !== 'actions';
                return (
                  <th
                    key={col.key || idx}
                    onClick={() => handleHeaderClick(col)}
                    className={`p-3 font-bold select-none ${
                      isSortable ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors' : ''
                    } ${col.className || ''}`}
                  >
                    <div className="flex items-center space-x-1.5 justify-between">
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="shrink-0 inline-flex items-center">
                          {sortColumn === col.key && sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-brand dark:text-brand-soft font-bold" />
                          ) : sortColumn === col.key && sortDirection === 'desc' ? (
                            <ArrowDown className="w-3.5 h-3.5 text-brand dark:text-brand-soft font-bold" />
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => {
                const rowKey = row[keyField] ?? rowIdx;
                const isSelected = selectedIds.has(rowKey);
                return (
                  <tr
                    key={rowKey}
                    className={`transition-colors ${
                      isSelected
                        ? 'bg-teal-50/70 dark:bg-teal-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {selectable && (
                      <td className="p-3 w-10 text-center select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(rowKey)}
                          className="w-4 h-4 text-brand rounded-none border-slate-300 dark:border-slate-700 focus:ring-brand accent-brand cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col, colIdx) => (
                      <td key={col.key || colIdx} className={`p-3 ${col.className || ''}`}>
                        {col.render ? col.render(row, rowIdx) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={(columns.length || 1) + (selectable ? 1 : 0)}
                  className="py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Inbox className="w-8 h-8 opacity-40" />
                    <p className="text-xs font-semibold">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {Math.min(startIndex + pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-900 dark:text-white">{sortedData.length}</span> results
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevPage}
              disabled={safeCurrentPage === 1}
              className="p-1.5 rounded-none border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-slate-700 dark:text-slate-300">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={safeCurrentPage === totalPages}
              className="p-1.5 rounded-none border border-slate-300 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
