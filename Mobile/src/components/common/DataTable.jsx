import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, CheckSquare, Square, Inbox } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export default function DataTable({
  title,
  description,
  columns = [],
  data = [],
  keyField = 'id',
  pageSize = 6,
  selectable = true,
  onSelectionChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('none');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleHeaderClick = (col) => {
    if (col.sortable === false || col.key === 'actions') return;

    if (sortColumn !== col.key) {
      setSortColumn(col.key);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortColumn(null);
      setSortDirection('none');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || sortDirection === 'none') return data;
    return [...data].sort((a, b) => {
      let valA = a[sortColumn] || '';
      let valB = b[sortColumn] || '';
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    const currentIds = paginatedData.map((r) => r[keyField]);
    const allSelected = currentIds.every((id) => selectedIds.has(id));
    const next = new Set(selectedIds);
    if (allSelected) {
      currentIds.forEach((id) => next.delete(id));
    } else {
      currentIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
    if (onSelectionChange) onSelectionChange(Array.from(next));
  };

  const toggleSelectRow = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
    if (onSelectionChange) onSelectionChange(Array.from(next));
  };

  return (
    <View style={styles.container}>
      {(title || description) && (
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}

      {selectable && selectedIds.size > 0 && (
        <View style={styles.bulkBanner}>
          <Text style={styles.bulkText}>{selectedIds.size} row(s) selected</Text>
          <TouchableOpacity onPress={() => setSelectedIds(new Set())}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {selectable && (
              <TouchableOpacity onPress={toggleSelectAll} style={styles.checkboxCol}>
                <CheckSquare size={16} color={colors.brand} />
              </TouchableOpacity>
            )}
            {columns.map((col, idx) => (
              <TouchableOpacity
                key={col.key || idx}
                onPress={() => handleHeaderClick(col)}
                style={[styles.headerCell, { width: col.width || 120 }]}
              >
                <Text style={styles.headerText}>{col.header}</Text>
                {sortColumn === col.key ? (
                  sortDirection === 'asc' ? <ArrowUp size={12} color={colors.brand} /> : <ArrowDown size={12} color={colors.brand} />
                ) : (
                  <ArrowUpDown size={12} color="#94a3b8" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Data Rows */}
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIdx) => {
              const rowKey = row[keyField] ?? rowIdx;
              const isSelected = selectedIds.has(rowKey);
              return (
                <View key={rowKey} style={[styles.dataRow, isSelected && styles.selectedRow]}>
                  {selectable && (
                    <TouchableOpacity onPress={() => toggleSelectRow(rowKey)} style={styles.checkboxCol}>
                      {isSelected ? <CheckSquare size={16} color={colors.brand} /> : <Square size={16} color="#cbd5e1" />}
                    </TouchableOpacity>
                  )}
                  {columns.map((col, colIdx) => (
                    <View key={col.key || colIdx} style={[styles.dataCell, { width: col.width || 120 }]}>
                      {col.render ? col.render(row) : <Text style={styles.cellText}>{String(row[col.key] ?? '')}</Text>}
                    </View>
                  ))}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Inbox size={32} color="#cbd5e1" />
              <Text style={styles.emptyText}>No records found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <View style={styles.paginationRow}>
          <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
          <View style={styles.paginationButtons}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
            >
              <ChevronLeft size={16} color={currentPage === 1 ? '#cbd5e1' : '#0f172a'} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
            >
              <ChevronRight size={16} color={currentPage === totalPages ? '#cbd5e1' : '#0f172a'} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 0,
    marginVertical: 8,
  },
  titleContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  bulkBanner: {
    backgroundColor: '#ccfbf1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bulkText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.brand,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textDecorationLine: 'underline',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  checkboxCol: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedRow: {
    backgroundColor: '#f0fdfa',
  },
  dataCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 12,
    color: '#1e293b',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  paginationText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  paginationButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  pageBtn: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.3,
  },
});
