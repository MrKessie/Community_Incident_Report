import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import Header from '../../src/components/common/Header';
import DataTable from '../../src/components/common/DataTable';
import IncidentCard from '../../src/components/incidents/IncidentCard';
import { StatusBadge, SeverityBadge } from '../../src/components/common/StatusBadge';
import { formatDate } from '../../src/utils/formatters';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';
import ActionMenu from '../../src/components/common/ActionMenu';
import { Eye, FileText } from 'lucide-react-native';

export default function MyIncidentsScreen() {
  const [incidents, setIncidents] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/incidents');
      if (res.data?.data) {
        setIncidents(res.data.data);
      }
    } catch (e) {
      setIncidents([
        {
          id: '1',
          reference_number: 'INC-2026-00001',
          title: 'Major water main leak on 5th Avenue',
          description: 'High pressure water gushing onto the main road near community center.',
          severity: 'high',
          status: 'in_progress',
          created_at: new Date().toISOString(),
          category: { name: 'Flood & Water' },
        },
        {
          id: '2',
          reference_number: 'INC-2026-00002',
          title: 'Power transformer spark',
          description: 'Transformer unit sparking on utility pole block 4.',
          severity: 'critical',
          status: 'assigned',
          created_at: new Date().toISOString(),
          category: { name: 'Infrastructure' },
        },
      ]);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIncidents();
    setRefreshing(false);
  };

  const columns = [
    { header: 'Ref #', key: 'reference_number', width: 130 },
    { header: 'Title', key: 'title', width: 160 },
    {
      header: 'Severity',
      key: 'severity',
      width: 100,
      render: (row) => <SeverityBadge severity={row.severity} />,
    },
    {
      header: 'Status',
      key: 'status',
      width: 120,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Date',
      key: 'created_at',
      width: 110,
      render: (row) => <Text style={{ fontSize: 11, color: '#64748b' }}>{formatDate(row.created_at)}</Text>,
    },
    {
      header: 'Actions',
      key: 'actions',
      width: 80,
      render: (row) => (
        <ActionMenu
          items={[
            {
              label: 'View Incident Details',
              icon: Eye,
              to: `/(reporter)/incidents/${row.id}`,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <View style={styles.flex}>
      <Header title="My Incident Reports" />

      {/* View Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setViewMode('cards')}
          style={[styles.toggleBtn, viewMode === 'cards' && styles.toggleActive]}
        >
          <Text style={[styles.toggleText, viewMode === 'cards' && styles.toggleTextActive]}>Cards View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setViewMode('table')}
          style={[styles.toggleBtn, viewMode === 'table' && styles.toggleActive]}
        >
          <Text style={[styles.toggleText, viewMode === 'table' && styles.toggleTextActive]}>Data Table View</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.brand]} />}
      >
        {viewMode === 'table' ? (
          <DataTable
            title="Citizen Reported Incidents"
            description="Detailed incident tracking database table"
            columns={columns}
            data={incidents}
            selectable
          />
        ) : (
          incidents.map((item) => (
            <IncidentCard key={item.id} incident={item} linkPrefix="/(reporter)" />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 0,
  },
  toggleActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  scroll: { padding: 14, paddingBottom: 40 },
});
