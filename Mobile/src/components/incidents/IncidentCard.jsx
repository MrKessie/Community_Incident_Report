import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Calendar, MapPin, ArrowRight, ShieldAlert } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { StatusBadge, SeverityBadge } from '../common/StatusBadge';
import { formatDate, truncateText } from '../../utils/formatters';

export default function IncidentCard({ incident, linkPrefix = '/incidents' }) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.refBadge}>
          <Text style={styles.refText}>{incident.reference_number || 'INC-2026-001'}</Text>
        </View>
        <View style={styles.badges}>
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </View>
      </View>

      <Text style={styles.title}>{incident.title}</Text>
      <Text style={styles.desc}>{truncateText(incident.description, 90)}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <ShieldAlert size={12} color={colors.brand} />
          <Text style={styles.metaText}>{incident.category?.name || 'Emergency'}</Text>
        </View>
        <View style={styles.metaItem}>
          <Calendar size={12} color="#64748b" />
          <Text style={styles.metaText}>{formatDate(incident.reported_at || incident.created_at)}</Text>
        </View>
        {incident.address && (
          <View style={styles.metaItem}>
            <MapPin size={12} color="#ef4444" />
            <Text style={[styles.metaText, { maxWidth: 120 }]} numberOfLines={1}>
              {incident.address}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => router.push(`${linkPrefix}/${incident.id}`)}
        style={styles.actionBtn}
      >
        <Text style={styles.actionBtnText}>View Incident Details</Text>
        <ArrowRight size={14} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 0, // Sharp square corners per brand rules
    padding: 14,
    marginVertical: 6,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  refText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  desc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 0,
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
});
