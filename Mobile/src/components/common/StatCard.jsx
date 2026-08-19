import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon size={20} color={colors.brand} />
          </View>
        )}
        <View style={styles.content}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
          {sub && <Text style={styles.sub}>{sub}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 0, // Enforce sharp rounded-none corners
    padding: 14,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: colors.iconBg, // #ccfbf1 lightgreen shade
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 1,
  },
  sub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand,
    marginTop: 2,
  },
});
