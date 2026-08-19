import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const severities = [
  { id: 'low', label: 'Low', desc: 'Minor / Non-urgent', key: 'low' },
  { id: 'medium', label: 'Medium', desc: 'Attention soon', key: 'medium' },
  { id: 'high', label: 'High', desc: 'Urgent response', key: 'high' },
  { id: 'critical', label: 'Critical', desc: 'Life / Property threat', key: 'critical' },
];

export default function SeveritySelector({ selectedId, onSelect }) {
  return (
    <View style={styles.grid}>
      {severities.map((sev) => {
        const isSelected = selectedId === sev.id;
        const conf = colors.severity[sev.key];

        return (
          <TouchableOpacity
            key={sev.id}
            onPress={() => onSelect && onSelect(sev.id)}
            style={[
              styles.card,
              isSelected ? { backgroundColor: conf.bg, borderColor: conf.border, borderWidth: 2 } : styles.normalCard,
            ]}
          >
            <Text style={[styles.label, isSelected && { color: conf.text }]}>{sev.label.toUpperCase()}</Text>
            <Text style={styles.desc}>{sev.desc}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  card: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 0, // Sharp square corners
  },
  normalCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  desc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
});
