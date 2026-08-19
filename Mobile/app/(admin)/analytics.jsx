import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Header from '../../src/components/common/Header';
import StatCard from '../../src/components/common/StatCard';
import { BarChart3, Clock, CheckCircle, ShieldAlert } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function AnalyticsScreen() {
  return (
    <View style={styles.flex}>
      <Header title="Analytics Hub" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <StatCard label="Average Response Time" value="12 Mins" sub="⚡ 18% Faster Response" icon={Clock} />
        <StatCard label="Monthly Resolution Rate" value="94.2%" sub="Target: >90%" icon={CheckCircle} />
        <StatCard label="High Priority Dispatches" value="14 Cases" icon={ShieldAlert} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown Summary</Text>
          <View style={styles.row}>
            <Text style={styles.catName}>Fire & Explosion</Text>
            <Text style={styles.catCount}>120 cases (18%)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.catName}>Road Accidents</Text>
            <Text style={styles.catCount}>450 cases (38%)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.catName}>Medical Emergencies</Text>
            <Text style={styles.catCount}>290 cases (24%)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 0, padding: 16, gap: 10, marginTop: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  catName: { fontSize: 12, fontWeight: '700', color: '#1e293b' },
  catCount: { fontSize: 12, fontWeight: '800', color: colors.brand },
});
