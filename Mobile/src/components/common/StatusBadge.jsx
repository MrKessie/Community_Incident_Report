import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export function StatusBadge({ status = 'submitted' }) {
  const conf = colors.status[status] || colors.status.submitted;
  const label = status.replace('_', ' ').toUpperCase();

  return (
    <View style={[styles.badge, { backgroundColor: conf.bg }]}>
      <Text style={[styles.text, { color: conf.text }]}>{label}</Text>
    </View>
  );
}

export function SeverityBadge({ severity = 'medium' }) {
  const conf = colors.severity[severity] || colors.severity.medium;
  const label = severity.toUpperCase();

  return (
    <View style={[styles.badge, { backgroundColor: conf.bg, borderColor: conf.border, borderWidth: 1 }]}>
      <Text style={[styles.text, { color: conf.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
