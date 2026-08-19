import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Header from '../../src/components/common/Header';
import DataTable from '../../src/components/common/DataTable';
import { StatusBadge, SeverityBadge } from '../../src/components/common/StatusBadge';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';
import ActionMenu from '../../src/components/common/ActionMenu';

export default function VerificationScreen() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/incidents?status=submitted');
      const list = res.data?.data || res.data || [];
      setIncidents(list);
    } catch (e) {
      setIncidents([
        { id: '1', reference_number: 'INC-2026-00001', title: 'Water pipe burst', severity: 'high', status: 'submitted' },
        { id: '2', reference_number: 'INC-2026-00002', title: 'Power transformer spark', severity: 'critical', status: 'submitted' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/incidents/${id}/verify`, {
        reason: 'Verified by admin on mobile dispatch.',
      });
      Alert.alert('Verified', `Incident #${id} has been verified.`);
      fetchQueue();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Verification failed.');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/admin/incidents/${id}/reject`, {
        reason: 'Rejected by admin on mobile dispatch.',
      });
      Alert.alert('Rejected', `Incident #${id} marked invalid.`);
      fetchQueue();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Rejection failed.');
    }
  };

  const columns = [
    { header: 'Ref #', key: 'reference_number', width: 130 },
    { header: 'Title', key: 'title', width: 150 },
    { header: 'Severity', key: 'severity', width: 90, render: (r) => <SeverityBadge severity={r.severity} /> },
    { header: 'Status', key: 'status', width: 110, render: (r) => <StatusBadge status={r.status} /> },
    {
      header: 'Actions',
      key: 'actions',
      width: 80,
      render: (r) => (
        <ActionMenu
          items={[
            {
              label: 'Verify Incident',
              icon: CheckCircle2,
              onPress: () => handleVerify(r.id),
            },
            {
              label: 'Reject Incident',
              icon: XCircle,
              danger: true,
              onPress: () => handleReject(r.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <View style={styles.flex}>
      <Header title="Verification & Unit Dispatch" />

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.brand} style={{ marginTop: 20 }} />
        ) : (
          <DataTable
            title="Incident Verification Queue"
            description="Review citizen reports and assign response teams"
            columns={columns}
            data={incidents}
            selectable
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
});
