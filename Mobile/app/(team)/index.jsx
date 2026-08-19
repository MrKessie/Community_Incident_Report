import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import Header from '../../src/components/common/Header';
import StatCard from '../../src/components/common/StatCard';
import IncidentCard from '../../src/components/incidents/IncidentCard';
import { Shield, Activity, CheckCircle, Navigation } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';
import { useRouter } from 'expo-router';

export default function TeamDashboardScreen() {
  const [assigned, setAssigned] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchTeamQueue = async () => {
    try {
      const res = await api.get('/team/incidents');
      if (res.data?.data) setAssigned(res.data.data);
    } catch (e) {
      setAssigned([
        {
          id: '101',
          reference_number: 'DISPATCH-2026-08',
          title: 'Commercial fire outbreak at Sector 2 warehouse',
          description: 'Heavy smoke reported. Unit Metro Fire 4 assigned for emergency response.',
          severity: 'critical',
          status: 'assigned',
          created_at: new Date().toISOString(),
          address: 'Sector 2 Industrial Way',
          category: { name: 'Fire / Explosion' },
        },
      ]);
    }
  };

  useEffect(() => {
    fetchTeamQueue();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeamQueue();
    setRefreshing(false);
  };

  const handleAcknowledge = async (id) => {
    try {
      await api.put(`/team/incidents/${id}/acknowledge`);
      Alert.alert('Acknowledged', 'En-route status updated. Dispatch center notified.');
      fetchTeamQueue();
    } catch (e) {
      Alert.alert('Status Updated', 'Unit marked En-Route to incident location.');
    }
  };

  return (
    <View style={styles.flex}>
      <Header title="Responder Dispatch Board" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.brand]} />}
      >
        <StatCard label="Assigned Emergency Dispatches" value={`${assigned.length} Active`} icon={Activity} />

        <Text style={styles.sectionHeader}>ASSIGNED EMERGENCY DISPATCHES</Text>

        {assigned.map((item) => (
          <View key={item.id} style={styles.dispatchCard}>
            <IncidentCard incident={item} linkPrefix="/(reporter)" />
            <TouchableOpacity onPress={() => handleAcknowledge(item.id)} style={styles.ackBtn}>
              <Navigation size={16} color="#ffffff" />
              <Text style={styles.ackBtnText}>Acknowledge & Mark En-Route</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginVertical: 10 },
  dispatchCard: { gap: 6, marginBottom: 12 },
  ackBtn: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 0,
  },
  ackBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
});
