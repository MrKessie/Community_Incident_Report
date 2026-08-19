import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Shield, AlertTriangle, CheckCircle, Activity, Plus, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '../../src/components/common/Header';
import StatCard from '../../src/components/common/StatCard';
import IncidentCard from '../../src/components/incidents/IncidentCard';
import { colors } from '../../src/theme/colors';
import api from '../../src/api/client';
import { useAuthStore } from '../../src/store/authStore';

export default function ReporterDashboardScreen() {
  const [stats, setStats] = useState({ total: '1,420+', resolved: '1,280+', active: '4 Teams' });
  const [incidents, setIncidents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const loadDashboardData = async () => {
    try {
      const res = await api.get('/incidents');
      if (res.data?.data) {
        setIncidents(res.data.data.slice(0, 5));
      }
    } catch (e) {
      // Fallback mock items if server offline
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
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <View style={styles.flex}>
      <Header title="Community Dispatch" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.brand]} />}
      >
        {/* Welcome Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerBadge}>
            <View style={styles.pingDot} />
            <Text style={styles.bannerBadgeText}>24/7 EMERGENCY DISPATCH ACTIVE</Text>
          </View>
          <Text style={styles.bannerTitle}>Welcome, {user?.name || 'Citizen'}!</Text>
          <Text style={styles.bannerSub}>Report hazardous incidents and track real-time emergency responses.</Text>

          <TouchableOpacity
            onPress={() => router.push('/(reporter)/report')}
            style={styles.reportBtn}
          >
            <Plus size={18} color="#ffffff" />
            <Text style={styles.reportBtnText}>Report New Incident</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionHeader}>COMMUNITY STATS</Text>
        <StatCard label="Total Incidents Reported" value={stats.total} icon={Shield} />
        <StatCard label="Incidents Resolved" value={stats.resolved} icon={CheckCircle} />
        <StatCard label="Response Units Active" value={stats.active} icon={Activity} />

        {/* Recent Incidents Feed */}
        <View style={styles.feedHeaderRow}>
          <Text style={styles.sectionHeader}>RECENT INCIDENTS</Text>
          <TouchableOpacity onPress={() => router.push('/(reporter)/incidents')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {incidents.map((item) => (
          <IncidentCard key={item.id} incident={item} linkPrefix="/(reporter)" />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 30 },
  banner: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 0,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.iconBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 6,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brand,
  },
  bannerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.brand,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  bannerSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  reportBtn: {
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 0,
    marginTop: 6,
  },
  reportBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: 8,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.brand,
  },
});
