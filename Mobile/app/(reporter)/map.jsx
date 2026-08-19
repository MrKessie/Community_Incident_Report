import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../src/components/common/Header';
import { MapPin, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function LiveMapScreen() {
  return (
    <View style={styles.flex}>
      <Header title="Live Incident Map" />

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color={colors.brand} />
          <Text style={styles.mapTitle}>Geotagged Incident Map</Text>
          <Text style={styles.mapSub}>
            Interactive GPS mapping pins active emergencies and response unit dispatch routes.
          </Text>

          <View style={styles.legendCard}>
            <Text style={styles.legendHeader}>MAP LEGEND</Text>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>Critical Emergency (Active)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.legendText}>Under Verification / En-Route</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.legendText}>Resolved Incident</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  mapContainer: { flex: 1, padding: 16, justifyContent: 'center' },
  mapPlaceholder: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 0,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  mapTitle: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  mapSub: { fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 18 },
  legendCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    padding: 12,
    width: '100%',
    marginTop: 12,
    gap: 6,
  },
  legendHeader: { fontSize: 10, fontWeight: '800', color: '#475569', letterSpacing: 0.5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#1e293b', fontWeight: '600' },
});
