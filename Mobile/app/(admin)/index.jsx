import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import Header from '../../src/components/common/Header';
import StatCard from '../../src/components/common/StatCard';
import IncidentCard from '../../src/components/incidents/IncidentCard';
import { Shield, AlertTriangle, Users, Activity, CheckCircle } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';

export default function AdminDashboardScreen() {
  const [incidents, setIncidents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/admin/incidents');
      if (res.data?.data) setIncidents(res.data.data.slice(0, 5));
    } catch (e) {
      setIncidents([
        {
          id: '1',
          reference_number: 'INC-2026-00001',
          title: 'Major water main leak on 5th Avenue',
          description: 'High pressure water gushing onto the main road near community center.',
          severity: 'high',
          status: 'submitted',
          created_at: new Date().toISOString(),
          category: { name: 'Flood & Water' },
        },
      ]);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
    setRefreshing(false);
  };

  return (
    <View style={styles.flex}>
      <Header title="Admin Command Console" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.brand]} />}
      >
        <StatCard label="Pending Incident Verifications" value="3 Pending" sub="Action Needed" icon={AlertTriangle} />
        <StatCard label="Total Registered Citizens & Officers" value="1,240 Users" icon={Users} />
        <StatCard label="Active Response Units" value="4 Teams On Duty" icon={Activity} />

        <Text style={styles.sectionHeader}>PENDING VERIFICATION QUEUE</Text>
        {incidents.map((item) => (
          <IncidentCard key={item.id} incident={item} linkPrefix="/(reporter)" />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginVertical: 10 },
});
